import crypto from 'node:crypto';
import { env, isMercadoPagoConfigured } from '../config/env.js';
import { getPaymentClient, getPreferenceClient } from '../config/mercadopago.js';
import { getSupabaseClient } from '../config/supabase.js';
import { HttpError } from '../utils/httpError.js';
import {
  mapPaymentRowToDto,
  normalizePaymentMethod,
  normalizePaymentStatus,
} from '../utils/mappers.js';

/**
 * Atualiza o status do pedido e decrementa o estoque dos presentes de forma idempotente
 * apenas na transição do pedido para `paid_confirmed_by_backend`.
 */
export async function syncOrderWithPaymentStatus(supabase, orderId, paymentStatus) {
  if (!orderId) return;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();

  if (orderError || !order) return;

  const normalizedStatus = normalizePaymentStatus(paymentStatus);

  // Idempotência: se o pedido já foi confirmado anteriormente, nunca decrementa o estoque novamente
  if (order.status === 'paid_confirmed_by_backend') {
    return;
  }

  if (normalizedStatus === 'approved') {
    const { data: updatedOrder } = await supabase
      .from('orders')
      .update({ status: 'paid_confirmed_by_backend' })
      .eq('id', orderId)
      .neq('status', 'paid_confirmed_by_backend')
      .select('*')
      .maybeSingle();

    if (updatedOrder && Array.isArray(updatedOrder.items)) {
      for (const item of updatedOrder.items) {
        if (!item?.giftId) continue;
        const { data: giftRow } = await supabase
          .from('gifts')
          .select('id, available_quantity')
          .eq('id', item.giftId)
          .maybeSingle();

        if (giftRow && Number(giftRow.available_quantity) > 0) {
          const deductQty = Math.max(1, Number(item.quantity || 1));
          const nextQty = Math.max(0, Number(giftRow.available_quantity) - deductQty);
          await supabase
            .from('gifts')
            .update({ available_quantity: nextQty })
            .eq('id', giftRow.id);
        }
      }
    }
    return;
  }

  let nextOrderStatus = 'awaiting_payment';
  if (normalizedStatus === 'in_process' || normalizedStatus === 'pending') {
    nextOrderStatus = 'pending_confirmation';
  } else if (normalizedStatus === 'rejected') {
    nextOrderStatus = 'rejected';
  } else if (normalizedStatus === 'cancelled') {
    nextOrderStatus = 'cancelled';
  }

  if (order.status !== nextOrderStatus) {
    await supabase
      .from('orders')
      .update({ status: nextOrderStatus })
      .eq('id', orderId);
  }
}

