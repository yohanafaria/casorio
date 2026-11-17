/**
 * Adapter de configuração de ambiente para comunicação com Backend e Mercado Pago.
 *
 * IMPORTANTE (Segurança):
 * - NUNCA adicione Access Token, Client Secret ou chaves privadas aqui.
 * - Apenas a Public Key do Mercado Pago (`VITE_MERCADO_PAGO_PUBLIC_KEY`) pode existir no navegador.
 */

export const envConfig = {
  useMockApi: import.meta.env.VITE_USE_MOCK_API !== 'false',
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333').replace(/\/$/, ''),
  mercadoPagoPublicKey: import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || '',
};

export async function simulateNetworkDelay(ms = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${envConfig.apiBaseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody.message || `Erro na comunicação com o servidor (${response.status}).`
    );
  }

  return response.json() as Promise<T>;
}
