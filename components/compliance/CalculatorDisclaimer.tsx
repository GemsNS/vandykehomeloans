import Link from "next/link";
import { LENDER, SITE_NAME } from "@/lib/company";

export function CalculatorDisclaimer() {
  return (
    <aside className="rounded-board border border-ink/10 bg-canvas px-4 py-3 text-xs leading-relaxed text-slate-600">
      <p>
        Estimates only — not a loan offer, commitment, or guarantee of approval, rate, APR, payment,
        or closing costs. Actual terms depend on credit, property, occupancy, income documentation,
        and lock through {LENDER.dba}. {SITE_NAME} calculators do not store personal information.
        See our{" "}
        <Link href="/privacy" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/licensing" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
          Licensing &amp; Disclosures
        </Link>
        .
      </p>
    </aside>
  );
}
