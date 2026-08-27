#!/usr/bin/env node
/**
 * Publishes `out/` to the gh-pages branch, which GitHub Pages serves at
 * https://gemsns.github.io/vandykehomeloans/.
 *
 * The export is committed from a throwaway repository created inside `out/`, so the
 * published branch contains only built files, shares no history with main, and no
 * local work can be pushed by accident.
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");
const branch = "gh-pages";

if (!fs.existsSync(path.join(out, "index.html"))) {
  console.error("No export found. Run `npm run build:demo` first.");
  process.exit(1);
}

const capture = (args, cwd = root) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();

function run(args, cwd) {
  const result = spawnSync("git", args, { cwd, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function configured(key, fallback) {
  try {
    return capture(["config", key]) || fallback;
  } catch {
    return fallback;
  }
}

const remote = capture(["remote", "get-url", "origin"]);
const sourceCommit = capture(["rev-parse", "--short", "HEAD"]);
const identity = [
  "-c",
  `user.name=${configured("user.name", "vandyke-demo")}`,
  "-c",
  `user.email=${configured("user.email", "demo@vandykehomeloan.net")}`,
];

fs.rmSync(path.join(out, ".git"), { recursive: true, force: true });

run(["init", "-q", "-b", branch], out);
run(["add", "-A"], out);
run([...identity, "commit", "-q", "-m", `Deploy static demo from ${sourceCommit}`], out);
run(["push", "--force", remote, `${branch}:${branch}`], out);

fs.rmSync(path.join(out, ".git"), { recursive: true, force: true });
console.log(`\nPublished to ${branch}. Live at https://gemsns.github.io/vandykehomeloans/`);
