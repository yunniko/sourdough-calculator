// Baker's-percentage math: every ingredient is expressed as a percentage of
// TOTAL flour weight (flour = 100%), and "total flour" here includes the
// flour contributed by the starter/levain, not just what's added at final
// mix -- this is the professional convention (Jeffrey Hamelman's "Bread":
// an Overall Formula percentages every ingredient against total flour
// including prefermented flour, then the Final Dough is derived by
// subtracting the preferment's own flour/water back out). A domain-expert
// review (2026-09-08, see docs/domain-reference.md) verified this against
// a real published formula and found the code's subtract-don't-add-on-top
// method matches exactly. Correction from that review: an earlier version
// of this comment cited "The Perfect Loaf" and "The Sourdough Journey" as
// using this same convention by default -- checked directly, TPL's own
// explainer article says the opposite ("I typically do not include
// [starter's flour/water]... I treat the starter as a single, cohesive
// unit"), only offering full inclusion as an opt-in "if you wish to be
// 100% correct." Hamelman is the accurate citation for this convention;
// see docs/domain-reference.md for what this means for reading a
// TPL-style recipe's own percentages into this calculator.
//
// The derivation: if F is total flour, H is hydration (ratio), S is salt
// (ratio), starterPct is the starter's weight as a fraction of F, and
// starterHydration is the starter's own water:flour ratio, then the
// starter's own flour/water are already part of F and the total water, so
// subtracting them out of the final-mix additions (rather than adding them
// on top) avoids double-counting. Verified algebraically: flourInMix +
// waterInMix + starterWeight + salt reduces to exactly F + F*H + F*S, i.e.
// total dough weight = F * (1 + H + S).

export class RecipeError extends Error {}

function assertNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RecipeError(`${label} must be zero or a positive number.`);
  }
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RecipeError(`${label} must be a positive number.`);
  }
}

export type RecipeBasis = "flour" | "doughWeight";

export type RecipeInput = {
  basis: RecipeBasis;
  amount: number; // grams: total flour if basis="flour", total dough weight if basis="doughWeight"
  hydrationPercent: number;
  saltPercent: number;
  starterPercent: number; // starter weight as % of total flour; 0 = no starter
  starterHydrationPercent: number; // the starter's own water:flour ratio, as a percent
};

export type RecipeResult = {
  totalFlour: number;
  flourInMix: number;
  flourInStarter: number;
  totalWater: number;
  waterInMix: number;
  waterInStarter: number;
  starterWeight: number;
  saltWeight: number;
  totalDoughWeight: number;
  /**
   * Prefermented flour % (PFF) = flourInStarter / totalFlour x 100 -- the
   * figure professional formulas (Hamelman) actually print, and the one
   * that predicts fermentation speed. NOT the same number as
   * `starterPercent` the caller passed in (that's starter weight as % of
   * total flour; PFF is just the flour portion of the starter as % of
   * total flour) -- see docs/domain-reference.md finding #3 for why
   * conflating the two is a real, easy mistake (recipes sometimes quote a
   * "levain %" against mix flour instead of total flour, which reads as a
   * different PFF than intended if typed into `starterPercent` directly).
   */
  prefermentedFlourPercent: number;
  steps: string[];
};

export function scaleRecipe(input: RecipeInput): RecipeResult {
  assertPositive(input.amount, "Amount");
  assertPositive(input.hydrationPercent, "Hydration percent");
  assertNonNegative(input.saltPercent, "Salt percent");
  assertNonNegative(input.starterPercent, "Starter percent");
  if (input.starterPercent > 0) {
    assertPositive(input.starterHydrationPercent, "Starter hydration percent");
  }

  const H = input.hydrationPercent / 100;
  const S = input.saltPercent / 100;
  const steps: string[] = [];

  let totalFlour: number;
  if (input.basis === "flour") {
    totalFlour = input.amount;
    steps.push(`Total flour: ${round(totalFlour)} g (given)`);
  } else {
    totalFlour = input.amount / (1 + H + S);
    steps.push(
      `Total flour: ${round(input.amount)} ÷ (1 + ${round(H)} + ${round(S)}) = ${round(totalFlour)} g`
    );
  }

  const starterWeight = totalFlour * (input.starterPercent / 100);
  let flourInStarter = 0;
  let waterInStarter = 0;
  if (input.starterPercent > 0) {
    const Lh = input.starterHydrationPercent / 100;
    flourInStarter = starterWeight / (1 + Lh);
    waterInStarter = starterWeight - flourInStarter;
    steps.push(
      `Starter: ${round(totalFlour)} × ${input.starterPercent}% = ${round(starterWeight)} g ` +
        `(${round(flourInStarter)} g flour + ${round(waterInStarter)} g water at ${input.starterHydrationPercent}% hydration)`
    );
  } else {
    steps.push("No starter (starter percent is 0)");
  }

  const flourInMix = totalFlour - flourInStarter;
  if (flourInMix < 0) {
    throw new RecipeError(
      "Starter percent is too high for its hydration -- it would need more flour than the total."
    );
  }
  steps.push(
    `Flour to add at mix: ${round(totalFlour)} − ${round(flourInStarter)} = ${round(flourInMix)} g`
  );

  const totalWater = totalFlour * H;
  const waterInMix = totalWater - waterInStarter;
  if (waterInMix < 0) {
    throw new RecipeError(
      "Starter percent is too high for its hydration -- it would need more water than the total."
    );
  }
  steps.push(
    `Total water: ${round(totalFlour)} × ${input.hydrationPercent}% = ${round(totalWater)} g`
  );
  steps.push(
    `Water to add at mix: ${round(totalWater)} − ${round(waterInStarter)} = ${round(waterInMix)} g`
  );

  const saltWeight = totalFlour * S;
  steps.push(`Salt: ${round(totalFlour)} × ${input.saltPercent}% = ${round(saltWeight)} g`);

  const totalDoughWeight = flourInMix + waterInMix + starterWeight + saltWeight;
  steps.push(
    `Total dough weight: ${round(flourInMix)} + ${round(waterInMix)} + ${round(starterWeight)} + ${round(saltWeight)} = ${round(totalDoughWeight)} g`
  );
  steps.push(
    "This is raw dough weight -- expect roughly 10-20% loss by the time it's a baked loaf (moisture loss in the oven), more for a free-standing/hearth loaf, less for a pan loaf."
  );

  const prefermentedFlourPercent = (flourInStarter / totalFlour) * 100;
  steps.push(
    `Prefermented flour (PFF): ${round(flourInStarter)} ÷ ${round(totalFlour)} = ${round(prefermentedFlourPercent)}%`
  );

  return {
    totalFlour,
    flourInMix,
    flourInStarter,
    totalWater,
    waterInMix,
    waterInStarter,
    starterWeight,
    saltWeight,
    totalDoughWeight,
    prefermentedFlourPercent,
    steps,
  };
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}
