import crypto from 'node:crypto';
import { env, isMercadoPagoConfigured } from '../config/env.js';
import { getPaymentClient } from '../config/mercadopago.js';
import { getSupabaseClient } from '../config/supabase.js';
import {
  normalizePaymentMethod,
  normalizePaymentStatus,
} from '../utils/mappers.js';
import { syncOrderWithPaymentStatus } from './paymentController.js';

function verifyMercadoPagoSignature(req, dataId) {
  if (!env.mpWebhookSecret) {
    return true; // Se MP_WEBHOOK_SECRET não estiver definido no .env, delega validação para paymentClient.get({ id })
  }

  const xSignature = req.headers['x-signature'];
  const xRequestId = req.headers['x-request-id'];

  if (!xSignature || !xRequestId || !dataId) {
    return false;
  }

  const parts = String(xSignature).split(',');
  let ts = '';
  let v1 = '';

  for (const part of parts) {
    const [key, value] = part.split('=').map((s) => s.trim());
    if (key === 'ts') ts = value;
    if (key === 'v1') v1 = value;
  }

  if (!ts || !v1) {
    return false;
  }

  const manifest = `id:${String(dataId).toLowerCase()};request-id:${xRequestId};ts:${ts};`;
  const expectedHash = crypto
    .createHmac('sha256', env.mpWebhookSecret)
    .update(manifest)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedHash, 'hex'),
      Buffer.from(v1, 'hex')
    );
  } catch {
    return false;
  }
}

export async function handleMercadoPagoWebhook(req, res) {
  const paymentId =
    req.body?.data?.id ||
    req.query?.['data.id'] ||
    (req.query?.topic === 'payment' ? req.query?.id : undefined);

  if (!paymentId) {
    return res.status(200).json({ received: true });
  }

  const isSignatureValid = verifyMercadoPagoSignature(req, paymentId);
  if (!isSignatureValid) {
    console.warn(
      `[Webhook MercadoPago] Assinatura x-signature inválida para o evento ${paymentId}.`
    );
    return res.status(401).json({ message: 'Assinatura de webhook inválida.' });
  }

  if (!isMercadoPagoConfigured()) {
    return res.status(200).json({ received: true, configured: false });
  }

  try {
    const paymentClient = getPaymentClient();
    const mpData = await paymentClient.get({ id: String(paymentId) });

    if (!mpData || !mpData.id) {
      return res.status(200).json({ received: true });
    }

    const orderId = mpData.external_reference || null;
    const status = normalizePaymentStatus(mpData.status);
    const verifiedByBackend = status === 'approved';
    const amount = Number(mpData.transaction_amount ?? 0);

    const supabase = getSupabaseClient();

    await supabase.from('payments').upsert(
      {
        payment_id: String(mpData.id),
        order_id: orderId,
        status,
        status_detail: mpData.status_detail || 'Atualizado via Webhook Mercado Pago.',
        amount,
        payment_method: normalizePaymentMethod(mpData.payment_method_id),
        verified_by_backend: verifiedByBackend,
      },
      { onConflict: 'payment_id' }
    );

    if (orderId) {
      // Também atualiza eventual registro preliminar MP-PREF-${orderId} ou MP-ORD-${orderId}
      await supabase
        .from('payments')
        .update({
          status,
          status_detail: mpData.status_detail || 'Confirmado via Webhook Mercado Pago.',
          verified_by_backend: verifiedByBackend,
        })
        .eq('order_id', orderId)
        .in('payment_id', [`MP-PREF-${orderId}`, `MP-ORD-${orderId}`]);

      await syncOrderWithPaymentStatus(supabase, orderId, status);
    }
  } catch (err) {
    console.error('[Webhook MercadoPago] Erro ao validar notificação:', err);
  }

  return res.status(200).json({ received: true });
}
