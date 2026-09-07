import type { Metadata } from "next";
import Link from "next/link";
import { HydrationForm } from "@/app/_components/hydration-form";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Sourdough Hydration Calculator",
  description:
    "Calculate your dough's hydration percentage from flour and water weight, or find how much water you need for a target hydration.",
};

const FAQ = [
  {
    question: "What does hydration percent mean in bread baking?",
    answer:
      "It's the weight of water as a percentage of the weight of flour (water ÷ flour × 100). 500g flour with 375g water is 75% hydration. Higher numbers mean a wetter, stickier dough.",
  },
  {
    question: "Does hydration include the water in my starter?",
    answer:
      "This simple calculator doesn't — it's just the flour and water you're measuring right now. For a full recipe that accounts for your starter's own flour and water, use the recipe scaler instead.",
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

      <h1 className="text-3xl font-semibold">Hydration Calculator</h1>
      <p className="mt-3 text-gray-600">
        Hydration is water weight as a percentage of flour weight — the
        single number that most determines how wet, sticky, and open-crumbed
        your dough will be.
      </p>

      <div className="mt-6">
        <HydrationForm />
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
