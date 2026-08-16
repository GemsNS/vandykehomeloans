import { Building2, ShieldCheck, Star } from "lucide-react";
import { LENDER, PEOPLE } from "@/lib/company";

const BADGES = [
  { label: `${PEOPLE.anthony.ratingValue} / 5`, detail: `${PEOPLE.anthony.reviewCount} Anthony reviews` },
  { label: `${PEOPLE.gonzalo.ratingValue} / 5`, detail: `${PEOPLE.gonzalo.reviewCount} Gonzalo reviews` },
  { label: "Equal Housing", detail: "Lender" },
  { label: `NMLS #${LENDER.nmls}`, detail: "New American Funding" },
];

export function TrustSection() {
  return (
    <section className="border-t border-ink/10 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow text-brand-600">Why VanDyke Mortgage Team</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Personal at the team level. Dependable at the brand level.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
              Anthony VanDyke and Gonzalo Guimoye originate through New American Funding, so you
              get a local Suffolk conversation plus a national lock desk, in-house operations, and
              a full product menu — conventional, FHA, VA, self-employed, Non-QM, investor, and
              reverse.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                Licensed originators: Anthony VanDyke NMLS #{PEOPLE.anthony.nmlsId} and Gonzalo
                Guimoye NMLS #{PEOPLE.gonzalo.nmlsId}. Company NMLS #{LENDER.nmls}.
              </li>
              <li className="flex items-start gap-3">
                <Star className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                Strong borrower reviews on New American Funding profiles, with the same officers
                you reach on this site.
              </li>
              <li className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                Branch office at 425 West Washington Street, Suite 4, Office 219, Suffolk, VA
                23434 — serving Hampton Roads and military families across Virginia.
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-board border border-ink/10 bg-ink-100">
            {BADGES.map((badge) => (
              <div key={badge.label} className="bg-white px-5 py-7 text-center">
                <p className="tape text-2xl font-semibold text-ink">{badge.label}</p>
                <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {badge.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
