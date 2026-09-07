// Baker's-percentage math: every ingredient is expressed as a percentage of
// TOTAL flour weight (flour = 100%), and "total flour" here includes the
// flour contributed by the starter/levain, not just what's added at final
// mix -- this is the convention real sourdough calculators (e.g. The
// Perfect Loaf, The Sourdough Journey) use, because it's what lets a baker
// scale a whole recipe by one number. The derivation: if F is total flour,
// H is hydration (ratio), S is salt (ratio), starterPct is the starter's
// weight as a fraction of F, and starterHydration is the starter's own
// water:flour ratio, then the starter's own flour/water are already part of
// F and the total water, so subtracting them out of the final-mix additions
// (rather than adding them on top) avoids double-counting. Verified
// algebraically: flourInMix + waterInMix + starterWeight + salt reduces to
// exactly F + F*H + F*S, i.e. total dough weight = F * (1 + H + S).

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
    steps,
  };
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}
