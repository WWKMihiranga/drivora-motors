"use client";

import { useSearchParams } from "next/navigation";
import { LeasingCalculator } from "@/components/finance/LeasingCalculator";
import type { RegistrationStatus } from "@/lib/finance";

/** Lets the home-page teaser hand its values over: /finance?price=…&reg=…&term=… */
export function FinanceCalculatorFromUrl() {
  const p = useSearchParams();
  const price = Number(p.get("price")) || undefined;
  const reg = (p.get("reg") as RegistrationStatus) || undefined;
  const term = Number(p.get("term")) || undefined;
  return <LeasingCalculator key={p.toString()} init={{ price, reg, term }} />;
}
