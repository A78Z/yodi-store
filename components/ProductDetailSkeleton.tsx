import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
      <div className="min-h-screen bg-white py-8 px-4 font-josefin">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb skeleton */}
          <div className="text-xs text-gray-600 mb-6 flex items-end justify-end">
            <Skeleton className="w-48 h-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Colonne gauche - Image skeleton */}
            <div className="lg:col-span-2 relative">
              <div className="relative">
                <Skeleton className="w-full h-[600px]" />

                {/* Icône de recherche skeleton */}
                <div className="absolute top-4 left-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            </div>

            {/* Colonne droite - Détails skeleton */}
            <div className="lg:col-span-3 space-y-4">
              {/* Titre skeleton */}
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-3/4 h-6" />

              {/* Prix skeleton */}
              <div className="flex items-center gap-4">
                <Skeleton className="w-20 h-6" />
                <Skeleton className="w-24 h-8" />
              </div>

              {/* Avantages skeleton */}
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="w-full h-4" />
                  </div>
                ))}
              </div>

              {/* Stock skeleton */}
              <Skeleton className="w-16 h-4" />

              {/* Sélecteur de quantité et bouton skeleton */}
              <div className="flex md:flex-row flex-col items-start md:items-center gap-4">
                <Skeleton className="w-16 h-4" />
                <div className="flex items-center rounded-md">
                  <Skeleton className="w-8 h-8" />
                  <Skeleton className="w-16 h-8 mx-4" />
                  <Skeleton className="w-8 h-8" />
                </div>
                <Skeleton className="w-32 h-12 rounded-md" />
              </div>

              {/* Informations marque skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="w-12 h-4" />
                <Skeleton className="w-24 h-4" />
              </div>

              {/* Information livraison skeleton */}
              <div className="border inline-flex flex-col items-start gap-2 p-2 my-2">
                <Skeleton className="w-64 h-4" />
                <Skeleton className="w-48 h-3" />
              </div>

              {/* SKU skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="w-20 h-3" />
                <Skeleton className="w-24 h-3" />
              </div>

              {/* Onglets skeleton */}
              <div className="mt-12 mb-8">
                <div className="flex md:flex-row flex-col items-start md:items-center gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="w-32 h-8" />
                  ))}
                </div>
              </div>

              {/* Contenu des onglets skeleton */}
              <div className="min-h-[200px]">
                <div className="space-y-3">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-5/6 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
