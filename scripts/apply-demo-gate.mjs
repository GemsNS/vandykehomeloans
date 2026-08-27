#!/usr/bin/env node
/**
 * Locks the static GitHub Pages demo behind an under-construction gate.
 *
 * GitHub Pages cannot do real HTTP auth on a public site, so this injects a
 * client-side gate into every HTML file. Unauthenticated visitors only see the
 * construction screen; a matching password (SHA-256 compared in-browser) unlocks
 * the session via sessionStorage. This is access control for a preview, not
 * cryptographic protection of the exported assets.
 *
 * Set DEMO_GATE_PASSWORD when running build:demo / deploy:demo.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "out");
const password = process.env.DEMO_GATE_PASSWORD?.trim();

if (!password) {
  console.error(
    "DEMO_GATE_PASSWORD is required to build the GitHub Pages demo while it is closed for construction.",
  );
  process.exit(1);
}

if (!fs.existsSync(path.join(out, "index.html"))) {
  console.error("No export found in out/. Run the demo build first.");
  process.exit(1);
}

const passwordHash = createHash("sha256").update(password, "utf8").digest("hex");
const storageKey = "vd-demo-gate-ok";
const basePath = "/vandykehomeloans";

const gateScript = `(() => {
  const HASH = ${JSON.stringify(passwordHash)};
  const KEY = ${JSON.stringify(storageKey)};
  const BASE = ${JSON.stringify(basePath)};

  async function sha256Hex(value) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function unlocked() {
    try {
      return sessionStorage.getItem(KEY) === HASH;
    } catch {
      return false;
    }
  }

  async function tryUnlock(password) {
    const hex = await sha256Hex(password);
    if (hex !== HASH) return false;
    try {
      sessionStorage.setItem(KEY, HASH);
    } catch {}
    return true;
  }

  function paintGate() {
    document.documentElement.setAttribute("data-vd-gate", "1");
    document.title = "Under Construction | VanDyke Home Loans";
    const logo = BASE + "/brand/vandyke-home-loans-logo.png";
    document.body.innerHTML = \`
      <main class="vd-gate">
        <div class="vd-gate__card">
          <img class="vd-gate__logo" src="\${logo}" width="220" height="147" alt="VanDyke Home Loans" />
          <p class="vd-gate__eyebrow">Preview offline</p>
          <h1>Site under construction</h1>
          <p class="vd-gate__copy">
            The VanDyke Home Loans GitHub Pages demo is temporarily closed while we finish
            production deployment. Enter the preview password to continue.
          </p>
          <form class="vd-gate__form" id="vd-gate-form" autocomplete="current-password">
            <label class="vd-gate__label" for="vd-gate-password">Preview password</label>
            <input id="vd-gate-password" name="password" type="password" required autofocus />
            <button type="submit">Unlock preview</button>
            <p class="vd-gate__error" id="vd-gate-error" hidden>That password is not correct.</p>
          </form>
          <p class="vd-gate__foot">Production: <a href="https://vandykehomeloans.net">vandykehomeloans.net</a></p>
        </div>
      </main>
    \`;

    const form = document.getElementById("vd-gate-form");
    const error = document.getElementById("vd-gate-error");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      error.hidden = true;
      const value = new FormData(form).get("password");
      const ok = await tryUnlock(String(value || ""));
      if (!ok) {
        error.hidden = false;
        return;
      }
      window.location.reload();
    });
  }

  const style = document.createElement("style");
  style.textContent = \`
    html[data-vd-gate="1"], html[data-vd-gate="1"] body {
      margin: 0;
      min-height: 100%;
      background: #050D18;
      color: #E7EBF1;
      font-family: "DM Sans", "Segoe UI", sans-serif;
    }
    .vd-gate {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      background:
        radial-gradient(ellipse at top, rgba(201,164,76,0.18), transparent 55%),
        linear-gradient(180deg, #0B192C 0%, #050D18 100%);
    }
    .vd-gate__card {
      width: min(440px, 100%);
      border: 1px solid rgba(231,235,241,0.12);
      border-radius: 2px;
      background: rgba(11,25,44,0.92);
      padding: 28px 24px 22px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.35);
    }
    .vd-gate__logo { display: block; width: 180px; height: auto; margin: 0 auto 18px; }
    .vd-gate__eyebrow {
      margin: 0 0 8px;
      text-align: center;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #E3C77E;
      font-weight: 700;
    }
    .vd-gate h1 {
      margin: 0;
      text-align: center;
      font-size: clamp(1.6rem, 4vw, 2rem);
      line-height: 1.15;
      letter-spacing: -0.03em;
      font-weight: 800;
    }
    .vd-gate__copy {
      margin: 12px 0 0;
      text-align: center;
      color: rgba(231,235,241,0.7);
      font-size: 0.95rem;
      line-height: 1.55;
    }
    .vd-gate__form { margin-top: 22px; display: grid; gap: 8px; }
    .vd-gate__label { font-size: 12px; font-weight: 600; color: rgba(231,235,241,0.7); }
    .vd-gate input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid rgba(231,235,241,0.18);
      border-radius: 2px;
      background: #050D18;
      color: #fff;
      padding: 12px 14px;
      font-size: 1rem;
    }
    .vd-gate button {
      margin-top: 6px;
      border: 0;
      border-radius: 2px;
      background: #C9A44C;
      color: #050D18;
      font-weight: 800;
      padding: 12px 14px;
      cursor: pointer;
    }
    .vd-gate__error { margin: 4px 0 0; color: #E5484D; font-size: 0.85rem; }
    .vd-gate__foot {
      margin: 18px 0 0;
      text-align: center;
      font-size: 0.8rem;
      color: rgba(231,235,241,0.45);
    }
    .vd-gate__foot a { color: #E3C77E; }
  \`;

  function boot() {
    if (unlocked()) return;
    document.head.appendChild(style);
    const run = () => paintGate();
    if (document.body) run();
    else document.addEventListener("DOMContentLoaded", run, { once: true });
  }

  boot();
})();
`;

fs.writeFileSync(path.join(out, "demo-gate.js"), gateScript);

const snip = `<meta name="robots" content="noindex, nofollow" />
<script src="${basePath}/demo-gate.js" defer></script>`;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

let patched = 0;
for (const file of walk(out)) {
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("demo-gate.js")) continue;
  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, `<head$1>\n${snip}`);
  } else {
    html = `${snip}\n${html}`;
  }
  // Soften public link-preview copy while the gate is up.
  html = html
    .replace(
      /<title>[^<]*<\/title>/i,
      "<title>Under Construction | VanDyke Home Loans</title>",
    )
    .replace(
      /property="og:title" content="[^"]*"/i,
      'property="og:title" content="Under Construction | VanDyke Home Loans"',
    )
    .replace(
      /name="twitter:title" content="[^"]*"/i,
      'name="twitter:title" content="Under Construction | VanDyke Home Loans"',
    )
    .replace(
      /property="og:description" content="[^"]*"/i,
      'property="og:description" content="The VanDyke Home Loans preview is temporarily closed for construction."',
    )
    .replace(
      /name="twitter:description" content="[^"]*"/i,
      'name="twitter:description" content="The VanDyke Home Loans preview is temporarily closed for construction."',
    )
    .replace(
      /name="description" content="[^"]*"/i,
      'name="description" content="The VanDyke Home Loans preview is temporarily closed for construction."',
    );
  fs.writeFileSync(file, html);
  patched += 1;
}

fs.writeFileSync(
  path.join(out, "robots.txt"),
  `User-agent: *\nDisallow: /\n`,
);

console.log(`Demo construction gate applied to ${patched} HTML files.`);
