/**
 * Pure TypeScript mortgage mathematics.
 * No I/O, no Date side-effects in the formulas themselves.
 * Isolated here so UI, server actions, and tests share one source of truth.
 */

export type AmortizationRow = {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
  totalPrincipal: number;
};

export type PaymentBreakdown = {
  principalAndInterest: number;
  taxes: number;
  insurance: number;
  hoa: number;
  pmi: number;
  total: number;
};

export type AffordabilityInput = {
  annualIncome: number;
  monthlyDebt: number;
  downPayment: number;
  annualRatePercent: number;
  termYears: number;
  annualTaxes: number;
  annualInsurance: number;
  monthlyHoa?: number;
  frontEndDti?: number;
  backEndDti?: number;
};

export type AffordabilityResult = {
  maxHousingPayment: number;
  maxTotalPayment: number;
  maxLoanAmount: number;
  maxPurchasePrice: number;
  frontEndDtiUsed: number;
  backEndDtiUsed: number;
  bindingConstraint: "front-end" | "back-end";
};

export type RefinanceInput = {
  currentBalance: number;
  currentRatePercent: number;
  currentRemainingYears: number;
  newRatePercent: number;
  newTermYears: number;
  closingCosts: number;
  pointsPercent?: number;
};

export type RefinanceResult = {
  currentPayment: number;
  newPayment: number;
  monthlySavings: number;
  annualSavings: number;
  breakEvenMonths: number | null;
  lifetimeInterestCurrent: number;
  lifetimeInterestNew: number;
  lifetimeInterestSaved: number;
  newLoanAmount: number;
};

export function monthlyInterestRate(annualRatePercent: number): number {
  return annualRatePercent / 100 / 12;
}

export function termMonths(termYears: number): number {
  return Math.round(termYears * 12);
}

export function roundMoney(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Standard fixed-rate principal & interest payment.
 * M = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculatePrincipalAndInterest(
  principal: number,
  annualRatePercent: number,
  termYears: number,
): number {
  if (principal <= 0 || termYears <= 0) return 0;
  const n = termMonths(termYears);
  const r = monthlyInterestRate(annualRatePercent);
  if (r === 0) return principal / n;
  const factor = (1 + r) ** n;
  return (principal * r * factor) / (factor - 1);
}

/**
 * Invert the payment formula: given a target P&I, solve for principal.
 */
export function calculateMaxLoanFromPayment(
  monthlyPi: number,
  annualRatePercent: number,
  termYears: number,
): number {
  if (monthlyPi <= 0 || termYears <= 0) return 0;
  const n = termMonths(termYears);
  const r = monthlyInterestRate(annualRatePercent);
  if (r === 0) return monthlyPi * n;
  const factor = (1 + r) ** n;
  return (monthlyPi * (factor - 1)) / (r * factor);
}

export function calculateLoanToValue(loanAmount: number, homePrice: number): number {
  if (homePrice <= 0) return 0;
  return loanAmount / homePrice;
}

/**
 * Conventional PMI estimate. Drops to $0 at or below 80% LTV.
 * Default annual premium ~0.55% of original loan amount.
 */
export function estimateMonthlyPmi(
  loanAmount: number,
  homePrice: number,
  annualPremiumRate = 0.0055,
): number {
  if (loanAmount <= 0 || homePrice <= 0) return 0;
  if (calculateLoanToValue(loanAmount, homePrice) <= 0.8) return 0;
  return (loanAmount * annualPremiumRate) / 12;
}

export function calculateTotalMonthlyPayment(input: {
  homePrice: number;
  downPayment: number;
  annualRatePercent: number;
  termYears: number;
  annualTaxes?: number;
  annualInsurance?: number;
  monthlyHoa?: number;
  pmiAnnualRate?: number;
}): PaymentBreakdown {
  const principal = Math.max(0, input.homePrice - input.downPayment);
  const principalAndInterest = calculatePrincipalAndInterest(
    principal,
    input.annualRatePercent,
    input.termYears,
  );
  const taxes = (input.annualTaxes ?? 0) / 12;
  const insurance = (input.annualInsurance ?? 0) / 12;
  const hoa = input.monthlyHoa ?? 0;
  const pmi = estimateMonthlyPmi(principal, input.homePrice, input.pmiAnnualRate);
  return {
    principalAndInterest,
    taxes,
    insurance,
    hoa,
    pmi,
    total: principalAndInterest + taxes + insurance + hoa + pmi,
  };
}

export function buildAmortizationSchedule(
  principal: number,
  annualRatePercent: number,
  termYears: number,
): AmortizationRow[] {
  const n = termMonths(termYears);
  const r = monthlyInterestRate(annualRatePercent);
  const payment = calculatePrincipalAndInterest(principal, annualRatePercent, termYears);
  const rows: AmortizationRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  let totalPrincipal = 0;

  for (let month = 1; month <= n && balance > 0.005; month += 1) {
    const interest = balance * r;
    let principalPaid = payment - interest;
    if (principalPaid > balance) principalPaid = balance;
    const actualPayment = principalPaid + interest;
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    totalPrincipal += principalPaid;
    rows.push({
      month,
      year: Math.ceil(month / 12),
      payment: roundMoney(actualPayment),
      principal: roundMoney(principalPaid),
      interest: roundMoney(interest),
      balance: roundMoney(balance),
      totalInterest: roundMoney(totalInterest),
      totalPrincipal: roundMoney(totalPrincipal),
    });
  }

  return rows;
}

export function totalInterestPaid(schedule: AmortizationRow[]): number {
  return schedule.at(-1)?.totalInterest ?? 0;
}

/**
 * Approximate APR including discount points and origination fees.
 * Solves for the internal monthly rate that equates net proceeds to the
 * contractual payment stream (bisection — no native math libs).
 */
export function calculateApr(
  principal: number,
  annualRatePercent: number,
  termYears: number,
  pointsPercent = 0,
  additionalFees = 0,
): number {
  if (principal <= 0 || termYears <= 0) return 0;
  const n = termMonths(termYears);
  const payment = calculatePrincipalAndInterest(principal, annualRatePercent, termYears);
  const pointsCost = principal * (pointsPercent / 100);
  const netProceeds = principal - pointsCost - additionalFees;

  if (netProceeds <= 0) return annualRatePercent;
  if (Math.abs(netProceeds - principal) < 0.01) return annualRatePercent;

  const presentValue = (monthlyRate: number): number => {
    if (monthlyRate === 0) return payment * n;
    const factor = (1 + monthlyRate) ** n;
    return (payment * (1 - 1 / factor)) / monthlyRate;
  };

  let lo = 0;
  let hi = 0.05; // 60% APR ceiling monthly
  for (let i = 0; i < 80; i += 1) {
    const mid = (lo + hi) / 2;
    if (presentValue(mid) > netProceeds) lo = mid;
    else hi = mid;
  }

  return roundMoney(((lo + hi) / 2) * 12 * 100, 3);
}

export function calculateDti(
  monthlyHousing: number,
  monthlyDebt: number,
  monthlyIncome: number,
): { frontEnd: number; backEnd: number } {
  if (monthlyIncome <= 0) return { frontEnd: 0, backEnd: 0 };
  return {
    frontEnd: monthlyHousing / monthlyIncome,
    backEnd: (monthlyHousing + monthlyDebt) / monthlyIncome,
  };
}

/**
 * 28/36 housing-affordability rule (overridable).
 * Front-end DTI caps PITI+HOA; back-end DTI caps PITI+HOA plus other debt.
 */
export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const frontEndDti = input.frontEndDti ?? 0.28;
  const backEndDti = input.backEndDti ?? 0.36;
  const monthlyIncome = input.annualIncome / 12;
  const maxHousingFromFront = monthlyIncome * frontEndDti;
  const maxHousingFromBack = monthlyIncome * backEndDti - input.monthlyDebt;
  const bindingConstraint: AffordabilityResult["bindingConstraint"] =
    maxHousingFromBack < maxHousingFromFront ? "back-end" : "front-end";
  const maxHousingPayment = Math.max(0, Math.min(maxHousingFromFront, maxHousingFromBack));

  const monthlyTaxes = input.annualTaxes / 12;
  const monthlyInsurance = input.annualInsurance / 12;
  const monthlyHoa = input.monthlyHoa ?? 0;
  const availableForPi = Math.max(
    0,
    maxHousingPayment - monthlyTaxes - monthlyInsurance - monthlyHoa,
  );

  const maxLoanAmount = calculateMaxLoanFromPayment(
    availableForPi,
    input.annualRatePercent,
    input.termYears,
  );

  return {
    maxHousingPayment: roundMoney(maxHousingPayment),
    maxTotalPayment: roundMoney(monthlyIncome * backEndDti),
    maxLoanAmount: roundMoney(maxLoanAmount),
    maxPurchasePrice: roundMoney(maxLoanAmount + input.downPayment),
    frontEndDtiUsed: frontEndDti,
    backEndDtiUsed: backEndDti,
    bindingConstraint,
  };
}

