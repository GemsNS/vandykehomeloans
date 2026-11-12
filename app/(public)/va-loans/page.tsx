import { ProgramArticle } from "@/components/programs/ProgramArticle";
import { PROGRAMS } from "@/lib/programs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: PROGRAMS.va.seoTitle,
  description: PROGRAMS.va.description,
  path: "/va-loans",
  keywords: ["VA loans Virginia", "VA mortgage Hampton Roads", "Certificate of Eligibility"],
});

export default function VaLoansPage() {
  return (
    <ProgramArticle slug="va">
      {/* Moved word for word from the retired /refinance page. */}
      <div className="mt-8 rounded-board border border-ink/10 bg-white p-6 shadow-card">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink">VA refinance</h2>
        <p className="mt-2 text-sm text-slate-600">
          Streamline or cash-out paths when remaining entitlement and recoupment still work.
        </p>
      </div>
    </ProgramArticle>
  );
}