export async function createOrInitPayment(req, res, next) {
  try {
    const body = req.body || {};
    const action = body.action;
    const rawOrderId = String(body.orderId || '').trim();
    const rawAmount = Number(body.amount ?? 0);

    // 1. Inicialização de sessão do Mercado Pago Payment Brick (action === 'init_brick')
    if (action === 'init_brick') {
      const orderId = rawOrderId || 'PREVIEW-ORDER';
      let authoritativeAmount =
        Number.isFinite(rawAmount) && rawAmount > 0
          ? Math.round(rawAmount * 100) / 100
          : 100;

      // Se for um pedido real já salvo, usa o valor autoritativo calculado no servidor
      if (orderId !== 'PREVIEW-ORDER') {
        const supabase = getSupabaseClient();
        const { data: orderRow } = await supabase
          .from('orders')
          .select('id, total')
          .eq('id', orderId)
          .maybeSingle();

        if (orderRow) {
          authoritativeAmount = Number(orderRow.total);
        }
      }

      if (!isMercadoPagoConfigured()) {
        return res.json({
          preferenceId: `pref-preview-${orderId.toLowerCase()}`,
          publicKeyConfigured: false,
          publicKeyPreview: 'Configure MP_ACCESS_TOKEN no backend',
          brickReadyToMount: false,
          backendNote:
            'Backend conectado! Configure MP_ACCESS_TOKEN no .env do casorio-backend para gerar preferências reais no Mercado Pago.',
        });
      }

      const preference = getPreferenceClient();
      const result = await preference.create({
        body: {
          items: [
            {
              id: orderId,
              title: `Presente Lua de Mel Daniel & Yohana (${orderId})`,
              quantity: 1,
              currency_id: 'BRL',
              unit_price: Number(authoritativeAmount),
            },
          ],
          external_reference: orderId,
          notification_url: `${env.backendPublicUrl}/api/webhooks/mercadopago`,
        },
      });

      const hasPublicKey =
        Boolean(env.mpPublicKey) &&
        !env.mpPublicKey.includes('sua-public-key-aqui');

      return res.json({
        preferenceId: result.id,
        publicKeyConfigured: true,
        publicKeyPreview: hasPublicKey
          ? `${env.mpPublicKey.slice(0, 12)}...`
          : 'Configurada no Frontend (.env)',
        brickReadyToMount: true,
        backendNote: 'Sessão Mercado Pago iniciada pelo backend.',
      });
    }

    // 2. Criação / Processamento de Pagamento vinculado a um Pedido real
    if (!rawOrderId) {
      throw new HttpError(400, 'O código do pedido (orderId) é obrigatório.');
    }

    const supabase = getSupabaseClient();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', rawOrderId)
      .maybeSingle();

    if (orderError || !order) {
      throw new HttpError(404, 'Pedido não encontrado para processar o pagamento.');
    }

    const authoritativeAmount = Number(order.total);
    if (!Number.isFinite(authoritativeAmount) || authoritativeAmount <= 0) {
      throw new HttpError(400, 'Valor total do pedido inválido.');
    }

    // Idempotência: verifica se já existe pagamento aprovado ou pendente para este pedido
    const { data: existingPayments } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', order.id)
      .order('created_at', { ascending: false });

    const approvedPayment = (existingPayments || []).find(
      (p) => normalizePaymentStatus(p.status) === 'approved' && p.verified_by_backend
    );

    if (approvedPayment) {
      return res.json(mapPaymentRowToDto(approvedPayment));
    }

    const formData =
      body.formData && typeof body.formData === 'object' ? body.formData : null;

    // Caso o Payment Brick envie o payload completo de transação (formData com payment_method_id / token)
    if (formData && (formData.payment_method_id || formData.token)) {
      const paymentClient = getPaymentClient();
      const idempotencyKey =
        req.headers['x-idempotency-key'] ||
        crypto
          .createHash('sha256')
          .update(`${order.id}-${formData.payment_method_id || 'brick'}-${authoritativeAmount}`)
          .digest('hex');

      const mpRes = await paymentClient.create({
        body: {
          ...formData,
          transaction_amount: authoritativeAmount,
          description:
            formData.description ||
            `Presente Lua de Mel Daniel & Yohana (${order.id})`,
          external_reference: order.id,
          payer: {
            email: formData?.payer?.email || order.buyer_email,
            first_name: formData?.payer?.first_name || order.buyer_name,
            ...(formData?.payer || {}),
          },
          notification_url: `${env.backendPublicUrl}/api/webhooks/mercadopago`,
        },
        requestOptions: {
          idempotencyKey: String(idempotencyKey),
        },
      });

      const status = normalizePaymentStatus(mpRes.status);
      const verifiedByBackend = status === 'approved';
      const paymentRow = {
        payment_id: String(mpRes.id),
        order_id: order.id,
        status,
        status_detail:
          mpRes.status_detail || 'Processado via Mercado Pago Payment Brick.',
        amount: authoritativeAmount,
        payment_method: normalizePaymentMethod(
          mpRes.payment_method_id || body.paymentMethod
        ),
        verified_by_backend: verifiedByBackend,
        created_at: new Date().toISOString(),
      };

      const { data: savedPayment, error: saveError } = await supabase
        .from('payments')
        .upsert(paymentRow, { onConflict: 'payment_id' })
        .select('*')
        .single();

      if (saveError) {
        throw new HttpError(
          500,
          `Erro ao salvar registro de pagamento: ${saveError.message}`
        );
      }

      await syncOrderWithPaymentStatus(supabase, order.id, status);
      return res.json(mapPaymentRowToDto(savedPayment));
    }

    // Caso o frontend chame createPayment({ orderId, amount, paymentMethod }) sem formData de cartão direto:
    // Se já houver um pagamento pendente criado para este pedido, retorna o existente (idempotência)
    const existingPending = (existingPayments || []).find(
      (p) => normalizePaymentStatus(p.status) === 'pending'
    );
    if (existingPending) {
      return res.json(mapPaymentRowToDto(existingPending));
    }

    let preferenceId = undefined;
    if (isMercadoPagoConfigured()) {
      try {
        const preferenceClient = getPreferenceClient();
        const prefResult = await preferenceClient.create({
          body: {
            items: order.items.map((item) => ({
              id: item.giftId,
              title: item.giftName,
              quantity: Number(item.quantity),
              currency_id: 'BRL',
              unit_price: Number(item.unitPrice),
            })),
            payer: {
              name: order.buyer_name,
              email: order.buyer_email,
            },
            external_reference: order.id,
            notification_url: `${env.backendPublicUrl}/api/webhooks/mercadopago`,
          },
        });
        preferenceId = prefResult.id;
      } catch (prefErr) {
        console.warn(
          '[MercadoPago] Aviso ao criar preferência para o pedido:',
          prefErr?.message || prefErr
        );
      }
    }

    const generatedPaymentId = preferenceId
      ? `MP-PREF-${order.id}`
      : `MP-ORD-${order.id}`;

    const pendingRow = {
      payment_id: generatedPaymentId,
      order_id: order.id,
      status: 'pending',
      status_detail:
        'Pedido registrado no servidor. Aguardando confirmação oficial de pagamento via Mercado Pago.',
      amount: authoritativeAmount,
      payment_method: normalizePaymentMethod(body.paymentMethod),
      verified_by_backend: false,
      created_at: new Date().toISOString(),
    };

    const { data: savedPending, error: pendingError } = await supabase
      .from('payments')
      .upsert(pendingRow, { onConflict: 'payment_id' })
      .select('*')
      .single();

    if (pendingError) {
      throw new HttpError(
        500,
        `Não foi possível registrar o pagamento: ${pendingError.message}`
      );
    }

    await syncOrderWithPaymentStatus(supabase, order.id, 'pending');
    return res.json(mapPaymentRowToDto(savedPending, preferenceId));
  } catch (err) {
    return next(err);
  }
}

