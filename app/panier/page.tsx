"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus } from "lucide-react";
import useStore from "@/lib/store-manage";

const CartPage = () => {
  const { carts, updateToCart, removeFromCart, selectedCurrency, usdRate } =
    useStore();
  const [promoCode, setPromoCode] = useState("");

  // Calcul du sous-total avec remises
  const subTotal = carts.reduce(
    (acc, cart) =>
      acc +
      (cart.price - (cart.discount ? (cart.price * cart.discount) / 100 : 0)) *
        cart.quantity,
    0
  );

  // Calcul du total (pour l'instant égal au sous-total, shipping à ajouter plus tard)
  const total =
    selectedCurrency === "XOF"
      ? subTotal
      : Number(subTotal / Number(usdRate || 1)).toFixed(2);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateToCart(productId, newQuantity);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    removeFromCart(productId);
  };

  const handleApplyPromoCode = () => {
    // Logique pour appliquer le code promo
    console.log("Code promo appliqué:", promoCode);
  };

  if (carts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
              Mon Panier
            </h1>
            <p className="text-gray-600 mb-6">Votre panier est vide</p>
            <Link
              href="/"
              className="inline-block bg-[#A36F5E] text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-[#916253] transition-colors text-sm sm:text-base"
            >
              Continuer les achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-start py-4 sm:py-8 mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 p-2 sm:p-4">
        Mon Panier
      </h2>

      <div className="w-full max-w-6xl p-2 sm:p-4">
        {/* Version Desktop - Tableau */}
        <div className="hidden md:block">
          <table
            style={{
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            }}
            className="w-full bg-white font-josefin p-4"
          >
            <thead>
              <tr>
                <th className="text-left mr-8 py-4 px-4">Produit</th>
                <th className="text-center py-4 px-4">Prix</th>
                <th className="text-center py-4 px-4">Quantité</th>
                <th className="text-center py-4 px-4">Sous total</th>
              </tr>
            </thead>
            <tbody>
              {carts.map((cart) => (
                <tr key={cart.id} className="py-6">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRemoveProduct(cart.id)}
                        style={{
                          boxShadow:
                            "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                        }}
                        className="text-black bg-gray-100 p-1.5 rounded-full border-none outline-none mr-8 cursor-pointer focus:outline-none"
                      >
                        <X
                          size={16}
                          className="hover:text-red-500 transition-all duration-300"
                        />
                      </button>
                      <Image
                        src={cart.imageUrl}
                        alt={cart.title}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover"
                      />
                      <span className="text-xs">{cart.title}</span>
                    </div>
                  </td>
                  <td className="text-center text-sm py-4 px-4">
                    <span className="line-through">
                      {selectedCurrency === "XOF"
                        ? cart.price
                        : Number(cart.price / Number(usdRate || 1)).toFixed(2)}{" "}
                      {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                    </span>
                    {(cart.discount ?? 0) > 0 && (
                      <span className="ml-2">
                        {selectedCurrency === "XOF"
                          ? Math.round(
                              cart.price - (cart.price * cart.discount) / 100
                            )
                          : Math.round(
                              (cart.price -
                                (cart.discount
                                  ? (cart.price * cart.discount) / 100
                                  : 0)) /
                                Number(usdRate || 1)
                            )}{" "}
                        {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2 min-w-20">
                      <button
                        onClick={() =>
                          handleQuantityChange(cart.id, cart.quantity - 1)
                        }
                        className="text-black bg-gray-100 p-2 rounded-full border-none outline-none cursor-pointer focus:outline-none"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-sm min-w-6 text-center">
                        {cart.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(cart.id, cart.quantity + 1)
                        }
                        className="text-black bg-gray-100 p-2 rounded-full border-none outline-none cursor-pointer focus:outline-none"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="text-center font-bold py-4 px-4">
                    {selectedCurrency === "XOF"
                      ? Math.round(
                          (cart.price -
                            (cart.discount
                              ? (cart.price * cart.discount) / 100
                              : 0)) *
                            cart.quantity
                        )
                      : Math.round(
                          (cart.price -
                            (cart.discount
                              ? (cart.price * cart.discount) / 100
                              : 0)) /
                            Number(usdRate || 1)
                        ) * cart.quantity}{" "}
                    {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Version Mobile/Tablette - Cards */}
        <div className="md:hidden space-y-4">
          {carts.map((cart) => (
            <div
              key={cart.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
              }}
            >
              {/* En-tête du produit */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <Image
                    src={cart.imageUrl}
                    alt={cart.title}
                    width={50}
                    height={50}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm leading-tight line-clamp-2">
                      {cart.title}
                    </h3>
                    {cart.brand && (
                      <p className="text-xs text-gray-500 mt-1">{cart.brand}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveProduct(cart.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Prix et remise */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-center">
                  <span className="font-semibold text-gray-800 text-sm">
                    {selectedCurrency === "XOF"
                      ? Math.round(
                          cart.price -
                            (cart.discount
                              ? (cart.price * cart.discount) / 100
                              : 0)
                        )
                      : Math.round(
                          (cart.price -
                            (cart.discount
                              ? (cart.price * cart.discount) / 100
                              : 0)) /
                            Number(usdRate || 1)
                        )}{" "}
                    {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                  </span>
                  {(cart.discount ?? 0) > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 line-through">
                        {selectedCurrency === "XOF"
                          ? cart.price
                          : Number(cart.price / Number(usdRate || 1)).toFixed(2)}{" "}
                        {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                      </span>
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                        -{cart.discount}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantité et sous-total */}
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() =>
                      handleQuantityChange(cart.id, cart.quantity - 1)
                    }
                    className="p-2 rounded-md hover:bg-white transition-colors disabled:opacity-50"
                    disabled={cart.quantity <= 1}
                  >
                    <Minus size={14} className="text-gray-600" />
                  </button>
                  <span className="px-3 py-1 text-gray-800 font-semibold min-w-[2rem] text-center">
                    {cart.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(cart.id, cart.quantity + 1)
                    }
                    className="p-2 rounded-md hover:bg-white transition-colors"
                  >
                    <Plus size={14} className="text-gray-600" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Sous-total</p>
                  <p className="font-bold text-gray-800">
                    {selectedCurrency === "XOF"
                      ? Math.round(
                          (cart.price -
                            (cart.discount
                              ? (cart.price * cart.discount) / 100
                              : 0)) *
                            cart.quantity
                        )
                      : Math.round(
                          (cart.price -
                            (cart.discount
                              ? (cart.price * cart.discount) / 100
                              : 0)) /
                            Number(usdRate || 1)
                        ) * cart.quantity}{" "}
                    {selectedCurrency === "XOF" ? "FCFA" : "USD"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé de la commande */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Total panier
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-semibold text-gray-800">
                {selectedCurrency === "XOF"
                  ? Math.round(subTotal).toLocaleString()
                  : Number(subTotal / Number(usdRate || 1)).toFixed(2)}{" "}
                {selectedCurrency === "XOF" ? "FCFA" : "USD"}
              </span>
            </div>

            <div className="flex justify-between items-start py-2 border-b border-gray-100">
              <span className="text-gray-600">Expédition</span>
              <div className="text-right max-w-[180px]">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Saisissez votre adresse pour voir les options de livraison
                </p>
                <button className="text-[#A36F5E] text-xs font-medium hover:underline mt-1">
                  Calculer les frais
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-3">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-[#A36F5E]">
                {selectedCurrency === "XOF"
                  ? Number(total).toLocaleString()
                  : Number(total).toFixed(2)}{" "}
                {selectedCurrency === "XOF" ? "FCFA" : "USD"}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full mt-2 bg-[#A36F5E] cursor-pointer text-white p-2 text-sm rounded-lg font-bold transition-all duration-300 hover:bg-[#916253] hover:shadow-lg"
          >
            Valider la commande
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
