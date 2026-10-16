import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";
import type { UniversAffiche } from "@/lib/catalog";

// Page propre pour une catégorie (ou sous-catégorie) encore vide, appelée par
// son URL directe : jamais de page « Aucun produit trouvé ».
const CategoryComingSoon = ({ title, univers }: { title: string; univers: UniversAffiche[] }) => (
  <main className="bg-ivoire px-4 pb-28 pt-12 md:pb-20 md:pt-20">
    <div className="mx-auto max-w-xl text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sauge-clair text-sauge" aria-hidden="true">
        <Sprout className="h-7 w-7" />
      </span>
      <p className="mt-6 font-dmsans text-xs font-medium uppercase tracking-[0.18em] text-terracotta-fonce">
        Bientôt disponible
      </p>
      <h1 className="mt-3 font-fraunces text-3xl leading-tight text-cacao md:text-5xl">{title}</h1>
      <p className="mt-4 font-dmsans text-[15px] leading-relaxed text-cacao-doux md:text-base">
        Cette catégorie arrive bientôt sur Yodi-K. En attendant, découvrez nos produits déjà disponibles.
      </p>
      <Link
        href="/#produits"
        className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-terracotta px-6 font-dmsans text-[15px] font-medium text-ivoire transition-colors hover:bg-terracotta-fonce focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-ivoire"
      >
        Voir nos produits
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>

      {univers.length > 0 && (
        <nav aria-label="Catégories disponibles" className="mt-10">
          <p className="font-dmsans text-sm text-cacao-doux">Ou parcourez une catégorie disponible :</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {univers.map((u) => (
              <li key={u.slug}>
                <Link
                  href={`/${u.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-terracotta/40 px-5 font-dmsans text-sm text-terracotta-fonce transition-colors hover:bg-terracotta hover:text-ivoire focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                >
                  {u.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  </main>
);

export default CategoryComingSoon;
