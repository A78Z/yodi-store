"use client";

import clsx from "clsx";
import { BarChart2, TrendingUp, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  //   console.log(pathname)
  const profileItems = [
    {
      href: "/profile",
      icon: User,
      label: "Profile",
      size: 24,
    },
    {
      href: "/profile/commandes",
      label: "Commandes",
      icon: TrendingUp,
      size: 24,
    },
    // {
    //   href: "/profile/favoris",
    //   label: "Mes Favoris",
    //   icon: BarChart2,
    //   size: 24,
    // },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen font-poppins">
      {/* Barre latérale */}
      <div className="h-full flex flex-col items-start justify-between bg-[#1A1D21] text-white px-6 border-r border-gray-700 w-20 sm:w-64">
        <div>
          <Link href="/" className="flex items-center gap-0">
            <Image
              src="/logo-yodi-k.png"
              alt="Yodi-K"
              height={100}
              width={120}
              className="px-4 py-2 h-auto w-[110px] object-contain"
            />
            <span className=" max-sm:hidden text-5xl font-extrabold text-gray-300 -ml-4">
              Yodi
            </span>
            <span className="sr-only">Yodi logo</span>
          </Link>
          <div className="flex flex-col items-start gap-6 w-full py-7">
            {profileItems.map((item) => (
              <Link
                key={item.label}
                className={clsx("flex items-center gap-2 transition-colors", {
                  "text-yellow-600": pathname === `${item.href}`,
                  "text-gray-300 hover:text-yellow-600":
                    pathname !== `${item.href}`,
                })}
                href={item.href}
              >
                <item.icon className="" size={item.size} />
                <span className="max-sm:hidden">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
        <button
          className="flex items-center gap-2 cursor-pointer text-gray-300 bottom-0 py-6 px-2 transition-colors hover:opacity-75"
          onClick={handleLogout}
          aria-label="logout button"
        >
          <LogOut size={24} />
          <span className="max-sm:hidden">Déconnexion</span>
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-2 sm:p-6 overflow-y-auto profile-user">
        {children}
      </div>
    </div>
  );
}
