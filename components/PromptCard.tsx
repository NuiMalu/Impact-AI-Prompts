import Link from "next/link";
import type { Prompt } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  Marketing: "bg-orange-100 text-orange-700",
  Data: "bg-blue-100 text-blue-700",
  Image: "bg-purple-100 text-purple-700",
  Video: "bg-pink-100 text-pink-700",
  General: "bg-gray-100 text-gray-600",
};

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  const colorClass =
    CATEGORY_COLORS[prompt.category] ?? CATEGORY_COLORS.General;

  return (
    <Link
      href={`/prompts/${prompt.slug}`}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-brand-500 transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors leading-snug">
          {prompt.title}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
        >
          {prompt.category}
        </span>
      </div>
      <p className="text-sm text-gray-500 line-clamp-3 flex-1">
        {prompt.short_description}
      </p>
      <div className="mt-4 text-xs text-gray-400 flex items-center gap-1">
        <span>View prompt</span>
        <span className="group-hover:translate-x-0.5 transition-transform inline-block">
          →
        </span>
      </div>
    </Link>
  );
}
