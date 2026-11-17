import { INITIAL_MOCK_GIFTS } from '../data/mockGifts';
import { Gift, GiftAvailabilityStatus } from '../types';
import { apiFetch, envConfig, simulateNetworkDelay } from './apiClient';

const STORAGE_KEY_GIFTS = 'dy_wedding_gifts_v3';
const STORAGE_KEY_RESERVED_IDS = 'dy_wedding_reserved_gifts_v3';

function getStoredGifts(): Gift[] {
  return INITIAL_MOCK_GIFTS;
}

function getReservedGiftIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESERVED_IDS);
    return raw ? (JSON.parse(raw) as string[]) : ['gift-curso-culinaria-casal'];
  } catch {
    return ['gift-curso-culinaria-casal'];
  }
}

export const giftService = {
  /**
   * Endpoint futuro: GET /api/gifts
   */
  async getGifts(): Promise<Gift[]> {
    if (!envConfig.useMockApi) {
      return apiFetch<Gift[]>('/api/gifts');
    }

    await simulateNetworkDelay(320);
    return getStoredGifts().filter((g) => g.active);
  },

  /**
   * Endpoint futuro: GET /api/gifts/:id
   */
  async getGiftById(id: string): Promise<Gift | null> {
    if (!envConfig.useMockApi) {
      return apiFetch<Gift>(`/api/gifts/${encodeURIComponent(id)}`);
    }

    await simulateNetworkDelay(220);
    const gifts = getStoredGifts();
    return gifts.find((g) => g.id === id && g.active) || null;
  },

  /**
   * Determina o status visual do presente (disponível, reservado ou esgotado)
   */
  getAvailabilityStatus(gift: Gift): GiftAvailabilityStatus {
    if (gift.availableQuantity <= 0) {
      return 'sold_out';
    }
    const reservedIds = getReservedGiftIds();
    if (reservedIds.includes(gift.id) && gift.availableQuantity === 1) {
      return 'reserved';
    }
    return 'available';
  },

  /**
   * No modo mock, registra reserva temporária de item quando um pedido pendente é criado.
   * Na produção, o próprio backend gerencia o estoque ao processar POST /api/orders e webhooks.
   */
  markGiftReservedInMock(giftIds: string[]): void {
    if (!envConfig.useMockApi) return;
    try {
      const current = new Set(getReservedGiftIds());
      giftIds.forEach((id) => current.add(id));
      localStorage.setItem(STORAGE_KEY_RESERVED_IDS, JSON.stringify(Array.from(current)));
    } catch {
      // Ignora erros de quota do localStorage
    }
  },
};
