import { Skeleton } from "@/components/ui/skeleton";

export default function ProductListLoading() {
  return (
    <div className="w-full flex flex-col py-10 mx-auto max-w-7xl font-josefin px-4" aria-busy="true">
      <Skeleton className="w-48 h-8 mb-4" />
      <div className="w-full my-6"><Skeleton className="w-72 h-9 mb-4" /></div>
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12 mb-6">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center gap-3">
              <Skeleton className="w-72 h-64" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-3" />
              <Skeleton className="w-20 h-6" />
              <Skeleton className="w-full h-10 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
