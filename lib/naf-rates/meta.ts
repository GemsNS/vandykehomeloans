import fs from "node:fs";
import path from "node:path";
import { NAF_PUBLISHED_RATES } from "@/lib/company";
import { nafRatesDataDir } from "@/lib/naf-rates/paths";
import type { NafPublishedMeta, NafParsedRate } from "@/lib/naf-rates/types";

const META_FILE = () => path.join(nafRatesDataDir(), "naf-rates-meta.json");
const CACHE_FILE = () => path.join(nafRatesDataDir(), "naf-rates-cache.json");

export function readNafPublishedMeta(): NafPublishedMeta | null {
  try {
    const metaFile = META_FILE();
    if (!fs.existsSync(metaFile)) return null;
    const parsed = JSON.parse(fs.readFileSync(metaFile, "utf8")) as NafPublishedMeta;
    if (!parsed.asOf || !parsed.pointsLabel) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeNafPublishedMeta(meta: Omit<NafPublishedMeta, "syncedAt">): NafPublishedMeta {
  const payload: NafPublishedMeta = { ...meta, syncedAt: new Date().toISOString() };
  const dir = nafRatesDataDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(META_FILE(), JSON.stringify(payload, null, 2));
  return payload;
}

export function readNafRatesCache(): NafParsedRate[] | null {
  try {
    const cacheFile = CACHE_FILE();
    if (!fs.existsSync(cacheFile)) return null;
    const parsed = JSON.parse(fs.readFileSync(cacheFile, "utf8")) as { rates?: NafParsedRate[] };
    return parsed.rates?.length ? parsed.rates : null;
  } catch {
    return null;
  }
}

export function writeNafRatesCache(rates: NafParsedRate[]): void {
  const dir = nafRatesDataDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    CACHE_FILE(),
    JSON.stringify({ rates, syncedAt: new Date().toISOString() }, null, 2),
  );
}

export function getNafPublishedMeta(): NafPublishedMeta {
  const cached = readNafPublishedMeta();
  if (cached) return cached;
  return {
    asOf: NAF_PUBLISHED_RATES.asOf,
    pointsLabel: NAF_PUBLISHED_RATES.pointsLabel,
    syncedAt: new Date(0).toISOString(),
  };
}
