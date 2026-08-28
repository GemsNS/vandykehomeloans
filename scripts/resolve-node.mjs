#!/usr/bin/env node
/**
 * Resolve the Node binary PM2 should use — same logic as ecosystem.config.cjs.
 * Lets deploy scripts use the app's interpreter without changing the shell default.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const home = os.homedir();

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

const fileEnv = loadEnvFile(path.join(root, ".env"));

function fromEnv() {
  const raw = (process.env.NODE_INTERPRETER || fileEnv.NODE_INTERPRETER || "").trim();
  if (raw && fs.existsSync(raw)) return raw;
  return null;
}

function fromNvm() {
  const version = process.env.NODE_VERSION?.trim() || "v24.16.0";
  const nvmNode = path.join(home, ".nvm", "versions", "node", version, "bin", "node");
  if (fs.existsSync(nvmNode)) return nvmNode;
  return null;
}

function resolveNodeInterpreter() {
  return fromEnv() ?? fromNvm() ?? process.execPath;
}

const interpreter = resolveNodeInterpreter();
const binDir = path.dirname(interpreter);

export { interpreter, binDir, resolveNodeInterpreter };

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  console.log(interpreter);
}
