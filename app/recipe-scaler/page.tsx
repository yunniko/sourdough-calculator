import type { Metadata } from "next";
import Link from "next/link";
import { RecipeScalerForm } from "@/app/_components/recipe-scaler-form";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Sourdough Recipe Scaler (Baker's Percentages)",
  description:
    "Scale a sourdough recipe to any size from either total flour or total dough weight — get exact flour, water, starter, and salt weights, with the full working shown.",
};

const FAQ = [
  {
    question: "What are baker's percentages?",
    answer:
      "Every ingredient expressed as a percentage of total flour weight, with flour itself as 100%. It's how professional bakers scale recipes to any size without recalculating every ratio by hand.",
  },
  {
    question: "Why does total flour include the flour inside my starter?",
    answer:
      "Your starter is itself flour and water. Counting it as part of the 100% flour baseline (rather than adding it on top) is what lets the hydration and salt percentages describe the whole dough accurately, not just what you add at final mix.",
  },
  {
    question: "Can I scale from a dough weight I want, instead of a flour weight?",
    answer:
      "Yes — switch \"Start from\" to total dough weight (useful when you know your pan or basket needs a specific weight) and it works backward to the flour weight for you.",
  },
];

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />

      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">
          ← All tools
        </Link>
      </nav>

      <h1 className="text-3xl font-semibold">Recipe Scaler</h1>
      <p className="mt-3 text-gray-600">
        Scale a full sourdough recipe to any size — enter your target
        hydration, salt, and starter percentages, and either a total flour
        weight or a target dough weight.
      </p>

      <div className="mt-6">
        <RecipeScalerForm />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Frequently asked questions</h2>
        <dl className="mt-3 space-y-4">
          {FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-medium text-gray-900">{item.question}</dt>
              <dd className="mt-1 text-gray-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
