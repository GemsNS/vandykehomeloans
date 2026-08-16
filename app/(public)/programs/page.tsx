import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import Link from "next/link";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const PROGRAMS = [
  {
    slug: "conventional",
    href: "/programs/conventional",
    title: "Conventional",
    body: "A strong fit for well-qualified buyers, repeat homeowners, and households looking for stable payment planning.",
  },
  {
    slug: "fha",
    href: "/fha-loans",
    title: "FHA",
    body: "A more approachable starting point for buyers who want a structured path and a guided conversation before applying.",
  },
  {
    slug: "va",
    href: "/va-loans",
    title: "VA",
    body: "Created for eligible active-duty and Veteran service members, with no down payment and no monthly PMI for many qualified borrowers.",
  },
  {
    slug: "self-employed",
    href: "/self-employed-loans",
    title: "Self-Employed",
    body: "Mortgage planning for business owners, freelancers, and independent earners whose income documentation is more layered than a W-2.",
  },
  {
    slug: "non-qm",
    href: "/programs/non-qm",
    title: "Non-QM",
    body: "For borrowers exploring non-qualified mortgage options when a conventional box is not the right fit.",
  },
  {
    slug: "investors",
    href: "/programs/investors",
    title: "Investors",
    body: "Financing conversations for real estate investors who need a practical next step, not a teaser rate.",
  },
  {
    slug: "reverse",
    href: "/programs/reverse",
    title: "Reverse Mortgage",
    body: "Guidance for eligible homeowners who want to understand whether a reverse mortgage belongs in the plan.",
  },
  {
    slug: "usda",
    href: "/programs/usda",
    title: "USDA",
    body: "Zero-down options in eligible geographies through New American Funding, subject to income and property maps.",
  },
  {
    slug: "jumbo",
    href: "/programs/jumbo",
    title: "Jumbo",
    body: "High-balance conventional and jumbo files when the purchase price is above conforming limits.",
  },
];

export const metadata = pageMetadata({
  title: "Loan Programs in Hampton Roads",
  description:
    "Explore conventional, FHA, VA, self-employed, Non-QM, investor, reverse, USDA, and jumbo mortgages with the VanDyke Mortgage Team and New American Funding.",
  path: "/programs",
});

export default function ProgramsIndexPage() {
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
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-2 lg:grid-cols-3">
        {PROGRAMS.map((program) => (
          <Link
            key={program.slug}
            href={program.href}
            className="rounded-board border border-ink/10 bg-white p-6 shadow-card transition hover:border-brand-300 hover:shadow-lift"
          >
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              {program.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{program.body}</p>
          </Link>
        ))}
      </section>
      <div className="mx-auto max-w-7xl px-4 pb-12">
        <ApplyNowButton>Talk through program fit</ApplyNowButton>
      </div>
    </>
  );
}
