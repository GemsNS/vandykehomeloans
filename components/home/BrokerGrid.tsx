import { Mail, Phone } from "lucide-react";
import type { Broker } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { CONTACT, LENDER, PEOPLE, fullAddress } from "@/lib/company";
import { initials } from "@/lib/utils";

const PROFILE: Record<string, string> = {
  [PEOPLE.anthony.nmlsId]: PEOPLE.anthony.profile,
  [PEOPLE.gonzalo.nmlsId]: PEOPLE.gonzalo.profile,
};

/** Anthony's card always leads, then Gonzalo, then anyone else the admin adds. */
const CARD_ORDER: string[] = [PEOPLE.anthony.nmlsId, PEOPLE.gonzalo.nmlsId];

function rank(broker: Broker): number {
  const index = CARD_ORDER.indexOf(broker.nmlsId);
  return index === -1 ? CARD_ORDER.length : index;
}

export function BrokerGrid({ brokers }: { brokers: Broker[] }) {
  const ordered = [...brokers].sort((a, b) => rank(a) - rank(b));
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-3xl">
          <p className="eyebrow text-brand-600">Meet Anthony</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Talk with Anthony or Gonzalo — not a call center
          </h2>
          {/* About copy moved word for word from the retired /about page. */}
          <p className="mt-3 text-base text-ink-600">
            VanDyke Home Loans is the local face of the VanDyke Mortgage Team. Branch Manager
            Anthony VanDyke and Loan Consultant Gonzalo Guimoye originate purchase and refinance
            loans from Suffolk, Virginia.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {ordered.map((broker) => (
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
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 grid gap-5 text-sm leading-relaxed text-slate-600 lg:grid-cols-3">
          <p>
            {PEOPLE.anthony.name} is Branch Manager, NMLS #{PEOPLE.anthony.nmlsId}. With many years
            originating purchase and refinance loans, he is focused on competitive New American
            Funding pricing, professional advice, and consistent communication from application
            through closing.
          </p>
          <p>
            {PEOPLE.gonzalo.name}, NMLS #{PEOPLE.gonzalo.nmlsId}, is a dedicated loan consultant
            serving the same community. Together they help first-time buyers, military families,
            veterans, FHA clients, self-employed borrowers, and investors.
          </p>
          <p>
            Office: {fullAddress()}. Phone: {CONTACT.phoneDisplay}. Email:{" "}
            <a className="font-semibold text-brand-600" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
            . Company: {LENDER.name}, NMLS #{LENDER.nmls}. Confirm licenses at{" "}
            <a
              className="font-semibold text-brand-600"
              href={LENDER.nmlsLookup}
              target="_blank"
              rel="noreferrer"
            >
              NMLS Consumer Access
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
