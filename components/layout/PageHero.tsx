import Link from "next/link";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-14">
        {eyebrow ? <p className="eyebrow text-brand-300">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/70">{description}</p>
      </div>
    </section>
  );
}

export function CalculatorNav() {
  const items = [
    { href: "/calculators/payment", label: "Payment & amortization" },
    { href: "/calculators/affordability", label: "Affordability" },
    { href: "/calculators/refinance", label: "Refinance break-even" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-board border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-ink/40"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
