import { PageHero } from "@/components/layout/PageHero";
import { LegalBody, LegalIntro } from "@/components/legal/LegalDocument";
import { JsonLd } from "@/components/seo/JsonLd";
import { NAF_PRIVACY_POLICY } from "@/lib/legal/naf-privacy-policy";
import { TEAM_NAME } from "@/lib/company";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `New American Funding's Privacy Policy, reproduced from newamericanfunding.com for the ${TEAM_NAME} website.`,
  path: "/privacy",
  keywords: ["New American Funding privacy policy", "VanDyke Home Loans privacy"],
});

export default function PrivacyPage() {
  const doc = NAF_PRIVACY_POLICY;
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
        description="How New American Funding collects, uses, shares, and safeguards your information."
      />
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12">
        <LegalIntro kind="privacy policy" doc={doc} />
        <LegalBody doc={doc} />
      </article>
    </>
  );
}
