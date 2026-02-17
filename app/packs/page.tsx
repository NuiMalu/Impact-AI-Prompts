import type { Metadata } from "next";
import Link from "next/link";
import type { Prompt } from "@/lib/types";
import PromptCard from "@/components/PromptCard";
import promptsData from "@/data/prompts.json";

export const metadata: Metadata = {
  title: "Prompt Packs — AI Impact Prompt Library",
  description: "Browse prompts grouped by category.",
};

const prompts = promptsData as Prompt[];

const PACK_META: Record<string, { emoji: string; description: string }> = {
  Marketing: {
    emoji: "📣",
    description: "Prompts for ads, campaigns, GTM strategies, and growth.",
  },
  Data: {
    emoji: "📊",
    description: "Prompts for data analysis, reporting, and insights.",
  },
  Image: {
    emoji: "🖼️",
    description: "Prompts for AI image generation and visual creation.",
  },
  Video: {
    emoji: "🎬",
    description: "Prompts for video scripts, Sora, and multimedia content.",
  },
  General: {
    emoji: "⚡",
    description: "General-purpose prompts for a wide range of tasks.",
  },
};

export default function PacksPage() {
  // Group prompts by category
  const groups: Record<string, Prompt[]> = {};
  for (const p of prompts) {
    if (!groups[p.category]) groups[p.category] = [];
    groups[p.category].push(p);
  }

  // Order: non-empty categories first, sorted by count desc
  const sortedCategories = Object.keys(groups).sort(
    (a, b) => groups[b].length - groups[a].length
  );

  return (
    <div>
      {/* Header */}
      <section className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Prompt Packs
        </h1>
        <p className="mt-3 text-gray-500 text-lg max-w-xl">
          Prompts grouped by category so you can find exactly what you need.
        </p>
      </section>

      {/* Pack summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-14">
        {sortedCategories.map((cat) => {
          const meta = PACK_META[cat] ?? { emoji: "📁", description: "" };
          return (
            <a
              key={cat}
              href={`#${cat.toLowerCase()}`}
              className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-brand-500 transition-all"
            >
              <span className="text-3xl">{meta.emoji}</span>
              <div>
                <p className="font-semibold text-gray-900">{cat}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {groups[cat].length} prompt
                  {groups[cat].length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-gray-400 mt-1">{meta.description}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Per-category sections */}
      {sortedCategories.map((cat) => {
        const meta = PACK_META[cat] ?? { emoji: "📁", description: "" };
        return (
          <section key={cat} id={cat.toLowerCase()} className="mb-14 scroll-mt-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{meta.emoji}</span>
              <h2 className="text-2xl font-bold text-gray-900">{cat}</h2>
              <span className="text-sm text-gray-400 ml-1">
                {groups[cat].length} prompt
                {groups[cat].length !== 1 ? "s" : ""}
              </span>
            </div>
            {meta.description && (
              <p className="text-gray-500 text-sm mb-5 -mt-2 ml-9">
                {meta.description}
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groups[cat].map((prompt) => (
                <PromptCard key={prompt.slug} prompt={prompt} />
              ))}
            </div>
          </section>
        );
      })}

      {/* All prompts CTA */}
      <div className="border-t border-gray-200 pt-10 text-center">
        <p className="text-gray-500 mb-3">Looking for something specific?</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          Search all prompts →
        </Link>
      </div>
    </div>
  );
}
