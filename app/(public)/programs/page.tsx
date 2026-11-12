import Link from "next/link";
import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { LENDER } from "@/lib/company";
import { PROGRAM_GROUPS, PROGRAMS, type ProgramSlug } from "@/lib/programs";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Loan Programs in Hampton Roads",
  description:
    "Explore conventional, FHA, VA, self-employed, Non-QM, investor, reverse, USDA, and jumbo mortgages with the VanDyke Mortgage Team and New American Funding.",
  path: "/programs",
});

/** Groups whose copy states down-payment terms; each gets the terms pointer below its cards. */
const DOWN_PAYMENT_TERM_GROUPS: ReadonlySet<ProgramSlug> = new Set(["conventional", "va", "usda"]);

export default function ProgramsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Loan Programs", path: "/programs" },
        ])}
      />
      <PageHero
        eyebrow="Loan programs"
        title="Mortgage solutions shaped around real homeowner goals."
        description="The VanDyke Mortgage Team shops New American Funding overlays so your file fits the guideline — conventional, FHA, VA, self-employed, Non-QM, investor, and reverse."
      />

      <nav aria-label="Loan programs on this page" className="border-b border-ink/10 bg-white">
        <ul className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-4">
          {PROGRAM_GROUPS.map((group) => (
            <li key={group.id}>
              <a
                href={`#${group.id}`}
                className="inline-block rounded-board border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-ink/40"
              >
                {group.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12">
        {PROGRAM_GROUPS.map((group) => (
          <section
            key={group.id}
            id={group.id}
            aria-labelledby={`${group.id}-heading`}
          >
            <h2
              id={`${group.id}-heading`}
              className="font-display text-3xl font-extrabold tracking-tight text-ink"
            >
              {group.label}
            </h2>
            <div className="mt-6 space-y-6">
              {group.slugs.map((slug) => {
                const program = PROGRAMS[slug];
                const hasOwnPage = !program.path.startsWith("/programs#");
                return (
                  <article
                    key={slug}
                    // Sub-programs (jumbo, non-qm, investors) get their own anchor too.
                    id={slug === group.id ? undefined : slug}
                    className="rounded-board border border-ink/10 bg-white p-6 shadow-card"
                  >
                    <p className="eyebrow text-brand-600">{program.title}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
                      {program.headline}
                    </h3>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
                      {program.description}
                    </p>
                    <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
                      {program.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    {hasOwnPage ? (
                      <Link
                        href={program.path}
                        className="mt-5 inline-block text-sm font-semibold text-brand-600 underline-offset-4 hover:underline"
                      >
                        Read more about {program.title}
                      </Link>
                    ) : null}
                  </article>
                );
              })}
            </div>
            {DOWN_PAYMENT_TERM_GROUPS.has(group.id) ? <ProgramTermsNote /> : null}
          </section>
        ))}

        <div className="flex flex-wrap items-center gap-4 border-t border-ink/10 pt-10">
          <ApplyNowButton>Start Pre-Qualification</ApplyNowButton>
          <Link
            href="/#rates"
            className="text-sm font-semibold text-brand-600 underline-offset-4 hover:underline"
          >
            See today&apos;s published rates
          </Link>
        </div>
      </div>
    </>
  );
}

function ProgramTermsNote() {
  return (
    <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-500">
      Down payment, rate, APR, and repayment terms depend on credit, loan amount, occupancy, and
      property, and are set at lock through {LENDER.dba}. See{" "}
      <Link href="/#rates" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
        today&apos;s published rates with APR and the points/cost they assume
      </Link>{" "}
      and our{" "}
      <Link
        href="/licensing#rate-advertising"
        className="font-semibold text-brand-600 underline-offset-2 hover:underline"
      >
        rate and APR advertising disclosures
      </Link>
      .
    </p>
  );
}
