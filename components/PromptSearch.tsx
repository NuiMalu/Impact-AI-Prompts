"use client";

import { useState, useMemo } from "react";
import type { Prompt } from "@/lib/types";
import { CATEGORIES, type Category } from "@/lib/types";
import PromptCard from "./PromptCard";

export default function PromptSearch({ prompts }: { prompts: Prompt[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return prompts.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.prompt_text.toLowerCase().includes(q)
      );
    });
  }, [prompts, query, activeCategory]);

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
        </span>
        <input
          type="search"
          placeholder="Search prompts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-brand-600 text-white shadow"
                : "bg-white border border-gray-200 text-gray-600 hover:border-brand-500 hover:text-brand-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-gray-400">
        {filtered.length === 0
          ? "No prompts found"
          : `${filtered.length} prompt${filtered.length === 1 ? "" : "s"}`}
        {activeCategory !== "All" && ` in ${activeCategory}`}
        {query && ` matching "${query}"`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((prompt) => (
            <PromptCard key={prompt.slug} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <span className="text-5xl mb-4">🔍</span>
          <p className="text-lg font-medium">No prompts found</p>
          <p className="text-sm mt-1">Try a different search or category</p>
        </div>
      )}
    </div>
  );
}
