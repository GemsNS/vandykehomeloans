"use client";

import { useMemo, useState } from "react";
import { ApplyNowButton } from "@/components/lead-funnel/ApplyNowButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateTotalMonthlyPayment, downPaymentFromPercent } from "@/lib/mortgage-math";
import { formatCurrency } from "@/lib/utils";

const FIELD_ON_DARK =
  "border-white/15 bg-ink-800 text-white shadow-none placeholder:text-white/30 focus-visible:ring-brand-400 focus:ring-brand-400";
const LABEL_ON_DARK = "text-white/45";

export function QuickQuote({ defaultRate }: { defaultRate: number }) {
  const [purpose, setPurpose] = useState("purchase");
  const [homeValue, setHomeValue] = useState(450000);
  const [downPercent, setDownPercent] = useState(20);
  const [rate, setRate] = useState(defaultRate);

  const quote = useMemo(() => {
    const downPayment = downPaymentFromPercent(homeValue, downPercent);
    return calculateTotalMonthlyPayment({
      homePrice: homeValue,
      downPayment,
      annualRatePercent: rate,
      termYears: 30,
      annualTaxes: homeValue * 0.01,
      annualInsurance: 1800,
    });
  }, [homeValue, downPercent, rate]);

  return (
    <div className="overflow-hidden rounded-board border border-white/12 bg-ink-900 text-white shadow-lift">
      <div className="flex items-center justify-between border-b border-white/10 bg-ink-950 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-up" />
          <span className="eyebrow text-white/70">Quick quote</span>
        </div>
        <span className="tape text-[11px] uppercase tracking-wider text-white/40">30-Yr term</span>
      </div>

      <div className="space-y-4 px-5 py-5">
        <div className="space-y-1.5">
          <Label className={LABEL_ON_DARK}>Loan purpose</Label>
          <Select value={purpose} onValueChange={setPurpose}>
            <SelectTrigger className={FIELD_ON_DARK}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="purchase">Purchase</SelectItem>
              <SelectItem value="refinance">Refinance</SelectItem>
              <SelectItem value="cashout">Cash-out</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="homeValue" className={LABEL_ON_DARK}>
            Home value
          </Label>
          <Input
            id="homeValue"
            type="number"
            min={50000}
            value={homeValue}
            onChange={(event) => setHomeValue(Number(event.target.value))}
            className={`tape ${FIELD_ON_DARK}`}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="downPercent" className={LABEL_ON_DARK}>
              Down payment %
            </Label>
            <Input
              id="downPercent"
              type="number"
              min={0}
              max={100}
              value={downPercent}
              onChange={(event) => setDownPercent(Number(event.target.value))}
              className={`tape ${FIELD_ON_DARK}`}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="quoteRate" className={LABEL_ON_DARK}>
              Rate %
            </Label>
            <Input
              id="quoteRate"
              type="number"
              step="0.125"
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
              className={`tape ${FIELD_ON_DARK}`}
            />
          </div>
        </div>
      </div>

      <div className="border-y border-white/10 bg-ink-950 px-5 py-4">
        <p className="eyebrow text-white/40">Estimated monthly</p>
        <p className="tape mt-1 text-4xl font-semibold text-brand-300">
          {formatCurrency(quote.total)}
        </p>
        <p className="tape mt-1 text-xs text-white/45">
          P&amp;I {formatCurrency(quote.principalAndInterest)} · taxes &amp; insurance estimated
        </p>
      </div>

      <div className="px-5 py-5">
        <ApplyNowButton className="w-full" size="lg">
          Lock this payment
        </ApplyNowButton>
        <Button variant="ghost" className="mt-1 w-full text-white/70 hover:bg-white/10" asChild>
          <a href="/calculators/payment">Open full calculator</a>
        </Button>
      </div>
    </div>
  );
}
