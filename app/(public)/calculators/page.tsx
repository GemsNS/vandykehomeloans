import type { ReactNode } from "react";
import { AffordabilityCalculator } from "@/components/calculators/AffordabilityCalculator";
import { PaymentCalculator } from "@/components/calculators/PaymentCalculator";
import { RefinanceCalculator } from "@/components/calculators/RefinanceCalculator";
import { CalculatorDisclaimer } from "@/components/compliance/CalculatorDisclaimer";
import { CalculatorNav, PageHero } from "@/components/layout/PageHero";
import { getFeaturedRates } from "@/lib/data/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Mortgage Calculators",
  description:
    "Payment, affordability, and refinance break-even calculators from the VanDyke Mortgage Team in Suffolk, VA. Run the numbers before you apply with Anthony VanDyke.",
  path: "/calculators",
});

export default async function CalculatorsPage() {
  const rates = await getFeaturedRates();
  const firstRate = Number(rates[0]?.rate ?? 6.625);
  const thirtyYearRate = Number(
    rates.find((item) => item.termYears === 30)?.rate ?? rates[0]?.rate ?? 6.625,
  );

  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="Run the numbers before you apply."
        description="Estimate a monthly payment, see how long a refinance takes to break even, and check what a 28/36 debt-to-income budget can buy."
      />
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12">
        <CalculatorNav />

        <CalculatorSection
          id="payment"
          title="Payment & amortization"
          description="Model principal and interest, taxes, insurance, HOA, and PMI. Expand the schedule to see every month of the loan."
        >
          <PaymentCalculator defaultRate={firstRate} />
        </CalculatorSection>

        <CalculatorSection
          id="refinance"
          title="Refinance break-even"
          description="Compare your current coupon against a new VanDyke quote, including points and closing costs."
        >
          <RefinanceCalculator defaultRate={thirtyYearRate} />
        </CalculatorSection>

        <CalculatorSection
          id="affordability"
          title="How much home can you afford?"
          description="We apply the 28/36 front-end and back-end DTI rule, then reverse the payment formula to a max purchase price."
        >
          <AffordabilityCalculator defaultRate={firstRate} />
        </CalculatorSection>

      </div>
    </>
  );
}

function CalculatorSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="space-y-6">
      <div>
        <h2
          id={`${id}-heading`}
          className="font-display text-3xl font-extrabold tracking-tight text-ink"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
      </div>
      {children}
      <CalculatorDisclaimer />
    </section>
  );
}
