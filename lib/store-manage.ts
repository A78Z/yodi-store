import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CART } from "./types/types";

interface MyStore {
  carts: CART[];
  addToCart: (product: CART) => void;
  updateToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCart: () => CART[];
  getCartTotal: () => number;
  getCartTotalQuantity: () => number;
  getCartTotalPrice: () => number;
  getCartTotalDiscount: () => number;
  totalQuantity: number;
  updateCart: (product: CART) => void;
  // Currency management
  selectedCurrency: "XOF" | "USD";
  usdRate: number;
  setSelectedCurrency: (currency: "XOF" | "USD") => void;
  setUsdRate: (rate: number) => void;
}

const useStore = create<MyStore>()(
  persist(
    (set, get) => ({
      carts: [],
      totalQuantity: 0,
      selectedCurrency: "XOF" as "XOF" | "USD",
      usdRate: 1,
      setSelectedCurrency: (currency: "XOF" | "USD") =>
        set({ selectedCurrency: currency }),
      setUsdRate: (rate: number) => set({ usdRate: rate }),
      updateCart: (product: CART) => {
        const currentCarts = get().carts;
        const existingProduct = currentCarts.find(
          (cart) => cart.id === product.id
        );
        if (existingProduct) {
          set({
            carts: currentCarts.map((cart) =>
              cart.id === product.id
                ? { ...cart, quantity: product.quantity }
                : cart
            ),
          });
        }
      },
      addToCart: (cart) =>
        set((state) => {
          const updateCart = state.carts.map((crt) => {
            if (cart?.id === crt?.id) {
              return {
                ...crt,
                quantity: crt.quantity + cart.quantity,
                price: cart.price,
                discount: cart.discount || 0,
              };
            }
            return crt;
          });
          if (!state.carts.some((crt) => crt?.id === cart.id)) {
            updateCart.push(cart);
          }
          return {
            carts: updateCart,
            totalQuantity: updateCart.length,
          };
        }),

      updateToCart: (productId: string, quantity: number) =>
        set((state) => {
          const updatedCart = state.carts.map((crt) => {
            if (crt?.id === productId) {
              return {
                ...crt,
                quantity: quantity,
                price: crt.price,
                discount: crt.discount || 0,
              };
            }
            return crt;
          });
          return {
            carts: updatedCart,
            totalQuantity: updatedCart.length,
          };
        }),

      removeFromCart: (productId) =>
        set((state) => {
          const removeFromCart = state.carts.filter(
            (crt) => crt?.id !== productId
          );
          return {
            carts: removeFromCart,
            totalQuantity: removeFromCart.length,
          };
        }),
      clearCart: () => set({ carts: [], totalQuantity: 0 }),
      getCart: () => get().carts,
      getCartTotal: () =>
        get().carts.reduce((total, cart) => total + cart.price, 0),
      getCartTotalQuantity: () => get().totalQuantity,
      getCartTotalPrice: () =>
        get().carts.reduce((total, cart) => total + (cart.discount || 0), 0),
      getCartTotalDiscount: () =>
        get().carts.reduce(
          (total, cart) => total + cart.price - (cart.discount || 0),
          0
        ),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      // Évite le mismatch d'hydratation SSR : le client démarre avec les
      // valeurs par défaut (identiques au serveur), puis on réhydrate
      // manuellement depuis localStorage APRÈS le montage (cf. ProviderSession).
      skipHydration: true,
    }
  )
);

export default useStore;
