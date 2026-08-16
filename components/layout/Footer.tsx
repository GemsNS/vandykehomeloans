import { Equal, Phone } from "lucide-react";
import Link from "next/link";
import { CONTACT, LENDER, PEOPLE, SITE_NAME, TEAM_NAME, fullAddress } from "@/lib/company";

const COLUMNS = [
  {
    title: "Borrow",
    links: [
      { href: "/purchase", label: "Buy a home" },
      { href: "/refinance", label: "Refinance" },
      { href: "/apply", label: "Request a quote" },
      { href: CONTACT.preQual, label: "NAF pre-qualification", external: true },
    ],
  },
  {
    title: "Programs",
    links: [
      { href: "/programs/conventional", label: "Conventional" },
      { href: "/fha-loans", label: "FHA loans" },
      { href: "/va-loans", label: "VA loans" },
      { href: "/self-employed-loans", label: "Self-employed" },
      { href: "/programs/non-qm", label: "Non-QM" },
      { href: "/programs/reverse", label: "Reverse mortgage" },
    ],
  },
  {
    title: "Team",
    links: [
      { href: "/team", label: "Meet the team" },
      { href: "/about", label: "About us" },
      { href: "/calculators", label: "Calculators" },
      { href: "/#naf-black-impact", label: "NAF Black Impact" },
      { href: LENDER.nmlsLookup, label: "NMLS Consumer Access", external: true },
      { href: "/admin", label: "Staff login" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight">{SITE_NAME}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">
            Powered by NAF | New American Funding
          </p>
          <p className="mt-3 max-w-xs text-sm text-white/70">
            {TEAM_NAME} — local guidance in {fullAddress()}.
          </p>
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-300"
          >
            <Phone className="h-4 w-4" />
            {CONTACT.phoneDisplay}
          </a>
          <p className="mt-2 text-sm text-white/70">
            <a href={`mailto:${CONTACT.email}`} className="hover:text-white">
              {CONTACT.email}
            </a>
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
              {column.title}
            </p>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  {"external" in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-white/75 hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-white/75 hover:text-white">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl space-y-3 px-4 py-6 text-xs leading-relaxed text-white/55">
          <p className="inline-flex items-start gap-2">
            <Equal className="mt-0.5 h-4 w-4 shrink-0" />
            New American Funding, LLC is an Equal Housing Lender. We fully comply with the Equal
            Credit Opportunity Act (ECOA), Fair Housing Act, and all other Federal and State
            regulations. All applicants applying for credit will be treated equally regardless of
            race, color, ethnicity, national origin, religion, sex or gender, sexual orientation,
            gender identification, military status, marital or familial status, age, disability or
            handicap, receipt of public assistance, exercise of any right under the Consumer Credit
            Protection Act, or any other prohibited basis.
          </p>
          <p>
            Company NMLS #{LENDER.nmls} · {PEOPLE.anthony.name} NMLS #{PEOPLE.anthony.nmlsId} ·{" "}
            {PEOPLE.gonzalo.name} NMLS #{PEOPLE.gonzalo.nmlsId} ·{" "}
            <a href={LENDER.nmlsLookup} className="underline hover:text-white" target="_blank" rel="noreferrer">
              NMLS Consumer Access
            </a>
            . Rates shown on this site are illustrative and subject to change. Your actual rate is
            determined at lock through New American Funding.
          </p>
          <p>© {new Date().getFullYear()} {SITE_NAME}. {fullAddress()}.</p>
        </div>
      </div>
    </footer>
  );
}
