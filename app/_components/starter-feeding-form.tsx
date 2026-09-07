"use client";

import { useMemo, useState } from "react";
import { computeFeeding, FeedingError } from "@/lib/starter-feeding";

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

export function StarterFeedingForm() {
  const [starterAmount, setStarterAmount] = useState("20");
  const [ratioStarter, setRatioStarter] = useState("1");
  const [ratioFlour, setRatioFlour] = useState("5");
  const [ratioWater, setRatioWater] = useState("5");

  const outcome = useMemo(() => {
    try {
      const result = computeFeeding({
        starterAmount: Number(starterAmount),
        ratioStarter: Number(ratioStarter),
        ratioFlour: Number(ratioFlour),
        ratioWater: Number(ratioWater),
      });
      return { error: null as string | null, result };
    } catch (e) {
      return {
        error: e instanceof FeedingError ? e.message : "Couldn't compute that.",
        result: null,
      };
    }
  }, [starterAmount, ratioStarter, ratioFlour, ratioWater]);

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Starter you&rsquo;re feeding (g)</span>
          <input
            className="w-32 rounded border border-gray-300 px-3 py-2"
            value={starterAmount}
            onChange={(e) => setStarterAmount(e.target.value)}
            aria-label="Starter amount in grams"
            inputMode="decimal"
          />
        </label>
        <span className="pb-2 text-sm text-gray-500">Feed ratio</span>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Starter</span>
          <input
            className="w-16 rounded border border-gray-300 px-3 py-2"
            value={ratioStarter}
            onChange={(e) => setRatioStarter(e.target.value)}
            aria-label="Starter ratio part"
            inputMode="decimal"
          />
        </label>
        <span className="pb-2">:</span>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Flour</span>
          <input
            className="w-16 rounded border border-gray-300 px-3 py-2"
            value={ratioFlour}
            onChange={(e) => setRatioFlour(e.target.value)}
            aria-label="Flour ratio part"
            inputMode="decimal"
          />
        </label>
        <span className="pb-2">:</span>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Water</span>
          <input
            className="w-16 rounded border border-gray-300 px-3 py-2"
            value={ratioWater}
            onChange={(e) => setRatioWater(e.target.value)}
            aria-label="Water ratio part"
            inputMode="decimal"
          />
        </label>
      </div>

      <div className="mt-6" data-testid="result">
        {outcome.error ? (
          <p className="text-red-600" role="alert">
            {outcome.error}
          </p>
        ) : (
          <>
            <p className="text-lg">
              Add <span className="font-semibold">{round(outcome.result!.flourToAdd)} g</span>{" "}
              flour and{" "}
              <span className="font-semibold">{round(outcome.result!.waterToAdd)} g</span> water
              (total {round(outcome.result!.totalAfterFeeding)} g).
            </p>
            <p className="mt-2 text-sm text-gray-500">
              This ratio&rsquo;s hydration: {round(outcome.result!.ratioHydrationPercent)}%
            </p>
            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-gray-700">
              {outcome.result!.steps.map((step, i) => (
                <li key={i} className="font-mono">
                  {step}
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
