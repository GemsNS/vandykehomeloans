import "server-only";

import path from "path";

/** Absolute path to data/naf-rates-*.json (set VD_DATA_DIR in PM2 .env). */
export function nafRatesDataDir(): string {
  const fromEnv = process.env.VD_DATA_DIR?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), "data");
}
