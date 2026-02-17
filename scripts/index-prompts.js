#!/usr/bin/env node

/**
 * index-prompts.js
 *
 * Scans the repository root for prompt content (files and folders),
 * extracts metadata, and writes data/prompts.json.
 *
 * Runs automatically via `predev` and `prebuild` hooks.
 */

const fs = require("fs");
const path = require("path");

// ── helpers ──────────────────────────────────────────────────────────────────

const REPO_ROOT = path.join(__dirname, "..");
const OUTPUT_FILE = path.join(REPO_ROOT, "data", "prompts.json");

// Items to skip when scanning the root
const SKIP = new Set([
  ".git",
  ".next",
  "node_modules",
  "scripts",
  "data",
  "app",
  "components",
  "lib",
  "public",
  "README.md",
  "package.json",
  "package-lock.json",
  "next.config.js",
  "next.config.mjs",
  "next-env.d.ts",
  "tailwind.config.ts",
  "tailwind.config.js",
  "postcss.config.js",
  "tsconfig.json",
  ".eslintrc.json",
  ".gitignore",
]);

/** Convert a name to a URL-safe kebab-case slug */
function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Assign a category based on folder/file name */
function getCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes("image")) return "Image";
  if (lower.includes("video") || lower.includes("sora")) return "Video";
  if (lower.includes("data") || lower.includes("analyst")) return "Data";
  if (
    lower.includes("marketing") ||
    lower.includes(" ad ") ||
    lower.includes("ads") ||
    lower.includes("ppc") ||
    lower.includes("gtm")
  )
    return "Marketing";
  return "General";
}

/** Read a file safely, returning null on error */
function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

/**
 * Given raw file content, split into short_description and prompt_text.
 * short_description = first non-empty paragraph (max 200 chars)
 * prompt_text       = full content (preserving formatting)
 */
function extractContent(raw) {
  const text = raw.trim();

  // Split into paragraphs by blank lines
  const paragraphs = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  let short_description = "";
  if (paragraphs.length > 0) {
    // Strip leading markdown heading markers
    const first = paragraphs[0].replace(/^#+\s*/, "").trim();
    short_description =
      first.length > 200 ? first.slice(0, 197) + "…" : first;
  }

  return { short_description, prompt_text: text };
}

/**
 * Find the best content file inside a directory.
 * Preference order:
 *   1. README.md
 *   2. Largest .md file
 *   3. Largest .txt file
 *   4. Largest file of any extension
 */
function findBestFileInDir(dirPath) {
  let entries;
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return null;
  }

  const files = entries
    .filter((e) => e.isFile())
    .map((e) => {
      const full = path.join(dirPath, e.name);
      let size = 0;
      try {
        size = fs.statSync(full).size;
      } catch {}
      return { name: e.name, full, size };
    });

  if (files.length === 0) return null;

  // 1. README.md
  const readme = files.find(
    (f) => f.name.toLowerCase() === "readme.md"
  );
  if (readme) return readme.full;

  // 2. Largest .md
  const mdFiles = files.filter((f) => f.name.toLowerCase().endsWith(".md"));
  if (mdFiles.length > 0)
    return mdFiles.sort((a, b) => b.size - a.size)[0].full;

  // 3. Largest .txt
  const txtFiles = files.filter((f) => f.name.toLowerCase().endsWith(".txt"));
  if (txtFiles.length > 0)
    return txtFiles.sort((a, b) => b.size - a.size)[0].full;

  // 4. Largest file overall
  return files.sort((a, b) => b.size - a.size)[0].full;
}

// ── main ─────────────────────────────────────────────────────────────────────

function buildIndex() {
  const entries = fs.readdirSync(REPO_ROOT, { withFileTypes: true });
  const prompts = [];

  for (const entry of entries) {
    if (SKIP.has(entry.name)) continue;
    // Skip hidden files/dirs and TypeScript declaration files
    if (entry.name.startsWith(".")) continue;
    if (entry.name.endsWith(".d.ts")) continue;

    const fullPath = path.join(REPO_ROOT, entry.name);
    const title = entry.name.replace(/-/g, " ").replace(/_/g, " ");
    const slug = toSlug(entry.name);
    const category = getCategory(entry.name);

    let source_file = null;
    let raw = null;

    if (entry.isDirectory()) {
      // Find the best file inside the directory
      const bestFile = findBestFileInDir(fullPath);
      if (bestFile) {
        source_file = path.relative(REPO_ROOT, bestFile);
        raw = readFileSafe(bestFile);
      } else {
        source_file = "needs manual selection";
      }
    } else if (entry.isFile()) {
      // Treat the file itself as the prompt
      source_file = entry.name;
      raw = readFileSafe(fullPath);
    }

    if (!raw) {
      prompts.push({
        title,
        slug,
        category,
        source_file: source_file || "needs manual selection",
        short_description: "No content found — needs manual selection.",
        prompt_text: "",
      });
      continue;
    }

    const { short_description, prompt_text } = extractContent(raw);

    prompts.push({
      title,
      slug,
      category,
      source_file,
      short_description,
      prompt_text,
    });
  }

  // Sort alphabetically by title
  prompts.sort((a, b) => a.title.localeCompare(b.title));

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(prompts, null, 2), "utf8");

  console.log(
    `✓ Indexed ${prompts.length} prompt(s) → ${path.relative(
      process.cwd(),
      OUTPUT_FILE
    )}`
  );
}

buildIndex();
