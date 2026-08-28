import "server-only";

import { CONTACT } from "@/lib/company";
import { parseNafRatesHtml } from "@/lib/naf-rates/parse";

const NAF_USER_AGENT =
  "VanDykeHomeLoansRatesSync/1.0 (+https://vandykehomeloan.net; compliance copy)";

export async function fetchNafPublishedRates() {
  const response = await fetch(CONTACT.publishedRates, {
    headers: {
      "User-Agent": NAF_USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(45_000),
  });

  if (!response.ok) {
    throw new Error(`NAF rates fetch failed (${response.status})`);
  }

  const html = await response.text();
  return parseNafRatesHtml(html);
}
