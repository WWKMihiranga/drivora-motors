import { DEFAULT_RATES, minDownPayment, reducingInstalment, type RegistrationStatus } from "@/lib/finance";
import type { Vehicle } from "@/types";

export function registrationOf(v: Pick<Vehicle, "condition" | "yor">): RegistrationStatus {
  if (v.condition !== "used") return "unregistered";
  return "over-1-year";
}

/** "From" monthly figure shown on cards: minimum legal down payment, 60 months, sample reducing rate. */
export function monthlyFrom(v: Pick<Vehicle, "priceLkr" | "vehicleClass" | "condition" | "yor">) {
  const reg = registrationOf(v);
  const down = minDownPayment(v.priceLkr, v.vehicleClass, reg);
  return reducingInstalment(v.priceLkr - down, DEFAULT_RATES.reducingAnnual, 60);
}
