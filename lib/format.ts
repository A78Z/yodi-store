// Normalise l'affichage des noms de produits en "Title Case" français.
// Ex: "HUILE DE BARBE" -> "Huile de Barbe" ; "HUILE LOCKS" -> "Huile Locks" ;
//     "Baume BARBE" -> "Baume Barbe". Transformation d'AFFICHAGE uniquement
//     (ne modifie pas les données en base).
const MINOR_WORDS = new Set([
  "de", "du", "des", "la", "le", "les", "et", "à", "au", "aux", "d", "l", "en",
]);

export function formatProductName(name: string): string {
  if (!name) return "";
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) =>
      index === 0 || !MINOR_WORDS.has(word)
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(" ");
}
