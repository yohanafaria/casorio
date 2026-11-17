import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, Gift } from '../../types';
import { cartService } from '../../services/cartService';

interface CartContextValue {
  items: CartItem[];
  subtotal: number;
  total: number;
  totalItemsCount: number;
  isCartDrawerOpen: boolean;
  recentlyAddedId: string | null;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  addToCart: (
    gift: Gift,
    quantity?: number,
    isPartialContribution?: boolean,
    customAmount?: number
  ) => void;
  updateQuantity: (index: number, nextQuantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => cartService.getCart());
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  useEffect(() => {
    cartService.saveCart(items);
  }, [items]);

  const openCartDrawer = useCallback(() => setIsCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setIsCartDrawerOpen(false), []);

  const addToCart = useCallback(
    (
      gift: Gift,
      quantity = 1,
      isPartialContribution = false,
      customAmount?: number
    ) => {
      setItems((prev) =>
        cartService.addItem(prev, gift, quantity, isPartialContribution, customAmount)
      );
      setRecentlyAddedId(gift.id);
      setTimeout(() => {
        setRecentlyAddedId((current) => (current === gift.id ? null : current));
      }, 1400);
    },
    []
  );

  const updateQuantity = useCallback((index: number, nextQuantity: number) => {
    setItems((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      if (nextQuantity <= 0) {
        const filtered = prev.filter((_, i) => i !== index);
        cartService.saveCart(filtered);
        return filtered;
      }
      const next = [...prev];
      const maxQty = next[index].gift.availableQuantity;
      next[index] = {
        ...next[index],
        quantity: Math.min(nextQuantity, maxQty),
      };
      cartService.saveCart(next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      cartService.saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    cartService.clearCart();
    setItems([]);
  }, []);

  const { subtotal, total, totalItemsCount } = cartService.calculateTotals(items);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        total,
        totalItemsCount,
        isCartDrawerOpen,
        recentlyAddedId,
        openCartDrawer,
        closeCartDrawer,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart deve ser utilizado dentro de um CartProvider');
  }
  return ctx;
}
