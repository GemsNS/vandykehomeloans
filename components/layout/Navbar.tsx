"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/company";
import { cn } from "@/lib/utils";

// Five destinations. FHA, My Portal, NAF Black Impact and Staff login live in the footer.
const LINKS = [
  { href: "/programs", label: "Loans" },
  { href: "/va-loans", label: "VA Loans" },
  { href: "/#rates", label: "Rates" },
  { href: "/calculators", label: "Calculators" },
  { href: "/#anthony", label: "Meet Anthony" },
];

const OUTLINE_ON_DARK =
  "border-white/25 bg-transparent text-white hover:border-white/60 hover:bg-white/10";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/95 text-white backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label="VanDyke Home Loans home">
          <BrandLockup />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} active={isActive(link.href)}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Phones get Call and Start Pre-Qualification in the bottom action bar instead. */}
          <Button
            variant="outline"
            size="sm"
            className={cn("hidden md:inline-flex", OUTLINE_ON_DARK)}
            asChild
          >
            <a href={`tel:${CONTACT.phoneTel}`}>
              <Phone className="h-3.5 w-3.5" />
              <span className="xl:hidden">Call</span>
              <span className="tape hidden xl:inline">{CONTACT.phoneDisplay}</span>
            </a>
          </Button>
          <ApplyNowButton size="sm" className="hidden md:inline-flex">
            Start Pre-Qualification
          </ApplyNowButton>
          <button
            type="button"
            className="rounded-board p-2 text-white lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-white/10 bg-ink-950 px-4 py-4 lg:hidden" aria-label="Menu">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-board px-3 py-2.5 text-base font-semibold text-white/80 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

/**
 * Phone-only bar pinned to the bottom of the screen so Call and Start Pre-Qualification are
 * always one tap away. SiteShell pads the page by the bar's height so it never covers the
 * footer's compliance text.
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <Button variant="outline" className={OUTLINE_ON_DARK} asChild>
          <a href={`tel:${CONTACT.phoneTel}`}>
            <Phone className="h-4 w-4" />
            Call Anthony
          </a>
        </Button>
        <ApplyNowButton>Start Pre-Qualification</ApplyNowButton>
      </div>
    </div>
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
        "relative whitespace-nowrap rounded-board px-3 py-2 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white",
        active &&
          "text-white after:absolute after:inset-x-3 after:-bottom-[9px] after:h-0.5 after:bg-brand-500",
      )}
    >
      {children}
    </Link>
  );
}
