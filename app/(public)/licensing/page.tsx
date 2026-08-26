import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { CONTACT, LENDER, PEOPLE, SITE_NAME, TEAM_NAME, fullAddress } from "@/lib/company";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Licensing & Disclosures",
  description: `NMLS licensing, Equal Housing, rate advertising, and fair-lending disclosures for ${SITE_NAME} and the ${TEAM_NAME}.`,
  path: "/licensing",
  keywords: ["NMLS 6606", "Equal Housing Lender", "VanDyke Home Loans disclosures"],
});

export default function LicensingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Licensing & Disclosures", path: "/licensing" },
        ])}
      />
      <PageHero
        eyebrow="Compliance"
        title="Licensing & Disclosures"
        description="NMLS identifiers, fair-lending commitments, and advertising disclosures for this Hampton Roads mortgage site."
      />
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 text-sm leading-relaxed text-slate-700">
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Licensing</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              {LENDER.name} ({LENDER.dba}) — Company NMLS #{LENDER.nmls}
            </li>
            <li>
              {PEOPLE.anthony.name}, {PEOPLE.anthony.title} — NMLS #{PEOPLE.anthony.nmlsId} (
              {PEOPLE.anthony.licenseStates})
            </li>
            <li>
              {PEOPLE.gonzalo.name}, {PEOPLE.gonzalo.title} — NMLS #{PEOPLE.gonzalo.nmlsId} (
              {PEOPLE.gonzalo.licenseStates})
            </li>
          </ul>
          <p>
            Confirm licenses at{" "}
            <a
              href={LENDER.nmlsLookup}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-600 underline-offset-2 hover:underline"
            >
              NMLS Consumer Access
            </a>
            . State licensing details for {LENDER.dba} are published at{" "}
            <a
              href={LENDER.licensing}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-600 underline-offset-2 hover:underline"
            >
              newamericanfunding.com/legal/state-licensing
            </a>
            .
          </p>
          <p>
            Office: {fullAddress()}. Phone:{" "}
            <a href={`tel:${CONTACT.phoneTel}`} className="font-semibold text-brand-600">
              {CONTACT.phoneDisplay}
            </a>
            . Email:{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-semibold text-brand-600">
              {CONTACT.email}
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Equal Housing &amp; fair lending
          </h2>
          <p>
            {LENDER.name} is an Equal Housing Lender. We fully comply with the Equal Credit
            Opportunity Act (ECOA), Fair Housing Act, and other applicable federal and state
            regulations. All applicants applying for credit will be treated equally regardless of
            race, color, ethnicity, national origin, religion, sex or gender, sexual orientation,
            gender identification, military status, marital or familial status, age, disability or
            handicap, receipt of public assistance, exercise of any right under the Consumer Credit
            Protection Act, or any other prohibited basis.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Relationship to New American Funding
          </h2>
          <p>
            {SITE_NAME} / the {TEAM_NAME} market mortgage services and educate borrowers in Hampton
            Roads. Loans discussed on this site are originated through {LENDER.dba}. Branding,
            rates, and program availability remain subject to lender policies and underwriting.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Rate and APR advertising
          </h2>
          <p>
            When interest rates appear on this site, corresponding APRs and assumed points/cost are
            shown or linked nearby. Published figures are estimates copied from{" "}
            <a
              href={CONTACT.publishedRates}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-600 underline-offset-2 hover:underline"
            >
              New American Funding&apos;s mortgage rates page
            </a>{" "}
            and are not a commitment to lend. Your actual rate, APR, payment, and costs are set at
            lock and may differ based on credit, loan amount, property, occupancy, and other factors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Calculators and educational content
          </h2>
          <p>
            Payment, affordability, and refinance tools provide educational estimates only. They are
            not appraisals, underwriting decisions, loan offers, or guarantees of approval. Always
            confirm figures with a licensed loan officer before making a purchase or refinance
            decision.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Privacy</h2>
          <p>
            How we handle website inquiries is described in our{" "}
            <Link href="/privacy" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </article>
    </>
  );
}
