import type { Metadata } from "next";
import {
  DM_Sans,
  Fraunces,
  Geist,
  Geist_Mono,
  Josefin_Sans,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Toaster } from "sonner";
import { ProviderSession } from "@/components/ProviderSession";
import MetaPixel from "@/components/MetaPixel";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Refonte — direction A « Terre & Karité » (titres Fraunces, texte DM Sans)
const fraunces = Fraunces({
  variable: "--font-fraunces-serif",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Yodi Cosmetics",
  description:
    "Yodi vend des produits parapharmaceutiques et cosmétiques. Vous trouverez ici toutes sortes de produits cosmétiques à Dakar, Sénégal.",
  icons: {
    icon: "/logo-yodi-k.png",
    apple: "/logo-yodi-k.png",
  },

  alternates: {
    canonical: "/",
  },

  keywords: [
    "yodi",
    "Yodi Cosmetics",
    "yodi parapharmaceutiques",
    "yodi cosmétiques",
    "dakar",
    "sénégal",
    "Tisane Detox",
    "Savon",
    "Tisane Digestive",
    "Baume à Barbe",
    "Cheveux",
    "Huile à Barbe",
  ],

  openGraph: {
    title: "Yodi Cosmetics",
    description:
      "Yodi vend des produits parapharmaceutiques et cosmétiques. Vous trouverez ici toutes sortes de produits cosmétiques à Dakar, Sénégal.",
    url: SITE_URL,
    siteName: "Yodi Cosmetics",
    images: "/logo-yodi-k.png",
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Yodi Cosmetics",
    description:
      "Yodi vend des produits parapharmaceutiques et cosmétiques. Vous trouverez ici toutes sortes de produits cosmétiques à Dakar, Sénégal.",
    images: "/logo-yodi-k.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${josefinSans.variable} ${playfairDisplay.variable} ${fraunces.variable} ${dmSans.variable} antialiased bg-white h-full`}
      >
        {/* Le fallback noscript du Pixel contient une image : il doit rester
            dans body pour que le navigateur conserve la structure SSR. */}
        <MetaPixel />
        <ProviderSession>
          <Toaster />
          {/* Header complet en UN seul bloc, NON sticky : il défile avec la page
              (espace visuel récupéré). z-40 conservé pour la hiérarchie des dropdowns. */}
          <div className="relative z-40 bg-white">
            <Header />
            <Hero />
          </div>
          {children}
          <Footer />
          <ScrollToTopButton />
        </ProviderSession>
      </body>
    </html>
  );
}
