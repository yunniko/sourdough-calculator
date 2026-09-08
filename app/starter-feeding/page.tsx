import type { Metadata } from "next";
import Link from "next/link";
import { StarterFeedingForm } from "@/app/_components/starter-feeding-form";
import { JsonLd } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Sourdough Starter Feeding Calculator",
  description:
    "How much flour and water to add to your sourdough starter for any feeding ratio (like 1:5:5), starting from how much starter you're keeping.",
};

const FAQ = [
  {
    question: "What does a feeding ratio like 1:5:5 mean?",
    answer:
      "Parts by weight of starter : flour : water. 1:5:5 means for every 1g of existing starter, add 5g flour and 5g water. A higher ratio (like 1:10:10) means more food relative to starter, which does slow fermentation — but temperature matters more: roughly every 8°C/15°F warmer roughly halves the time to peak, and every 8°C/15°F cooler roughly doubles it, so a hot kitchen can undo what a higher ratio is trying to buy you.",
  },
  {
    question: "Does this account for my starter's current hydration?",
    answer:
      "It assumes your starter is at a steady state matching your usual feed ratio's hydration, which is true for most maintained starters. If you've just changed your feeding ratio, how long it takes to settle back to steady state depends on the ratio: at 1:5:5 or higher, one or two feeds gets you close; at a stiffer ratio like 1:1:1, each feed only dilutes roughly a third of the old composition, so it can take four or five feeds.",
  },
  {
    question: "I already have some starter in the jar — do I need to discard first?",
    answer:
      "This calculator doesn't currently ask how much you're keeping versus discarding — it assumes the \"starter\" amount you enter is everything you're feeding. If you're maintaining a smaller amount than what's in your jar, discard down to your usual keep amount first, then use that amount here.",
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

      <h1 className="text-3xl font-semibold">Starter Feeding Calculator</h1>
      <p className="mt-3 text-gray-600">
        Enter how much starter you&rsquo;re keeping and your feeding ratio to
        get exact flour and water amounts.
      </p>

      <div className="mt-6">
        <StarterFeedingForm />
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
