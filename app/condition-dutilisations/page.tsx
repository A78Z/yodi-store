import React from "react";
import { CONTACT_EMAIL } from "@/lib/site";

const ConditionDutilisations = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 md:p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-josefin text-[#A36F5E] mb-4">
            Conditions Générales de Vente
          </h1>
          <p className="text-lg font-josefin text-gray-600">
            Site internet www.yodi-k.com
          </p>
          <div className="w-24 h-1 bg-[#A36F5E] mx-auto mt-4"></div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Article 1 */}
          <article className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-josefin font-semibold text-[#A36F5E] mb-4">
              Article 1 – Présentation du Site internet
            </h2>
            <p className="text-gray-700 font-josefin leading-relaxed">
              yodi-store est une boutique en ligne spécialisée dans la vente de
              produits de beauté, maquillage, de parfums, de produits
              d&apos;hygiène et beauté et d&apos;accessoires divers pour
              cheveux, visage et corps pour Homme et Femme. Le Site offre
              également des gammes diverses comme les produits intimes.
            </p>
          </article>

          {/* Article 2 */}
          <article className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-josefin font-semibold text-[#A36F5E] mb-4">
              Article 2 – Acceptation des CGV
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 font-josefin leading-relaxed">
                Les présentes Conditions Générales de Vente (ci-après dénommées
                « CGV ») régissent les règles de vente et d&apos;achat des produits
                mis en vente sur internet par le site internet «{" "}
                <span className="text-[#A36F5E] font-semibold">
                  https://www.yodi-k.com
                </span>{" "}
                » (ci-après dénommé « yodi-store»). Les CGV ne concernent à
                titre exclusif que les personnes physiques non commerçantes.
              </p>
              <p className="text-gray-700 font-josefin leading-relaxed">
                Les CGV définissent les étapes nécessaires à la passation de la
                commande, de l&apos;achat et permettent de suivre
                l&apos;acheminement de chaque commande conclue, à
                l&apos;exclusion de toute autre convention présente ou non sur
                le Site.
              </p>
              <p className="text-gray-700 font-josefin leading-relaxed">
                Les présentes CGV doivent obligatoirement être acceptées lors de
                tout achat effectué sur le Site. Seules les personnes physiques
                non commerçantes sont autorisées à effectuer des achats sur le
                Site. Tous les achats effectués sur le Site sont conclues à
                titre non professionnel.
              </p>
            </div>
          </article>

          {/* Article 3 */}
          <article className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-josefin font-semibold text-[#A36F5E] mb-4">
              Article 3 – Disponibilité
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 font-josefin leading-relaxed">
                Les offres présentées par yodi-store sont valables tant qu&apos;elles
                sont annoncées sur le Site et dans la limite des stocks
                disponibles.
              </p>
              <p className="text-gray-700 font-josefin leading-relaxed">
                En tout état de cause, et dans l&apos;éventualité d&apos;une
                indisponibilité totale ou partielle de produits après passation
                de la Commande, l&apos;Acheteur sera informé par téléphone dès que
                possible de l&apos;indisponibilité du produit et de l&apos;annulation
                totale ou partielle de sa commande.
              </p>
              <p className="text-gray-700 font-josefin leading-relaxed">
                En cas d&apos;annulation totale de la Commande :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 font-josefin">
                <li>
                  La Commande de l&apos;Acheteur sera automatiquement annulée et le
                  montant payé sera rembourser sans frais.
                </li>
                <li>
                  Le Service Clients de yodi-store prendra contact avec
                  l&apos;Acheteur pour l&apos;informer de l&apos;annulation de sa Commande et
                  lui proposer de renouveler sa Commande, à l&apos;exception du
                  produit non disponible.
                </li>
              </ul>
            </div>
          </article>

          {/* Article 4 */}
          <article className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-josefin font-semibold text-[#A36F5E] mb-4">
              Article 4 – Livraison
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 font-josefin leading-relaxed">
                Au cours de la validation de chaque commande, l&apos;acheteur
                concerné doit obligatoirement choisir la Zone de livraison de sa
                commande. Ces Zones de livraison sont affichées sur le Site lors
                de la validation de la commande.
              </p>
              <div className="bg-[#A36F5E]/10 p-4 rounded-lg border-l-4 border-[#A36F5E]">
                <p className="text-gray-700 font-josefin leading-relaxed font-semibold">
                  Le délai de livraison est de moins de 24h dans la région de
                  Dakar et 72h dans les autres régions.
                </p>
                <p className="text-gray-600 font-josefin text-sm mt-2">
                  Hors dimanche et jours fériés.
                </p>
              </div>
            </div>
          </article>

          {/* Article 5 */}
          <article className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-josefin font-semibold text-[#A36F5E] mb-4">
              Article 5 – Moyen de Paiement
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 font-josefin leading-relaxed">
                L&apos;acheteur aura le choix de payer en espèces lors de la
                livraison, par carte bancaire ou par Orange Money lors de la
                validation de la commande.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 font-josefin leading-relaxed">
                  Pour tous les paiements en ligne, le Site n&apos;accèdent et ne
                  conservent aucune donnée bancaire, seuls les organismes de
                  paiement y ayant accès.
                </p>
              </div>
              <p className="text-gray-700 font-josefin leading-relaxed">
                Chaque acheteur concerné est seul et entier responsable des
                éventuelles autorisations nécessaires autant dans le choix du
                mode de paiement qu&apos;au règlement de sa commande.
              </p>
            </div>
          </article>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 font-josefin">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>
          <p className="text-sm text-gray-500 font-josefin mt-2">
            Pour toute question concernant ces conditions, contactez-nous à
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[#A36F5E] hover:underline ml-1"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConditionDutilisations;
