"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteBroker, upsertBroker } from "@/actions/brokers";
import type { Broker } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const empty = {
  name: "",
  title: "Loan Officer",
  nmlsId: "",
  email: "",
  phone: "",
  bio: "",
  avatarUrl: "",
  licenseStates: "",
  active: true,
};

export function BrokersManager({ brokers }: { brokers: Broker[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);

  function startEdit(broker?: Broker) {
    if (!broker) {
      setEditing("new");
      setForm(empty);
      return;
    }
    setEditing(broker.id);
    setForm({
      name: broker.name,
      title: broker.title,
      nmlsId: broker.nmlsId,
      email: broker.email,
      phone: broker.phone,
      bio: broker.bio ?? "",
      avatarUrl: broker.avatarUrl ?? "",
      licenseStates: broker.licenseStates ?? "",
      active: Boolean(broker.active),
    });
  }

  function save() {
    setError(null);
    startTransition(async () => {
      try {
        await upsertBroker({
          id: editing && editing !== "new" ? editing : undefined,
          ...form,
        });
        setEditing(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to save broker");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            Broker directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Loan officers appear on the homepage team grid and /team.
          </p>
        </div>
        <Button onClick={() => startEdit()}>Add broker</Button>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {editing ? (
        <div className="grid gap-4 rounded-board border border-ink/10 bg-white p-6 shadow-card sm:grid-cols-2">
          {(
            [
              ["name", "Name"],
              ["title", "Title"],
              ["nmlsId", "NMLS ID"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["licenseStates", "License states"],
              ["avatarUrl", "Headshot URL"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Input
                value={form[key]}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
              />
            </div>
          ))}
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Bio</Label>
            <textarea
              className="min-h-24 w-full rounded-board border border-ink/15 p-3 text-sm"
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) => setForm({ ...form, active: event.target.checked })}
            />
            Active
          </label>
          <div className="flex gap-2">
            <Button onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {brokers.map((broker) => (
          <article key={broker.id} className="rounded-board border border-ink/10 bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                  {broker.name}
                </h2>
                <p className="text-sm text-slate-500">
                  {broker.title} · NMLS #{broker.nmlsId}
                </p>
              </div>
              <span className="text-xs font-semibold uppercase text-slate-500">
                {broker.active ? "Active" : "Hidden"}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{broker.bio}</p>
            <p className="mt-2 text-xs text-slate-500">{broker.licenseStates}</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => startEdit(broker)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  startTransition(async () => {
                    await deleteBroker(broker.id);
                    router.refresh();
                  })
                }
              >
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
