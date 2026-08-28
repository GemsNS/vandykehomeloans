#!/usr/bin/env node
/**
 * Pull NAF published rates into data/*.json and Postgres.
 * Plain Node ESM — no tsx/esbuild (those segfault under the GLIBC wrapper on Ubuntu 18.04).
 *
 * Usage: npm run sync:naf-rates  (via scripts/run-pm2-node.mjs)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "data");
const META_FILE = path.join(DATA_DIR, "naf-rates-meta.json");
const CACHE_FILE = path.join(DATA_DIR, "naf-rates-cache.json");
const NAF_URL = "https://www.newamericanfunding.com/mortgage-rates/";
const PURCHASE_COUNT = 6;
const PURCHASE_FEATURED = new Set([
  "purchase|30-Year Fixed",
  "purchase|FHA 30-Year Fixed",
  "purchase|VA 30-Year Fixed",
]);

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const out = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function parsePoints(label) {
  const match = label.match(/^([\d.]+)/);
  if (!match) return "1.00";
  const value = Number(match[1]);
  return Number.isFinite(value) ? value.toFixed(2) : "1.00";
}

function inferTermYears(productName) {
  return productName.includes("15-Year") ? 15 : 30;
}

function inferProductType(productName) {
  if (productName.includes("ARM")) return "arm";
  if (productName.includes("FHA")) return "fha";
  if (productName.includes("VA")) return "va";
  return "conventional";
}

function parseNafRatesHtml(html) {
  const asOfMatch = html.match(
    /current as of:?\s*<\/span>\s*(\d{1,2}:\d{2}[AP]M PT on \d{1,2}\/\d{1,2}\/\d{4})/i,
  );
  const asOf = asOfMatch?.[1]?.trim() ?? "the latest NAF publish time";
  const blocks = html.split("rate-title").slice(1);
  const rates = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const productName = block.match(/>([^<]+)</)?.[1]?.trim();
    const rate = block.match(/rate-percentage[\s\S]*?rate-text">([^<]+)/)?.[1]?.replace("%", "").trim();
    const apr = block.match(/apr-percentage[\s\S]*?rate-text">([^<]+)/)?.[1]?.replace("%", "").trim();
    const pointsLabel =
      block.match(/rate-info points[\s\S]*?rate-text">([^<]+)/)?.[1]?.trim() ?? "1.000";
    if (!productName || !rate || !apr) continue;
    rates.push({
      productName,
      rate,
      apr,
      points: parsePoints(pointsLabel),
      pointsLabel,
      loanPurpose: index < PURCHASE_COUNT ? "purchase" : "refinance",
      termYears: inferTermYears(productName),
      productType: inferProductType(productName),
    });
  }

  return { asOf, pointsLabel: rates[0]?.pointsLabel ?? "1.000", rates };
}

async function fetchNafPublishedRates() {
  const response = await fetch(NAF_URL, {
    headers: {
      "User-Agent": "VanDykeHomeLoansRatesSync/1.0 (+https://vandykehomeloan.net)",
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) throw new Error(`NAF rates fetch failed (${response.status})`);
  return parseNafRatesHtml(await response.text());
}

function writeCacheFiles({ asOf, pointsLabel, rates }) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const syncedAt = new Date().toISOString();
  fs.writeFileSync(META_FILE, JSON.stringify({ asOf, pointsLabel, syncedAt }, null, 2));
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ rates, syncedAt }, null, 2));
}

function isFeatured(loanPurpose, productName) {
  return PURCHASE_FEATURED.has(`${loanPurpose}|${productName}`);
}

async function upsertRates(sql, rates) {
  let updated = 0;
  for (const row of rates) {
    const existing = await sql`
      SELECT id, rate, is_featured
      FROM rates
      WHERE product_name = ${row.productName} AND loan_purpose = ${row.loanPurpose}
      LIMIT 1
    `;
    const previousRate = existing[0] ? Number(existing[0].rate) : Number(row.rate);
    const weeklyChange = (Number(row.rate) - previousRate).toFixed(3);
    const featured = existing[0]?.is_featured ?? isFeatured(row.loanPurpose, row.productName);

    if (existing[0]) {
      await sql`
        UPDATE rates SET
          rate = ${row.rate},
          apr = ${row.apr},
          term_years = ${row.termYears},
          points = ${row.points},
          product_type = ${row.productType},
          is_featured = ${featured},
          weekly_change = ${weeklyChange},
          updated_at = NOW()
        WHERE id = ${existing[0].id}
      `;
    } else {
      await sql`
        INSERT INTO rates (
          product_name, rate, apr, term_years, points, product_type,
          loan_purpose, is_featured, weekly_change, updated_at
        ) VALUES (
          ${row.productName}, ${row.rate}, ${row.apr}, ${row.termYears}, ${row.points},
          ${row.productType}, ${row.loanPurpose}, ${featured}, ${weeklyChange}, NOW()
        )
      `;
    }
    updated += 1;
  }
  return updated;
}

async function main() {
  const fileEnv = loadEnvFile(path.join(ROOT, ".env"));
  const databaseUrl = fileEnv.DATABASE_URL || process.env.DATABASE_URL;

  console.log("[naf-rates] fetching from NAF...");
  const fetched = await fetchNafPublishedRates();
  if (fetched.rates.length === 0) {
    console.error("[naf-rates] no rates parsed");
    process.exit(1);
  }

  writeCacheFiles(fetched);
  console.log(`[naf-rates] wrote ${META_FILE}`);

  let dbUpdated = 0;
  if (databaseUrl) {
    const sql = postgres(databaseUrl, { max: 1, prepare: false });
    try {
      dbUpdated = await upsertRates(sql, fetched.rates);
    } finally {
      await sql.end({ timeout: 5 });
    }
  }

  const result = { ok: true, asOf: fetched.asOf, updated: dbUpdated, cached: fetched.rates.length };
  console.log("[naf-rates] synced:", JSON.stringify(result));

  const port = fileEnv.PORT || process.env.PORT || "3010";
  const secret = fileEnv.RATES_SYNC_SECRET || process.env.RATES_SYNC_SECRET;
  const headers = secret ? { Authorization: `Bearer ${secret}` } : {};
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/cron/revalidate-rates`, { headers });
    const body = await response.text();
    console.log(`[naf-rates] revalidate: HTTP ${response.status} ${body}`);
  } catch (error) {
    console.warn(
      "[naf-rates] revalidate skipped (restart PM2 after sync if the date still looks old):",
      error instanceof Error ? error.message : error,
    );
  }
}

main().catch((error) => {
  console.error("[naf-rates] sync failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
