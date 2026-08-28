import { BrokerGrid } from "@/components/home/BrokerGrid";
import { ContactCta } from "@/components/home/ContactCta";
import { Hero } from "@/components/home/Hero";
import { LifestyleShowcase } from "@/components/home/LifestyleShowcase";
import { RateTable } from "@/components/home/RateTable";
import { FaqSection, NafBlackImpact, ReviewsSection } from "@/components/home/SocialProof";
import { TrustSection } from "@/components/home/TrustSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getActiveBrokers, getRates } from "@/lib/data/queries";
import { FAQS } from "@/lib/company";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { getNafPublishedMeta } from "@/lib/naf-rates/meta";

export const metadata = pageMetadata({
  title: "VanDyke Home Loans | Hampton Roads Mortgages",
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
  const featured = rates.find((rate) => rate.isFeatured) ?? rates[0];

  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <Hero featuredRate={Number(featured?.rate ?? 6.625)} />
      <LifestyleShowcase />
      <RateTable rates={rates} publishedMeta={publishedMeta} />
      <BrokerGrid brokers={brokers} />
      <ReviewsSection />
      <TrustSection />
      <NafBlackImpact />
      <FaqSection />
      <ContactCta />
    </>
  );
}
