import { PageHero } from "@/components/layout/PageHero";
import { LegalBody, LegalIntro } from "@/components/legal/LegalDocument";
import { JsonLd } from "@/components/seo/JsonLd";
import { NAF_TERMS_OF_USE } from "@/lib/legal/naf-terms-of-use";
import { TEAM_NAME } from "@/lib/company";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: `New American Funding's website Terms of Use, reproduced from newamericanfunding.com for the ${TEAM_NAME} website.`,
  path: "/terms",
  keywords: ["New American Funding terms of use", "VanDyke Home Loans terms"],
});

export default function TermsPage() {
  const doc = NAF_TERMS_OF_USE;
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Terms of Use", path: "/terms" },
        ])}
      />
      <PageHero
        eyebrow="Compliance"
        title="Terms of Use"
        description="New American Funding's terms for the use of its websites and online services."
      />
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12">
        <LegalIntro kind="terms of use" doc={doc} />
        <LegalBody doc={doc} />
      </article>
    </>
  );
}
