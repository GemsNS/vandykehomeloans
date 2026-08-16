import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { CONTACT, PEOPLE } from "@/lib/company";

export function ContactCta() {
  return (
    <section id="contact" className="bg-canvas py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="eyebrow text-brand-600">Loan inquiry</p>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink">
          Start with a conversation or secure pre-qualification.
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Clients who are not ready to apply can still review the FAQs, check current rates, or
          speak with {PEOPLE.anthony.name} or {PEOPLE.gonzalo.name} first.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ApplyNowButton>Request a Quote</ApplyNowButton>
          <a
            href={CONTACT.preQual}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-board border border-ink/15 bg-white px-5 text-sm font-semibold text-ink hover:border-ink/40"
          >
            NAF pre-qualification
          </a>
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="tape inline-flex h-11 items-center px-5 text-sm font-semibold text-brand-600"
          >
            {CONTACT.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
