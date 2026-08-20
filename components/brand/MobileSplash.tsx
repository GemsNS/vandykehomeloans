"use client";

import { useEffect, useState } from "react";
import { LogoPlate } from "@/components/brand/LogoPlate";

const SESSION_KEY = "vd-splash-seen";
const FILL_MS = 1700;
const FADE_MS = 700;

/**
 * First-visit intro on phones only. The raster plate is the brand moment; after it
 * fades, the hero no longer repeats that same framed logo.
 */
export function MobileSplash() {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("splash-done")) return;

    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem(SESSION_KEY));
    } catch {
      seen = true;
    }

    if (wide || reduced || seen) {
      root.classList.add("splash-done");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => setLeaving(true), FILL_MS);
    const doneTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* private mode */
      }
      root.classList.add("splash-done");
      document.body.style.overflow = previousOverflow;
    }, FILL_MS + FADE_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div
      data-mobile-splash
      className={leaving ? "is-leaving" : undefined}
      aria-hidden="true"
    >
      <div className="vd-splash-logo w-full max-w-[240px] px-6">
        <LogoPlate className="w-full shadow-glow" priority />
      </div>
      <div className="vd-splash-track mt-10 h-[3px] w-44 overflow-hidden rounded-full bg-white/10">
        <span className="vd-splash-bar block h-full w-full rounded-full bg-brand-400" />
      </div>
      <p className="vd-splash-tag eyebrow mt-5 text-brand-300/80">Trusted advice, smart solutions</p>
    </div>
  );
}
