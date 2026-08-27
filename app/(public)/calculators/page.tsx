import Link from "next/link";
import { CalculatorDisclaimer } from "@/components/compliance/CalculatorDisclaimer";
import { CalculatorNav, PageHero } from "@/components/layout/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pageMetadata } from "@/lib/seo";

const TOOLS = [
  {
    href: "/calculators/payment",
    title: "Payment & amortization",
    body: "P&I, taxes, insurance, HOA, and PMI with a month-by-month schedule.",
  },
  {
    href: "/calculators/affordability",
    title: "Home affordability",
    body: "28/36 DTI limits translated into a max purchase price and loan amount.",
  },
  {
    href: "/calculators/refinance",
    title: "Refinance break-even",
    body: "Monthly savings, closing-cost payback, and lifetime interest comparison.",
  },
];

export const metadata = pageMetadata({
  title: "Mortgage Calculators",
  description:
    "Payment, affordability, and refinance break-even calculators from the VanDyke Mortgage Team in Suffolk, VA. Run the numbers before you apply with Anthony VanDyke.",
  path: "/calculators",
});

export default function CalculatorsIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="Run the numbers before you apply."
        description="Every formula is the same engine our loan officers use — principal and interest, APR with points, DTI, and refinance break-even."
      />
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <CalculatorNav />
        <div className="grid gap-6 md:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <Card className="h-full transition hover:shadow-lift">
                <CardHeader>
                  <CardTitle>{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">{tool.body}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <CalculatorDisclaimer />
      </section>
    </>
  );
}
