import { FAQS, REVIEWS } from "@/lib/company";

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

export function NafBlackImpact() {
  return (
    <section id="naf-black-impact" className="bg-ink-950 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4">
        <p className="eyebrow text-brand-300">
          NAF Black Impact
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          A stronger path to equitable homeownership for diverse communities.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75">
          We are dedicated to promoting equitable homeownership in diverse communities. The NAF
          Black Impact program trains and certifies loan officers in cultural competency and
          historical awareness. For the VanDyke Mortgage Team, that commitment supports local Black
          homebuyers in Hampton Roads alongside first-time buyers, military households, and
          self-employed borrowers.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Mortgage-ready guidance",
              body: "Education that helps first-time and returning homeowners prepare financially before they apply.",
            },
            {
              title: "Cultural competency",
              body: "Language grounded in awareness, historical context, and respectful borrower support.",
            },
            {
              title: "Housing Advocate Certified",
              body: "Displayed as a trust marker for equitable borrower support across Hampton Roads.",
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
