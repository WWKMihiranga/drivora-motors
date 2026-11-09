import type { VehicleClass } from "@/types";

/**
 * Central Bank of Sri Lanka maximum loan-to-value caps for motor vehicle credit,
 * effective 25 May 2026. Kept in one place with a date so they can be updated
 * when CBSL changes the directions.
 */
export const LTV_RULES = {
  effectiveDate: "25 May 2026",
  source: "CBSL macroprudential directions on motor vehicle LTV ratios",
  // registered and used in Sri Lanka for more than one year, any vehicle
  registeredOverOneYear: 0.6,
  // unregistered, or registered for less than one year
  newOrRecent: { car: 0.4, commercial: 0.6 } satisfies Record<VehicleClass, number>,
} as const;

export const DEFAULT_RATES = {
  /** Sample rates for the demo only; real rates come from partner lenders. */
  flatAnnual: 0.12,
  reducingAnnual: 0.155,
};

export type RegistrationStatus = "unregistered" | "under-1-year" | "over-1-year";

export function maxLtv(vehicleClass: VehicleClass, reg: RegistrationStatus): number {
  if (reg === "over-1-year") return LTV_RULES.registeredOverOneYear;
  return LTV_RULES.newOrRecent[vehicleClass];
}

export function minDownPayment(price: number, vehicleClass: VehicleClass, reg: RegistrationStatus) {
  return Math.ceil(price * (1 - maxLtv(vehicleClass, reg)));
}

export type RateType = "flat" | "reducing";

export interface LeaseResult {
  principal: number;
  monthly: number;
  totalInterest: number;
  totalPayable: number;
  /** remaining balance at the end of each month, for the chart */
  balances: number[];
  /** effective reducing-balance APR equivalent of a flat rate */
  effectiveAnnual: number;
}

/** Flat: interest charged on the original amount for the whole term. */
export function flatInstalment(principal: number, annualRate: number, months: number) {
  const interest = principal * annualRate * (months / 12);
  return (principal + interest) / months;
}

/** Reducing balance: standard annuity formula. */
export function reducingInstalment(principal: number, annualRate: number, months: number) {
  const r = annualRate / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

/** Solve the reducing-balance rate that produces a given instalment (bisection). */
export function effectiveAnnualRate(principal: number, monthly: number, months: number) {
  if (principal <= 0 || monthly * months <= principal) return 0;
  let lo = 0;
  let hi = 2;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (reducingInstalment(principal, mid, months) > monthly) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

export function calculateLease(
  principal: number,
  annualRate: number,
  months: number,
  type: RateType,
): LeaseResult {
  const p = Math.max(0, principal);
  const monthly = type === "flat" ? flatInstalment(p, annualRate, months) : reducingInstalment(p, annualRate, months);
  const totalPayable = monthly * months;
  const effective = type === "flat" ? effectiveAnnualRate(p, monthly, months) : annualRate;
  const r = effective / 12;
  const balances: number[] = [];
  let bal = p;
  for (let m = 0; m < months; m++) {
    bal = bal * (1 + r) - monthly;
    balances.push(Math.max(0, bal));
  }
  return {
    principal: p,
    monthly,
    totalInterest: totalPayable - p,
    totalPayable,
    balances,
    effectiveAnnual: effective,
  };
}

/** Maximum vehicle price for a monthly budget + cash down payment, given LTV cap. */
export function affordablePrice(
  monthlyBudget: number,
  downPayment: number,
  annualRate: number,
  months: number,
  ltv: number,
) {
  const r = annualRate / 12;
  const f = Math.pow(1 + r, months);
  const loanFromBudget = r === 0 ? monthlyBudget * months : (monthlyBudget * (f - 1)) / (r * f);
  // the loan can't exceed ltv share of the price, and down payment must cover the rest
  const priceFromLoan = loanFromBudget + downPayment;
  const priceFromDown = downPayment / (1 - ltv);
  return Math.max(0, Math.min(priceFromLoan, priceFromDown));
}
