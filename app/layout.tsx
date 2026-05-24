import type { Metadata } from "next";
import {
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
    <html lang="fr" suppressHydrationWarning>
      <head>
        <MetaPixel />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${josefinSans.variable} ${playfairDisplay.variable} antialiased bg-white h-full`}
      >
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
