import { AffordabilityCalculator } from "@/components/calculators/AffordabilityCalculator";
import { CalculatorNav, PageHero } from "@/components/layout/PageHero";
import { getFeaturedRates } from "@/lib/data/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Home Affordability Calculator",
  description:
    "Estimate how much home you can afford using 28/36 DTI limits. VanDyke Mortgage Team, Suffolk, Virginia.",
  path: "/calculators/affordability",
});

export default async function AffordabilityPage() {
  const rates = await getFeaturedRates();
  const rate = Number(rates[0]?.rate ?? 6.375);
  return (
    <>
      <PageHero
        eyebrow="Calculators"
        title="How much home can you afford?"
        description="We apply the 28/36 front-end and back-end DTI rule, then reverse the payment formula to a max purchase price."
      />
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <CalculatorNav />
        <AffordabilityCalculator defaultRate={rate} />
      </section>
    </>
  );
}
