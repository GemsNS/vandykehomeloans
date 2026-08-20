import { PaymentCalculator } from "@/components/calculators/PaymentCalculator";
import { CalculatorNav, PageHero } from "@/components/layout/PageHero";
import { getFeaturedRates } from "@/lib/data/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Mortgage Payment Calculator",
  description:
    "Estimate principal, interest, taxes, insurance, HOA, and PMI with a month-by-month amortization table. VanDyke Home Loans, Suffolk VA.",
  path: "/calculators/payment",
});

export default async function PaymentCalculatorPage() {
  const rates = await getFeaturedRates();
  const rate = Number(rates[0]?.rate ?? 6.625);
  return (
    <>
      <PageHero
        eyebrow="Calculators"
        title="Payment & amortization"
        description="Model principal and interest, taxes, insurance, HOA, and PMI. Expand the schedule to see every month of the loan."
      />
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <CalculatorNav />
        <PaymentCalculator defaultRate={rate} />
      </section>
    </>
  );
}
