import Image from "next/image";
import Link from "next/link";
import type { UniversAffiche } from "@/lib/catalog";

const plural = (n: number) => `${n} produit${n > 1 ? "s" : ""}`;

const HomeUnivers = ({ univers }: { univers: UniversAffiche[] }) => {
  if (univers.length === 0) return null;
  return (
    <section aria-labelledby="univers-titre" className="mx-auto max-w-6xl px-4 pt-12 md:px-8 md:pt-20">
      <h2 id="univers-titre" className="font-fraunces text-2xl text-cacao md:text-4xl">
        Nos univers
      </h2>
      <ul className="mt-6 grid grid-cols-3 gap-4 md:mt-10 md:gap-10">
        {univers.map((u) => (
          <li key={u.slug}>
            <Link
              href={`/${u.slug}`}
              className="group flex flex-col items-center text-center focus-visible:outline-none"
            >
              <span className="relative block aspect-square w-full overflow-hidden rounded-full bg-sable ring-terracotta ring-offset-4 ring-offset-ivoire transition group-hover:ring-2 group-focus-visible:ring-2">
                <Image
                  src={u.imageUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 30vw, 280px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="mt-3 font-dmsans text-sm font-medium text-cacao md:text-lg">{u.title}</span>
              <span className="font-dmsans text-xs text-cacao-doux md:text-sm">{plural(u.productCount)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomeUnivers;
