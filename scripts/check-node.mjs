#!/usr/bin/env node
/**
 * Fail fast when npm/build runs under the wrong Node (e.g. system v16 on Ubuntu 18.04).
 * Next.js 15 requires Node 18+. Wrong Node + with-glibc often segfaults instead of a clear error.
 */
import path from "node:path";
import { resolveNodeInterpreter } from "./resolve-node.mjs";

const MIN_MAJOR = 18;
const interpreter = resolveNodeInterpreter();
const version = process.version;
const major = Number.parseInt(version.slice(1).split(".")[0] ?? "0", 10);

if (major < MIN_MAJOR) {
  console.error(
    [
      "",
      "ERROR: Wrong Node for VanDyke Home Loans build/install.",
      `  Shell Node:     ${version} (${process.execPath})`,
      `  PM2 Node:     ${interpreter}`,
      "",
      "npm ci / npm run build must use the same Node binary PM2 runs (see ecosystem.config.cjs).",
      "Running under system Node 16 corrupts node_modules and can segfault with the GLIBC wrapper.",
      "",
      "Fix (uses PM2's Node without changing your default shell node):",
      `  export PATH="${path.dirname(interpreter)}:$PATH"`,
      "  node -v   # should be v18+",
      "  rm -rf node_modules && npm ci && npm run build",
      "",
      "Or set NODE_INTERPRETER in backend/.env to your compatible Node path.",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

if (process.execPath !== interpreter) {
  console.warn(
    `Note: shell Node (${version}) differs from PM2 interpreter (${interpreter}). ` +
      "Use the PM2 Node for npm ci/build to avoid corrupt installs.",
  );
}
