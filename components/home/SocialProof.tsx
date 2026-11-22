import Image from "next/image";
import { FAQS, PEOPLE, REVIEWS } from "@/lib/company";
import communityPhoto from "@/public/images/father-son-kitchen.jpg";

export function ReviewsSection() {
  return (
    <section className="bg-canvas py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="eyebrow text-brand-600">
          Borrower reviews
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          What clients say about the VanDyke team
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <blockquote
              key={review.author}
              className="rounded-board border border-ink/10 bg-white p-6 shadow-card"
            >
              <p className="text-sm leading-relaxed text-slate-600">“{review.quote}”</p>
              <footer className="mt-4">
                <cite className="font-display text-lg font-bold not-italic tracking-tight text-ink">
                  {review.author}
                </cite>
                <p className="text-xs text-slate-500">
                  {review.location}
                  {review.date ? ` · ${review.date}` : ""}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
        <p className="mt-6 text-sm">
          <a
            href={PEOPLE.anthony.profile}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-brand-600 underline-offset-4 hover:underline"
          >
            Read reviews on Anthony&apos;s New American Funding profile
          </a>
        </p>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-4">
        <p className="eyebrow text-brand-600">
          Frequently asked questions
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink">
          Mortgage questions we hear first
        </h2>
        <dl className="mt-8 space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.question} className="rounded-board border border-ink/10 bg-canvas p-5">
              <dt className="font-semibold text-ink">{faq.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function CommitmentSection() {
  return (
    <section id="commitment" className="bg-ink-950 py-16 text-white">
      {/* Retired anchor: keeps old /#naf-black-impact links landing on this section. */}
      <span id="naf-black-impact" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="eyebrow text-brand-300">Our commitment</p>
            <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              A place to call home, for every family in Hampton Roads.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75">
              Buying, refinancing, or keeping a home is one of the most personal decisions a family
              makes. Anthony and Gonzalo take the time to listen, explain each option in plain
              language, and walk alongside you from the first conversation to the closing table —
              with the same care for every family they serve.
            </p>
          </div>
          <Image
            src={communityPhoto}
            alt="A father and son talking at the kitchen counter of their home"
            sizes="(max-width: 1024px) 100vw, 480px"
            className="aspect-[4/3] h-auto w-full rounded-board border border-white/10 object-cover object-[60%_55%] shadow-lift"
          />
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Prepared, not pressured",
              body: "Time to understand your budget, your options, and the steps ahead before you apply.",
            },
            {
              title: "Respect at every step",
              body: "Patient, courteous guidance for first-time and returning homeowners alike, whatever your story.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-board border border-white/10 bg-white/5 p-5">
              <h3 className="font-display text-xl font-bold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm text-white/70">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
