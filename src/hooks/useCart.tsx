"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export { TAX_RATE } from "@/lib/constants";

const STORAGE_KEY = "maison-cart";

export type CartProduct = {
  id: string;
  title: string;
  price: number;
  image: string;
  stock: number;
};

export type CartItem = CartProduct & {
  quantity: number;
};

export type AddToCartResult = {
  success: boolean;
  reason?: "out-of-stock" | "max-stock";
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  isHydrated: boolean;
  addToCart: (product: CartProduct, quantity?: number) => AddToCartResult;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount. This has to run in an effect
  // rather than a lazy initializer because localStorage is unavailable during
  // server rendering.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed/inaccessible storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addToCart = useCallback(
    (product: CartProduct, quantity = 1): AddToCartResult => {
      let result: AddToCartResult = { success: true };

      if (product.stock <= 0) {
        return { success: false, reason: "out-of-stock" };
      }

      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        const currentQuantity = existing?.quantity ?? 0;

        if (currentQuantity >= product.stock) {
          result = { success: false, reason: "max-stock" };
          return prev;
        }

        const nextQuantity = Math.min(
          currentQuantity + quantity,
          product.stock
        );

        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: nextQuantity }
              : item
          );
        }

        return [...prev, { ...product, quantity: nextQuantity }];
      });

      return result;
    },
    []
  );

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const clamped = Math.max(1, Math.min(quantity, item.stock));
        return { ...item, quantity: clamped };
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      isOpen,
      isHydrated: hydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      items,
      itemCount,
      subtotal,
      isOpen,
      hydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
