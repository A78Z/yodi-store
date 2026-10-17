export const HERO_INTERVAL_MS = 8000;

export function nextHeroSlide(current: number, direction: number, count: number) {
  return count > 0 ? ((current + direction) % count + count) % count : 0;
}

export function heroSwipeDirection(dx: number, dy: number) {
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.3) return 0;
  return dx < 0 ? 1 : -1;
}

export function homeSlides(univers: ReadonlyArray<{ slug: string }>) {
  const has = (slug: string) => univers.some(universe => universe.slug === slug);
  return [
    {
      id: "maison", label: "La maison", eyebrow: "Maison Yodi-K · L’essentiel", title: "Le soin naturel,", accent: "un plaisir à soi.",
      description: "Huiles, baumes et soins du corps. Prenez le temps de trouver le rituel qui vous ressemble.",
      cta: "Découvrir nos soins", href: "#produits", image: "/lifestyle-hero.png", position: "70% center",
      alt: "Une femme souriante tient un flacon de soin dans un intérieur chaleureux", caption: "Le plaisir du quotidien", theme: "sand",
    },
    {
      id: "cheveux", label: "Les cheveux", eyebrow: "Le rituel · Cheveux", title: "Vos cheveux,", accent: "votre signature.",
      description: has("huile") ? "Une place pour vous, un geste pour vos cheveux. Explorez notre collection d’huiles et composez votre rituel." : "Prenez un moment pour vous. Retrouvez les soins disponibles dans notre collection.",
      cta: has("huile") ? "Explorer les huiles" : "Découvrir nos soins", href: has("huile") ? "/huile" : "#produits",
      image: "/slider/banniere_3.png", position: "92% center", alt: "Une femme aux longues locs tient un flacon d’huile Yodi-K", caption: "À chacun son rituel", theme: "rose",
    },
    {
      id: "barbe", label: "La barbe", eyebrow: "Le rituel · Barbe", title: "L’art du détail,", accent: "chaque jour.",
      description: has("baume") ? "Un rendez-vous avec soi, jusque dans les détails. Découvrez nos baumes et faites une place au soin dans votre quotidien." : "Le soin se glisse dans les petits gestes. Découvrez la sélection disponible dans notre boutique.",
      cta: has("baume") ? "Découvrir les baumes" : "Découvrir nos soins", href: has("baume") ? "/baume" : "#produits",
      image: "/slider/banniere_2.png", position: "10% center", alt: "Un homme à la barbe soignée, avec une sélection de produits Yodi-K", caption: "Les gestes qui comptent", theme: "olive",
    },
  ] as const;
}
