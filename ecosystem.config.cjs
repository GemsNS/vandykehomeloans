/**
 * PM2 process file for Ubuntu 18.04 + NVM Node 24 + custom GLIBC 2.28.
 *
 * Usage (on the server, from the app root):
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 */
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

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

const root = __dirname;
const fileEnv = loadEnvFile(path.join(root, ".env"));
const home = os.homedir();
const glibcRoot = path.join(home, "glibc-2.28", "build");
const glibcLib = path.join(glibcRoot, "lib");
const existingLd = process.env.LD_LIBRARY_PATH || "";
const ldLibraryPath = [glibcRoot, glibcLib, existingLd].filter(Boolean).join(":");

const nodeVersion = process.env.NODE_VERSION?.trim() || "v24.16.0";
const nvmNode = path.join(home, ".nvm", "versions", "node", nodeVersion, "bin", "node");
const envInterpreter = fileEnv.NODE_INTERPRETER || process.env.NODE_INTERPRETER;
const interpreter =
  (envInterpreter && fs.existsSync(envInterpreter) ? envInterpreter : null) ||
  (fs.existsSync(nvmNode) ? nvmNode : "node");

const port = fileEnv.PORT || process.env.PORT || "3010";
const hostname = fileEnv.HOSTNAME || process.env.HOSTNAME || "127.0.0.1";

module.exports = {
  apps: [
    {
      name: "vandyke-home-loan",
      cwd: root,
      script: "node_modules/next/dist/bin/next",
      args: "start",
      interpreter,
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 20,
      min_uptime: "5s",
      env: {
        ...fileEnv,
        NODE_ENV: "production",
        PORT: port,
        HOSTNAME: hostname,
        LD_LIBRARY_PATH: ldLibraryPath,
        VD_DATA_DIR: path.join(root, "data"),
      },
    },
  ],
};
