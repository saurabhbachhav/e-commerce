"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description:string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (payload: { product: Product; quantity: number }) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  fetchCartItems: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const fetchCartItems = useCallback(async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`/api/cart?userId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart items:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const addToCart = async ({
    product,
    quantity,
  }: {
    product: Product;
    quantity: number;
  }) => {
    if (!user?.id) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          item: { productId: product._id, quantity }, // Fix: Use product._id as productId
        }),
      });
      alert("Product Added succesfully to Cart");
    } catch (err) {
      console.error("Error syncing cart after add:", err);
    }
    
  
  };
  

  const removeFromCart = async (productId: string) => {
    if (!user?.id) return;

    setCart((prev) => prev.filter((item) => item.product._id !== productId));

    try {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, productId }),
      });
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  };

  const clearCart = async () => {
  
    if (!user?.id) return;
    setCart([]);
    try {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, fetchCartItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
