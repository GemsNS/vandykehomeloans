import { desc, eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import {
  brokers,
  leads,
  rates,
  type Broker,
  type Lead,
  type Rate,
} from "@/db/schema";
import { FALLBACK_BROKERS, FALLBACK_RATES } from "@/lib/data/fallback";

export async function getRates(): Promise<Rate[]> {
  if (!isDatabaseConfigured || !db) return FALLBACK_RATES;
  try {
    return await db.select().from(rates).orderBy(rates.termYears);
  } catch {
    return FALLBACK_RATES;
  }
}

export async function getFeaturedRates(): Promise<Rate[]> {
  const all = await getRates();
  const featured = all.filter((rate) => rate.isFeatured);
  return featured.length > 0 ? featured : all.slice(0, 4);
}

export async function getActiveBrokers(): Promise<Broker[]> {
  if (!isDatabaseConfigured || !db) return FALLBACK_BROKERS;
  try {
    return await db.select().from(brokers).where(eq(brokers.active, true));
  } catch {
    return FALLBACK_BROKERS;
  }
}

export async function getAllBrokers(): Promise<Broker[]> {
  if (!isDatabaseConfigured || !db) return FALLBACK_BROKERS;
  try {
    return await db.select().from(brokers);
  } catch {
    return FALLBACK_BROKERS;
  }
}

export async function getLeads(): Promise<Lead[]> {
  if (!isDatabaseConfigured || !db) return [];
  try {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  } catch {
    return [];
  }
}

export async function getLatestRateUpdate(allRates?: Rate[]): Promise<Date> {
  const list = allRates ?? (await getRates());
  const timestamps = list.map((rate) => new Date(rate.updatedAt).getTime());
  const latest = timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
  return new Date(latest);
}
