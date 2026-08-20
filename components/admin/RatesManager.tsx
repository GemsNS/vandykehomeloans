"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteRate, upsertRate } from "@/actions/rates";
import type { Rate } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPercent } from "@/lib/utils";

const PRODUCT_TYPES = ["conventional", "fha", "va", "usda", "jumbo", "arm"] as const;

const empty = {
  productName: "",
  rate: 6.625,
  apr: 6.5,
  termYears: 30,
  points: 0,
  productType: "conventional" as (typeof PRODUCT_TYPES)[number],
  isFeatured: false,
  weeklyChange: 0,
};

export function RatesManager({ rates }: { rates: Rate[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);

  function startEdit(rate?: Rate) {
    if (!rate) {
      setEditing("new");
      setForm(empty);
      return;
    }
    setEditing(rate.id);
    setForm({
      productName: rate.productName,
      rate: Number(rate.rate),
      apr: Number(rate.apr),
      termYears: rate.termYears,
      points: Number(rate.points ?? 0),
      productType: rate.productType as (typeof PRODUCT_TYPES)[number],
      isFeatured: Boolean(rate.isFeatured),
      weeklyChange: Number(rate.weeklyChange ?? 0),
    });
  }

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await upsertRate({
          id: editing && editing !== "new" ? editing : undefined,
          ...form,
        });
        setEditing(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to save rate");
      }
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      try {
        await deleteRate(id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to delete rate");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            Live rate engine
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Updates appear immediately on the header ticker and public rate table.
          </p>
        </div>
        <Button onClick={() => startEdit()}>Add product</Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {editing ? (
        <div className="grid gap-4 rounded-board border border-ink/10 bg-white p-6 shadow-card sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Product name</Label>
            <Input
              value={form.productName}
              onChange={(event) => setForm({ ...form, productName: event.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Rate</Label>
            <Input
              type="number"
              step="0.001"
              value={form.rate}
              onChange={(event) => setForm({ ...form, rate: Number(event.target.value) })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>APR</Label>
            <Input
              type="number"
              step="0.001"
              value={form.apr}
              onChange={(event) => setForm({ ...form, apr: Number(event.target.value) })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Term years</Label>
            <Input
              type="number"
              value={form.termYears}
              onChange={(event) => setForm({ ...form, termYears: Number(event.target.value) })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Points</Label>
            <Input
              type="number"
              step="0.01"
              value={form.points}
              onChange={(event) => setForm({ ...form, points: Number(event.target.value) })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Weekly change</Label>
            <Input
              type="number"
              step="0.001"
              value={form.weeklyChange}
              onChange={(event) => setForm({ ...form, weeklyChange: Number(event.target.value) })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <select
              className="flex h-11 w-full rounded-board border border-ink/15 bg-white px-3 text-sm"
              value={form.productType}
              onChange={(event) =>
                setForm({ ...form, productType: event.target.value as (typeof PRODUCT_TYPES)[number] })
              }
            >
              {PRODUCT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })}
            />
            Featured in ticker
          </label>
          <div className="flex items-end gap-2 sm:col-span-2">
            <Button onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-board border border-ink/10 bg-white shadow-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-ink-950 text-white">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Rate</th>
              <th className="px-4 py-3">APR</th>
              <th className="px-4 py-3">Term</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => (
              <tr key={rate.id} className="border-t border-ink/10">
                <td className="px-4 py-3 font-semibold text-ink">{rate.productName}</td>
                <td className="px-4 py-3 tabular-nums">{formatPercent(Number(rate.rate))}</td>
                <td className="px-4 py-3 tabular-nums">{formatPercent(Number(rate.apr))}</td>
                <td className="px-4 py-3 tabular-nums">{rate.termYears} yr</td>
                <td className="px-4 py-3">{rate.isFeatured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(rate)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(rate.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
