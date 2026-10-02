"use client";

import { useEffect, useMemo, useState } from "react";
import useStore from "@/lib/store-manage";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Loader,
  MapPin,
  MessageSquare,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { deleliveryZones } from "@/lib/sampledata";
import { trackInitiateCheckout, trackPurchase, trackAddPaymentInfo, sendToCAPI } from "@/components/MetaPixel";

const CheckoutPage = () => {
  const { data: session } = useSession();
  const { carts, selectedCurrency, usdRate } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [lastname, setLastname] = useState(session?.user?.lastname);
  const [firstname, setFirstname] = useState(session?.user?.firstname);
  const [email, setEmail] = useState(session?.user?.email);
  const [country, setCountry] = useState(session?.user?.country);
  const [city, setCity] = useState(session?.user?.city);
  const [delivery, setDelivery] = useState("");
  const [address, setAddress] = useState(session?.user?.address);
  const [message, setMessage] = useState("");
  const [deliveryZones, setDeliveryZones] = useState<string[]>([]);
  // Calcul du sous-total avec remises
  const subTotal = carts.reduce(
    (acc, cart) =>
      acc +
      (cart.price - (cart.discount ? (cart.price * cart.discount) / 100 : 0)) *
      cart.quantity,
    0
  );

  const shippingCost = 1500;
  const total =
    selectedCurrency === "XOF"
      ? subTotal + shippingCost
      : Number((subTotal + shippingCost) / Number(usdRate || 1)).toFixed(2);

  // Meta Pixel: Track InitiateCheckout when page loads
  useEffect(() => {
    if (carts.length > 0) {
      const eventId = trackInitiateCheckout({
        value: subTotal,
        currency: selectedCurrency,
        num_items: carts.reduce((acc, cart) => acc + cart.quantity, 0),
        content_ids: carts.map((cart) => cart.id),
      });

      // Send to CAPI for better tracking reliability
      sendToCAPI("InitiateCheckout", {
        content_ids: carts.map((cart) => cart.id),
        content_type: "product",
        value: subTotal,
        currency: selectedCurrency,
        num_items: carts.reduce((acc, cart) => acc + cart.quantity, 0),
      }, eventId);
    }
  }, []); // Only track once on page load

  const handleCheckout = async () => {
    console.log("Commande confirmée");

    const orderData = {
      products: carts,
      shippingCost,
      valueCurrency: selectedCurrency === "XOF" ? 1 : Number(usdRate),
      selectedCurrency: selectedCurrency === "XOF" ? "FCFA" : "USD",
      total:
        selectedCurrency === "XOF"
          ? Number(total).toLocaleString()
          : Number(total).toFixed(2),
      paymentMethod: "on-delivery",
      shippingInfo: {
        address,
        city,
        postalCode: session?.user?.zip || "",
        country,
        delivery,
        message,
        phone: session?.user?.phone || "",
        firstname,
        lastname,
        email,
        zip: session?.user?.zip || "",
      },
      status: "pending",
    };

    if (!session?.user) {
      toast.error("Veuillez vous connecter pour confirmer votre commande", {
        style: {
          color: "#ef4444",
        },
        position: "top-right",
      });
      return;
    }

    if (!delivery) {
      toast.error("Zone de livraison obligatoire", {
        style: {
          color: "#ef4444",
        },
        position: "top-right",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderData }),
      });
      const data = await response.json();
      if (response.ok) {
        // Meta Pixel: Track Purchase event
        const eventId = trackPurchase({
          value: Number(total),
          currency: selectedCurrency,
          content_ids: carts.map((cart) => cart.id),
          num_items: carts.reduce((acc, cart) => acc + cart.quantity, 0),
          order_id: data.orderId || "",
        });

        // Send to CAPI for better tracking reliability
        sendToCAPI("Purchase", {
          content_ids: carts.map((cart) => cart.id),
          content_type: "product",
          value: Number(total),
          currency: selectedCurrency,
          num_items: carts.reduce((acc, cart) => acc + cart.quantity, 0),
          order_id: data.orderId || "",
        }, eventId);

        toast.success(
          "Commande confirmée, nous vous contacterons dans les prochaines heures.",
          {
            style: {
              color: "#10b981",
            },
            position: "top-right",
          }
        );
      } else {
        toast.error(data.message, {
          style: {
            color: "#ef4444",
          },
          position: "top-right",
        });
      }
    } catch (error) {
      console.log("Erreur lors de la confirmation de la commande");
      toast.error("Erreur lors de la confirmation de la commande", {
        style: {
          color: "#ef4444",
        },
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useMemo(() => {
    if (country === "senegal") {
      setDeliveryZones(deleliveryZones.senegal);
    } else if (country === "canada") {
      setDeliveryZones(deleliveryZones.canada);
    } else {
      setDeliveryZones([]);
    }
  }, [country]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 lg:px-8 px-6 w-full font-josefin">
      <div className="w-full flex flex-col items-start max-w-6xl mx-auto">
        {/* Header avec navigation */}
        <div className="w-full mb-8">
          <Link
            href="/panier"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#A36F5E] transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour au panier</span>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
            Facturation et Expédition
          </h1>
          <p className="text-gray-600 mt-2">
            Remplissez vos informations pour finaliser votre achat
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informations personnelles */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A36F5E]/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#A36F5E]" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Informations personnelles
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstname"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Prénom *
                  </label>
                  <input
                    type="text"
                    placeholder="Votre prénom"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A36F5E] focus:border-transparent transition-all duration-200"
                    id="lastname"
                    value={lastname}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLastname(e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastname"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nom *
                  </label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A36F5E] focus:border-transparent transition-all duration-200"
                    id="firstname"
                    value={firstname}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFirstname(e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A36F5E] focus:border-transparent transition-all duration-200"
                    id="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pays *
                  </label>
                  <select
                    name="country"
                    id="country"
                    className="w-full p-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A36F5E] focus:border-transparent transition-all duration-200 bg-white"
                    value={country}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setCountry(e.target.value)
                    }
                    required
                  >
                    <option value="">Sélectionnez votre pays</option>
                    <option value="senegal">Sénégal</option>
                    <option value="canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A36F5E]/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#A36F5E]" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Adresse de livraison
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Ville *
                  </label>
                  <input
                    type="text"
                    placeholder="Votre ville"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A36F5E] focus:border-transparent transition-all duration-200"
                    id="city"
                    value={city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCity(e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="delivery"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Zone de livraison *
                  </label>
                  <select
                    name="delivery"
                    id="delivery"
                    className="w-full p-[14px] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A36F5E] focus:border-transparent transition-all duration-200 bg-white"
                    value={delivery}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setDelivery(e.target.value)
                    }
                    required
                  >
                    <option value="">Choisissez votre zone</option>
                    {deliveryZones.map((zone) => (
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Adresse détaillée - Point de repère *
                </label>
                <input
                  type="text"
                  placeholder="Votre adresse complète avec point de repère"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A36F5E] focus:border-transparent transition-all duration-200"
                  id="address"
                  maxLength={60}
                  value={address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAddress(e.target.value)
                  }
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum 60 caractères
                </p>
              </div>
            </div>

            {/* Notes de commande */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A36F5E]/10 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#A36F5E]" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Informations complémentaires
                </h2>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Notes de commande (facultatif)
                </label>
                <textarea
                  placeholder="Commentaires concernant votre commande..."
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A36F5E] focus:border-transparent transition-all duration-200 resize-none"
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setMessage(e.target.value)
                  }
                />
              </div>
            </div>

            {/* Méthodes de paiement */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A36F5E]/10 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#A36F5E]" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Méthodes de paiement
                </h2>
              </div>

              <div className="space-y-4">
                {/* Paiement à la livraison - ACTIF */}
                <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-xl cursor-pointer hover:bg-green-100 transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-800">
                          Paiement à la livraison
                        </p>
                        <p className="text-xs text-green-600">
                          Payez en espèces à la réception
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Actif
                  </div>
                </div>

                {/* Wave - DÉSACTIVÉ */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-xl opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image
                          src="/wave.png"
                          alt="Wave"
                          width={100}
                          height={100}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          Wave
                        </p>
                        <p className="text-xs text-gray-500">
                          Paiement mobile Wave
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Bientôt
                  </div>
                </div>

                {/* Orange Money - DÉSACTIVÉ */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-xl opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image
                          src="/orange-money.png"
                          alt="Orange Money"
                          width={100}
                          height={100}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          Orange Money
                        </p>
                        <p className="text-xs text-gray-500">
                          Paiement mobile Orange
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full font-medium">
                    Bientôt
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Note :</strong> Pour le moment, seul le paiement à la
                  livraison est disponible. Les autres méthodes de paiement
                  seront bientôt opérationnelles.
                </p>
              </div>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#A36F5E]/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[#A36F5E]" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Votre commande
                </h2>
              </div>

              {/* Liste des produits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">
                    Produit(s)
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    Sous Total
                  </span>
                </div>

                {carts.map((cart) => (
                  <div
                    key={cart.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {cart.title} * {cart.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 ml-2">
                      {selectedCurrency === "XOF"
                        ? Math.round(
                          (cart.price -
                            (cart.discount
                              ? (cart.price * cart.discount) / 100
                              : 0)) *
                          cart.quantity
                        )
                        : Math.round(
                          ((cart.price -
                            (cart.discount
                              ? (cart.price * cart.discount) / 100
                              : 0)) *
                            cart.quantity) /
                          Number(usdRate || 1)
                        )}
                      {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Détails des coûts */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold text-gray-800">
                    {selectedCurrency === "XOF" ? Math.round(subTotal).toLocaleString("fr-FR") : Number(subTotal / Number(usdRate || 1)).toFixed(2)} {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Expédition</span>
                  <span className="font-semibold text-gray-800">
                    Frais de livraison: {selectedCurrency === "XOF" ? shippingCost.toLocaleString("fr-FR") : Number(shippingCost / Number(usdRate || 1)).toFixed(2)} {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 bg-gray-50 rounded-xl px-4">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-[#A36F5E]">
                    {total} {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                  </span>
                </div>
              </div>

              {/* Bouton de paiement */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-[#A36F5E] to-[#916253] text-white py-4 rounded-xl font-bold text-lg hover:from-[#916253] hover:to-[#A36F5E] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />{" "}
                    <span>En cours...</span>
                  </div>
                ) : (
                  <>
                    <Truck className="w-5 h-5" />
                    Confirmer la commande
                  </>
                )}
              </button>

              {/* Informations de sécurité */}
              <div className="mt-6 text-center">
                {/* <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">
                    Paiement sécurisé
                  </span>
                </div> */}
                <p className="text-xs text-gray-500">
                  Vos informations sont protégées
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
