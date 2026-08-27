#!/usr/bin/env node
/**
 * Builds the static GitHub Pages demo into `out/`.
 *
 * GitHub Pages serves files only, so the server-dependent parts cannot ship:
 *   - `middleware.ts` (cookie auth) is unsupported by `output: export`
 *   - `app/admin/*` and `components/admin/*` need cookies, Server Actions, and Postgres
 *   - every `actions/*.ts` module is marked "use server"
 *
 * Rather than mutating the working tree (which fights the dev server's file locks),
 * the source is copied to a temporary directory without those paths, and the one
 * action the public site needs is replaced by a client-side stub.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const work = path.join(os.tmpdir(), "vandyke-demo-build");

const SKIP_TOP_LEVEL = new Set([".git", ".next", "node_modules", "out", "drizzle"]);

const SKIP_PATHS = new Set([
  path.join("app", "admin"),
  path.join("components", "admin"),
  "actions",
  "middleware.ts",
]);

// cpSync hands the filter Windows extended-length paths (\\?\C:\...).
const normalize = (target) => (target.startsWith("\\\\?\\") ? target.slice(4) : target);

function shouldCopy(source) {
  const relative = path.relative(root, normalize(source));
  if (!relative) return true;
  if (SKIP_TOP_LEVEL.has(relative.split(path.sep)[0])) return false;
  if (relative.startsWith(".env")) return false;
  for (const skipped of SKIP_PATHS) {
    if (relative === skipped || relative.startsWith(`${skipped}${path.sep}`)) return false;
  }
  return true;
}

fs.rmSync(work, { recursive: true, force: true });
fs.cpSync(root, work, { recursive: true, filter: shouldCopy });

// The lead funnel keeps importing "@/actions/leads"; in the demo tree that path is
// the client-side stub rather than a Server Action.
fs.mkdirSync(path.join(work, "actions"), { recursive: true });
fs.copyFileSync(
  path.join(root, "actions", "leads.demo.ts"),
  path.join(work, "actions", "leads.ts"),
);

// Share the installed dependencies instead of reinstalling them.
const linkedModules = path.join(work, "node_modules");
if (!fs.existsSync(linkedModules)) {
  fs.symlinkSync(
    path.join(root, "node_modules"),
    linkedModules,
    process.platform === "win32" ? "junction" : "dir",
  );
}

const build = spawnSync("node", ["scripts/with-glibc.mjs", "next", "build"], {
  cwd: work,
  stdio: "inherit",
  env: { ...process.env, DEMO_EXPORT: "1", NEXT_PUBLIC_DEMO: "1" },
});

if (build.status !== 0) process.exit(build.status ?? 1);

fs.rmSync(path.join(root, "out"), { recursive: true, force: true });
fs.cpSync(path.join(work, "out"), path.join(root, "out"), { recursive: true });

// Without this, Pages runs Jekyll and discards the _next directory.
fs.writeFileSync(path.join(root, "out", ".nojekyll"), "");

// Close the public demo behind an under-construction password gate.
const gate = spawnSync("node", ["scripts/apply-demo-gate.mjs"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});
if (gate.status !== 0) process.exit(gate.status ?? 1);

console.log("\nStatic demo written to out/ (construction gate enabled)");
