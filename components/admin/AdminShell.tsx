"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/rates", label: "Live rates" },
  { href: "/admin/leads", label: "Lead pipeline" },
  { href: "/admin/brokers", label: "Brokers" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-white/10 bg-ink-950 text-white lg:flex lg:flex-col">
        <div className="px-5 py-6">
          <p className="font-display text-xl font-bold tracking-tight">VanDyke</p>
          <p className="tape text-[11px] uppercase tracking-[0.18em] text-brand-300">
            Broker portal
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                pathname === item.href ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4">
          <form action={logoutAdmin}>
            <Button
              type="submit"
              variant="outline"
              className="w-full border-white/20 bg-transparent text-white"
            >
              Sign out
            </Button>
          </form>
        </div>
      </aside>
      <div className="lg:pl-60">
        <header className="flex items-center justify-between border-b border-ink/10 bg-white px-4 py-3 lg:hidden">
          <p className="font-display text-lg font-bold tracking-tight text-ink">Broker portal</p>
          <form action={logoutAdmin}>
            <Button type="submit" size="sm" variant="outline">
              Sign out
            </Button>
          </form>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-ink/10 bg-white px-4 py-2 lg:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold ${
                pathname === item.href ? "bg-ink-950 text-white" : "text-slate-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
