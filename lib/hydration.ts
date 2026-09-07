export class HydrationError extends Error {}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new HydrationError(`${label} must be a positive number.`);
  }
}

export function hydrationPercent(flourGrams: number, waterGrams: number): number {
  assertPositive(flourGrams, "Flour weight");
  assertPositive(waterGrams, "Water weight");
  return (waterGrams / flourGrams) * 100;
}

export function waterForHydration(flourGrams: number, hydration: number): number {
  assertPositive(flourGrams, "Flour weight");
  assertPositive(hydration, "Hydration percent");
  return flourGrams * (hydration / 100);
}

export function flourForHydration(waterGrams: number, hydration: number): number {
  assertPositive(waterGrams, "Water weight");
  assertPositive(hydration, "Hydration percent");
  return waterGrams / (hydration / 100);
}
