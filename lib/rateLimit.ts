// Per-IP daily rate limiting backed by Vercel KV (atomic INCR with TTL).
//
// Previous version used an in-memory Map inside the lambda, which reset on
// every cold start and was per-instance — effectively no limit in prod.
// This version uses KV so the limit is global and persistent.
//
// Two independent buckets:
//   - 'gen'  — /api/generate (free single-image tool)
//   - 'book' — /api/book/create (personalized book, 3x fal.ai per call)
//
// Each bucket has its own per-day quota. We also still write a cookie so the
// client can show "N remaining today" in the UI, but the cookie is *not* the
// source of truth for limiting — KV is.

import { redis } from './redis';
import { cookies } from 'next/headers';
import { SITE } from './site';

export type Bucket = 'gen' | 'book';

// Per-day quota per bucket.
// gen  = 3 images/IP/day × $0.003 = $0.009/IP/day (direct fal.ai bleed)
// book = 50 books/IP/day. Per-theme assets are pre-generated & cached —
//        every preview after the first hit is $0 fal.ai cost. Quota is
//        here only as an anti-bot cap; junk previews auto-expire in 24h.
const QUOTAS: Record<Bucket, number> = {
  gen: SITE.freeDailyLimit, // 3 (see lib/site.ts)
  book: 50,
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function kvKey(bucket: Bucket, ip: string): string {
  return `rl:${bucket}:${todayKey()}:${ip}`;
}

export function getIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function getQuota(bucket: Bucket): number {
  return QUOTAS[bucket];
}

// Check current usage for this IP/bucket without incrementing.
// Used by the client-facing "remaining" indicator.
export async function getUsage(bucket: Bucket, ip: string): Promise<number> {
  try {
    const v = await redis.get<number>(kvKey(bucket, ip));
    return typeof v === 'number' ? v : 0;
  } catch (err) {
    console.error('[rateLimit] getUsage failed', err);
    return 0; // fail-open on read; write side still guards
  }
}

// Atomically check-and-increment. Returns { allowed, count, remaining }.
// - If count would exceed quota, does NOT increment and returns allowed=false.
// - Sets a 26h TTL on first write of the day so keys self-expire.
export async function checkAndBump(
  bucket: Bucket,
  ip: string
): Promise<{ allowed: boolean; count: number; remaining: number }> {
  const quota = QUOTAS[bucket];
  const key = kvKey(bucket, ip);
  try {
    // Atomic incr — returns new value.
    const count = await redis.incr(key);
    if (count === 1) {
      // First hit today for this IP — set expiry so it self-cleans.
      await redis.expire(key, 60 * 60 * 26);
    }
    if (count > quota) {
      return { allowed: false, count: count - 1, remaining: 0 };
    }
    return { allowed: true, count, remaining: Math.max(0, quota - count) };
  } catch (err) {
    console.error('[rateLimit] checkAndBump failed', err);
    // Fail-closed on KV error for book (expensive), fail-open for gen (cheap).
    if (bucket === 'book') {
      return { allowed: false, count: 0, remaining: 0 };
    }
    return { allowed: true, count: 0, remaining: quota };
  }
}

// --- Legacy cookie helpers (UI-only; kept for /api/generate display) ---

const COOKIE_NAME = 'mc_usage';

export function readCookieUsage(): number {
  const c = cookies().get(COOKIE_NAME)?.value;
  if (!c) return 0;
  const [day, countStr] = c.split('|');
  if (day !== todayKey()) return 0;
  const n = parseInt(countStr || '0', 10);
  return Number.isFinite(n) ? n : 0;
}

export function writeCookieUsage(count: number) {
  cookies().set(COOKIE_NAME, `${todayKey()}|${count}`, {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 26,
  });
}

export function remainingFromCount(count: number): number {
  return Math.max(0, SITE.freeDailyLimit - count);
}
