import { and, eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { rates, type Rate } from "@/db/schema";
import { fetchNafPublishedRates } from "@/lib/naf-rates/fetch";
import {
  readNafPublishedMeta,
  readNafRatesCache,
  writeNafPublishedMeta,
  writeNafRatesCache,
} from "@/lib/naf-rates/meta";
import type { NafParsedRate, NafSyncResult } from "@/lib/naf-rates/types";

const DEFAULT_SYNC_INTERVAL_MS = 30 * 60 * 1000;
const PURCHASE_FEATURED = new Set([
  "purchase|30-Year Fixed",
  "purchase|FHA 30-Year Fixed",
  "purchase|VA 30-Year Fixed",
]);

let inflightSync: Promise<NafSyncResult> | null = null;
let lastSyncFinishedAt = 0;

function syncIntervalMs(): number {
  const raw = process.env.NAF_RATES_SYNC_INTERVAL_MS;
  const parsed = raw ? Number(raw) : DEFAULT_SYNC_INTERVAL_MS;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_SYNC_INTERVAL_MS;
}

function rateKey(loanPurpose: string, productName: string): string {
  return `${loanPurpose}|${productName}`;
}

function isFeatured(loanPurpose: string, productName: string): boolean {
  return PURCHASE_FEATURED.has(rateKey(loanPurpose, productName));
}

function parsedToRateRow(parsed: NafParsedRate, previous?: Rate): Omit<Rate, "id"> {
  const previousRate = previous ? Number(previous.rate) : Number(parsed.rate);
  const newRate = Number(parsed.rate);
  const weeklyChange = Number.isFinite(previousRate)
    ? (newRate - previousRate).toFixed(3)
    : "0.000";

  return {
    productName: parsed.productName,
    rate: parsed.rate,
    apr: parsed.apr,
    termYears: parsed.termYears,
    points: parsed.points,
    productType: parsed.productType,
    loanPurpose: parsed.loanPurpose,
    isFeatured: previous?.isFeatured ?? isFeatured(parsed.loanPurpose, parsed.productName),
    weeklyChange,
    updatedAt: new Date(),
  };
}

function cacheToRates(parsed: NafParsedRate[]): Rate[] {
  return parsed.map((row, index) => ({
    id: `naf-cache-${index}`,
    productName: row.productName,
    rate: row.rate,
    apr: row.apr,
    termYears: row.termYears,
    points: row.points,
    productType: row.productType,
    loanPurpose: row.loanPurpose,
    isFeatured: isFeatured(row.loanPurpose, row.productName),
    weeklyChange: "0.000",
    updatedAt: new Date(),
  }));
}

async function findExistingRate(parsed: NafParsedRate): Promise<Rate | undefined> {
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(rates)
    .where(
      and(eq(rates.productName, parsed.productName), eq(rates.loanPurpose, parsed.loanPurpose)),
    );
  return rows[0];
}

async function upsertParsedRates(parsedRates: NafParsedRate[]): Promise<number> {
  if (!isDatabaseConfigured || !db) return 0;

  let updated = 0;
  for (const parsed of parsedRates) {
    const existing = await findExistingRate(parsed);
    const payload = parsedToRateRow(parsed, existing);

    if (existing) {
      await db.update(rates).set(payload).where(eq(rates.id, existing.id));
    } else {
      await db.insert(rates).values(payload);
    }
    updated += 1;
  }
  return updated;
}

export async function syncNafRates(options?: { force?: boolean }): Promise<NafSyncResult> {
  const force = options?.force ?? false;
  const interval = syncIntervalMs();
  const cachedMeta = readNafPublishedMeta();
  const syncedRecently =
    cachedMeta?.syncedAt &&
    Date.now() - new Date(cachedMeta.syncedAt).getTime() < interval;

  if (!force && syncedRecently) {
    return { ok: true, skipped: true, reason: "synced recently", asOf: cachedMeta?.asOf };
  }

  try {
    const fetched = await fetchNafPublishedRates();
    if (fetched.rates.length === 0) {
      return { ok: false, error: "No rates parsed from NAF page" };
    }

    writeNafRatesCache(fetched.rates);
    writeNafPublishedMeta({ asOf: fetched.asOf, pointsLabel: fetched.pointsLabel });

    const updated = await upsertParsedRates(fetched.rates);
    lastSyncFinishedAt = Date.now();

    return { ok: true, asOf: fetched.asOf, updated };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync error";
    return { ok: false, error: message };
  }
}

export async function ensureNafRatesFresh(): Promise<void> {
  const interval = syncIntervalMs();
  if (Date.now() - lastSyncFinishedAt < interval && readNafPublishedMeta()) {
    return;
  }

  if (inflightSync) {
    await inflightSync;
    return;
  }

  inflightSync = syncNafRates();
  try {
    await inflightSync;
  } finally {
    inflightSync = null;
  }
}

export function ratesFromNafCache(): Rate[] | null {
  const cached = readNafRatesCache();
  return cached ? cacheToRates(cached) : null;
}
