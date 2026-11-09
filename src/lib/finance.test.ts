import { describe, expect, it } from "vitest";
import {
  affordablePrice,
  calculateLease,
  effectiveAnnualRate,
  flatInstalment,
  maxLtv,
  minDownPayment,
  reducingInstalment,
} from "./finance";

describe("leasing maths", () => {
  it("matches the CBSL flat-rate example (Rs 100,000, 10%, 12 months)", () => {
    // CBSL FAQ: interest 833.33 + principal 8,333.33 per month
    expect(flatInstalment(100_000, 0.1, 12)).toBeCloseTo(9166.67, 2);
  });

  it("computes the reducing-balance annuity", () => {
    // 1,000,000 at 12% for 60 months = 22,244.45
    expect(reducingInstalment(1_000_000, 0.12, 60)).toBeCloseTo(22244.45, 1);
  });

  it("finds the effective rate of a flat quote", () => {
    const m = flatInstalment(1_000_000, 0.12, 60);
    const eff = effectiveAnnualRate(1_000_000, m, 60);
    expect(eff).toBeGreaterThan(0.2);
    expect(reducingInstalment(1_000_000, eff, 60)).toBeCloseTo(m, 2);
  });

  it("balances run down to zero", () => {
    const r = calculateLease(2_000_000, 0.15, 48, "reducing");
    expect(r.balances).toHaveLength(48);
    expect(r.balances.at(-1)).toBeLessThan(1);
    expect(r.totalPayable).toBeCloseTo(r.monthly * 48, 4);
  });
});

describe("CBSL loan-to-value rules (25 May 2026)", () => {
  it("caps unregistered cars at 40%", () => {
    expect(maxLtv("car", "unregistered")).toBe(0.4);
    expect(minDownPayment(10_000_000, "car", "under-1-year")).toBe(6_000_000);
  });
  it("caps unregistered commercial vehicles at 60%", () => {
    expect(maxLtv("commercial", "unregistered")).toBe(0.6);
  });
  it("caps vehicles registered over a year at 60%", () => {
    expect(maxLtv("car", "over-1-year")).toBe(0.6);
    expect(minDownPayment(10_000_000, "car", "over-1-year")).toBe(4_000_000);
  });
  it("affordable price respects the down-payment limit", () => {
    const p = affordablePrice(200_000, 3_000_000, 0.15, 60, 0.4);
    expect(p).toBeLessThanOrEqual(3_000_000 / 0.6 + 1);
  });
});
