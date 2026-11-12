import { PurchaseSection, RefinanceSection } from "@/components/home/BorrowSections";
import { BrokerGrid } from "@/components/home/BrokerGrid";
import { ContactCta } from "@/components/home/ContactCta";
import { Hero } from "@/components/home/Hero";
import { LifestyleShowcase } from "@/components/home/LifestyleShowcase";
import { RateTable } from "@/components/home/RateTable";
import { FaqSection, NafBlackImpact, ReviewsSection } from "@/components/home/SocialProof";
import { JsonLd } from "@/components/seo/JsonLd";
import { getActiveBrokers, getRates } from "@/lib/data/queries";
import { FAQS, SITE_NAME } from "@/lib/company";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { getNafPublishedMeta } from "@/lib/naf-rates/meta";

export const metadata = pageMetadata({
  title: SITE_NAME,
  description:
    "VanDyke Home Loans in Suffolk, VA. Branch Manager Anthony VanDyke, NMLS #955777, and Loan Consultant Gonzalo Guimoye, NMLS #1131706. Conventional, FHA, VA, self-employed, Non-QM, and investor financing through New American Funding.",
  path: "/",
  keywords: ["Suffolk mortgage", "Hampton Roads VA loans", "Anthony VanDyke NMLS 955777"],
});

export default async function HomePage() {
  const [rates, brokers, publishedMeta] = await Promise.all([
    getRates(),
    getActiveBrokers(),
    getNafPublishedMeta(),
  ]);

  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <Hero />
      <LifestyleShowcase />
      <PurchaseSection />
      <RefinanceSection />
      <RateTable rates={rates} publishedMeta={publishedMeta} />
      {/* Old /about and /team URLs 301 here. NAF Black Impact keeps its own anchor inside. */}
      <div id="anthony">
        <BrokerGrid brokers={brokers} />
        <NafBlackImpact />
      </div>
      <ReviewsSection />
      <FaqSection />
      <ContactCta />
    </>
  );
}
