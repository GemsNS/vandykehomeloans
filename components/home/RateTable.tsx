"use client";

import { useMemo, useState } from "react";
import type { Rate } from "@/db/schema";
import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { calculatePrincipalAndInterest } from "@/lib/mortgage-math";
import { formatCurrency, formatPercent } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "30", label: "30Y" },
  { id: "20", label: "20Y" },
  { id: "15", label: "15Y" },
  { id: "arm", label: "ARM" },
] as const;

export function RateTable({ rates }: { rates: Rate[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const loanAmount = 400000;

  const visible = useMemo(() => {
    return rates.filter((rate) => {
      if (filter === "all") return true;
      if (filter === "arm") return rate.productType === "arm";
      return rate.termYears === Number(filter) && rate.productType !== "arm";
    });
  }, [rates, filter]);

  return (
    <section id="rates" className="bg-ink-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-up" />
              <p className="eyebrow text-brand-300">Rate board</p>
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Compare today&apos;s published rates
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Payments below assume a {formatCurrency(loanAmount)} loan amount, owner-occupied
              purchase, and 740+ credit. These figures are illustrative. APR includes typical points
              and prepaid finance charges. Lock your actual rate with the VanDyke Mortgage Team
              through New American Funding.
            </p>
          </div>
          <div className="flex flex-wrap gap-1 rounded-board border border-white/10 bg-ink-900 p-1">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`tape rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  filter === item.id
                    ? "bg-brand-500 text-white"
                    : "text-white/55 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-board border border-white/10 bg-ink-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-ink-950">
                  {["Product", "Term", "Rate", "APR", "Chg 1W", "Points", "Est. P&I", ""].map(
                    (heading, index) => (
                      <th
                        key={heading || `action-${index}`}
                        className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45 ${
                          index > 1 ? "text-right" : ""
                        }`}
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {visible.map((rate) => {
                  const payment = calculatePrincipalAndInterest(
                    loanAmount,
                    Number(rate.rate),
                    rate.termYears,
                  );
                  const change = Number(rate.weeklyChange ?? 0);
                  const down = change < 0;
                  return (
                    <tr
                      key={rate.id}
                      className="border-b border-white/[0.06] transition-colors last:border-0 hover:bg-white/[0.04]"
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-white">{rate.productName}</div>
                        <div className="tape text-[11px] uppercase tracking-wider text-white/40">
                          {rate.productType}
                        </div>
                      </td>
                      <td className="tape px-4 py-3.5 text-white/70">
                        {rate.productType === "arm" ? "ARM" : `${rate.termYears}Y`}
                      </td>
                      <td className="tape px-4 py-3.5 text-right text-base font-semibold text-white">
                        {formatPercent(Number(rate.rate))}
                      </td>
                      <td className="tape px-4 py-3.5 text-right text-white/70">
                        {formatPercent(Number(rate.apr))}
                      </td>
                      <td
                        className={`tape px-4 py-3.5 text-right ${
                          change === 0 ? "text-white/40" : down ? "text-up" : "text-down"
                        }`}
                      >
                        {change === 0
                          ? "—"
                          : `${down ? "▼" : "▲"} ${formatPercent(Math.abs(change))}`}
                      </td>
                      <td className="tape px-4 py-3.5 text-right text-white/70">
                        {Number(rate.points ?? 0).toFixed(2)}
                      </td>
                      <td className="tape px-4 py-3.5 text-right font-semibold text-brand-300">
                        {formatCurrency(payment)}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <ApplyNowButton size="sm">Lock</ApplyNowButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
