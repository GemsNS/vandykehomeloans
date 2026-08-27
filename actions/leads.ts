"use server";

import { revalidatePath } from "next/cache";
import { db, isDatabaseConfigured } from "@/db";
import { leads } from "@/db/schema";
import { leadFunnelSchema } from "@/lib/validations";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

export async function submitLead(input: unknown): Promise<ActionResult> {
  const parsed = leadFunnelSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" };
  }

  if (!isDatabaseConfigured || !db) {
    console.error("Lead submission rejected: DATABASE_URL is not configured.");
    return {
      ok: false,
      error: "Online submissions are temporarily unavailable. Please call us at (757) 338-3432.",
    };
  }

  try {
    const [row] = await db
      .insert(leads)
      .values({
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        loanType: parsed.data.loanType,
        propertyValue: parsed.data.propertyValue.toFixed(2),
        loanAmount: parsed.data.loanAmount.toFixed(2),
        creditScoreTier: parsed.data.creditScoreTier,
        propertyType: parsed.data.propertyType,
        timeline: parsed.data.timeline,
        incomeSource: parsed.data.incomeSource,
        status: "New",
      })
      .returning({ id: leads.id });

    revalidatePath("/admin/leads");
    return { ok: true, id: row?.id };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Unable to save your application. Please call us directly." };
  }
}
