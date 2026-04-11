// Shared Upstash Redis client.
// Replaces the deprecated @vercel/kv. API is compatible for get/set/incr/expire/keys.
//
// Lazy-initialized: the client is constructed on first access so that scripts
// which load dotenv AFTER the initial module evaluation still pick up env vars.
// (ES module imports are hoisted, so `import { redis } from './redis'` runs
// before `config({ path: '.env.local' })` in a plain script.)
//
// We pass URL/token explicitly so existing KV_REST_API_* env vars keep working
// without renaming to UPSTASH_REDIS_REST_*.

import { Redis } from '@upstash/redis';

let _client: Redis | null = null;

function getClient(): Redis {
  if (_client) return _client;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error(
      'Redis not configured: KV_REST_API_URL / KV_REST_API_TOKEN missing'
    );
  }
  _client = new Redis({ url, token });
  return _client;
}

// Proxy gives us `redis.get(...)`-style call sites without forcing every
// caller to use `getClient().get(...)`. Only method access / call patterns —
// nothing here introspects properties the way auth adapters do, so the
// Proxy pitfall warned about in the storage skill doesn't apply.
export const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    const client = getClient() as any;
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
