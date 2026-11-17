import { Payment, PaymentStatus } from '../types';
import { apiFetch, envConfig, simulateNetworkDelay } from './apiClient';

const STORAGE_KEY_PAYMENTS = 'dy_wedding_payments_v1';

export interface InitializePaymentResponse {
  preferenceId: string;
  publicKeyConfigured: boolean;
  publicKeyPreview: string;
  brickReadyToMount: boolean;
  backendNote: string;
}

export interface CreatePaymentInput {
  orderId: string;
  amount: number;
  paymentMethod: Payment['paymentMethod'];
  /**
   * Apenas para demonstração dos estados visuais da UI no modo mock
   * ('pending' | 'rejected' | 'backend_confirmed_preview').
   * Nunca confirma pagamento de forma autônoma sem validação do backend.
   */
  mockScenario?: 'pending' | 'rejected' | 'backend_confirmed_preview';
}

function getStoredPayments(): Payment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PAYMENTS);
    return raw ? (JSON.parse(raw) as Payment[]) : [];
  } catch {
    return [];
  }
}

function saveStoredPayment(payment: Payment): void {
  try {
    const current = getStoredPayments().filter((p) => p.paymentId !== payment.paymentId);
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify([payment, ...current]));
  } catch {
    // Ignora
  }
}

export const paymentService = {
  /**
   * Prepara a configuração para inicialização do Mercado Pago Payment Brick no navegador.
   *
   * ARQUITETURA DE SEGURANÇA:
   * 1. O frontend lê apenas `VITE_MERCADO_PAGO_PUBLIC_KEY`.
   * 2. O backend será responsável por chamar a API do Mercado Pago usando o ACCESS_TOKEN
   *    privado para gerar o `preferenceId` e processar o pagamento no `onSubmit` do Brick.
   * 3. O status definitivo depende do webhook do Mercado Pago no backend.
   */
  async preparePaymentBrickSession(orderId: string, amount: number): Promise<InitializePaymentResponse> {
    const hasPublicKey = Boolean(envConfig.mercadoPagoPublicKey.trim());

    if (!envConfig.useMockApi) {
      return apiFetch<InitializePaymentResponse>('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify({ orderId, amount, action: 'init_brick' }),
      });
    }

    await simulateNetworkDelay(650);

    return {
      preferenceId: `mock-pref-${orderId.toLowerCase()}`,
      publicKeyConfigured: hasPublicKey,
      publicKeyPreview: hasPublicKey
        ? `${envConfig.mercadoPagoPublicKey.slice(0, 12)}...`
        : 'Não definida (.env)',
      brickReadyToMount: false, // Só monta o SDK real quando conectado ao backend real
      backendNote:
        'A criação da preferência, montagem ativa do Payment Brick, processamento do pagamento, webhook e confirmação de status dependem da integração com o backend.',
    };
  },

  /**
   * Endpoint futuro: POST /api/payments/create
   */
  async createPayment(input: CreatePaymentInput): Promise<Payment> {
    if (!envConfig.useMockApi) {
      return apiFetch<Payment>('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify({
          orderId: input.orderId,
          amount: input.amount,
          paymentMethod: input.paymentMethod,
        }),
      });
    }

    await simulateNetworkDelay(700);

    let status: PaymentStatus = 'pending';
    let statusDetail =
      'Pedido registrado em modo demonstração. Aguardando integração com o backend e confirmação via webhook do Mercado Pago.';
    let verifiedByBackend = false;

    if (input.mockScenario === 'rejected') {
      status = 'rejected';
      statusDetail =
        'Simulação de pagamento recusado pelo emissor ou gateway (estado visual de recusa).';
    } else if (input.mockScenario === 'backend_confirmed_preview') {
      status = 'approved';
      statusDetail =
        'Visualização de tela de sucesso (em produção, este estado só é exibido após GET /api/payments/:id/status confirmar o webhook no backend).';
      verifiedByBackend = false; // Explicitamente falso no mock para reforçar que não é pagamento real
    }

    const payment: Payment = {
      orderId: input.orderId,
      paymentId: `MP-MOCK-${Date.now().toString().slice(-6)}`,
      status,
      statusDetail,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      createdAt: new Date().toISOString(),
      verifiedByBackend,
      preferenceId: `pref_${input.orderId}`,
    };

    saveStoredPayment(payment);
    return payment;
  },

  /**
   * Endpoint futuro: GET /api/payments/:id/status
   * Consulta o status confirmado pelo servidor (nunca confie apenas no retorno do navegador).
   */
  async getPaymentStatus(paymentId: string): Promise<Payment | null> {
    if (!envConfig.useMockApi) {
      return apiFetch<Payment>(`/api/payments/${encodeURIComponent(paymentId)}/status`);
    }

    await simulateNetworkDelay(400);
    const payments = getStoredPayments();
    return payments.find((p) => p.paymentId === paymentId) || null;
  },
};
