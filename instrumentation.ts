import { readNafPublishedMeta } from "@/lib/naf-rates/meta";

/** Pull NAF rates when the Node server starts (PM2 restart / deploy). */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { syncNafRates } = await import("@/lib/naf-rates/sync");
  const hasMeta = Boolean(readNafPublishedMeta());
  const result = await syncNafRates({ force: !hasMeta });
  console.log("[naf-rates] startup sync:", JSON.stringify(result));
}
