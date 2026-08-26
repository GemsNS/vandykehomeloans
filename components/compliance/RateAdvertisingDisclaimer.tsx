import { CONTACT, LENDER, NAF_PUBLISHED_RATES } from "@/lib/company";

/** Short MAP Rule / Reg N companion copy for rate advertising surfaces. */
export function RateAdvertisingDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-white/45 ${className}`}>
      Rates and APRs shown are estimates published by {LENDER.dba} as of {NAF_PUBLISHED_RATES.asOf}{" "}
      and assume the points/cost shown. They are not a commitment to lend. Your actual rate, APR,
      payment, and costs are determined at lock and may differ based on credit, loan amount,
      property type, occupancy, and other underwriting factors. Confirm current figures on{" "}
      <a
        href={CONTACT.publishedRates}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-white/70"
      >
        New American Funding&apos;s mortgage rates page
      </a>
      .
    </p>
  );
}
