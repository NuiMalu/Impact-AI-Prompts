import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Impact Prompt Library",
  description:
    "A curated library of high-impact AI prompts for marketing, sales, product, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-brand-600 transition-colors"
            >
              <span className="text-2xl">⚡</span>
              <span>AI Impact Prompts</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link
                href="/"
                className="hover:text-brand-600 transition-colors"
              >
                Library
              </Link>
              <Link
                href="/packs"
                className="hover:text-brand-600 transition-colors"
              >
                Packs
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-400">
          AI Impact Prompt Library — open source &amp; community driven
        </footer>
      </body>
    </html>
  );
}
