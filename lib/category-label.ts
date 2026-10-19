// Libellé public utilisable côté client sans charger le catalogue serveur.
import { categories } from "@/lib/sampledata";

export function categoryLabel(slug: string): string {
  const label = categories.find(category => category.slug === slug)?.title;
  if (label != null) return label;
  const text = slug.replace(/[-_]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}
