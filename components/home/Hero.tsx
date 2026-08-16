import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { QuickQuote } from "@/components/home/QuickQuote";
import { Button } from "@/components/ui/button";
import { CONTACT, PEOPLE } from "@/lib/company";
import { formatPercent } from "@/lib/utils";

const STATS = [
  { label: "Branch manager", value: PEOPLE.anthony.name.split(" ")[0] },
  { label: "NMLS", value: `#${PEOPLE.anthony.nmlsId}` },
  { label: "Office", value: "Suffolk, VA" },
];

export function Hero({ featuredRate }: { featuredRate: number }) {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-sm border border-brand-500/40 bg-brand-500/10 px-2.5 py-1">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-up" />
              <span className="tape text-[11px] uppercase tracking-wider text-brand-300">
                30-Yr fixed {formatPercent(featuredRate)}
              </span>
            </span>
            <span className="eyebrow text-white/50">Indicative · Hampton Roads, VA</span>
          </div>
          <h1 className="mt-6 max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Mortgage pricing,
            <span className="block text-brand-300">on the board.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-white/70 sm:text-lg">
            From pre-qualification through closing, the VanDyke Mortgage Team helps first-time
            homebuyers, conventional borrowers, FHA clients, military families, veterans,
            self-employed borrowers, real estate investors, and clients exploring non-qualified
            mortgage options — with direct access to New American Funding.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ApplyNowButton size="lg">Start Pre-Qualification</ApplyNowButton>
            <Button
              variant="outline"
              size="lg"
              className="border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/10"
              asChild
            >
              <a href="/refinance">I am Refinancing</a>
            </Button>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-y border-white/10">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-4 py-4 first:pl-0">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  {stat.label}
                </dt>
                <dd className="tape mt-1.5 text-lg font-semibold">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm text-white/55">
            Call{" "}
            <a className="tape font-semibold text-brand-300" href={`tel:${CONTACT.phoneTel}`}>
              {CONTACT.phoneDisplay}
            </a>{" "}
            · Powered by NAF | New American Funding
          </p>
        </div>
        <QuickQuote defaultRate={featuredRate} />
      </div>
    </section>
  );
}
