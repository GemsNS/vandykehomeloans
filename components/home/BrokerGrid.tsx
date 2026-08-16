import { Mail, Phone } from "lucide-react";
import type { Broker } from "@/db/schema";
import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { Button } from "@/components/ui/button";
import { PEOPLE } from "@/lib/company";
import { initials } from "@/lib/utils";

const PROFILE: Record<string, string> = {
  [PEOPLE.anthony.nmlsId]: PEOPLE.anthony.profile,
  [PEOPLE.gonzalo.nmlsId]: PEOPLE.gonzalo.profile,
};

export function BrokerGrid({ brokers }: { brokers: Broker[] }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl">
          <p className="eyebrow text-brand-600">Licensed loan officers</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Talk with Anthony or Gonzalo — not a call center
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            The VanDyke Mortgage Team is Branch Manager Anthony VanDyke and Loan Consultant Gonzalo
            Guimoye, originating through New American Funding from Suffolk, Virginia.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {brokers.map((broker) => (
            <article
              key={broker.id}
              className="flex flex-col rounded-board border border-ink/10 bg-canvas p-6 shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-board bg-ink-950 font-display text-lg font-bold text-brand-300">
                  {initials(broker.name)}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-ink">
                    {broker.name}
                  </h3>
                  <p className="text-sm text-slate-500">{broker.title}</p>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{broker.bio}</p>
              <p className="tape mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                NMLS #{broker.nmlsId}
                {broker.licenseStates ? ` · ${broker.licenseStates}` : ""}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${broker.email}`}>
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${broker.phone.replace(/\D/g, "")}`}>
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                </Button>
                {PROFILE[broker.nmlsId] ? (
                  <Button variant="outline" size="sm" asChild>
                    <a href={PROFILE[broker.nmlsId]} target="_blank" rel="noreferrer">
                      NAF profile
                    </a>
                  </Button>
                ) : null}
                <ApplyNowButton size="sm" variant="ink">
                  Book
                </ApplyNowButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
