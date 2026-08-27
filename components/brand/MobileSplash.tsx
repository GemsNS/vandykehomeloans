"use client";

import { useEffect, useState } from "react";
import { LogoPlate } from "@/components/brand/LogoPlate";

const SESSION_KEY = "vd-splash-seen";
const FILL_MS = 1600;
const FADE_MS = 500;
const TOTAL_MS = FILL_MS + FADE_MS;

function markSplashDone() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* private mode */
  }
  document.documentElement.classList.add("splash-done");
  document.body.style.overflow = "";
}

/**
 * First-visit intro on phones only. Dismiss is driven by timers + a CSS
 * safety animation so a late/failed hydration cannot leave the overlay stuck.
 */
export function MobileSplash() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem(SESSION_KEY));
    } catch {
      seen = true;
    }

    if (wide || reduced || seen || root.classList.contains("splash-done")) {
      markSplashDone();
      setVisible(false);
      return;
    }

    setVisible(true);
    document.body.style.overflow = "hidden";

    const fadeTimer = window.setTimeout(() => setLeaving(true), FILL_MS);
    const doneTimer = window.setTimeout(() => {
      markSplashDone();
      setVisible(false);
    }, TOTAL_MS);

    // Absolute failsafe if the component tree remounts or timers are cleared.
    const safetyTimer = window.setTimeout(() => {
      markSplashDone();
      setVisible(false);
    }, TOTAL_MS + 800);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      window.clearTimeout(safetyTimer);
    };
  }, []);

  if (!visible) return null;

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
