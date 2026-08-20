"use client";

import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildAmortizationSchedule,
  calculateApr,
  calculateTotalMonthlyPayment,
  downPaymentFromPercent,
  downPaymentPercent,
  totalInterestPaid,
} from "@/lib/mortgage-math";
import { formatCurrency, formatPercent } from "@/lib/utils";

const COLORS = ["#C9A44C", "#0B192C", "#E3C77E", "#4E5F79", "#B7C0CD"];

export function PaymentCalculator({ defaultRate = 6.625 }: { defaultRate?: number }) {
  const [homePrice, setHomePrice] = useState(450000);
  const [downMode, setDownMode] = useState<"percent" | "dollars">("percent");
  const [downPercent, setDownPercent] = useState(20);
  const [downDollars, setDownDollars] = useState(90000);
  const [rate, setRate] = useState(defaultRate);
  const [termYears, setTermYears] = useState(30);
  const [annualTaxes, setAnnualTaxes] = useState(5400);
  const [annualInsurance, setAnnualInsurance] = useState(1800);
  const [hoa, setHoa] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);

  const downPayment =
    downMode === "percent" ? downPaymentFromPercent(homePrice, downPercent) : downDollars;

  const breakdown = useMemo(
    () =>
      calculateTotalMonthlyPayment({
        homePrice,
        downPayment,
        annualRatePercent: rate,
        termYears,
        annualTaxes,
        annualInsurance,
        monthlyHoa: hoa,
      }),
    [homePrice, downPayment, rate, termYears, annualTaxes, annualInsurance, hoa],
  );

  const principal = Math.max(0, homePrice - downPayment);
  const schedule = useMemo(
    () => buildAmortizationSchedule(principal, rate, termYears),
    [principal, rate, termYears],
  );
  const interest = totalInterestPaid(schedule);
  const apr = calculateApr(principal, rate, termYears, 0);
  const chartData = [
    { name: "P&I", value: breakdown.principalAndInterest },
    { name: "Taxes", value: breakdown.taxes },
    { name: "Insurance", value: breakdown.insurance },
    { name: "HOA", value: breakdown.hoa },
    { name: "PMI", value: breakdown.pmi },
  ].filter((slice) => slice.value > 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <CardTitle>Loan inputs</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Home price" value={homePrice} onChange={setHomePrice} />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Down payment</Label>
              <button
                type="button"
                className="text-xs font-semibold text-brand-600"
                onClick={() => {
                  if (downMode === "percent") {
                    setDownMode("dollars");
                    setDownDollars(downPaymentFromPercent(homePrice, downPercent));
                  } else {
                    setDownMode("percent");
                    setDownPercent(downPaymentPercent(homePrice, downDollars));
                  }
                }}
              >
                Use {downMode === "percent" ? "$" : "%"}
              </button>
            </div>
            {downMode === "percent" ? (
              <Input
                type="number"
                value={downPercent}
                onChange={(event) => setDownPercent(Number(event.target.value))}
              />
            ) : (
              <Input
                type="number"
                value={downDollars}
                onChange={(event) => setDownDollars(Number(event.target.value))}
              />
            )}
          </div>
          <Field label="Interest rate %" value={rate} onChange={setRate} step={0.125} />
          <Field label="Term (years)" value={termYears} onChange={setTermYears} />
          <Field label="Property taxes / yr" value={annualTaxes} onChange={setAnnualTaxes} />
          <Field label="Home insurance / yr" value={annualInsurance} onChange={setAnnualInsurance} />
          <Field label="HOA / mo" value={hoa} onChange={setHoa} />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly breakdown</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value), 2)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total monthly
              </p>
              <p className="tape text-4xl font-semibold text-ink">
                {formatCurrency(breakdown.total)}
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                <li>P&amp;I · {formatCurrency(breakdown.principalAndInterest, 2)}</li>
                <li>Taxes · {formatCurrency(breakdown.taxes, 2)}</li>
                <li>Insurance · {formatCurrency(breakdown.insurance, 2)}</li>
                {breakdown.hoa > 0 ? <li>HOA · {formatCurrency(breakdown.hoa, 2)}</li> : null}
                {breakdown.pmi > 0 ? <li>PMI · {formatCurrency(breakdown.pmi, 2)}</li> : null}
                <li>APR (est.) · {formatPercent(apr)}</li>
                <li>Total interest · {formatCurrency(interest)}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        <Button variant="outline" onClick={() => setShowSchedule((value) => !value)}>
          {showSchedule ? "Hide" : "Show"} amortization table
        </Button>
      </div>

      {showSchedule ? (
        <div className="lg:col-span-2 overflow-hidden rounded-board border border-ink/10 bg-white shadow-card">
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="sticky top-0 bg-ink-950 text-white">
                <tr>
                  <th className="px-3 py-2">Mo</th>
                  <th className="px-3 py-2">Payment</th>
                  <th className="px-3 py-2">Principal</th>
                  <th className="px-3 py-2">Interest</th>
                  <th className="px-3 py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.month} className="border-t border-ink/10">
                    <td className="px-3 py-1.5 tabular-nums">{row.month}</td>
                    <td className="px-3 py-1.5 tabular-nums">{formatCurrency(row.payment, 2)}</td>
                    <td className="px-3 py-1.5 tabular-nums">{formatCurrency(row.principal, 2)}</td>
                    <td className="px-3 py-1.5 tabular-nums">{formatCurrency(row.interest, 2)}</td>
                    <td className="px-3 py-1.5 tabular-nums">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
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
