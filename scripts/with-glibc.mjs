#!/usr/bin/env node
/**
 * Cross-platform launcher that prepends the custom GLIBC 2.28 build
 * to LD_LIBRARY_PATH on Linux hosts (Ubuntu 18.04 + NVM Node 24).
 * On Windows/macOS this is a no-op passthrough.
 *
 * GLIBC override is only applied for the NVM Node binary PM2 uses — not system
 * Node 16, which segfaults when LD_LIBRARY_PATH points at glibc 2.28.
 */
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { resolveNodeInterpreter } = await import("./resolve-node.mjs");

function shouldApplyGlibc() {
  if (process.platform !== "linux") return false;
  if (process.env.VD_SKIP_GLIBC === "1") return false;
  const pm2Node = resolveNodeInterpreter();
  // Only the NVM/custom Node build is linked against ~/glibc-2.28 — not apt Node 16.
  return process.execPath === pm2Node || process.env.VD_USE_GLIBC === "1";
}

if (shouldApplyGlibc()) {
  const glibcRoot = path.join(os.homedir(), "glibc-2.28", "build");
  const extra = [glibcRoot, path.join(glibcRoot, "lib")].join(path.delimiter);
  process.env.LD_LIBRARY_PATH = process.env.LD_LIBRARY_PATH
    ? `${extra}${path.delimiter}${process.env.LD_LIBRARY_PATH}`
    : extra;
}

const major = Number.parseInt(process.version.slice(1).split(".")[0] ?? "0", 10);
if (major < 18) {
  console.error(
    `Node ${process.version} cannot run Next.js 15. PM2 interpreter: ${resolveNodeInterpreter()}`,
  );
  process.exit(1);
}

const [cmd, ...args] = process.argv.slice(2);

if (!cmd) {
  console.error("Usage: node scripts/with-glibc.mjs <command> [...args]");
  process.exit(1);
}

const child = spawn(cmd, args, {
  stdio: "inherit",
  shell: true,
  env: process.env,
  cwd: root,
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