export async function getPaymentStatus(req, res, next) {
  try {
    const paymentId = String(req.params.id || '').trim();
    if (!paymentId) {
      throw new HttpError(400, 'Identificador do pagamento inválido.');
    }

    const supabase = getSupabaseClient();
    let { data: paymentRow, error } = await supabase
      .from('payments')
      .select('*')
      .eq('payment_id', paymentId)
      .maybeSingle();

    if (error) {
      throw new HttpError(
        500,
        `Erro ao consultar status do pagamento: ${error.message}`
      );
    }

    if (!paymentRow) {
      throw new HttpError(404, 'Pagamento não encontrado.');
    }

    // Se o pagamento ainda não estiver aprovado e for um ID numérico real do Mercado Pago,
    // consulta proativamente a API do Mercado Pago para garantir status sempre atualizado
    const isNumericMpId = /^\d+$/.test(paymentRow.payment_id);
    if (
      !paymentRow.verified_by_backend &&
      isMercadoPagoConfigured() &&
      isNumericMpId
    ) {
      try {
        const paymentClient = getPaymentClient();
        const mpData = await paymentClient.get({ id: paymentRow.payment_id });
        if (mpData && mpData.id) {
          const latestStatus = normalizePaymentStatus(mpData.status);
          const verified = latestStatus === 'approved';
          const { data: updatedRow } = await supabase
            .from('payments')
            .update({
              status: latestStatus,
              status_detail: mpData.status_detail || paymentRow.status_detail,
              payment_method: normalizePaymentMethod(
                mpData.payment_method_id || paymentRow.payment_method
              ),
              verified_by_backend: verified,
            })
            .eq('payment_id', paymentRow.payment_id)
            .select('*')
            .single();

          if (updatedRow) {
            paymentRow = updatedRow;
          }
          await syncOrderWithPaymentStatus(
            supabase,
            paymentRow.order_id,
            latestStatus
          );
        }
      } catch (mpErr) {
        console.warn(
          `[MercadoPago] Não foi possível atualizar status online do pagamento ${paymentRow.payment_id}:`,
          mpErr?.message || mpErr
        );
      }
    }

    // Caso o webhook tenha confirmado outro pagamento numérico para o mesmo pedido (substituindo o registro de preferência inicial)
    if (!paymentRow.verified_by_backend && paymentRow.order_id) {
      const { data: orderPayments } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', paymentRow.order_id)
        .order('created_at', { ascending: false });

      const confirmedForSameOrder = (orderPayments || []).find(
        (p) => p.verified_by_backend && normalizePaymentStatus(p.status) === 'approved'
      );

      if (confirmedForSameOrder) {
        paymentRow = confirmedForSameOrder;
      }
    }

    return res.json(mapPaymentRowToDto(paymentRow));
  } catch (err) {
    return next(err);
  }
}
