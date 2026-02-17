import type { Prompt } from "@/lib/types";
import PromptSearch from "@/components/PromptSearch";
import promptsData from "@/data/prompts.json";

export default function HomePage() {
  const prompts = promptsData as Prompt[];

  return (
    <div>
      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          AI Impact{" "}
          <span className="text-brand-600">Prompt Library</span>
        </h1>
        <p className="mt-3 max-w-xl text-gray-500 text-lg">
          A curated collection of high-impact prompts for marketing, sales,
          product, data, and more — ready to copy and use.
        </p>
      </section>

      {/* Search + Filter + Grid */}
      <PromptSearch prompts={prompts} />
    </div>
  );
}
