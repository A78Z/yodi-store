import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HomeHero = () => (
  <section aria-label="Bienvenue chez Yodi-K" className="px-4 pt-4 md:px-8 md:pt-8">
    <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-sable md:grid md:grid-cols-2 md:items-center">
      <div className="relative aspect-[4/5] md:order-2 md:aspect-square">
        <Image
          src="/lifestyle-hero.png"
          alt="Femme appliquant une huile de soin Yodi-K dans un intérieur lumineux"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-[70%_center]"
        />
        {/* Voile cacao pour garder le titre lisible sur la photo (mobile) */}
        <div className="absolute inset-0 bg-gradient-to-t from-cacao/80 via-cacao/10 to-transparent md:hidden" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 md:static md:p-12 lg:p-16">
        <p className="font-dmsans text-xs font-medium uppercase tracking-[0.18em] text-ivoire md:text-terracotta">
          Cosmétiques naturels
        </p>
        <h1 className="mt-3 font-fraunces text-[2.1rem] leading-[1.08] text-ivoire md:text-5xl md:text-cacao lg:text-6xl">
          Le soin naturel, fait avec chaleur.
        </h1>
        <p className="mt-3 max-w-md font-dmsans text-[15px] leading-relaxed text-ivoire/90 md:text-base md:text-cacao-doux">
          Huiles, baumes et soins du corps. Présents au Sénégal et au Canada.
        </p>
        <Link
          href="#produits"
          className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-terracotta px-6 font-dmsans text-[15px] font-medium text-ivoire transition-colors hover:bg-terracotta-fonce focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivoire focus-visible:ring-offset-2 focus-visible:ring-offset-terracotta"
        >
          Découvrir nos soins
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  </section>
);

export default HomeHero;
