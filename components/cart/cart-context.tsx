"use client";

import { decrementCart, getCartTotal, incrementCart } from "@/lib/utils";
import { Cart, CartItem } from "@/types";
import { CartSchema } from "@/types/zod-schemas";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ShoppingCartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, action: "plus" | "minus") => void;
  toggleCart: () => void;
  isCartOpen: boolean;
}

export const CartContext = createContext<ShoppingCartContextType | undefined>(
  undefined
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart>({ items: [], totalAmount: 0 });

  useEffect(() => {
    if (localStorage) {
      const localCart = localStorage.getItem("cart");
      if (localCart) {
        const localCartJson = JSON.parse(localCart);
        const result = CartSchema.safeParse(localCartJson);
        if (result.success) setCart(result.data);
      }
    }
  }, []);

  function addToCart(item: CartItem) {
    setCart((prevCart) => {
      const existingIndex = prevCart.items.findIndex((i) => i.id === item.id);

      if (existingIndex !== -1) {
        const updatedCart = incrementCart(prevCart, existingIndex);
        return updatedCart;
      }

      prevCart.items.push({
        ...item,
        subTotal: item.price,
      });

      prevCart.totalAmount = getCartTotal(prevCart.items);
      return prevCart;
    });
    toggleCart();
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function removeFromCart(itemId: string) {
    setCart((prev) => {
      const updatedCartItems = prev.items.filter((i) => i.id !== itemId);
      return {
        ...prev,
        totalAmount: getCartTotal(updatedCartItems),
        items: updatedCartItems,
      };
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartItem(itemId: string, action: "plus" | "minus") {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex((i) => i.id === itemId);

      if (existingIndex !== -1) {
        let updatedCart;
        switch (action) {
          case "plus":
            updatedCart = incrementCart(cart, existingIndex);
            break;
          case "minus":
            updatedCart = decrementCart(cart, existingIndex);
            break;
        }
        return updatedCart;
      }

      return prev;
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function toggleCart() {
    setIsOpen((prevState) => !prevState);
  }

  const contextValue: ShoppingCartContextType = {
    cart,
    addToCart,
    removeFromCart,
    toggleCart,
    isCartOpen: isOpen,
    updateCartItem,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Custom Hook to get the CartContext

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartContext Provider");
  }
  return context;
}
