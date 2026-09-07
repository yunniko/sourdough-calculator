"use client";

import { useMemo, useState } from "react";
import { HydrationError, hydrationPercent, waterForHydration } from "@/lib/hydration";

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

export function HydrationForm() {
  const [flour, setFlour] = useState("500");
  const [water, setWater] = useState("375");

  const fromWeights = useMemo(() => {
    try {
      const pct = hydrationPercent(Number(flour), Number(water));
      return { error: null as string | null, pct };
    } catch (e) {
      return { error: e instanceof HydrationError ? e.message : "Invalid input.", pct: null };
    }
  }, [flour, water]);

  const [targetFlour, setTargetFlour] = useState("500");
  const [targetHydration, setTargetHydration] = useState("75");

  const fromTarget = useMemo(() => {
    try {
      const waterNeeded = waterForHydration(Number(targetFlour), Number(targetHydration));
      return { error: null as string | null, waterNeeded };
    } catch (e) {
      return {
        error: e instanceof HydrationError ? e.message : "Invalid input.",
        waterNeeded: null,
      };
    }
  }, [targetFlour, targetHydration]);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="font-medium">What&rsquo;s my hydration?</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Flour (g)</span>
            <input
              className="w-32 rounded border border-gray-300 px-3 py-2"
              value={flour}
              onChange={(e) => setFlour(e.target.value)}
              aria-label="Flour weight in grams"
              inputMode="decimal"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Water (g)</span>
            <input
              className="w-32 rounded border border-gray-300 px-3 py-2"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              aria-label="Water weight in grams"
              inputMode="decimal"
            />
          </label>
        </div>
        <div className="mt-4" data-testid="hydration-result">
          {fromWeights.error ? (
            <p className="text-red-600" role="alert">
              {fromWeights.error}
            </p>
          ) : (
            <p className="text-lg">
              Hydration: <span className="font-semibold">{round(fromWeights.pct!)}%</span>
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="font-medium">How much water for a target hydration?</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Flour (g)</span>
            <input
              className="w-32 rounded border border-gray-300 px-3 py-2"
              value={targetFlour}
              onChange={(e) => setTargetFlour(e.target.value)}
              aria-label="Flour weight for target hydration"
              inputMode="decimal"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Target hydration (%)</span>
            <input
              className="w-32 rounded border border-gray-300 px-3 py-2"
              value={targetHydration}
              onChange={(e) => setTargetHydration(e.target.value)}
              aria-label="Target hydration percent"
              inputMode="decimal"
            />
          </label>
        </div>
        <div className="mt-4" data-testid="target-result">
          {fromTarget.error ? (
            <p className="text-red-600" role="alert">
              {fromTarget.error}
            </p>
          ) : (
            <p className="text-lg">
              Water needed: <span className="font-semibold">{round(fromTarget.waterNeeded!)} g</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
