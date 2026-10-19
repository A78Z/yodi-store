"use client";

import { Home, LayoutGrid, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";
import styles from "./Footer.module.css";

const Footer = () => {
  const pathname = usePathname();
  const params = useParams();
  const { data: session } = useSession();

  if (
    pathname.includes("inscription") ||
    pathname.includes("profile") ||
    pathname.includes("connexion") ||
    pathname.includes("mot-de-passe-oublie") ||
    pathname.includes("reset-password")
  ) return null;

  const links = [
    { href: "/", label: "Accueil", accessibleLabel: "Accueil", Icon: Home, active: pathname === "/" },
    {
      href: "/categories",
      label: "Catégories",
      accessibleLabel: "Catégories de produits",
      Icon: LayoutGrid,
      active: pathname === "/categories" || Boolean(params.category),
    },
    {
      href: "/panier",
      label: "Panier",
      accessibleLabel: "Mon panier",
      Icon: ShoppingBag,
      active: pathname === "/panier" || pathname === "/checkout",
    },
    {
      href: session?.user ? "/profile" : "/connexion",
      label: "Compte",
      accessibleLabel: session?.user ? "Mon compte" : "Se connecter à mon compte",
      Icon: UserRound,
      active: false,
    },
  ];

  return (
    <nav className={styles.bar} aria-label="Navigation principale du bas">
      <ul className={styles.links}>
        {links.map(({ href, label, accessibleLabel, Icon, active }) => (
          <li key={label}>
            <Link
              href={href}
              className={styles.link}
              aria-label={accessibleLabel}
              aria-current={active ? (pathname === href ? "page" : "location") : undefined}
            >
              <Icon className={styles.icon} aria-hidden="true" strokeWidth={1.6} />
              <span>{label}</span>
              {active && <span className={styles.marker} aria-hidden="true" />}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Footer;
