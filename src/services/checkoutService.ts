import { CartItem, Order, OrderItemPayload } from '../types';
import { apiFetch, envConfig, simulateNetworkDelay } from './apiClient';
import { cartService } from './cartService';
import { giftService } from './giftService';

const STORAGE_KEY_ORDERS = 'dy_wedding_orders_v1';

export interface CreateOrderInput {
  items: CartItem[];
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message?: string;
}

function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function saveStoredOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  } catch {
    // Ignora
  }
}

export const checkoutService = {
  /**
   * Endpoint futuro: POST /api/orders
   * Cria o pedido com status inicial 'awaiting_payment'.
   * IMPORTANTE: O pedido NUNCA nasce como pago no frontend.
   */
  async createOrder(input: CreateOrderInput): Promise<Order> {
    const itemsPayload: OrderItemPayload[] = input.items.map((item) => {
      const unitPrice = cartService.getItemUnitPrice(item);
      return {
        giftId: item.gift.id,
        giftName: item.gift.name,
        quantity: item.quantity,
        unitPrice,
        isPartialContribution: item.isPartialContribution,
        totalItemPrice: unitPrice * item.quantity,
      };
    });

    const { subtotal, total } = cartService.calculateTotals(input.items);

    if (!envConfig.useMockApi) {
      return apiFetch<Order>('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: itemsPayload,
          buyerName: input.buyerName,
          buyerEmail: input.buyerEmail,
          buyerPhone: input.buyerPhone,
          message: input.message,
          subtotal,
          total,
        }),
      });
    }

    await simulateNetworkDelay(550);

    const newOrder: Order = {
      id: `PED-${Date.now().toString().slice(-6)}`,
      items: itemsPayload,
      buyerName: input.buyerName.trim(),
      buyerEmail: input.buyerEmail.trim(),
      buyerPhone: input.buyerPhone.trim(),
      message: input.message?.trim() || undefined,
      subtotal,
      total,
      status: 'awaiting_payment',
      createdAt: new Date().toISOString(),
    };

    const existing = getStoredOrders();
    saveStoredOrders([newOrder, ...existing]);
    giftService.markGiftReservedInMock(itemsPayload.map((i) => i.giftId));

    return newOrder;
  },

  getOrderByIdFromMock(orderId: string): Order | null {
    const orders = getStoredOrders();
    return orders.find((o) => o.id === orderId) || null;
  },
};
