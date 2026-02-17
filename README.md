# AI Impact Prompt Library

A clean, searchable website for a curated collection of high-impact AI prompts.
Built with **Next.js 14 (App Router)** + **Tailwind CSS**.

## Features

- Full-text search across title, description, and prompt content
- Category filters (Marketing, Data, Image, Video, General)
- Prompt Packs page — browse prompts grouped by category
- Copy prompt / copy link buttons with success state
- Auto-indexed at build time from the repository's prompt files

---

## Running Locally

### Prerequisites

- Node.js 18+
- npm (or pnpm / yarn)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/NuiMalu/Impact-AI-Prompts.git
cd Impact-AI-Prompts

# 2. Install dependencies
npm install

# 3. Start the development server
#    (The indexer runs automatically before the dev server starts)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build   # Indexes prompts then builds Next.js
npm start       # Starts the production server
```

---

## How to Add New Prompts

The indexer scans the **repository root** for prompt content automatically.
You can add prompts in two ways:

### Option A — Single file (simplest)

Create a file at the root of the repository named after your prompt:

```
My New Prompt
```

The file can be plain text or Markdown. No extension required, but `.md` and `.txt`
are also supported.

### Option B — Folder with a README

Create a folder named after your prompt, and put the content in a `README.md`
inside it:

```
My New Prompt/
└── README.md
```

If there is no `README.md`, the indexer picks the largest `.md` or `.txt` file,
and finally the largest file of any type.

### Category assignment

Categories are assigned automatically from the prompt name:

| If the name contains… | Category |
|---|---|
| `IMAGE` | Image |
| `Video` or `Sora` | Video |
| `Data` or `Analyst` | Data |
| `Marketing`, `Ad`, `Ads`, `PPC`, or `GTM` | Marketing |
| anything else | General |

After adding your prompt, restart the dev server (`npm run dev`) or run:

```bash
npm run index   # Re-generates data/prompts.json manually
```

---

## Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout + nav
│   ├── page.tsx            # Home page (search + cards)
│   ├── prompts/[slug]/     # Prompt detail page
│   └── packs/              # Packs page (grouped by category)
├── components/             # Shared React components
├── data/
│   └── prompts.json        # Auto-generated index (do not edit manually)
├── lib/
│   └── types.ts            # TypeScript types
└── scripts/
    └── index-prompts.js    # Indexer script
```

---

## Contributing

Pull requests welcome! When adding prompts, follow the conventions above.
For UI/feature changes, open an issue first.
