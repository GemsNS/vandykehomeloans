import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata({
  title: "Refinance with the VanDyke Mortgage Team",
  description:
    "Compare a rate-and-term or cash-out refinance with Anthony VanDyke and Gonzalo Guimoye in Suffolk, VA. VA IRRRL and streamline options available through New American Funding.",
  path: "/refinance",
});

export default function RefinancePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Refinance", path: "/refinance" },
        ])}
      />
      <PageHero
        eyebrow="Refinance"
        title="If the payment drop does not clear break-even, we will tell you."
        description="Rate-and-term, cash-out, and VA refinance reviews with an honest payback timeline — the same math as our public refinance calculator."
      />
      <section className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Rate & term",
              body: "Lower the coupon or shorten the term without taking cash out.",
            },
            {
              title: "Cash-out",
              body: "Tap equity for renovations, debt consolidation, or reserves — structured against DTI.",
            },
            {
              title: "VA refinance",
              body: "Streamline or cash-out paths when remaining entitlement and recoupment still work.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-board border border-ink/10 bg-white p-6 shadow-card">
              <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <ApplyNowButton>Check refinance savings</ApplyNowButton>
          <Button variant="outline" asChild>
            <Link href="/calculators/refinance">Open break-even calculator</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
