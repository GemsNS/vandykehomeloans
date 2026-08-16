import { PageHero } from "@/components/layout/PageHero";
import { LeadFunnel } from "@/components/lead-funnel/LeadFunnel";
import { PEOPLE } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Request a Quote",
  description:
    "Four quick steps to reach Branch Manager Anthony VanDyke or Loan Consultant Gonzalo Guimoye. Pre-qualify through the VanDyke Mortgage Team and New American Funding.",
  path: "/apply",
});

export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Four steps to a real quote."
        description={`Tell us about the loan, the property, and how to reach you. ${PEOPLE.anthony.name} or ${PEOPLE.gonzalo.name} will follow up — you can also start New American Funding pre-qualification when you are ready.`}
      />
      <section id="contact" className="mx-auto max-w-xl px-4 py-12">
        <div className="rounded-board border border-ink/10 bg-white p-6 shadow-card">
          <LeadFunnel />
        </div>
      </section>
    </>
  );
}
