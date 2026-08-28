import type { NafLoanPurpose, NafParsedRate } from "@/lib/naf-rates/types";

const PURCHASE_COUNT = 6;

/** Pure HTML parser for NAF's public mortgage rates page. */
export function parseNafRatesHtml(html: string): {
  asOf: string;
  pointsLabel: string;
  rates: NafParsedRate[];
} {
  const asOfMatch = html.match(
    /current as of:?\s*<\/span>\s*(\d{1,2}:\d{2}[AP]M PT on \d{1,2}\/\d{1,2}\/\d{4})/i,
  );
  const asOf = asOfMatch?.[1]?.trim() ?? "the latest NAF publish time";

  const blocks = html.split("rate-title").slice(1);
  const rates: NafParsedRate[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const productName = block.match(/>([^<]+)</)?.[1]?.trim();
    const rate = block.match(/rate-percentage[\s\S]*?rate-text">([^<]+)/)?.[1]?.replace("%", "").trim();
    const apr = block.match(/apr-percentage[\s\S]*?rate-text">([^<]+)/)?.[1]?.replace("%", "").trim();
    const pointsLabel =
      block.match(/rate-info points[\s\S]*?rate-text">([^<]+)/)?.[1]?.trim() ?? "1.000";

    if (!productName || !rate || !apr) continue;

    const loanPurpose: NafLoanPurpose = index < PURCHASE_COUNT ? "purchase" : "refinance";
    rates.push({
      productName,
      rate,
      apr,
      points: parsePoints(pointsLabel),
      pointsLabel,
      loanPurpose,
      termYears: inferTermYears(productName),
      productType: inferProductType(productName),
    });
  }

  const pointsLabel = rates[0]?.pointsLabel ?? "1.000";

  return { asOf, pointsLabel, rates };
}

function parsePoints(label: string): string {
  const match = label.match(/^([\d.]+)/);
  if (!match) return "1.00";
  const value = Number(match[1]);
  return Number.isFinite(value) ? value.toFixed(2) : "1.00";
}

function inferTermYears(productName: string): number {
  if (productName.includes("15-Year")) return 15;
  return 30;
}

function inferProductType(productName: string): NafParsedRate["productType"] {
  if (productName.includes("ARM")) return "arm";
  if (productName.includes("FHA")) return "fha";
  if (productName.includes("VA")) return "va";
  return "conventional";
}
