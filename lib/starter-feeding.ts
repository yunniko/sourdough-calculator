export class FeedingError extends Error {}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new FeedingError(`${label} must be a positive number.`);
  }
}

export type FeedingInput = {
  starterAmount: number; // grams of existing starter you're feeding
  ratioStarter: number; // the "1" in e.g. 1:5:5
  ratioFlour: number;
  ratioWater: number;
};

export type FeedingResult = {
  flourToAdd: number;
  waterToAdd: number;
  totalAfterFeeding: number;
  ratioHydrationPercent: number;
  steps: string[];
};

/**
 * Given an existing amount of starter and a feeding ratio (e.g. 1:5:5),
 * computes how much flour and water to add. Assumes the starter is being
 * maintained at a steady state matching the feed ratio -- it doesn't (and
 * can't, without knowing the starter's actual current composition) account
 * for a starter that's currently at a different hydration than its usual
 * feed ratio implies.
 */
export function computeFeeding(input: FeedingInput): FeedingResult {
  assertPositive(input.starterAmount, "Starter amount");
  assertPositive(input.ratioStarter, "Starter ratio part");
  assertPositive(input.ratioFlour, "Flour ratio part");
  assertPositive(input.ratioWater, "Water ratio part");

  const flourToAdd = input.starterAmount * (input.ratioFlour / input.ratioStarter);
  const waterToAdd = input.starterAmount * (input.ratioWater / input.ratioStarter);
  const totalAfterFeeding = input.starterAmount + flourToAdd + waterToAdd;
  const ratioHydrationPercent = (input.ratioWater / input.ratioFlour) * 100;

  const steps = [
    `Flour to add: ${round(input.starterAmount)} × (${input.ratioFlour} ÷ ${input.ratioStarter}) = ${round(flourToAdd)} g`,
    `Water to add: ${round(input.starterAmount)} × (${input.ratioWater} ÷ ${input.ratioStarter}) = ${round(waterToAdd)} g`,
    `Total after feeding: ${round(input.starterAmount)} + ${round(flourToAdd)} + ${round(waterToAdd)} = ${round(totalAfterFeeding)} g`,
  ];

  return { flourToAdd, waterToAdd, totalAfterFeeding, ratioHydrationPercent, steps };
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}
