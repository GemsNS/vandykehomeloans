import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { CONTACT, LENDER, PEOPLE, SITE_NAME, TEAM_NAME, fullAddress } from "@/lib/company";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and protects information submitted through this website and related contact channels.`,
  path: "/privacy",
  keywords: ["VanDyke Home Loans privacy", "mortgage privacy policy Suffolk VA"],
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
      <PageHero
        eyebrow="Compliance"
        title="Privacy Policy"
        description={`${SITE_NAME} respects your privacy. This page explains what we collect on this website and how the ${TEAM_NAME} uses it.`}
      />
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 text-sm leading-relaxed text-slate-700">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
          Effective for {SITE_NAME} · {fullAddress()}
        </p>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Who we are</h2>
          <p>
            This website is operated by the {TEAM_NAME} for marketing and borrower education.
            Mortgage loans are originated through {LENDER.name} ({LENDER.dba}), NMLS #{LENDER.nmls}.
            Licensed originators include {PEOPLE.anthony.name} (NMLS #{PEOPLE.anthony.nmlsId}) and{" "}
            {PEOPLE.gonzalo.name} (NMLS #{PEOPLE.gonzalo.nmlsId}).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Information we collect
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Contact and inquiry details you submit through forms (name, email, phone, loan goals,
              and related answers).
            </li>
            <li>
              Technical data such as browser type, device, approximate location derived from IP,
              pages viewed, and referring URL when available from hosting or analytics tools.
            </li>
            <li>
              Communications you send by phone, email, or SMS to the numbers and addresses published
              on this site.
            </li>
          </ul>
          <p>
            Mortgage calculators on this site run in your browser and are designed not to store
            personal information on our servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">How we use it</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Respond to rate, purchase, refinance, and program inquiries.</li>
            <li>Provide requested follow-up by phone, email, or text when you consent.</li>
            <li>Operate, secure, and improve this website.</li>
            <li>Meet legal, regulatory, and lender compliance obligations.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Sharing and loan applications
          </h2>
          <p>
            Lead information submitted here may be reviewed by the {TEAM_NAME} and, when you begin
            or continue an application, by {LENDER.dba} and its service providers under their
            privacy practices. Formal mortgage applications are completed on New American Funding
            systems. Review{" "}
            <a
              href="https://www.newamericanfunding.com/legal/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-600 underline-offset-2 hover:underline"
            >
              New American Funding&apos;s Privacy Policy
            </a>{" "}
            for lender-controlled processing.
          </p>
          <p>
            We do not sell personal information. We may disclose information when required by law,
            to protect rights and safety, or to service providers who support hosting, email, or
            security under appropriate confidentiality terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            Telephone and text consent
          </h2>
          <p>
            If you provide a phone number and submit a form, you agree that the {TEAM_NAME} /{" "}
            {LENDER.dba} may contact you at that number about your inquiry, including via autodialed
            or prerecorded calls or texts. Consent is not a condition of purchase. Message and data
            rates may apply. You may opt out of texts by replying STOP and request no further
            marketing contact by emailing{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-semibold text-brand-600">
              {CONTACT.email}
            </a>{" "}
            or calling{" "}
            <a href={`tel:${CONTACT.phoneTel}`} className="font-semibold text-brand-600">
              {CONTACT.phoneDisplay}
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Cookies</h2>
          <p>
            This site may use essential cookies or similar technologies needed for security,
            session continuity, and basic performance. We do not use those technologies to sell
            personal information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Your choices</h2>
          <p>
            You may request access to or correction of contact information we hold about you, or ask
            us to limit marketing follow-up, by contacting us at the email or phone above. Certain
            records may be retained as required for compliance, fraud prevention, or dispute
            resolution.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Updates</h2>
          <p>
            We may update this Privacy Policy as practices or legal requirements change. The current
            version will be posted on this page. Related disclosures are available on our{" "}
            <Link href="/licensing" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
              Licensing &amp; Disclosures
            </Link>{" "}
            page.
          </p>
        </section>
      </article>
    </>
  );
}
