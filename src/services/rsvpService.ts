import { CreateRSVPPayload, RSVPSubmission, UpdateRSVPPayload } from '../types';
import { apiFetch, envConfig, simulateNetworkDelay } from './apiClient';

const STORAGE_KEY_RSVP_LIST = 'dy_wedding_rsvps_v1';
const STORAGE_KEY_LAST_TOKEN = 'dy_wedding_last_rsvp_token_v1';

function getStoredRSVPs(): RSVPSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RSVP_LIST);
    return raw ? (JSON.parse(raw) as RSVPSubmission[]) : [];
  } catch {
    return [];
  }
}

function saveStoredRSVPs(list: RSVPSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_RSVP_LIST, JSON.stringify(list));
  } catch {
    // Ignora
  }
}

function generateRSVPToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'DY-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const rsvpService = {
  /**
   * Endpoint futuro: POST /api/rsvp
   */
  async createRSVP(payload: CreateRSVPPayload): Promise<RSVPSubmission> {
    if (!envConfig.useMockApi) {
      return apiFetch<RSVPSubmission>('/api/rsvp', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    await simulateNetworkDelay(600);

    const now = new Date().toISOString();
    const token = generateRSVPToken();
    const submission: RSVPSubmission = {
      ...payload,
      id: `rsvp_${Date.now()}`,
      token,
      createdAt: now,
      updatedAt: now,
    };

    const current = getStoredRSVPs();
    saveStoredRSVPs([submission, ...current]);
    try {
      localStorage.setItem(STORAGE_KEY_LAST_TOKEN, token);
    } catch {
      // Ignora
    }

    return submission;
  },

  /**
   * Endpoint futuro: GET /api/rsvp/:token
   * Permite buscar confirmação anterior pelo código/token ou e-mail para edição posterior.
   */
  async getRSVPByToken(tokenOrCode: string): Promise<RSVPSubmission | null> {
    const normalized = tokenOrCode.trim().toUpperCase();
    if (!normalized) return null;

    if (!envConfig.useMockApi) {
      return apiFetch<RSVPSubmission>(`/api/rsvp/${encodeURIComponent(normalized)}`);
    }

    await simulateNetworkDelay(350);
    const list = getStoredRSVPs();
    return (
      list.find(
        (item) =>
          item.token.toUpperCase() === normalized ||
          item.email.toUpperCase() === normalized ||
          (item.inviteCode && item.inviteCode.toUpperCase() === normalized)
      ) || null
    );
  },

  /**
   * Endpoint futuro: PUT /api/rsvp/:token
   */
  async updateRSVP(token: string, payload: UpdateRSVPPayload): Promise<RSVPSubmission> {
    const normalized = token.trim().toUpperCase();

    if (!envConfig.useMockApi) {
      return apiFetch<RSVPSubmission>(`/api/rsvp/${encodeURIComponent(normalized)}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    }

    await simulateNetworkDelay(550);
    const list = getStoredRSVPs();
    const index = list.findIndex((item) => item.token.toUpperCase() === normalized);

    if (index === -1) {
      throw new Error('Confirmação não encontrada para o código informado.');
    }

    const updated: RSVPSubmission = {
      ...list[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    saveStoredRSVPs(list);
    return updated;
  },

  getLastSavedToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY_LAST_TOKEN);
    } catch {
      return null;
    }
  },
};
