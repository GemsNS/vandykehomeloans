import { FALLBACK_BROKERS, FALLBACK_RATES } from "../lib/data/fallback";
import { db, isDatabaseConfigured } from "./index";
import { brokers, rates } from "./schema";

async function seed() {
  if (!isDatabaseConfigured || !db) {
    console.error("DATABASE_URL is not set. Skipping seed.");
    process.exit(1);
  }

  const existingRates = await db.select({ id: rates.id }).from(rates);
  if (existingRates.length === 0) {
    await db.insert(rates).values(
      FALLBACK_RATES.map(({ id: _id, ...row }) => ({
        ...row,
        rate: row.rate,
        apr: row.apr,
        points: row.points,
        weeklyChange: row.weeklyChange,
      })),
    );
    console.log(`Seeded ${FALLBACK_RATES.length} rates.`);
  } else {
    console.log("Rates already present; skipping.");
  }

  const existingBrokers = await db.select({ id: brokers.id }).from(brokers);
  if (existingBrokers.length === 0) {
    await db.insert(brokers).values(
      FALLBACK_BROKERS.map(({ id: _id, ...row }) => row),
    );
    console.log(`Seeded ${FALLBACK_BROKERS.length} brokers.`);
  } else {
    console.log("Brokers already present; skipping.");
  }

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
