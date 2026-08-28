#!/usr/bin/env node
/**
 * Copy runtime.json (and optional static fallback) into Apache DocumentRoot.
 * Run from backend/ on the server after build or pull.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const publicHtml =
  process.env.PUBLIC_HTML?.trim() ||
  path.resolve(root, "..", "public_html");

if (!process.env.PUBLIC_HTML && !fs.existsSync(path.dirname(publicHtml))) {
  console.log(
    `sync-public-html: skipped — ${publicHtml} parent missing (set PUBLIC_HTML on server)`,
  );
  process.exit(0);
}

const runtimeSrc = path.join(root, "public", "runtime.json");
const runtimeFallback = path.join(root, "deploy", "public_html", "runtime.json");
const indexSrc = path.join(root, "deploy", "public_html", "index.html");

function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`sync-public-html: missing source ${src}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`sync-public-html: ${dest}`);
}

const runtimeFrom = fs.existsSync(runtimeSrc) ? runtimeSrc : runtimeFallback;
copyFile(runtimeFrom, path.join(publicHtml, "runtime.json"));

if (fs.existsSync(indexSrc)) {
  copyFile(indexSrc, path.join(publicHtml, "index.html"));
}

console.log(`sync-public-html: done → ${publicHtml}`);
