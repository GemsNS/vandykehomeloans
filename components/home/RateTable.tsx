"use client";

import { useMemo, useState } from "react";
import type { Rate } from "@/db/schema";
import { RateAdvertisingDisclaimer } from "@/components/compliance/RateAdvertisingDisclaimer";
import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { CONTACT, NAF_PUBLISHED_RATES } from "@/lib/company";
import { formatPercent } from "@/lib/utils";

const PURPOSES = [
  { id: "purchase", label: "Purchase Rates" },
  { id: "refinance", label: "Rate and Term Refinance" },
] as const;

const FILTERS = [
  { id: "all", label: "All" },
  { id: "30", label: "30Y" },
  { id: "15", label: "15Y" },
  { id: "arm", label: "ARM" },
] as const;

export function RateTable({ rates }: { rates: Rate[] }) {
  const [purpose, setPurpose] = useState<(typeof PURPOSES)[number]["id"]>("purchase");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  const visible = useMemo(() => {
    return rates.filter((item) => {
      const itemPurpose = item.loanPurpose === "refinance" ? "refinance" : "purchase";
      if (itemPurpose !== purpose) return false;
      if (filter === "all") return true;
      if (filter === "arm") return item.productType === "arm";
      return item.termYears === Number(filter) && item.productType !== "arm";
    });
  }, [rates, purpose, filter]);

  return (
    <section id="rates" className="bg-ink-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-brand-300">New American Funding</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Today&apos;s published rates
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Estimated rates current as of {NAF_PUBLISHED_RATES.asOf}, copied from{" "}
              <a
                href={CONTACT.publishedRates}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-300 underline-offset-4 hover:underline"
              >
                New American Funding&apos;s mortgage rates page
              </a>
              . Your actual rate, APR, and payment depend on credit, property, and lock terms.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex flex-wrap gap-1 rounded-board border border-white/10 bg-ink-900 p-1">
              {PURPOSES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPurpose(item.id)}
                  className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    purpose === item.id
                      ? "bg-brand-500 text-ink-950"
                      : "text-white/55 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 rounded-board border border-white/10 bg-ink-900 p-1">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`tape rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    filter === item.id
                      ? "bg-white text-ink-950"
                      : "text-white/55 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-board border border-white/10 bg-ink-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-ink-950">
                  {["Term", "Rate", "APR", "Points (Cost)", ""].map((heading, index) => (
                    <th
                      key={heading || `action-${index}`}
                      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45 ${
                        index > 0 ? "text-right" : ""
                      }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/[0.06] transition-colors last:border-0 hover:bg-white/[0.04]"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">{item.productName}</div>
                    </td>
                    <td className="tape px-4 py-3.5 text-right text-base font-semibold text-brand-300">
                      {formatPercent(Number(item.rate))}
                    </td>
                    <td className="tape px-4 py-3.5 text-right font-semibold text-brand-300">
                      {formatPercent(Number(item.apr))}
                    </td>
                    <td className="tape px-4 py-3.5 text-right text-white/70">
                      {NAF_PUBLISHED_RATES.pointsLabel}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <ApplyNowButton size="sm">Apply Now</ApplyNowButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <RateAdvertisingDisclaimer className="mt-4" />
      </div>
    </section>
  );
}
