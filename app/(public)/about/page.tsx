import { PageHero } from "@/components/layout/PageHero";
import { TrustSection } from "@/components/home/TrustSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { CONTACT, LENDER, PEOPLE, fullAddress } from "@/lib/company";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the VanDyke Mortgage Team",
  description:
    "Meet Branch Manager Anthony VanDyke, NMLS #955777, and the Suffolk, Virginia VanDyke Mortgage Team — powered by New American Funding, NMLS #6606.",
  path: "/about",
  keywords: ["Anthony VanDyke", "Suffolk VA mortgage", "New American Funding Suffolk"],
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHero
        eyebrow="About"
        title="A Hampton Roads team backed by New American Funding."
        description="VanDyke Home Loans is the local face of the VanDyke Mortgage Team. Branch Manager Anthony VanDyke and Loan Consultant Gonzalo Guimoye originate purchase and refinance loans from Suffolk, Virginia."
      />
      <section className="mx-auto max-w-3xl space-y-5 px-4 py-12 text-sm leading-relaxed text-slate-600">
        <p>
          {PEOPLE.anthony.name} is Branch Manager, NMLS #{PEOPLE.anthony.nmlsId}. With many years
          originating purchase and refinance loans, he is focused on competitive New American
          Funding pricing, professional advice, and consistent communication from application
          through closing.
        </p>
        <p>
          {PEOPLE.gonzalo.name}, NMLS #{PEOPLE.gonzalo.nmlsId}, is a dedicated loan consultant
          serving the same community. Together they help first-time buyers, military families,
          veterans, FHA clients, self-employed borrowers, and investors.
        </p>
        <p>
          Office: {fullAddress()}. Phone: {CONTACT.phoneDisplay}. Email:{" "}
          <a className="font-semibold text-brand-600" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
          . Company: {LENDER.name}, NMLS #{LENDER.nmls}. Confirm licenses at{" "}
          <a className="font-semibold text-brand-600" href={LENDER.nmlsLookup} target="_blank" rel="noreferrer">
            NMLS Consumer Access
          </a>
          .
        </p>
        <p>
          Rates shown on this site are for illustration. Your actual rate is determined at lock
          through New American Funding and depends on credit, occupancy, property, and product.
        </p>
      </section>
      <TrustSection />
    </>
  );
}
