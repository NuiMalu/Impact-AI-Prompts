export interface Prompt {
  title: string;
  slug: string;
  category: string;
  source_file: string;
  short_description: string;
  prompt_text: string;
}

export const CATEGORIES = ["All", "General", "Marketing", "Data", "Image", "Video"] as const;
export type Category = (typeof CATEGORIES)[number];
