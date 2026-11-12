import Link from "next/link";
import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { PROGRAM_GROUPS, PROGRAMS } from "@/lib/programs";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Loan Programs in Hampton Roads",
  description:
    "Explore conventional, FHA, VA, self-employed, Non-QM, investor, reverse, USDA, and jumbo mortgages with the VanDyke Mortgage Team and New American Funding.",
  path: "/programs",
});

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
            className="scroll-mt-24"
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
                    className="scroll-mt-24 rounded-board border border-ink/10 bg-white p-6 shadow-card"
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
