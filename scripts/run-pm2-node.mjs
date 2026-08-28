#!/usr/bin/env node
/**
 * Run a script with the same Node binary + GLIBC env PM2 uses.
 * Safe to invoke from shell Node 16 — this launcher exec's the PM2 interpreter directly
 * (no shell:true, no nested with-glibc, no tsx).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

function pm2GlibcEnv(base = process.env) {
  const glibcRoot = path.join(os.homedir(), "glibc-2.28", "build");
  const glibcLib = path.join(glibcRoot, "lib");
  const existing = base.LD_LIBRARY_PATH || "";
  const ld = [glibcRoot, glibcLib, existing].filter(Boolean).join(":");
  return { ...base, LD_LIBRARY_PATH: ld };
}

const fileEnv = loadEnvFile(path.join(ROOT, ".env"));
for (const [key, value] of Object.entries(fileEnv)) {
  if (process.env[key] === undefined) process.env[key] = value;
}

const { resolveNodeInterpreter } = await import("./resolve-node.mjs");
const interpreter = resolveNodeInterpreter();

const versionResult = spawnSync(interpreter, ["--version"], {
  encoding: "utf8",
  shell: false,
});
const version = (versionResult.stdout || "").trim();
const major = Number.parseInt(version.replace(/^v/, "").split(".")[0] ?? "0", 10);
if (major < 18) {
  console.error(`PM2 Node ${version} at ${interpreter} cannot run this app (need v18+).`);
  process.exit(1);
}

const script = process.argv[2];
if (!script) {
  console.error("Usage: node scripts/run-pm2-node.mjs <script.mjs> [...args]");
  process.exit(1);
}

const scriptPath = path.resolve(ROOT, script);
if (!fs.existsSync(scriptPath)) {
  console.error(`Script not found: ${scriptPath}`);
  process.exit(1);
}

console.log(`[run-pm2-node] ${version} ${scriptPath}`);

const result = spawnSync(interpreter, [scriptPath, ...process.argv.slice(3)], {
  stdio: "inherit",
  env: pm2GlibcEnv({ ...process.env, ...fileEnv }),
  cwd: ROOT,
  shell: false,
});

if (result.error) {
  console.error("[run-pm2-node]", result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
