import { describe, expect, it } from "vitest";
import { RecipeError, scaleRecipe } from "@/lib/recipe-scaler";

describe("scaleRecipe", () => {
  it("computes a standard recipe from total flour", () => {
    const r = scaleRecipe({
      basis: "flour",
      amount: 1000,
      hydrationPercent: 75,
      saltPercent: 2,
      starterPercent: 20,
      starterHydrationPercent: 100,
    });
    expect(r.totalFlour).toBe(1000);
    expect(r.starterWeight).toBe(200);
    expect(r.flourInStarter).toBe(100);
    expect(r.waterInStarter).toBe(100);
    expect(r.flourInMix).toBe(900);
    expect(r.totalWater).toBe(750);
    expect(r.waterInMix).toBe(650);
    expect(r.saltWeight).toBe(20);
    expect(r.totalDoughWeight).toBe(1770);
  });

  it("never double-counts the starter's own flour/water", () => {
    const r = scaleRecipe({
      basis: "flour",
      amount: 1000,
      hydrationPercent: 75,
      saltPercent: 2,
      starterPercent: 20,
      starterHydrationPercent: 100,
    });
    expect(r.flourInMix + r.flourInStarter).toBe(r.totalFlour);
    expect(r.waterInMix + r.waterInStarter).toBe(r.totalWater);
    expect(r.totalFlour * (1 + 0.75 + 0.02)).toBeCloseTo(r.totalDoughWeight, 9);
  });

  it("round-trips: scaling by dough weight recovers the same total flour", () => {
    const byFlour = scaleRecipe({
      basis: "flour",
      amount: 1000,
      hydrationPercent: 75,
      saltPercent: 2,
      starterPercent: 20,
      starterHydrationPercent: 100,
    });
    const byDough = scaleRecipe({
      basis: "doughWeight",
      amount: byFlour.totalDoughWeight,
      hydrationPercent: 75,
      saltPercent: 2,
      starterPercent: 20,
      starterHydrationPercent: 100,
    });
    expect(byDough.totalFlour).toBeCloseTo(byFlour.totalFlour, 6);
  });

  it("handles no starter (starterPercent 0) without dividing by zero", () => {
    const r = scaleRecipe({
      basis: "flour",
      amount: 500,
      hydrationPercent: 70,
      saltPercent: 2,
      starterPercent: 0,
      starterHydrationPercent: 0,
    });
    expect(r.starterWeight).toBe(0);
    expect(r.flourInMix).toBe(500);
    expect(r.waterInMix).toBe(350);
    expect(r.totalDoughWeight).toBe(860);
  });

  it("rejects a starter percent too high for its hydration", () => {
    expect(() =>
      scaleRecipe({
        basis: "flour",
        amount: 100,
        hydrationPercent: 75,
        saltPercent: 2,
        starterPercent: 300,
        starterHydrationPercent: 50,
      })
    ).toThrow(RecipeError);
  });

  it.each([
    { amount: 0 },
    { hydrationPercent: 0 },
    { saltPercent: -1 },
    { starterPercent: -1 },
  ])("rejects invalid input %j", (overrides) => {
    expect(() =>
      scaleRecipe({
        basis: "flour",
        amount: 1000,
        hydrationPercent: 75,
        saltPercent: 2,
        starterPercent: 20,
        starterHydrationPercent: 100,
        ...overrides,
      })
    ).toThrow(RecipeError);
  });
});
