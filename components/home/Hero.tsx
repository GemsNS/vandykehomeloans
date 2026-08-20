import Image from "next/image";
import { LogoPlate } from "@/components/brand/LogoPlate";
import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { QuickQuote } from "@/components/home/QuickQuote";
import { Button } from "@/components/ui/button";
import { CONTACT, PEOPLE } from "@/lib/company";
import { formatPercent } from "@/lib/utils";
import heroPhoto from "@/public/images/hero-neighborhood-dusk.jpg";

const STATS = [
  { label: "Branch manager", value: PEOPLE.anthony.name.split(" ")[0] },
  { label: "NMLS", value: `#${PEOPLE.anthony.nmlsId}` },
  { label: "Office", value: "Suffolk, VA" },
];

export function Hero({ featuredRate }: { featuredRate: number }) {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <Image
        src={heroPhoto}
        alt="A suburban neighborhood at dusk with lit windows"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Navy wash keeps the copy legible while the photograph still warms the panel. Narrow
          screens get an even vertical wash, since a side-to-side fade leaves a bright band
          across the middle of a stacked layout. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/95 via-ink-950/88 to-ink-950/96 lg:bg-gradient-to-r lg:from-ink-950 lg:via-ink-950/88 lg:to-ink-900/45" />
      <div className="grid-field pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand-500/12 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <LogoPlate className="mb-8 hidden w-full max-w-[330px] md:block" />
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
            Let&apos;s get you home.
            <span className="block text-brand-300">Clear rates, real people.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-white/70 sm:text-lg">
            From the first conversation through closing day, the VanDyke Mortgage Team helps
            first-time homebuyers, conventional borrowers, FHA clients, military families, veterans,
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
          {/* Hidden on phones: it is three lines of detail between the CTAs and the quote
              widget, and the same figures appear in the footer. */}
          <dl className="mt-10 hidden max-w-lg grid-cols-3 divide-x divide-white/10 border-y border-white/10 sm:grid">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-4 py-4 first:pl-0">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  {stat.label}
                </dt>
                <dd className="tape mt-1.5 text-lg font-semibold">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm text-white/70">
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
