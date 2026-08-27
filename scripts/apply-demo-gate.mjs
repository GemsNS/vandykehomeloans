#!/usr/bin/env node
/**
 * Locks the static GitHub Pages demo behind an under-construction gate.
 *
 * GitHub Pages cannot do real HTTP auth on a public site. This injects a
 * blocking redirect into every HTML file: locked visitors are sent to a
 * standalone gate.html before Next.js can paint or hydrate. Unlock stores a
 * sessionStorage flag and returns them to the requested URL.
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

const gatePage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Under Construction | VanDyke Home Loans</title>
  <meta name="description" content="The VanDyke Home Loans preview is temporarily closed for construction." />
  <meta property="og:title" content="Under Construction | VanDyke Home Loans" />
  <meta property="og:description" content="The VanDyke Home Loans preview is temporarily closed for construction." />
  <style>
    html, body { margin: 0; min-height: 100%; background: #050D18; color: #E7EBF1; font-family: "DM Sans", "Segoe UI", sans-serif; }
    .vd-gate { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: radial-gradient(ellipse at top, rgba(201,164,76,.18), transparent 55%), linear-gradient(180deg, #0B192C 0%, #050D18 100%); }
    .vd-gate__card { width: min(440px, 100%); border: 1px solid rgba(231,235,241,.12); border-radius: 2px; background: rgba(11,25,44,.92); padding: 28px 24px 22px; box-shadow: 0 24px 60px rgba(0,0,0,.35); }
    .vd-gate__logo { display: block; width: 180px; height: auto; margin: 0 auto 18px; }
    .vd-gate__eyebrow { margin: 0 0 8px; text-align: center; font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: #E3C77E; font-weight: 700; }
    .vd-gate h1 { margin: 0; text-align: center; font-size: clamp(1.6rem, 4vw, 2rem); line-height: 1.15; letter-spacing: -.03em; font-weight: 800; }
    .vd-gate__copy { margin: 12px 0 0; text-align: center; color: rgba(231,235,241,.7); font-size: .95rem; line-height: 1.55; }
    .vd-gate__form { margin-top: 22px; display: grid; gap: 8px; }
    .vd-gate__label { font-size: 12px; font-weight: 600; color: rgba(231,235,241,.7); }
    .vd-gate input { width: 100%; box-sizing: border-box; border: 1px solid rgba(231,235,241,.18); border-radius: 2px; background: #050D18; color: #fff; padding: 12px 14px; font-size: 1rem; }
    .vd-gate button { margin-top: 6px; border: 0; border-radius: 2px; background: #C9A44C; color: #050D18; font-weight: 800; padding: 12px 14px; cursor: pointer; }
    .vd-gate__error { margin: 4px 0 0; color: #E5484D; font-size: .85rem; }
    .vd-gate__foot { margin: 18px 0 0; text-align: center; font-size: .8rem; color: rgba(231,235,241,.45); }
    .vd-gate__foot a { color: #E3C77E; }
  </style>
</head>
<body>
  <main class="vd-gate">
    <div class="vd-gate__card">
      <img class="vd-gate__logo" src="${basePath}/brand/vandyke-home-loans-logo.png" width="220" height="147" alt="VanDyke Home Loans" />
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
  <script>
  (function () {
    var HASH = ${JSON.stringify(passwordHash)};
    var KEY = ${JSON.stringify(storageKey)};
    var BASE = ${JSON.stringify(basePath)};

    function hex(buf) {
      return Array.from(new Uint8Array(buf))
        .map(function (b) { return b.toString(16).padStart(2, "0"); })
        .join("");
    }

    function safeNext() {
      var params = new URLSearchParams(location.search);
      var next = params.get("next") || (BASE + "/");
      try {
        var url = new URL(next, location.origin);
        if (url.origin !== location.origin) return BASE + "/";
        if (!url.pathname.startsWith(BASE)) return BASE + "/";
        if (url.pathname.indexOf("/gate.html") !== -1) return BASE + "/";
        return url.pathname + url.search + url.hash;
      } catch (e) {
        return BASE + "/";
      }
    }

    try {
      if (sessionStorage.getItem(KEY) === HASH) {
        location.replace(safeNext());
        return;
      }
    } catch (e) {}

    document.getElementById("vd-gate-form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var err = document.getElementById("vd-gate-error");
      err.hidden = true;
      var value = new FormData(ev.target).get("password") || "";
      crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(value))).then(function (digest) {
        if (hex(digest) !== HASH) {
          err.hidden = false;
          return;
        }
        try { sessionStorage.setItem(KEY, HASH); } catch (e) {}
        location.replace(safeNext());
      });
    });
  })();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(out, "gate.html"), gatePage);

// Hide the app instantly, then bounce locked visitors to the standalone gate.
// Keep this free of nested </script> sequences so the HTML parser cannot truncate it.
const redirectInline = `<script>
(function(){
  var HASH=${JSON.stringify(passwordHash)};
  var KEY=${JSON.stringify(storageKey)};
  var BASE=${JSON.stringify(basePath)};
  var unlocked=false;
  try{unlocked=sessionStorage.getItem(KEY)===HASH;}catch(e){}
  if(unlocked)return;
  document.documentElement.style.visibility="hidden";
  var next=location.pathname+location.search+location.hash;
  location.replace(BASE+"/gate.html?next="+encodeURIComponent(next));
})();
</script>`;

const snip = `<meta name="robots" content="noindex, nofollow" />
${redirectInline}`;

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
  if (path.basename(file) === "gate.html") continue;

  let html = fs.readFileSync(file, "utf8");
  // Strip any prior gate injection variants.
  html = html
    .replace(/\s*<meta name="robots" content="noindex, nofollow" \/>\s*/gi, "\n")
    .replace(/\s*<script src="\/vandykehomeloans\/demo-gate\.js"[^>]*><\/script>\s*/gi, "\n")
    .replace(/\s*<script>\s*\(function\s*\(\)\s*\{[\s\S]*?location\.replace\(BASE\+["']\/gate\.html[\s\S]*?<\/script>\s*/gi, "\n")
    .replace(/\s*<script>\s*\(function \(\) \{\s*var HASH =[\s\S]*?<\/script>\s*/gi, "\n");

  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, `<head$1>\n${snip}`);
  } else {
    html = `${snip}\n${html}`;
  }

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

fs.writeFileSync(path.join(out, "robots.txt"), `User-agent: *\nDisallow: /\n`);

const legacy = path.join(out, "demo-gate.js");
if (fs.existsSync(legacy)) fs.rmSync(legacy);

console.log(`Demo construction gate applied to ${patched} HTML files (redirect → gate.html).`);
