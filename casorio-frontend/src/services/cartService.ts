import { CartItem, Gift } from '../types';

const STORAGE_KEY_CART = 'dy_wedding_cart_v1';

export const cartService = {
  getCart(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CART);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  },

  saveCart(items: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
    } catch {
      // Ignora falha de escrita em modo privado restrito
    }
  },

  clearCart(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_CART);
    } catch {
      // Ignora
    }
  },

  getItemUnitPrice(item: CartItem): number {
    if (item.isPartialContribution && item.customAmount && item.customAmount > 0) {
      return item.customAmount;
    }
    return item.gift.price;
  },

  getItemSubtotal(item: CartItem): number {
    return this.getItemUnitPrice(item) * item.quantity;
  },

  calculateTotals(items: CartItem[]): {
    subtotal: number;
    total: number;
    totalItemsCount: number;
  } {
    const subtotal = items.reduce((acc, item) => acc + this.getItemSubtotal(item), 0);
    const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
    return {
      subtotal,
      total: subtotal,
      totalItemsCount,
    };
  },

  addItem(
    currentItems: CartItem[],
    gift: Gift,
    quantity = 1,
    isPartialContribution = false,
    customAmount?: number
  ): CartItem[] {
    if (gift.availableQuantity <= 0) return currentItems;

    const existingIndex = currentItems.findIndex(
      (i) =>
        i.gift.id === gift.id &&
        i.isPartialContribution === isPartialContribution &&
        (!isPartialContribution || i.customAmount === customAmount)
    );

    if (existingIndex > -1) {
      const updated = [...currentItems];
      const existing = updated[existingIndex];
      const maxAllowed = gift.availableQuantity;
      const nextQty = Math.min(existing.quantity + quantity, maxAllowed);
      updated[existingIndex] = { ...existing, quantity: nextQty };
      this.saveCart(updated);
      return updated;
    }

    const clampedQty = Math.min(Math.max(1, quantity), gift.availableQuantity);
    const nextItems: CartItem[] = [
      ...currentItems,
      {
        gift,
        quantity: clampedQty,
        isPartialContribution,
        customAmount: isPartialContribution ? customAmount : undefined,
      },
    ];
    this.saveCart(nextItems);
    return nextItems;
  },
};
