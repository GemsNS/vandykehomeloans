"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Home, Landmark, Wallet } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { submitLead } from "@/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhone } from "@/lib/utils";
import { leadFunnelSchema, type LeadFunnelValues } from "@/lib/validations";

const STEPS = ["Purpose", "Property", "Credit", "Contact"] as const;

const PURPOSE_OPTIONS: { value: LeadFunnelValues["loanType"]; icon: typeof Home; blurb: string }[] = [
  { value: "Purchase", icon: Home, blurb: "Buying a home" },
  { value: "Refinance", icon: Landmark, blurb: "Lower your rate or term" },
  { value: "Cash-Out", icon: Wallet, blurb: "Access home equity" },
];

const PROPERTY_TYPES: LeadFunnelValues["propertyType"][] = [
  "Single Family",
  "Condo",
  "Townhouse",
  "Multi-Family",
  "Manufactured",
];

const TIMELINES: LeadFunnelValues["timeline"][] = [
  "0-30 days",
  "30-90 days",
  "3-6 months",
  "6+ months",
  "Just researching",
];

const CREDIT_TIERS: LeadFunnelValues["creditScoreTier"][] = [
  "760+",
  "720-759",
  "680-719",
  "640-679",
  "Below 640",
];

const INCOME_SOURCES: LeadFunnelValues["incomeSource"][] = [
  "W-2",
  "Self-employed",
  "Retirement",
  "Mixed / Other",
];

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
        selected
          ? "border-brand-500 bg-brand-50 text-ink ring-2 ring-brand-500/20"
          : "border-ink/10 bg-white text-slate-600 hover:border-ink/30"
      }`}
    >
      {children}
    </button>
  );
}

export function LeadFunnel({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<LeadFunnelValues>({
    resolver: zodResolver(leadFunnelSchema),
    defaultValues: {
      loanType: "Purchase",
      propertyType: "Single Family",
      timeline: "30-90 days",
      propertyValue: 450000,
      loanAmount: 360000,
      creditScoreTier: "720-759",
      incomeSource: "W-2",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    mode: "onTouched",
  });

  const { control, register, watch, setValue, trigger, handleSubmit } = form;
  const propertyValue = watch("propertyValue");

  React.useEffect(() => {
    const current = form.getValues("loanAmount");
    if (!current || current === 360000) {
      setValue("loanAmount", Math.round(Number(propertyValue || 0) * 0.8));
    }
  }, [propertyValue, form, setValue]);

  async function next() {
    const fields: (keyof LeadFunnelValues)[][] = [
      ["loanType"],
      ["propertyType", "timeline", "propertyValue", "loanAmount"],
      ["creditScoreTier", "incomeSource"],
      ["firstName", "lastName", "email", "phone"],
    ];
    const valid = await trigger(fields[step], { shouldFocus: true });
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function onSubmit(values: LeadFunnelValues) {
    setSubmitting(true);
    setError(null);
    const result = await submitLead(values);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone(true);
    onComplete?.();
  }

  if (done) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-up" />
        <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">
          You&apos;re on the list.
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          A licensed VanDyke Mortgage Team officer will reach out — usually Anthony VanDyke or
          Gonzalo Guimoye — with a personalized rate path through New American Funding.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ol className="flex gap-2">
        {STEPS.map((label, index) => (
          <li key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-sm ${index <= step ? "bg-brand-500" : "bg-ink/10"}`}
            />
            <p className="mt-2 hidden text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:block">
              {label}
            </p>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="grid gap-3">
          <p className="text-sm text-slate-500">What brings you in today?</p>
          {PURPOSE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const selected = watch("loanType") === option.value;
            return (
              <ChoiceButton
                key={option.value}
                selected={selected}
                onClick={() => setValue("loanType", option.value)}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-brand-500" />
                  <span>
                    {option.value}
                    <span className="mt-0.5 block text-xs font-normal text-slate-500">
                      {option.blurb}
                    </span>
                  </span>
                </span>
              </ChoiceButton>
            );
          })}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <Label>Property type</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {PROPERTY_TYPES.map((type) => (
                <ChoiceButton
                  key={type}
                  selected={watch("propertyType") === type}
                  onClick={() => setValue("propertyType", type)}
                >
                  {type}
                </ChoiceButton>
              ))}
            </div>
          </div>
          <div>
            <Label>Target timeline</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {TIMELINES.map((item) => (
                <ChoiceButton
                  key={item}
                  selected={watch("timeline") === item}
                  onClick={() => setValue("timeline", item)}
                >
                  {item}
                </ChoiceButton>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="propertyValue">Estimated home value</Label>
              <Input id="propertyValue" type="number" min={50000} {...register("propertyValue")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="loanAmount">Estimated loan amount</Label>
              <Input id="loanAmount" type="number" min={25000} {...register("loanAmount")} />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <Label>Estimated credit tier</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {CREDIT_TIERS.map((tier) => (
                <ChoiceButton
                  key={tier}
                  selected={watch("creditScoreTier") === tier}
                  onClick={() => setValue("creditScoreTier", tier)}
                >
                  {tier}
                </ChoiceButton>
              ))}
            </div>
          </div>
          <div>
            <Label>Primary income source</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {INCOME_SOURCES.map((source) => (
                <ChoiceButton
                  key={source}
                  selected={watch("incomeSource") === source}
                  onClick={() => setValue("incomeSource", source)}
                >
                  {source}
                </ChoiceButton>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" autoComplete="given-name" {...register("firstName")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" autoComplete="family-name" {...register("lastName")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="phone">Phone</Label>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formatPhone(field.value)}
                  onChange={(event) => field.onChange(event.target.value.replace(/\D/g, ""))}
                />
              )}
            />
          </div>
          <p className="sm:col-span-2 text-xs text-slate-500">
            By submitting you agree to be contacted by the VanDyke Mortgage Team / New American
            Funding at the number and email provided, including via autodialed calls or texts.
            Consent is not a condition of purchase. See our{" "}
            <a href="/privacy" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
              Privacy Policy
            </a>
            . Anthony VanDyke NMLS #955777 · Gonzalo Guimoye NMLS #1131706 · Company NMLS #6606.{" "}
            <a
              href="https://www.nmlsconsumeraccess.org/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-slate-700"
            >
              nmlsconsumeraccess.org
            </a>
            .
          </p>
        </div>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={next}>
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Get my rate"}
          </Button>
        )}
      </div>
    </form>
  );
}
