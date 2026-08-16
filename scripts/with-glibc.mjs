#!/usr/bin/env node
/**
 * Cross-platform launcher that prepends the custom GLIBC 2.28 build
 * to LD_LIBRARY_PATH on Linux hosts (Ubuntu 18.04 + Node 24).
 * On Windows/macOS this is a no-op passthrough.
 */
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

if (process.platform === "linux") {
  const glibcRoot = path.join(os.homedir(), "glibc-2.28", "build");
  const extra = [glibcRoot, path.join(glibcRoot, "lib")].join(path.delimiter);
  process.env.LD_LIBRARY_PATH = process.env.LD_LIBRARY_PATH
    ? `${extra}${path.delimiter}${process.env.LD_LIBRARY_PATH}`
    : extra;
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
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
