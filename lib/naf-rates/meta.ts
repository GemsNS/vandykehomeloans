import fs from "node:fs";
import path from "node:path";
import { NAF_PUBLISHED_RATES } from "@/lib/company";
import type { NafPublishedMeta, NafParsedRate } from "@/lib/naf-rates/types";

const DATA_DIR = path.join(process.cwd(), "data");
const META_FILE = path.join(DATA_DIR, "naf-rates-meta.json");
const CACHE_FILE = path.join(DATA_DIR, "naf-rates-cache.json");

export function readNafPublishedMeta(): NafPublishedMeta | null {
  try {
    if (!fs.existsSync(META_FILE)) return null;
    const parsed = JSON.parse(fs.readFileSync(META_FILE, "utf8")) as NafPublishedMeta;
    if (!parsed.asOf || !parsed.pointsLabel) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeNafPublishedMeta(meta: Omit<NafPublishedMeta, "syncedAt">): NafPublishedMeta {
  const payload: NafPublishedMeta = { ...meta, syncedAt: new Date().toISOString() };
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(META_FILE, JSON.stringify(payload, null, 2));
  return payload;
}

export function readNafRatesCache(): NafParsedRate[] | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const parsed = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) as { rates?: NafParsedRate[] };
    return parsed.rates?.length ? parsed.rates : null;
  } catch {
    return null;
  }
}

export function writeNafRatesCache(rates: NafParsedRate[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ rates, syncedAt: new Date().toISOString() }, null, 2));
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
