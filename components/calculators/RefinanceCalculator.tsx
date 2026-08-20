"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateRefinanceBreakEven } from "@/lib/mortgage-math";
import { formatCurrency } from "@/lib/utils";

export function RefinanceCalculator({ defaultRate = 6.625 }: { defaultRate?: number }) {
  const [currentBalance, setCurrentBalance] = useState(320000);
  const [currentRate, setCurrentRate] = useState(7.25);
  const [remainingYears, setRemainingYears] = useState(27);
  const [newRate, setNewRate] = useState(defaultRate);
  const [newTerm, setNewTerm] = useState(30);
  const [closingCosts, setClosingCosts] = useState(6500);
  const [points, setPoints] = useState(0);

  const result = useMemo(
    () =>
      calculateRefinanceBreakEven({
        currentBalance,
        currentRatePercent: currentRate,
        currentRemainingYears: remainingYears,
        newRatePercent: newRate,
        newTermYears: newTerm,
        closingCosts,
        pointsPercent: points,
      }),
    [currentBalance, currentRate, remainingYears, newRate, newTerm, closingCosts, points],
  );

  const chartData = useMemo(() => {
    const months = Math.max(result.breakEvenMonths ?? 24, 24);
    return Array.from({ length: months + 6 }, (_, index) => {
      const month = index;
      return {
        month,
        savings: result.monthlySavings * month - closingCosts,
      };
    });
  }, [result.breakEvenMonths, result.monthlySavings, closingCosts]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Current vs. new loan</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Current balance" value={currentBalance} onChange={setCurrentBalance} />
          <Field label="Current rate %" value={currentRate} onChange={setCurrentRate} step={0.125} />
          <Field label="Years remaining" value={remainingYears} onChange={setRemainingYears} />
          <Field label="New rate %" value={newRate} onChange={setNewRate} step={0.125} />
          <Field label="New term (years)" value={newTerm} onChange={setNewTerm} />
          <Field label="Closing costs" value={closingCosts} onChange={setClosingCosts} />
          <Field label="Points %" value={points} onChange={setPoints} step={0.125} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Break-even analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Current P&I" value={formatCurrency(result.currentPayment, 2)} />
            <Stat label="New P&I" value={formatCurrency(result.newPayment, 2)} />
            <Stat
              label="Monthly savings"
              value={formatCurrency(result.monthlySavings, 2)}
              positive={result.monthlySavings > 0}
            />
            <Stat
              label="Break-even"
              value={
                result.breakEvenMonths === null
                  ? "Never"
                  : `${result.breakEvenMonths} mo`
              }
            />
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Lifetime interest {result.lifetimeInterestSaved >= 0 ? "saved" : "added"}:{" "}
            <span className="font-semibold">
              {formatCurrency(Math.abs(result.lifetimeInterestSaved))}
            </span>
            . New loan amount {formatCurrency(result.newLoanAmount)}.
          </p>
          <div className="mt-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7EBF1" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(label) => `Month ${label}`}
                />
                <Line type="monotone" dataKey="savings" stroke="#C9A44C" strokeWidth={2} dot={false} />
              </LineChart>
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

function Stat({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl bg-canvas p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`tape mt-1 text-2xl font-semibold ${positive ? "text-up" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}
