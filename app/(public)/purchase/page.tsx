import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { PageHero } from "@/components/layout/PageHero";
import { RateTable } from "@/components/home/RateTable";
import { JsonLd } from "@/components/seo/JsonLd";
import { getRates } from "@/lib/data/queries";
import { PEOPLE } from "@/lib/company";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { getNafPublishedMeta } from "@/lib/naf-rates/meta";

export const metadata = pageMetadata({
  title: "Buy a Home in Hampton Roads",
  description:
    "Pre-qualify with the VanDyke Mortgage Team for a conventional, FHA, VA, or self-employed purchase in Suffolk and Hampton Roads, Virginia.",
  path: "/purchase",
});

export default async function PurchasePage() {
  const [rates, publishedMeta] = await Promise.all([getRates(), getNafPublishedMeta()]);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Buy a Home", path: "/purchase" },
        ])}
      />
      <PageHero
        eyebrow="Purchase"
        title="Buy with a team that knows Hampton Roads."
        description={`From first conversation through closing, ${PEOPLE.anthony.name} and ${PEOPLE.gonzalo.name} help first-time buyers, military families, and move-up purchasers structure a New American Funding loan they can live with.`}
      />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
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
            <ApplyNowButton>Start a purchase conversation</ApplyNowButton>
          </div>
          <div className="rounded-board border border-ink/10 bg-white p-6 shadow-card">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              What helps us pre-qualify you
            </h2>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              <li>1. Last two years W-2s or tax returns</li>
              <li>2. Recent paystubs or business documentation</li>
              <li>3. Photo ID and a credit authorization</li>
              <li>4. Purchase contract once you are in escrow</li>
            </ol>
          </div>
        </div>
      </section>
      <RateTable
        rates={rates.filter((rate) => rate.productType !== "arm").slice(0, 6)}
        publishedMeta={publishedMeta}
      />
    </>
  );
}