export function calculateRefinanceBreakEven(input: RefinanceInput): RefinanceResult {
  const currentPayment = calculatePrincipalAndInterest(
    input.currentBalance,
    input.currentRatePercent,
    input.currentRemainingYears,
  );
  const pointsCost = input.currentBalance * ((input.pointsPercent ?? 0) / 100);
  const newLoanAmount = input.currentBalance + pointsCost;
  const newPayment = calculatePrincipalAndInterest(
    newLoanAmount,
    input.newRatePercent,
    input.newTermYears,
  );
  const monthlySavings = currentPayment - newPayment;
  const breakEvenMonths =
    monthlySavings > 0 ? Math.ceil(input.closingCosts / monthlySavings) : null;

  const currentSchedule = buildAmortizationSchedule(
    input.currentBalance,
    input.currentRatePercent,
    input.currentRemainingYears,
  );
  const newSchedule = buildAmortizationSchedule(
    newLoanAmount,
    input.newRatePercent,
    input.newTermYears,
  );
  const lifetimeInterestCurrent = totalInterestPaid(currentSchedule);
  const lifetimeInterestNew = totalInterestPaid(newSchedule);

  return {
    currentPayment: roundMoney(currentPayment),
    newPayment: roundMoney(newPayment),
    monthlySavings: roundMoney(monthlySavings),
    annualSavings: roundMoney(monthlySavings * 12),
    breakEvenMonths,
    lifetimeInterestCurrent,
    lifetimeInterestNew,
    lifetimeInterestSaved: roundMoney(lifetimeInterestCurrent - lifetimeInterestNew),
    newLoanAmount: roundMoney(newLoanAmount),
  };
}

export function downPaymentFromPercent(homePrice: number, percent: number): number {
  return roundMoney(homePrice * (percent / 100));
}

export function downPaymentPercent(homePrice: number, downPayment: number): number {
  if (homePrice <= 0) return 0;
  return roundMoney((downPayment / homePrice) * 100, 2);
}
