"use client";

export default function CategoryError({ reset }: { reset: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-7xl px-4 py-10 text-center font-josefin text-gray-500">
      <p>Impossible de charger les produits pour le moment.</p>
      <button onClick={reset} className="mt-4 rounded-full border border-[#A36F5E] px-6 py-2 text-[#A36F5E]">
        Réessayer
      </button>
    </div>
  );
}
