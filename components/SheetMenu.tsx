"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronRight, Menu } from "lucide-react";
import { categories } from "@/lib/sampledata";
import Link from "next/link";

const SheetMenu = () => {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const toggleCategory = (categoryId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenCategoryId(openCategoryId === categoryId ? null : categoryId);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="visible md:invisible text-[#A36F5E] cursor-pointer transition-all duration-300 hover:scale-110 hover:text-[#916253]">
          <Menu size={36} />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="px-0 py-10 font-josefin overflow-y-auto"
      >
        {/* Premium Mobile Menu */}
        <div className="flex flex-col items-stretch">
          {/* Menu Header */}
          <div className="px-6 pb-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 tracking-wide">Menu</h2>
            <p className="text-xs text-gray-500 mt-1">Découvrez nos catégories</p>
          </div>

          {/* Categories List */}
          <div className="flex flex-col py-4">
            {categories.map((category) => (
              <div key={category.id} className="relative">
                {/* Category Item */}
                <div className="group flex items-center justify-between px-6 py-4 transition-all duration-200 hover:bg-gray-50/80">
                  <Link
                    href={`/${category.slug}`}
                    className="flex-1 text-gray-800 font-medium tracking-wide text-[15px] transition-colors duration-200 group-hover:text-[#A36F5E]"
                  >
                    {category.title}
                  </Link>

                  {category.subcategories && (
                    <button
                      onClick={(e) => toggleCategory(category.id, e)}
                      aria-haspopup="true"
                      aria-expanded={openCategoryId === category.id}
                      aria-label={`Afficher les sous-catégories de ${category.title}`}
                      className="p-2 rounded-full transition-all duration-300 hover:bg-[#A36F5E]/10"
                    >
                      <ChevronRight
                        size={18}
                        className={`text-[#A36F5E] transition-transform duration-300 ${openCategoryId === category.id ? "rotate-90" : "rotate-0"
                          }`}
                      />
                    </button>
                  )}
                </div>

                {/* Subcategories - Animated Dropdown */}
                {category.subcategories && openCategoryId === category.id && (
                  <div className="bg-gray-50/50 border-l-2 border-[#A36F5E]/30 ml-6 mr-4 mb-2 rounded-r-lg overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    {category.subcategories.map((subcategory, index) => (
                      <Link
                        key={subcategory.id}
                        href={`/${category.slug}/${subcategory.slug}`}
                        className="group/sub flex items-center gap-3 px-4 py-3 text-sm text-gray-600 transition-all duration-200 hover:bg-white hover:text-[#A36F5E]"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animationFillMode: 'backwards'
                        }}
                      >
                        {/* Dot indicator */}
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 transition-all duration-200 group-hover/sub:bg-[#A36F5E] group-hover/sub:scale-125"></span>

                        <span className="font-normal tracking-wide">{subcategory.title}</span>

                        {/* Arrow on hover */}
                        <svg
                          className="w-3.5 h-3.5 ml-auto opacity-0 -translate-x-2 transition-all duration-200 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 text-[#A36F5E]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Subtle divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent mx-6"></div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetMenu;
