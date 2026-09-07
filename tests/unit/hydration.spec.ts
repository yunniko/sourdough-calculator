import { describe, expect, it } from "vitest";
import { flourForHydration, HydrationError, hydrationPercent, waterForHydration } from "@/lib/hydration";

describe("hydrationPercent", () => {
  it("computes a standard 75% hydration", () => {
    expect(hydrationPercent(500, 375)).toBe(75);
  });

  it("computes over 100% for very wet doughs", () => {
    expect(hydrationPercent(400, 440)).toBeCloseTo(110, 9);
  });

  it.each([
    [0, 100],
    [-1, 100],
    [100, 0],
    [100, -1],
  ])("rejects non-positive input (%d, %d)", (flour, water) => {
    expect(() => hydrationPercent(flour, water)).toThrow(HydrationError);
  });
});

describe("waterForHydration", () => {
  it("computes water from flour and target hydration", () => {
    expect(waterForHydration(500, 75)).toBe(375);
  });
});

describe("flourForHydration", () => {
  it("computes flour from water and target hydration", () => {
    expect(flourForHydration(375, 75)).toBe(500);
  });

  it("round-trips with waterForHydration", () => {
    const flour = 437;
    const hydration = 68;
    const water = waterForHydration(flour, hydration);
    expect(flourForHydration(water, hydration)).toBeCloseTo(flour, 9);
  });
});
