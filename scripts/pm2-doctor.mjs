#!/usr/bin/env node
/** Quick preflight before pm2 start/restart. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let ok = true;

function check(label, pass, hint) {
  console.log(pass ? `OK   ${label}` : `FAIL ${label}${hint ? ` — ${hint}` : ""}`);
  if (!pass) ok = false;
}

check(".next/BUILD_ID", fs.existsSync(path.join(ROOT, ".next", "BUILD_ID")), "run: npm run build");
check(
  "node_modules/next",
  fs.existsSync(path.join(ROOT, "node_modules/next/dist/bin/next")),
  "run: npm ci",
);
check(
  "data/naf-rates-meta.json",
  fs.existsSync(path.join(ROOT, "data", "naf-rates-meta.json")),
  "run: npm run sync:naf-rates",
);

process.exit(ok ? 0 : 1);
