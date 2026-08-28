import { readNafPublishedMeta } from "@/lib/naf-rates/meta";

/** Optional background NAF pull on cold start when no cache file exists yet. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (readNafPublishedMeta()) return;

  void (async () => {
    try {
      const { syncNafRates } = await import("@/lib/naf-rates/sync");
      const result = await syncNafRates({ force: true });
      console.log("[naf-rates] startup sync:", JSON.stringify(result));
    } catch (error) {
      console.error("[naf-rates] startup sync error:", error);
    }
  })();
}
