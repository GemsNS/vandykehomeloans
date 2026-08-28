#!/usr/bin/env node
/** Run `next start` under the PM2 Node binary. */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = path.join(ROOT, "node_modules/next/dist/bin/next");

const result = spawnSync(process.execPath, [nextBin, "start"], {
  stdio: "inherit",
  cwd: ROOT,
  shell: false,
});

process.exit(result.status ?? 1);
