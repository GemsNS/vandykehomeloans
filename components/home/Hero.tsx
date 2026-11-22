import { Phone } from "lucide-react";
import Image from "next/image";
import { AwardFigure } from "@/components/home/AwardFigure";
import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/company";
import heroPhoto from "@/public/images/hero-neighborhood-dusk.jpg";

export function Hero() {
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
      {/* One grid, three children: the award sits under the h1 on phones and moves to the
          right column on desktop without being rendered twice. */}
      <div className="relative mx-auto grid max-w-7xl gap-x-12 gap-y-7 px-4 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="eyebrow text-white/50">Suffolk · Hampton Roads, VA</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Let&apos;s get you home.
            <span className="block text-brand-300">Clear rates, real people.</span>
          </h1>
        </div>
        <AwardFigure className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center" />
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="max-w-lg text-base text-white/70 sm:text-lg">
            From the first conversation through closing day, the VanDyke Mortgage Team helps you
            buy, refinance, or put a VA benefit to work — with direct access to New American
            Funding.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ApplyNowButton size="lg">Start Pre-Qualification</ApplyNowButton>
            <Button
              variant="outline"
              size="lg"
              className="border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/10"
              asChild
            >
              <a href={`tel:${CONTACT.phoneTel}`}>
                <Phone className="h-4 w-4" />
                Call Anthony <span className="tape">{CONTACT.phoneDisplay}</span>
              </a>
            </Button>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-300">
            Powered by NAF | New American Funding
          </p>
        </div>
      </div>
    </section>
  );
}
