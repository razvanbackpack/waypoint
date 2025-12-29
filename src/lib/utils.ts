import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function parseRecipeSlug(slug: string): number | null {
  // Extract ID from "12345-item-name" or just "12345"
  const match = slug.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}
