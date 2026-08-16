import Link from "next/link";
import { getAllBrokers, getLeads, getRates } from "@/lib/data/queries";

export default async function AdminHomePage() {
  const [rates, leads, brokers] = await Promise.all([getRates(), getLeads(), getAllBrokers()]);
  const newLeads = leads.filter((lead) => lead.status === "New").length;

  const cards = [
    { href: "/admin/rates", label: "Published products", value: String(rates.length) },
    { href: "/admin/leads", label: "New leads", value: String(newLeads) },
    { href: "/admin/leads", label: "Pipeline total", value: String(leads.length) },
    { href: "/admin/brokers", label: "Active brokers", value: String(brokers.filter((b) => b.active).length) },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        Desk overview
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Manage the live rate board, incoming applications, and licensed originators.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-board border border-ink/10 bg-white p-5 shadow-card"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="tape mt-2 text-3xl font-semibold text-ink">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
