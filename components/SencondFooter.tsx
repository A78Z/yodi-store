"use client";

import React from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
  FaSnapchat,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Truck, Leaf, CreditCard, Sparkles } from "lucide-react";
import Image from "next/image";
import { CONTACT_EMAIL, PHONE_SN, PHONE_CA, PHONE_COMMERCIAL, WHATSAPP } from "@/lib/site";

const SencondFooter = () => {
  return (
    <footer className="w-full bg-gray-100 mt-44">
      {/* Section supérieure - Pourquoi choisir Yodi-K ? */}
      <div className="w-full bg-gradient-to-b from-[#FAF7F4] to-white py-12 md:py-16 px-4 lg:px-20">
        <h2 className="flex items-center justify-center gap-2 font-playfair text-2xl md:text-3xl font-bold text-center text-[#A36F5E] mb-10">
          <Sparkles className="w-6 h-6" aria-hidden="true" />
          Pourquoi choisir Yodi-K&nbsp;?
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Livraison */}
          <div className="flex flex-col items-center text-center h-full bg-white rounded-2xl p-8 border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(163,111,94,0.12)]">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-gradient-to-br from-[#FFE5D9] to-[#F5C896]">
              <Truck className="w-8 h-8 text-[#A36F5E]" strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2">
              Livraison Express
            </h3>
            <p className="font-josefin text-sm text-gray-500 leading-relaxed">
              Recevez vos produits en moins de 24h partout à Dakar, du lundi au
              samedi.
            </p>
          </div>

          {/* 100% Naturel */}
          <div className="flex flex-col items-center text-center h-full bg-white rounded-2xl p-8 border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(163,111,94,0.12)]">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9]">
              <Leaf className="w-8 h-8 text-[#2D7A4A]" strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2">
              100% Naturel
            </h3>
            <p className="font-josefin text-sm text-gray-500 leading-relaxed">
              Produits authentiques, sans additifs ni conservateurs. Sélectionnés
              avec soin pour votre bien-être.
            </p>
          </div>

          {/* Paiement flexible */}
          <div className="flex flex-col items-center text-center h-full bg-white rounded-2xl p-8 border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(163,111,94,0.12)]">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB]">
              <CreditCard className="w-8 h-8 text-[#1976D2]" strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2">
              Paiement flexible
            </h3>
            <p className="font-josefin text-sm text-gray-500 leading-relaxed mb-4">
              Choisissez votre mode de paiement préféré. 100% sécurisé.
            </p>
            <div className="mt-auto flex items-center justify-center gap-3">
              <Image
                src="/wave.png"
                alt="Wave"
                width={56}
                height={56}
                className="h-7 w-auto object-contain"
              />
              <Image
                src="/orange-money.png"
                alt="Orange Money"
                width={56}
                height={56}
                className="h-7 w-auto object-contain"
              />
              <span className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-600 font-josefin">
                CB
              </span>
              <span className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-600 font-josefin">
                Espèces
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section inférieure - Navigation et contact */}
      <div className="w-full bg-gray-100 py-12 px-4 lg:px-20">
        <div className="max-w-7xl mx-auto">
          {/* TODO (newsletter, étape future — nécessite un backend de stockage des emails) :
              <div className="footer-newsletter">🌿 Restons en contact — formulaire d'inscription</div>
              Voir SPEC à créer (modèle "abonnés" + route /api/newsletter). Désactivé pour l'instant. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo et Contact */}
            <div className="">
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <Image
                    src="/logo-yodi-k.png"
                    alt="Yodi-K"
                    width={140}
                    height={116}
                    className="h-auto w-[120px] object-contain"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 font-josefin leading-relaxed mb-4 max-w-xs">
                Cosmétiques naturels &amp; parapharmacie en ligne, préparés avec
                soin pour votre beauté et votre bien-être. Présents au Sénégal
                🇸🇳 et au Canada 🇨🇦.
              </p>
              <div className="space-y-3 font-josefin text-sm">
                {/* Sénégal */}
                <div>
                  <p className="font-semibold text-[#A36F5E] mb-1">🇸🇳 Sénégal</p>
                  <a
                    href={`tel:${PHONE_COMMERCIAL.tel}`}
                    className="block text-gray-600 hover:text-[#A36F5E]"
                  >
                    📞 Téléphone : {PHONE_COMMERCIAL.label}
                  </a>
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-600 hover:text-[#A36F5E]"
                  >
                    💬 WhatsApp : {PHONE_SN.label}
                  </a>
                </div>
                {/* Canada */}
                <div>
                  <p className="font-semibold text-[#A36F5E] mb-1">🇨🇦 Canada</p>
                  <a
                    href={`tel:${PHONE_CA.tel}`}
                    className="block text-gray-600 hover:text-[#A36F5E]"
                  >
                    📞 Téléphone : {PHONE_CA.label}
                  </a>
                </div>
                {/* Email */}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="block text-gray-600 hover:text-[#A36F5E]"
                >
                  📧 {CONTACT_EMAIL}
                </a>
                {/* TODO: passer à contact@yodi-k.com une fois la boîte créée (cf. lib/site.ts) */}
              </div>
            </div>

            {/* Catégories */}
            <div>
              <h3 className="text-sm font-josefin font-bold uppercase tracking-wider text-[#A36F5E] mb-4">
                Catégories
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/tisane/detox"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] font-josefin"
                  >
                    Tisane Detox
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tisane/digestive"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] font-josefin"
                  >
                    Tisane Digestive
                  </Link>
                </li>
                <li>
                  <Link
                    href="/huile/huile-barbe"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] font-josefin"
                  >
                    Huile à Barbe
                  </Link>
                </li>
                <li>
                  <Link
                    href="/baume/baume-barbe"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] font-josefin"
                  >
                    Baume à Barbe
                  </Link>
                </li>
                <li>
                  <Link
                    href="/huile/cheveux"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] font-josefin"
                  >
                    Cheveux
                  </Link>
                </li>
                <li>
                  <Link
                    href="/savon"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] font-josefin"
                  >
                    Savon
                  </Link>
                </li>
              </ul>
            </div>

            {/* Aide & infos */}
            <div>
              <h3 className="text-sm font-josefin font-bold uppercase tracking-wider text-[#A36F5E] mb-4">
                Aide &amp; infos
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/profile"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] hover:translate-x-1 inline-block transition-all font-josefin"
                  >
                    Mon compte
                  </Link>
                </li>
                <li>
                  <Link
                    href="/condition-dutilisations"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] hover:translate-x-1 inline-block transition-all font-josefin"
                  >
                    Conditions générales (CGV)
                  </Link>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:text-[#A36F5E] hover:translate-x-1 inline-block transition-all font-josefin"
                  >
                    Nous contacter (WhatsApp)
                  </a>
                </li>
                {/* TODO: activer ces liens quand les pages existeront (cf. TODO-PAGES.md) :
                    À propos, Livraison & délais, Moyens de paiement, Politique de retour,
                    FAQ, Mentions légales, Politique de confidentialité, Cookies. */}
              </ul>
            </div>

            {/* Suivez-nous */}
            <div>
              <h3 className="text-sm font-josefin font-bold uppercase tracking-wider text-[#A36F5E] mb-4">
                Suivez-nous
              </h3>
              <p className="text-sm text-gray-600 font-josefin leading-relaxed mb-4">
                Rejoignez notre communauté pour nos nouveautés et offres
                exclusives.
              </p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="https://www.facebook.com/yyodistores"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Yodi-K sur Facebook"
                  title="Facebook"
                  className="w-9 h-9 bg-white border border-[#A36F5E]/15 rounded-full flex items-center justify-center text-[#A36F5E] hover:bg-[#A36F5E] hover:text-white transition-all hover:-translate-y-0.5"
                >
                  <FaFacebook className="w-[18px] h-[18px]" />
                </a>
                <a
                  href="https://www.instagram.com/yodi_store"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Yodi-K sur Instagram"
                  title="Instagram"
                  className="w-9 h-9 bg-white border border-[#A36F5E]/15 rounded-full flex items-center justify-center text-[#A36F5E] hover:bg-[#A36F5E] hover:text-white transition-all hover:-translate-y-0.5"
                >
                  <FaInstagram className="w-[18px] h-[18px]" />
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contactez Yodi-K sur WhatsApp"
                  title="WhatsApp"
                  className="w-9 h-9 bg-white border border-[#A36F5E]/15 rounded-full flex items-center justify-center text-[#A36F5E] hover:bg-[#A36F5E] hover:text-white transition-all hover:-translate-y-0.5"
                >
                  <FaWhatsapp className="w-[18px] h-[18px]" />
                </a>
                <a
                  href="https://tiktok.com/@yyodi2"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Yodi-K sur TikTok"
                  title="TikTok"
                  className="w-9 h-9 bg-white border border-[#A36F5E]/15 rounded-full flex items-center justify-center text-[#A36F5E] hover:bg-[#A36F5E] hover:text-white transition-all hover:-translate-y-0.5"
                >
                  <FaTiktok className="w-[18px] h-[18px]" />
                </a>
                <a
                  href="https://www.snapchat.com/add/yyodi-store"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Yodi-K sur Snapchat"
                  title="Snapchat"
                  className="w-9 h-9 bg-white border border-[#A36F5E]/15 rounded-full flex items-center justify-center text-[#A36F5E] hover:bg-[#A36F5E] hover:text-white transition-all hover:-translate-y-0.5"
                >
                  <FaSnapchat className="w-[18px] h-[18px]" />
                </a>
              </div>
            </div>

          </div>

          {/* Bandeau paiement sécurisé (pleine largeur) */}
          <div className="mt-10 pt-8 border-t border-black/10 text-center">
            <p className="text-sm font-josefin font-semibold text-gray-600 mb-3">
              Paiement 100% sécurisé
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Image
                src="/wave.png"
                alt="Paiement Wave"
                width={120}
                height={48}
                className="h-8 w-auto object-contain bg-white rounded-md px-2 py-1"
              />
              <Image
                src="/orange-money.png"
                alt="Paiement Orange Money"
                width={120}
                height={48}
                className="h-8 w-auto object-contain bg-white rounded-md px-2 py-1"
              />
              <span className="inline-flex items-center rounded-md bg-white border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 font-josefin">
                Visa
              </span>
              <span className="inline-flex items-center rounded-md bg-white border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 font-josefin">
                Mastercard
              </span>
              <span className="inline-flex items-center rounded-md bg-white border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 font-josefin">
                Espèces à la livraison
              </span>
            </div>
          </div>

          {/* Barre légale */}
          <div className="mt-8 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
            <p className="text-xs text-gray-500 font-josefin">
              © {new Date().getFullYear()} Yodi-K — Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Link
                href="/condition-dutilisations"
                className="text-xs text-gray-500 hover:text-[#A36F5E] font-josefin"
              >
                CGV
              </Link>
              {/* TODO: ajouter Mentions légales, Confidentialité, Cookies quand les pages existeront (cf. TODO-PAGES.md) */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SencondFooter;
