#!/usr/bin/env node
/**
 * Pull today's rates from New American Funding and update the local cache/DB.
 * Usage: node scripts/with-glibc.mjs tsx scripts/sync-naf-rates.ts
 */
import { syncNafRates } from "../lib/naf-rates/sync";

async function main() {
  const result = await syncNafRates({ force: true });
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
