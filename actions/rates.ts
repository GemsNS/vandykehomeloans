"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, isDatabaseConfigured } from "@/db";
import { rates } from "@/db/schema";
import { rateFormSchema } from "@/lib/validations";

function requireDb() {
  if (!isDatabaseConfigured || !db) {
    throw new Error("Database is not configured. Set DATABASE_URL to manage live rates.");
  }
  return db;
}

function revalidateRates() {
  revalidatePath("/");
  revalidatePath("/admin/rates");
  revalidatePath("/purchase");
  revalidatePath("/refinance");
}

export async function upsertRate(input: unknown) {
  const parsed = rateFormSchema.parse(input);
  const database = requireDb();
  const payload = {
    productName: parsed.productName,
    rate: parsed.rate.toFixed(3),
    apr: parsed.apr.toFixed(3),
    termYears: parsed.termYears,
    points: parsed.points.toFixed(2),
    productType: parsed.productType,
    loanPurpose: parsed.loanPurpose ?? "purchase",
    isFeatured: parsed.isFeatured ?? false,
    weeklyChange: parsed.weeklyChange.toFixed(3),
    updatedAt: new Date(),
  };

  if (parsed.id) {
    await database.update(rates).set(payload).where(eq(rates.id, parsed.id));
  } else {
    await database.insert(rates).values(payload);
  }

  revalidateRates();
}

export async function deleteRate(id: string) {
  const database = requireDb();
  await database.delete(rates).where(eq(rates.id, id));
  revalidateRates();
}

export async function toggleFeaturedRate(id: string, isFeatured: boolean) {
  const database = requireDb();
  await database
    .update(rates)
    .set({ isFeatured, updatedAt: new Date() })
    .where(eq(rates.id, id));
  revalidateRates();
}
