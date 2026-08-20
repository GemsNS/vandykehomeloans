import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { PageHero } from "@/components/layout/PageHero";
import { CONTACT } from "@/lib/company";
import { pageMetadata } from "@/lib/seo";
import { RedirectToNafPrequal } from "./RedirectToNafPrequal";

export const metadata = pageMetadata({
  title: "Start Pre-Qualification",
  description:
    "Begin New American Funding pre-qualification with Branch Manager Anthony VanDyke. Credit, Social Security, and application data are submitted on NAF’s secure portal.",
  path: "/apply",
});

export default function ApplyPage() {
  return (
    <>
      <RedirectToNafPrequal />
      <PageHero
        eyebrow="Pre-qualification"
        title="Continue on New American Funding."
        description="Social Security numbers, credit pulls, and the rest of the application are handled on Anthony VanDyke’s New American Funding portal — the same system the team uses to originate."
      />
      <section className="mx-auto max-w-xl px-4 py-12 text-center">
        <ApplyNowButton size="lg">Start NAF Pre-Qualification</ApplyNowButton>
        <p className="mt-4 text-sm text-ink-600">
          If you are not redirected,{" "}
          <a
            href={CONTACT.preQual}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-600 underline-offset-4 hover:underline"
          >
            open the application
          </a>
          .
        </p>
      </section>
    </>
  );
}
