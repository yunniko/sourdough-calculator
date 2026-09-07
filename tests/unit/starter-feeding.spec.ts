import { describe, expect, it } from "vitest";
import { computeFeeding, FeedingError } from "@/lib/starter-feeding";

describe("computeFeeding", () => {
  it("computes a 1:5:5 feed from 20g of starter", () => {
    const r = computeFeeding({
      starterAmount: 20,
      ratioStarter: 1,
      ratioFlour: 5,
      ratioWater: 5,
    });
    expect(r.flourToAdd).toBe(100);
    expect(r.waterToAdd).toBe(100);
    expect(r.totalAfterFeeding).toBe(220);
    expect(r.ratioHydrationPercent).toBe(100);
  });

  it("computes a 1:2:1 (stiffer) feed", () => {
    const r = computeFeeding({
      starterAmount: 50,
      ratioStarter: 1,
      ratioFlour: 2,
      ratioWater: 1,
    });
    expect(r.flourToAdd).toBe(100);
    expect(r.waterToAdd).toBe(50);
    expect(r.ratioHydrationPercent).toBe(50);
  });

  it.each([
    { starterAmount: 0 },
    { ratioStarter: 0 },
    { ratioFlour: -1 },
    { ratioWater: 0 },
  ])("rejects invalid input %j", (overrides) => {
    expect(() =>
      computeFeeding({
        starterAmount: 20,
        ratioStarter: 1,
        ratioFlour: 5,
        ratioWater: 5,
        ...overrides,
      })
    ).toThrow(FeedingError);
  });
});
