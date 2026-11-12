import Link from "next/link";
import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { Button } from "@/components/ui/button";
import { PEOPLE } from "@/lib/company";

// Copy in this file moved word for word from the retired /purchase and /refinance pages
// (see git history at 00c3700). Only the button labels changed.

export function PurchaseSection() {
  return (
    <section id="buy" className="border-b border-ink/10 bg-canvas py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="eyebrow text-brand-600">Purchase</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Buy with a team that knows Hampton Roads.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-ink-600">
          From first conversation through closing, {PEOPLE.anthony.name} and {PEOPLE.gonzalo.name}{" "}
          help first-time buyers, military families, and move-up purchasers structure a New
          American Funding loan they can live with.
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 text-sm leading-relaxed text-slate-600">
            <p>
              Whether you are buying your first home or relocating with a military move, the
              VanDyke Mortgage Team shops conventional, FHA, VA, self-employed, and Non-QM options
              through New American Funding — then walks the file with you.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Secure NAF pre-qualification when you are ready to apply</li>
              <li>VA-friendly planning for eligible veterans and active duty</li>
              <li>Document guidance for W-2 and self-employed income</li>
            </ul>
            <ApplyNowButton>Start Pre-Qualification</ApplyNowButton>
          </div>
          <div className="rounded-board border border-ink/10 bg-white p-6 shadow-card">
            <h3 className="font-display text-2xl font-bold tracking-tight text-ink">
              What helps us pre-qualify you
            </h3>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              <li>1. Last two years W-2s or tax returns</li>
              <li>2. Recent paystubs or business documentation</li>
              <li>3. Photo ID and a credit authorization</li>
              <li>4. Purchase contract once you are in escrow</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

const REFINANCE_TYPES = [
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
];

export function RefinanceSection() {
  return (
    <section id="refinance" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="eyebrow text-brand-600">Refinance</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          If the payment drop does not clear break-even, we will tell you.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-ink-600">
          Rate-and-term, cash-out, and VA refinance reviews with an honest payback timeline — the
          same math as our public refinance calculator.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {REFINANCE_TYPES.map((item) => (
            <div
              key={item.title}
              className="rounded-board border border-ink/10 bg-canvas p-6 shadow-card"
            >
              <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ApplyNowButton>Start Pre-Qualification</ApplyNowButton>
          <Button variant="outline" asChild>
            <Link href="/calculators#refinance">Open break-even calculator</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
