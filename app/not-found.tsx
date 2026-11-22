import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { CONTACT } from "@/lib/company";

// Wrapped in SiteShell so the navbar and the compliance footer show on 404s too.
export default function NotFound() {
  return (
    <SiteShell>
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-24 text-center">
        <p className="eyebrow text-brand-600">404</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink">
          Page not found
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          That URL is not on the VanDyke Home Loans site. Head home or call{" "}
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="font-semibold text-brand-600 underline-offset-4 hover:underline"
          >
            {CONTACT.phoneDisplay}
          </a>
          .
        </p>
        <Link href="/" className="mt-6 text-sm font-semibold text-brand-600">
          Back home
        </Link>
      </div>
    </SiteShell>
  );
}
