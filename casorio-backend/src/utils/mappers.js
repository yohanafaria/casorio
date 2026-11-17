export function mapGiftRowToDto(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    longDescription: row.long_description || undefined,
    category: row.category || 'Lua de mel',
    image: row.image,
    price: Number(row.price),
    availableQuantity: Number(row.available_quantity ?? 0),
    allowPartialContribution: Boolean(row.allow_partial_contribution),
    suggestedContributions: Array.isArray(row.suggested_contributions)
      ? row.suggested_contributions.map((v) => Number(v))
      : undefined,
    active: Boolean(row.active),
    badge: row.badge || undefined,
    musicalNote: row.musical_note || undefined,
  };
}

export function mapRsvpRowToDto(row) {
  return {
    id: row.id,
    token: row.token,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    inviteCode: row.invite_code || undefined,
    attending: row.attending,
    companionsCount: Number(row.companions_count ?? 0),
    companions: Array.isArray(row.companions) ? row.companions : [],
    dietaryRestrictions: row.dietary_restrictions || undefined,
    notes: row.notes || undefined,
    consentAccepted: Boolean(row.consent_accepted),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapOrderRowToDto(row) {
  return {
    id: row.id,
    items: Array.isArray(row.items) ? row.items : [],
    buyerName: row.buyer_name,
    buyerEmail: row.buyer_email,
    buyerPhone: row.buyer_phone,
    message: row.message || undefined,
    subtotal: Number(row.subtotal),
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at,
  };
}

const VALID_PAYMENT_METHODS = new Set([
  'pix',
  'credit_card',
  'boleto',
  'mercado_pago_brick',
]);

const VALID_PAYMENT_STATUSES = new Set([
  'pending',
  'in_process',
  'approved',
  'rejected',
  'cancelled',
]);

export function normalizePaymentMethod(rawMethod) {
  if (!rawMethod) return 'mercado_pago_brick';
  const normalized = String(rawMethod).toLowerCase();
  if (VALID_PAYMENT_METHODS.has(normalized)) return normalized;
  if (normalized === 'pix') return 'pix';
  if (normalized.includes('bol') || normalized === 'pec') return 'boleto';
  if (
    normalized.includes('card') ||
    ['visa', 'master', 'elo', 'amex', 'hipercard'].includes(normalized)
  ) {
    return 'credit_card';
  }
  return 'mercado_pago_brick';
}

export function normalizePaymentStatus(rawStatus) {
  if (!rawStatus) return 'pending';
  const normalized = String(rawStatus).toLowerCase();
  if (VALID_PAYMENT_STATUSES.has(normalized)) return normalized;
  if (normalized === 'authorized') return 'in_process';
  if (normalized === 'refunded' || normalized === 'charged_back') return 'cancelled';
  return 'pending';
}

export function mapPaymentRowToDto(row, preferenceId = undefined) {
  return {
    orderId: row.order_id,
    paymentId: String(row.payment_id),
    status: normalizePaymentStatus(row.status),
    statusDetail: row.status_detail || 'Aguardando confirmação do pagamento.',
    amount: Number(row.amount),
    paymentMethod: normalizePaymentMethod(row.payment_method),
    createdAt: row.created_at || new Date().toISOString(),
    verifiedByBackend: Boolean(row.verified_by_backend),
    ...(preferenceId ? { preferenceId } : {}),
  };
}
