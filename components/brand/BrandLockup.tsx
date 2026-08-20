import { cn } from "@/lib/utils";

/**
 * Vector rendering of the VanDyke lockup for small sizes — the raster logo is a
 * 1024px plate and turns to mush at nav-bar height. Geometry and gold follow
 * `public/brand/vandyke-home-loans-logo.png`; use that file wherever it can be
 * shown large (hero, footer, share images).
 */
export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <HouseMark className="h-9 w-9 shrink-0" />
      <span className="hidden leading-none md:block">
        <span className="block font-brand text-[1.3rem] font-semibold leading-none text-brand-300">
          VanDyke
        </span>
        <span className="mt-1 block border-t border-brand-500/40 pt-1 text-[8.5px] font-semibold uppercase tracking-[0.3em] text-brand-200/75">
          Home Loans
        </span>
      </span>
    </span>
  );
}

function HouseMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="vd-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E9D69B" />
          <stop offset="45%" stopColor="#C9A44C" />
          <stop offset="100%" stopColor="#8A6A22" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#vd-gold)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      >
        <path d="M2 27 L32 5 L62 27" />
        <path d="M9.5 27 L32 10.5 L54.5 27" strokeWidth="1.3" opacity="0.75" />
        <path d="M14 17.5 V9.5 H18.4 V13.6" strokeWidth="1.9" />
        <path d="M1.5 31 H62.5" strokeWidth="1.6" />
      </g>
      <g fill="url(#vd-gold)">
        <rect x="28.3" y="15.4" width="3.2" height="3.2" rx="0.3" />
        <rect x="32.5" y="15.4" width="3.2" height="3.2" rx="0.3" />
        <rect x="28.3" y="19.6" width="3.2" height="3.2" rx="0.3" />
        <rect x="32.5" y="19.6" width="3.2" height="3.2" rx="0.3" />
      </g>
    </svg>
  );
}
