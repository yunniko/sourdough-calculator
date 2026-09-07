import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sourdough Baking Calculators",
  description:
    "Free calculators for sourdough bakers: hydration percentage, full recipe scaling by baker's percentages, and starter feeding ratios.",
};

const TOOLS = [
  {
    href: "/hydration",
    title: "Hydration calculator",
    description: "Find your dough's hydration percentage, or how much water you need for a target.",
  },
  {
    href: "/recipe-scaler",
    title: "Recipe scaler",
    description: "Scale a full recipe by baker's percentages, from either total flour or dough weight.",
  },
  {
    href: "/starter-feeding",
    title: "Starter feeding calculator",
    description: "How much flour and water to feed your starter for any ratio.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Sourdough Calculators</h1>
      <p className="mt-3 text-gray-600">
        Free tools for sourdough bread: hydration, full recipe scaling, and
        starter feeding.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="rounded-lg border border-gray-200 p-5 hover:border-gray-400"
          >
            <h2 className="font-semibold text-blue-700">{tool.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
