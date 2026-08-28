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

function fromEnv() {
  const raw = process.env.NODE_INTERPRETER?.trim();
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
