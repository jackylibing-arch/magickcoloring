// Cookie-based daily rate limit. Cheap, no DB. We also key by IP server-side
// in an in-memory map (best-effort; resets on cold start, which is fine for v1).

import { cookies } from 'next/headers';
import { SITE } from './site';

const COOKIE_NAME = 'mc_usage';

// In-memory IP counter (per serverless instance — best effort).
const ipMap = new Map<string, { day: string; count: number }>();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getIpUsage(ip: string): number {
  const day = todayKey();
  const entry = ipMap.get(ip);
  if (!entry || entry.day !== day) return 0;
  return entry.count;
}

export function bumpIpUsage(ip: string): number {
  const day = todayKey();
  const entry = ipMap.get(ip);
  const next = !entry || entry.day !== day ? { day, count: 1 } : { day, count: entry.count + 1 };
  ipMap.set(ip, next);
  return next.count;
}

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
