import { RefinanceCalculator } from "@/components/calculators/RefinanceCalculator";
import { CalculatorNav, PageHero } from "@/components/layout/PageHero";
import { getFeaturedRates } from "@/lib/data/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Refinance Break-Even Calculator",
  description:
    "Compare your current loan against a new rate, including closing costs and payback months. VanDyke Home Loans, Hampton Roads.",
  path: "/calculators/refinance",
});

export default async function RefinanceCalculatorPage() {
  const rates = await getFeaturedRates();
  const rate = Number(rates.find((item) => item.termYears === 30)?.rate ?? rates[0]?.rate ?? 6.375);
  return (
    <>
      <PageHero
        eyebrow="Calculators"
        title="Refinance break-even"
        description="Compare your current coupon against a new VanDyke quote, including points and closing costs."
      />
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <CalculatorNav />
        <RefinanceCalculator defaultRate={rate} />
      </section>
    </>
  );
}
