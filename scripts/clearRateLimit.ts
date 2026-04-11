// Clear all rl:book:* counters so testing is not blocked.
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import { redis } from '../lib/redis';

async function main() {
  const keys = await redis.keys('rl:book:*');
  console.log(`Found ${keys.length} book rate-limit keys`);
  for (const k of keys) {
    await redis.del(k);
    console.log('  deleted', k);
  }
  const gen = await redis.keys('rl:gen:*');
  console.log(`Found ${gen.length} gen rate-limit keys`);
  for (const k of gen) {
    await redis.del(k);
    console.log('  deleted', k);
  }
}
main().catch(console.error);
