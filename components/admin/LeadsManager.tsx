"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateLeadStatus } from "@/actions/brokers";
import type { Broker, Lead } from "@/db/schema";
import { LEAD_STATUSES } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

const STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "danger" | "outline"> = {
  New: "warning",
  Contacted: "default",
  "Application Sent": "outline",
  "Pre-Approved": "success",
  Closed: "success",
  Archived: "danger",
};

export function LeadsManager({ leads, brokers }: { leads: Lead[]; brokers: Broker[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState("all");
  const [brokerId, setBrokerId] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [fromDate, setFromDate] = useState("");

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      if (status !== "all" && lead.status !== status) return false;
      if (brokerId !== "all" && lead.assignedBrokerId !== brokerId) return false;
      if (minAmount && Number(lead.loanAmount) < Number(minAmount)) return false;
      if (fromDate && new Date(lead.createdAt) < new Date(fromDate)) return false;
      return true;
    });
  }, [leads, status, brokerId, minAmount, fromDate]);

  function patch(id: string, nextStatus: string, assignedBrokerId: string | null) {
    startTransition(async () => {
      await updateLeadStatus({
        id,
        status: nextStatus,
        assignedBrokerId,
      });
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
          Lead pipeline
        </h1>
        <p className="mt-1 text-sm text-slate-500">{filtered.length} of {leads.length} submissions</p>
      </div>
      <div className="grid gap-3 rounded-board border border-ink/10 bg-white p-4 md:grid-cols-4">
        <select
          className="h-11 rounded-board border border-ink/15 px-3 text-sm"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          className="h-11 rounded-board border border-ink/15 px-3 text-sm"
          value={brokerId}
          onChange={(event) => setBrokerId(event.target.value)}
        >
          <option value="all">All brokers</option>
          {brokers.map((broker) => (
            <option key={broker.id} value={broker.id}>
              {broker.name}
            </option>
          ))}
        </select>
        <Input
          placeholder="Min loan amount"
          value={minAmount}
          onChange={(event) => setMinAmount(event.target.value)}
        />
        <Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
      </div>
      <div className="overflow-hidden rounded-board border border-ink/10 bg-white shadow-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-ink-950 text-white">
            <tr>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Loan</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Broker</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-t border-ink/10">
                <td className="px-4 py-3">
                  <div className="font-semibold text-ink">
                    {lead.firstName} {lead.lastName}
                  </div>
                  <div className="text-xs text-slate-500">
                    {lead.email} · {lead.phone}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {lead.loanType}
                  <div className="text-xs text-slate-500">{lead.creditScoreTier}</div>
                </td>
                <td className="px-4 py-3 tabular-nums">{formatCurrency(Number(lead.loanAmount))}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[lead.status] ?? "default"}>{lead.status}</Badge>
                  <select
                    className="mt-2 block rounded-sm border border-ink/15 px-2 py-1 text-xs"
                    value={lead.status}
                    disabled={pending}
                    onChange={(event) =>
                      patch(lead.id, event.target.value, lead.assignedBrokerId)
                    }
                  >
                    {LEAD_STATUSES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    className="rounded-sm border border-ink/15 px-2 py-1 text-xs"
                    value={lead.assignedBrokerId ?? ""}
                    disabled={pending}
                    onChange={(event) =>
                      patch(lead.id, lead.status, event.target.value || null)
                    }
                  >
                    <option value="">Unassigned</option>
                    {brokers.map((broker) => (
                      <option key={broker.id} value={broker.id}>
                        {broker.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">No leads match these filters.</p>
        ) : null}
      </div>
    </div>
  );
}
