"use client";

import { useMemo, useState } from "react";
import { RecipeError, scaleRecipe, type RecipeBasis } from "@/lib/recipe-scaler";

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

export function RecipeScalerForm() {
  const [basis, setBasis] = useState<RecipeBasis>("flour");
  const [amount, setAmount] = useState("1000");
  const [hydration, setHydration] = useState("75");
  const [salt, setSalt] = useState("2");
  const [starterPercent, setStarterPercent] = useState("20");
  const [starterHydration, setStarterHydration] = useState("100");

  const outcome = useMemo(() => {
    try {
      const result = scaleRecipe({
        basis,
        amount: Number(amount),
        hydrationPercent: Number(hydration),
        saltPercent: Number(salt),
        starterPercent: Number(starterPercent),
        starterHydrationPercent: Number(starterHydration),
      });
      return { error: null as string | null, result };
    } catch (e) {
      return {
        error: e instanceof RecipeError ? e.message : "Couldn't compute that.",
        result: null,
      };
    }
  }, [basis, amount, hydration, salt, starterPercent, starterHydration]);

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Start from</span>
          <select
            className="rounded border border-gray-300 px-3 py-2"
            value={basis}
            onChange={(e) => setBasis(e.target.value as RecipeBasis)}
            aria-label="Recipe basis"
          >
            <option value="flour">Total flour weight</option>
            <option value="doughWeight">Total dough weight</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">
            {basis === "flour" ? "Total flour (g)" : "Total dough weight (g)"}
          </span>
          <input
            className="w-32 rounded border border-gray-300 px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-label="Amount in grams"
            inputMode="decimal"
          />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Hydration %</span>
          <input
            className="rounded border border-gray-300 px-3 py-2"
            value={hydration}
            onChange={(e) => setHydration(e.target.value)}
            aria-label="Hydration percent"
            inputMode="decimal"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Salt %</span>
          <input
            className="rounded border border-gray-300 px-3 py-2"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            aria-label="Salt percent"
            inputMode="decimal"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Starter % (of total flour)</span>
          <input
            className="rounded border border-gray-300 px-3 py-2"
            value={starterPercent}
            onChange={(e) => setStarterPercent(e.target.value)}
            aria-label="Starter percent, of total flour"
            inputMode="decimal"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Starter hydration %</span>
          <input
            className="rounded border border-gray-300 px-3 py-2"
            value={starterHydration}
            onChange={(e) => setStarterHydration(e.target.value)}
            aria-label="Starter hydration percent"
            inputMode="decimal"
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Percentages are baker&rsquo;s percentages: everything is a share of
        total flour weight, including the flour inside your starter.
        Careful copying a percentage off a recipe you found elsewhere: some
        sites print &ldquo;levain %&rdquo; against just the flour added at
        mix, not total flour including the starter itself — those are
        different numbers, and using the wrong one here changes how much
        starter you&rsquo;re really adding. If a recipe gives you the
        starter&rsquo;s weight directly instead of a percentage, divide it
        by the total flour weight and multiply by 100 to get the number
        this field wants.
      </p>

      <div className="mt-6" data-testid="result">
        {outcome.error ? (
          <p className="text-red-600" role="alert">
            {outcome.error}
          </p>
        ) : (
          <>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat label="Flour to add" value={`${round(outcome.result!.flourInMix)} g`} />
              <Stat label="Water to add" value={`${round(outcome.result!.waterInMix)} g`} />
              <Stat label="Starter" value={`${round(outcome.result!.starterWeight)} g`} />
              <Stat label="Salt" value={`${round(outcome.result!.saltWeight)} g`} />
              <Stat label="Total flour" value={`${round(outcome.result!.totalFlour)} g`} />
              <Stat
                label="Total dough weight"
                value={`${round(outcome.result!.totalDoughWeight)} g`}
              />
              <Stat
                label="Prefermented flour (PFF)"
                value={`${round(outcome.result!.prefermentedFlourPercent)}%`}
              />
            </dl>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-gray-50 p-3 text-center">
      <dt className="text-xs uppercase text-gray-500">{label}</dt>
      <dd className="text-lg font-semibold">{value}</dd>
    </div>
  );
}
