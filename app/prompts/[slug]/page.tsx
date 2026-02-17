import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { Prompt } from "@/lib/types";
import CopyButton from "@/components/CopyButton";
import CopyLinkButton from "@/components/CopyLinkButton";
import promptsData from "@/data/prompts.json";

const prompts = promptsData as Prompt[];

const CATEGORY_COLORS: Record<string, string> = {
  Marketing: "bg-orange-100 text-orange-700",
  Data: "bg-blue-100 text-blue-700",
  Image: "bg-purple-100 text-purple-700",
  Video: "bg-pink-100 text-pink-700",
  General: "bg-gray-100 text-gray-600",
};

export async function generateStaticParams() {
  return prompts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const prompt = prompts.find((p) => p.slug === params.slug);
  if (!prompt) return {};
  return {
    title: `${prompt.title} — AI Impact Prompt Library`,
    description: prompt.short_description,
  };
}

export default function PromptPage({
  params,
}: {
  params: { slug: string };
}) {
  const prompt = prompts.find((p) => p.slug === params.slug);
  if (!prompt) notFound();

  const colorClass =
    CATEGORY_COLORS[prompt.category] ?? CATEGORY_COLORS.General;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-400 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Library
        </Link>
        <span>/</span>
        <span className="text-gray-600">{prompt.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-start gap-3 mb-3">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight flex-1">
            {prompt.title}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}
          >
            {prompt.category}
          </span>
        </div>
        <p className="text-gray-500 text-base leading-relaxed">
          {prompt.short_description}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <CopyButton
          text={prompt.prompt_text}
          label="Copy prompt"
          successLabel="Copied!"
        />
        <CopyLinkButton />
      </div>

      {/* Prompt text */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Prompt
          </span>
          <CopyButton
            text={prompt.prompt_text}
            label="Copy"
            successLabel="Copied!"
            className="text-xs px-3 py-1.5"
          />
        </div>
        <pre className="p-5 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed overflow-x-auto font-mono scrollbar-thin">
          {prompt.prompt_text}
        </pre>
      </div>

      {/* Source file */}
      <p className="mt-4 text-xs text-gray-400">
        Source:{" "}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">
          {prompt.source_file}
        </code>
      </p>

      {/* Back link */}
      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 transition-colors"
        >
          ← Back to library
        </Link>
      </div>
    </div>
  );
}
