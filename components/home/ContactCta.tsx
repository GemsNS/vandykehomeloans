import Image from "next/image";
import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { CONTACT, PEOPLE } from "@/lib/company";
import keysPhoto from "@/public/images/closing-keys.jpg";

export function ContactCta() {
  return (
    <section id="contact" className="bg-canvas py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        {/* Copy leads on phones; a photo above the heading arrives with no context. */}
        <Image
          src={keysPhoto}
          alt="Hand holding the keys to a new home in the doorway"
          sizes="(max-width: 1024px) 100vw, 460px"
          className="order-2 h-auto w-full rounded-board border border-ink/10 object-cover shadow-card lg:order-none"
        />
        <div className="order-1 lg:order-none">
          <p className="eyebrow text-brand-600">Loan inquiry</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink">
            Start with a conversation, not a credit pull.
          </h2>
          <p className="mt-3 text-sm text-ink-600">
            Clients who are not ready to apply can still review the FAQs, check current rates, or
            speak with {PEOPLE.anthony.name} or {PEOPLE.gonzalo.name} first.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ApplyNowButton>Start Pre-Qualification</ApplyNowButton>
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="tape inline-flex h-11 items-center px-5 text-sm font-semibold text-brand-600"
            >
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
