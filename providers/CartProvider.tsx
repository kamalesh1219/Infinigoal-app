import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CartItem = {
  id: string;
  name: string;
  price: number;
  mrp: number;   
  image_url: string;
  qty: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  decrementQty:(id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "@infinigoal_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (stored) setCart(JSON.parse(stored));
      } catch (e) {
        console.log("Failed to load cart", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (e) {
        console.log("Failed to save cart", e);
      }
    })();
  }, [cart]);

  // ADD TO CART
  const addToCart = (item: Omit<CartItem, "qty">) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }

      return [...prev, { ...item,mrp: Number(item.mrp) || item.price, qty: 1 }];
    });
  };

  const decrementQty = (id: string) => {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, qty: item.qty - 1 }
            : item
        )
      );
    };

  // REMOVE ITEM
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = async () => {
    setCart([]);
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, decrementQty }}>
      {children}
    </CartContext.Provider>
  );
}

// HOOK
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
