"use client";

import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { formatPercent, formatRelativeDay } from "@/lib/utils";

export type TickerRate = {
  productName: string;
  rate: string;
  weeklyChange: string | null;
};

export function RateTickerBar({
  rates,
  updatedAt,
}: {
  rates: TickerRate[];
  updatedAt: Date | string;
}) {
  const loop = [...rates, ...rates];

  return (
    <div className="border-b border-white/10 bg-ink-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4">
        <div className="hidden shrink-0 items-center gap-2 border-r border-white/10 py-2.5 pr-4 sm:flex">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-up" />
          <span className="eyebrow text-white/80">Live rates</span>
        </div>
        <div className="relative min-w-0 flex-1 overflow-hidden py-2.5">
          <div className="flex w-max animate-ticker gap-7 pr-7 hover:[animation-play-state:paused]">
            {loop.map((rate, index) => {
              const change = Number(rate.weeklyChange ?? 0);
              // A falling rate is the favorable print, so it carries the green tape color.
              const down = change < 0;
              const up = change > 0;
              return (
                <div
                  key={`${rate.productName}-${index}`}
                  className="flex shrink-0 items-baseline gap-2 text-sm"
                >
                  <span className="tape text-[11px] uppercase tracking-wider text-white/55">
                    {rate.productName}
                  </span>
                  <span className="tape font-semibold text-white">
                    {formatPercent(Number(rate.rate))}
                  </span>
                  {up || down ? (
                    <span
                      className={`tape text-xs ${down ? "text-up" : "text-down"}`}
                      aria-label={`${down ? "down" : "up"} ${formatPercent(Math.abs(change))} week over week`}
                    >
                      {down ? "▼" : "▲"} {formatPercent(Math.abs(change))}
                    </span>
                  ) : (
                    <span className="tape text-xs text-white/40">—</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-ink-950 to-transparent" />
        </div>
        <p className="tape hidden shrink-0 border-l border-white/10 py-2.5 pl-4 text-[11px] uppercase tracking-wider text-white/45 lg:block">
          Indicative · {formatRelativeDay(updatedAt)}
        </p>
        <ApplyNowButton size="sm" className="hidden shrink-0 sm:inline-flex">
          Lock Rate
        </ApplyNowButton>
      </div>
    </div>
  );
}
