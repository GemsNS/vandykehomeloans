"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateAffordability, calculateDti } from "@/lib/mortgage-math";
import { formatCurrency, formatPercent } from "@/lib/utils";

export function AffordabilityCalculator({ defaultRate = 6.625 }: { defaultRate?: number }) {
  const [annualIncome, setAnnualIncome] = useState(120000);
  const [monthlyDebt, setMonthlyDebt] = useState(650);
  const [downPayment, setDownPayment] = useState(80000);
  const [rate, setRate] = useState(defaultRate);
  const [termYears, setTermYears] = useState(30);
  const [annualTaxes, setAnnualTaxes] = useState(5400);
  const [annualInsurance, setAnnualInsurance] = useState(1800);

  const result = useMemo(
    () =>
      calculateAffordability({
        annualIncome,
        monthlyDebt,
        downPayment,
        annualRatePercent: rate,
        termYears,
        annualTaxes,
        annualInsurance,
      }),
    [annualIncome, monthlyDebt, downPayment, rate, termYears, annualTaxes, annualInsurance],
  );

  const dti = calculateDti(result.maxHousingPayment, monthlyDebt, annualIncome / 12);
  const chartData = [
    { name: "Max housing", value: result.maxHousingPayment },
    { name: "Other debt", value: monthlyDebt },
    { name: "Remaining income", value: Math.max(0, annualIncome / 12 - result.maxHousingPayment - monthlyDebt) },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Income &amp; obligations</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Annual income" value={annualIncome} onChange={setAnnualIncome} />
          <Field label="Monthly debt" value={monthlyDebt} onChange={setMonthlyDebt} />
          <Field label="Down payment" value={downPayment} onChange={setDownPayment} />
          <Field label="Rate %" value={rate} onChange={setRate} step={0.125} />
          <Field label="Term (years)" value={termYears} onChange={setTermYears} />
          <Field label="Taxes / yr" value={annualTaxes} onChange={setAnnualTaxes} />
          <Field label="Insurance / yr" value={annualInsurance} onChange={setAnnualInsurance} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>What you can afford</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Max purchase price
          </p>
          <p className="tape text-4xl font-semibold text-ink">
            {formatCurrency(result.maxPurchasePrice)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Max loan {formatCurrency(result.maxLoanAmount)} · housing payment{" "}
            {formatCurrency(result.maxHousingPayment)}
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Binding constraint:{" "}
            <span className="font-semibold capitalize">{result.bindingConstraint}</span> DTI (
            {formatPercent(result.frontEndDtiUsed * 100, 0)} /{" "}
            {formatPercent(result.backEndDtiUsed * 100, 0)} rule). Front-end{" "}
            {formatPercent(dti.frontEnd * 100, 1)} · back-end {formatPercent(dti.backEnd * 100, 1)}.
          </p>
          <div className="mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7EBF1" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" fill="#C9A44C" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        type="number"
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
