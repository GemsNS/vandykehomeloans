import { ArrowRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import porchPhoto from "@/public/images/black-excellence-kitchen.jpg";
import purchasePhoto from "@/public/images/black-excellence-keys.jpg";
import refinancePhoto from "@/public/images/refinance-good-news.jpg";
import selfEmployedPhoto from "@/public/images/self-employed-owners.jpg";
import vaPhoto from "@/public/images/va-military-couple.jpg";

type Audience = {
  href: string;
  label: string;
  headline: string;
  body: string;
  photo: StaticImageData;
  alt: string;
  /** Crop anchor, so the narrow phone frame lands on the people and not the background. */
  focus: string;
};

const AUDIENCES: Audience[] = [
  {
    href: "/purchase",
    label: "Buying",
    headline: "First keys, first home",
    body: "Pre-qualification, down payment options, and a closing timeline you can plan around.",
    photo: purchasePhoto,
    alt: "African American couple shaking hands and receiving the keys to their new home",
    focus: "object-center",
  },
  {
    href: "/va-loans",
    label: "Military & veterans",
    headline: "Service earned this",
    body: "VA financing with no down payment for eligible veterans and active-duty families.",
    photo: vaPhoto,
    alt: "Military couple wrapped together in an American flag",
    focus: "object-[50%_38%]",
  },
  {
    href: "/self-employed-loans",
    label: "Self-employed",
    headline: "Your income, understood",
    body: "Bank statement and Non-QM options for business owners and 1099 earners.",
    photo: selfEmployedPhoto,
    alt: "Two small business owners smiling together inside their cafe",
    focus: "object-[52%_32%]",
  },
  {
    href: "/refinance",
    label: "Refinancing",
    headline: "Better news at the table",
    body: "Lower the payment, shorten the term, or pull cash out for the projects that matter.",
    photo: refinancePhoto,
    alt: "Woman reading good news from a letter at her kitchen table as her partner walks in",
    focus: "object-[48%_40%]",
  },
];

export function LifestyleShowcase() {
  return (
    <section className="border-b border-ink/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="eyebrow text-brand-600">Who we help</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Neighbors in Hampton Roads, not file numbers
            </h2>
            <p className="mt-4 max-w-xl text-base text-ink-600">
              Anthony and Gonzalo have sat at these kitchen tables. Whatever brought you here — a
              first home, a VA benefit you earned, a business that pays you differently, or a rate
              worth revisiting — there is a program for it, and a person who answers the phone.
            </p>
          </div>
          {/* Squarer crop on phones so the family is not lost in a wide architectural frame. */}
          <div className="relative aspect-[5/4] overflow-hidden rounded-board border border-ink/10 shadow-card sm:aspect-[3/2]">
            <Image
              src={porchPhoto}
              alt="African American parents and their children preparing breakfast together in their kitchen"
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover object-[50%_40%]"
            />
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((audience) => (
            // Phones get a photo beside the copy; stacking four full-width cards buried the
            // last two under a long scroll.
            <Link
              key={audience.href}
              href={audience.href}
              className="group grid grid-cols-[38%_1fr] overflow-hidden rounded-board border border-ink/10 bg-white shadow-card transition-shadow hover:shadow-lift sm:block"
            >
              <div className="relative min-h-[8.5rem] overflow-hidden sm:aspect-[4/3] sm:min-h-0">
                <Image
                  src={audience.photo}
                  alt={audience.alt}
                  fill
                  sizes="(max-width: 640px) 40vw, (max-width: 1024px) 50vw, 25vw"
                  className={cn(
                    "object-cover transition-transform duration-500 group-hover:scale-[1.04]",
                    audience.focus,
                  )}
                />
                <div className="absolute inset-0 hidden bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent sm:block" />
                <p className="eyebrow absolute bottom-3 left-4 hidden text-brand-300 sm:block">
                  {audience.label}
                </p>
              </div>
              <div className="p-4 sm:p-5">
                <p className="eyebrow text-brand-600 sm:hidden">{audience.label}</p>
                <h3 className="mt-1.5 font-display text-lg font-bold tracking-tight text-ink sm:mt-0">
                  {audience.headline}
                </h3>
                <p className="mt-2 text-sm text-ink-600">{audience.body}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 sm:mt-4">
                  See options
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
