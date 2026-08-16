import { leadFunnelSchema } from "@/lib/validations";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

/**
 * Stand-in for the `submitLead` Server Action, used only by the static GitHub Pages
 * demo where there is no server or database. `scripts/build-demo.mjs` copies this
 * file over `actions/leads.ts` in the throwaway build tree, so nothing in the demo
 * bundle is marked "use server". Validation still runs, so the funnel behaves the
 * same as production; the submission is simply discarded.
 */
export async function submitLead(input: unknown): Promise<ActionResult> {
  const parsed = leadFunnelSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" };
  }

  await new Promise((resolve) => setTimeout(resolve, 400));
  return { ok: true, id: "demo" };
}
