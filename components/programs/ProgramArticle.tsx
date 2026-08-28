import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { PageHero } from "@/components/layout/PageHero";
import { RateTable } from "@/components/home/RateTable";
import { JsonLd } from "@/components/seo/JsonLd";
import { PROGRAMS, type ProgramSlug } from "@/lib/programs";
import { getRates } from "@/lib/data/queries";
import { getNafPublishedMeta } from "@/lib/naf-rates/meta";
import { breadcrumbJsonLd } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function ProgramArticle({ slug }: { slug: string }) {
  const program = PROGRAMS[slug as ProgramSlug];
  if (!program) notFound();
  const [allRates, publishedMeta] = await Promise.all([getRates(), getNafPublishedMeta()]);
  const rates = allRates.filter((rate) => rate.productType === program.type);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Loan Programs", path: "/programs" },
          { name: program.title, path: program.path },
        ])}
      />
      <PageHero eyebrow="Loan programs" title={program.headline} description={program.description} />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <ul className="grid gap-4 md:grid-cols-3">
          {program.bullets.map((bullet) => (
            <li
              key={bullet}
              className="rounded-board border border-ink/10 bg-white p-5 text-sm text-slate-600 shadow-card"
            >
              {bullet}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <ApplyNowButton>Apply for {program.title}</ApplyNowButton>
        </div>
      </section>
      {rates.length > 0 ? <RateTable rates={rates} publishedMeta={publishedMeta} /> : null}
    </>
  );
}
