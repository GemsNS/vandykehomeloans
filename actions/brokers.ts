"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, isDatabaseConfigured } from "@/db";
import { brokers, leads } from "@/db/schema";
import { brokerFormSchema, leadStatusSchema } from "@/lib/validations";

function requireDb() {
  if (!isDatabaseConfigured || !db) {
    throw new Error("Database is not configured. Set DATABASE_URL to manage records.");
  }
  return db;
}

export async function upsertBroker(input: unknown) {
  const parsed = brokerFormSchema.parse(input);
  const database = requireDb();
  const payload = {
    name: parsed.name,
    title: parsed.title,
    nmlsId: parsed.nmlsId,
    email: parsed.email,
    phone: parsed.phone,
    bio: parsed.bio || null,
    avatarUrl: parsed.avatarUrl || null,
    licenseStates: parsed.licenseStates || null,
    active: parsed.active ?? true,
  };

  if (parsed.id) {
    await database.update(brokers).set(payload).where(eq(brokers.id, parsed.id));
  } else {
    await database.insert(brokers).values(payload);
  }

  revalidatePath("/admin/brokers");
  revalidatePath("/");
  revalidatePath("/team");
}

export async function deleteBroker(id: string) {
  const database = requireDb();
  await database.delete(brokers).where(eq(brokers.id, id));
  revalidatePath("/admin/brokers");
  revalidatePath("/");
  revalidatePath("/team");
}

export async function updateLeadStatus(input: unknown) {
  const parsed = leadStatusSchema.parse(input);
  const database = requireDb();
  await database
    .update(leads)
    .set({
      status: parsed.status,
      assignedBrokerId: parsed.assignedBrokerId ?? null,
    })
    .where(eq(leads.id, parsed.id));
  revalidatePath("/admin/leads");
}
