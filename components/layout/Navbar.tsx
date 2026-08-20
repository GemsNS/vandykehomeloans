"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/company";
import { cn } from "@/lib/utils";

// Every loan program lives here and nowhere else in the nav, so no destination is listed twice.
const PROGRAMS = [
  { href: "/programs/conventional", label: "Conventional" },
  { href: "/fha-loans", label: "FHA" },
  { href: "/va-loans", label: "VA" },
  { href: "/self-employed-loans", label: "Self-Employed" },
  { href: "/programs/non-qm", label: "Non-QM" },
  { href: "/programs/investors", label: "Investors" },
  { href: "/programs/reverse", label: "Reverse Mortgage" },
];

const PROGRAMS_INDEX = { href: "/programs", label: "All Loan Programs" };

const LINKS_BEFORE_PROGRAMS = [
  { href: "/purchase", label: "Buy a Home" },
  { href: "/refinance", label: "Refinance" },
];

const LINKS_AFTER_PROGRAMS = [
  { href: "/#rates", label: "Rates" },
  { href: "/calculators", label: "Calculators" },
  { href: "/#naf-black-impact", label: "NAF Black Impact" },
  { href: "/team", label: "Team" },
  { href: "/about", label: "About" },
];

const OUTLINE_ON_DARK =
  "border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/10";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [programsOpen, setProgramsOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
    setProgramsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);
  const programsActive = [PROGRAMS_INDEX, ...PROGRAMS].some((program) =>
    pathname.startsWith(program.href),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/95 text-white backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="VanDyke Home Loans home">
          <BrandLockup />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          {LINKS_BEFORE_PROGRAMS.map((link) => (
            <NavLink key={link.href} href={link.href} active={isActive(link.href)}>
              {link.label}
            </NavLink>
          ))}
          <div className="relative">
            <button
              type="button"
              className={cn(
                "relative inline-flex items-center gap-1 whitespace-nowrap rounded-board px-3 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white",
                programsActive &&
                  "text-white after:absolute after:inset-x-3 after:-bottom-[9px] after:h-0.5 after:bg-brand-500",
              )}
              onClick={() => setProgramsOpen((value) => !value)}
              onBlur={() => setTimeout(() => setProgramsOpen(false), 150)}
              aria-expanded={programsOpen}
            >
              Loan Programs
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {programsOpen ? (
              <div className="absolute left-0 top-full z-50 mt-2 w-52 rounded-board border border-white/10 bg-ink-900 p-2 shadow-lift">
                {PROGRAMS.map((program) => (
                  <Link
                    key={program.href}
                    href={program.href}
                    className="block rounded-board px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    {program.label}
                  </Link>
                ))}
                <Link
                  href={PROGRAMS_INDEX.href}
                  className="mt-1 block border-t border-white/10 px-3 pb-2 pt-3 text-sm font-semibold text-brand-300 hover:text-white"
                >
                  {PROGRAMS_INDEX.label}
                </Link>
              </div>
            ) : null}
          </div>
          {LINKS_AFTER_PROGRAMS.map((link) => (
            <NavLink key={link.href} href={link.href} active={isActive(link.href)}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="tape hidden whitespace-nowrap text-sm font-semibold text-brand-300 xl:inline"
          >
            {CONTACT.phoneDisplay}
          </a>
          <Button variant="outline" size="sm" className={OUTLINE_ON_DARK} asChild>
            <a href={CONTACT.portal} target="_blank" rel="noreferrer">
              My Portal
            </a>
          </Button>
          <ApplyNowButton size="sm">Start Pre-Qualification</ApplyNowButton>
        </div>

        <button
          type="button"
          className="rounded-board p-2 text-white xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-ink-950 px-4 py-4 xl:hidden">
          <div className="flex flex-col gap-1">
            {LINKS_BEFORE_PROGRAMS.map((link) => (
              <MobileLink key={link.href} href={link.href}>
                {link.label}
              </MobileLink>
            ))}
            <p className="eyebrow mt-3 px-3 py-1 text-white/40">Loan Programs</p>
            {PROGRAMS.map((program) => (
              <MobileLink key={program.href} href={program.href}>
                {program.label}
              </MobileLink>
            ))}
            <MobileLink href={PROGRAMS_INDEX.href}>{PROGRAMS_INDEX.label}</MobileLink>
            <div className="mt-3 h-px bg-white/10" />
            {LINKS_AFTER_PROGRAMS.map((link) => (
              <MobileLink key={link.href} href={link.href}>
                {link.label}
              </MobileLink>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button variant="outline" className={OUTLINE_ON_DARK} asChild>
                <a href={CONTACT.portal} target="_blank" rel="noreferrer">
                  My Portal
                </a>
              </Button>
              <ApplyNowButton>Start Pre-Qualification</ApplyNowButton>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-board px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
    >
      {children}
    </Link>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative whitespace-nowrap rounded-board px-2.5 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white",
        active &&
          "text-white after:absolute after:inset-x-2.5 after:-bottom-[9px] after:h-0.5 after:bg-brand-500",
      )}
    >
      {children}
    </Link>
  );
}
