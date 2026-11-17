import { getSupabaseClient } from '../config/supabase.js';
import { HttpError } from '../utils/httpError.js';
import { mapOrderRowToDto } from '../utils/mappers.js';
import { generateOrderId, validateCreateOrderPayload } from '../utils/validators.js';

const MIN_PARTIAL_CONTRIBUTION = 50;

export async function createOrder(req, res, next) {
  try {
    const validated = validateCreateOrderPayload(req.body);
    const supabase = getSupabaseClient();

    const uniqueGiftIds = Array.from(
      new Set(validated.items.map((item) => item.giftId))
    );

    const { data: giftsFromDb, error: giftsError } = await supabase
      .from('gifts')
      .select('*')
      .in('id', uniqueGiftIds)
      .eq('active', true);

    if (giftsError) {
      throw new HttpError(
        500,
        `Erro ao validar presentes no banco de dados: ${giftsError.message}`
      );
    }

    const giftsMap = new Map((giftsFromDb || []).map((g) => [g.id, g]));

    // Soma a quantidade total solicitada por giftId no pedido
    const requestedQtyByGift = new Map();
    for (const item of validated.items) {
      requestedQtyByGift.set(
        item.giftId,
        (requestedQtyByGift.get(item.giftId) || 0) + item.quantity
      );
    }

    for (const [giftId, totalRequestedQty] of requestedQtyByGift.entries()) {
      const dbGift = giftsMap.get(giftId);
      if (!dbGift) {
        throw new HttpError(
          404,
          `O presente "${giftId}" não foi encontrado ou não está mais ativo.`
        );
      }

      const availableQty = Number(dbGift.available_quantity ?? 0);
      if (availableQty <= 0) {
        throw new HttpError(
          409,
          `O presente "${dbGift.name}" já foi presenteado e está esgotado.`
        );
      }

      if (totalRequestedQty > availableQty) {
        throw new HttpError(
          409,
          `Quantidade indisponível para "${dbGift.name}". Disponível: ${availableQty}.`
        );
      }
    }

    // Recalcula preços exclusivamente no backend a partir da tabela gifts
    const authoritativeItems = validated.items.map((item) => {
      const dbGift = giftsMap.get(item.giftId);
      const dbPrice = Number(dbGift.price);
      const allowsPartial = Boolean(dbGift.allow_partial_contribution);

      let authoritativeUnitPrice = dbPrice;

      if (item.isPartialContribution) {
        if (!allowsPartial) {
          throw new HttpError(
            400,
            `O presente "${dbGift.name}" não permite contribuição parcial por cota.`
          );
        }

        if (
          item.requestedUnitPrice < MIN_PARTIAL_CONTRIBUTION ||
          item.requestedUnitPrice > dbPrice
        ) {
          throw new HttpError(
            400,
            `O valor da cota para "${dbGift.name}" deve estar entre R$ ${MIN_PARTIAL_CONTRIBUTION},00 e R$ ${dbPrice.toFixed(2)}.`
          );
        }

        authoritativeUnitPrice = Math.round(item.requestedUnitPrice * 100) / 100;
      }

      const totalItemPrice =
        Math.round(authoritativeUnitPrice * item.quantity * 100) / 100;

      return {
        giftId: dbGift.id,
        giftName: dbGift.name,
        quantity: item.quantity,
        unitPrice: authoritativeUnitPrice,
        isPartialContribution: item.isPartialContribution,
        totalItemPrice,
      };
    });

    const safeSubtotal =
      Math.round(
        authoritativeItems.reduce((acc, item) => acc + item.totalItemPrice, 0) * 100
      ) / 100;

    if (safeSubtotal <= 0) {
      throw new HttpError(400, 'O valor total do pedido deve ser maior que zero.');
    }

    let orderId = generateOrderId();
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await supabase
        .from('orders')
        .select('id')
        .eq('id', orderId)
        .maybeSingle();
      if (!existing.data) break;
      orderId = generateOrderId();
    }

    const { data: createdOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        items: authoritativeItems,
        buyer_name: validated.buyerName,
        buyer_email: validated.buyerEmail,
        buyer_phone: validated.buyerPhone,
        message: validated.message || null,
        subtotal: safeSubtotal,
        total: safeSubtotal,
        status: 'awaiting_payment',
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (orderError || !createdOrder) {
      throw new HttpError(
        400,
        orderError?.message || 'Não foi possível criar o pedido.'
      );
    }

    return res.status(201).json(mapOrderRowToDto(createdOrder));
  } catch (err) {
    return next(err);
  }
}
