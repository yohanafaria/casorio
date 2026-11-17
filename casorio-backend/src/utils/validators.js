import { HttpError } from './httpError.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_COMPANIONS = 10;
const MIN_PARTIAL_CONTRIBUTION = 50;

export function sanitizeString(value, maxLength = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export function sanitizeOptionalString(value, maxLength = 500) {
  if (value === undefined || value === null) return undefined;
  const cleaned = sanitizeString(value, maxLength);
  return cleaned.length > 0 ? cleaned : undefined;
}

export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
}

export function isValidPhone(phone) {
  if (typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function generateRsvpToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'DY-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateOrderId() {
  const timePart = Date.now().toString().slice(-6);
  const randPart = Math.floor(10 + Math.random() * 90);
  return `PED-${timePart}${randPart}`;
}

export function validateCreateRsvpPayload(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Dados de confirmação inválidos.');
  }

  const fullName = sanitizeString(body.fullName, 150);
  if (fullName.length < 3) {
    throw new HttpError(
      400,
      'Por favor, digite seu nome completo como consta no convite.'
    );
  }

  const email = sanitizeString(body.email, 160).toLowerCase();
  if (!isValidEmail(email)) {
    throw new HttpError(400, 'Digite um endereço de e-mail válido.');
  }

  const phone = sanitizeString(body.phone, 30);
  if (!isValidPhone(phone)) {
    throw new HttpError(
      400,
      'Informe um WhatsApp/telefone válido com DDD. Ex: (21) 99999-9999'
    );
  }

  const attending = body.attending;
  if (attending !== 'yes' && attending !== 'no') {
    throw new HttpError(400, 'Selecione se você poderá comparecer ("yes" ou "no").');
  }

  if (body.consentAccepted !== true) {
    throw new HttpError(
      400,
      'É necessário concordar com o uso dos dados exclusivamente para a organização do casamento.'
    );
  }

  const rawCompanionsCount = Number(body.companionsCount ?? 0);
  if (
    !Number.isInteger(rawCompanionsCount) ||
    rawCompanionsCount < 0 ||
    rawCompanionsCount > MAX_COMPANIONS
  ) {
    throw new HttpError(
      400,
      `O limite máximo configurado por convite é de ${MAX_COMPANIONS} acompanhantes.`
    );
  }

  const companionsCount = attending === 'yes' ? rawCompanionsCount : 0;
  const rawCompanions = Array.isArray(body.companions) ? body.companions : [];

  const companions =
    attending === 'yes'
      ? rawCompanions.slice(0, companionsCount).map((comp, idx) => {
          const name = sanitizeString(comp?.name, 150);
          if (name.length < 2) {
            throw new HttpError(
              400,
              `Informe o nome completo do acompanhante ${idx + 1}.`
            );
          }
          const dietaryRestrictions = sanitizeOptionalString(
            comp?.dietaryRestrictions,
            250
          );
          return dietaryRestrictions ? { name, dietaryRestrictions } : { name };
        })
      : [];

  return {
    fullName,
    email,
    phone,
    inviteCode: sanitizeOptionalString(body.inviteCode, 100),
    attending,
    companionsCount: companions.length,
    companions,
    dietaryRestrictions: sanitizeOptionalString(body.dietaryRestrictions, 300),
    notes: sanitizeOptionalString(body.notes, 400),
    consentAccepted: true,
  };
}

export function validateUpdateRsvpPayload(body, existingRecord) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Dados de atualização inválidos.');
  }

  const merged = {
    fullName: body.fullName !== undefined ? body.fullName : existingRecord.full_name,
    email: body.email !== undefined ? body.email : existingRecord.email,
    phone: body.phone !== undefined ? body.phone : existingRecord.phone,
    inviteCode:
      body.inviteCode !== undefined ? body.inviteCode : existingRecord.invite_code,
    attending: body.attending !== undefined ? body.attending : existingRecord.attending,
    companionsCount:
      body.companionsCount !== undefined
        ? body.companionsCount
        : existingRecord.companions_count,
    companions:
      body.companions !== undefined ? body.companions : existingRecord.companions,
    dietaryRestrictions:
      body.dietaryRestrictions !== undefined
        ? body.dietaryRestrictions
        : existingRecord.dietary_restrictions,
    notes: body.notes !== undefined ? body.notes : existingRecord.notes,
    consentAccepted:
      body.consentAccepted !== undefined
        ? body.consentAccepted
        : existingRecord.consent_accepted,
  };

  return validateCreateRsvpPayload(merged);
}

export function validateCreateOrderPayload(body) {
  if (!body || typeof body !== 'object') {
    throw new HttpError(400, 'Dados do pedido inválidos.');
  }

  const buyerName = sanitizeString(body.buyerName, 150);
  if (buyerName.length < 3) {
    throw new HttpError(
      400,
      'Por favor, informe seu nome completo para que o casal saiba quem presenteou.'
    );
  }

  const buyerEmail = sanitizeString(body.buyerEmail, 160).toLowerCase();
  if (!isValidEmail(buyerEmail)) {
    throw new HttpError(
      400,
      'Informe um e-mail válido para receber o comprovante do pedido.'
    );
  }

  const buyerPhone = sanitizeString(body.buyerPhone, 30);
  if (!isValidPhone(buyerPhone)) {
    throw new HttpError(
      400,
      'Informe um telefone/WhatsApp válido com DDD. Ex: (21) 99999-9999'
    );
  }

  const message = sanitizeOptionalString(body.message, 500);

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new HttpError(
      400,
      'Sua sacola de presentes está vazia. Adicione ao menos um presente.'
    );
  }

  if (body.items.length > 30) {
    throw new HttpError(400, 'Quantidade máxima de itens por pedido excedida.');
  }

  const normalizedItems = body.items.map((item, idx) => {
    const giftId = sanitizeString(item?.giftId || item?.gift?.id, 100);
    if (!giftId) {
      throw new HttpError(400, `Item #${idx + 1} sem identificador de presente válido.`);
    }

    const quantity = Number(item?.quantity ?? 1);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      throw new HttpError(400, `Quantidade inválida para o item "${giftId}".`);
    }

    const isPartialContribution = Boolean(item?.isPartialContribution);
    const requestedUnitPrice = Number(
      item?.unitPrice ?? item?.customAmount ?? item?.gift?.price ?? 0
    );

    if (!Number.isFinite(requestedUnitPrice) || requestedUnitPrice <= 0) {
      throw new HttpError(400, `Valor unitário inválido para o item "${giftId}".`);
    }

    if (isPartialContribution && requestedUnitPrice < MIN_PARTIAL_CONTRIBUTION) {
      throw new HttpError(
        400,
        `O valor mínimo para contribuição parcial por cota é de R$ ${MIN_PARTIAL_CONTRIBUTION},00.`
      );
    }

    return {
      giftId,
      giftName: sanitizeString(item?.giftName || item?.gift?.name, 200),
      quantity,
      requestedUnitPrice: Math.round(requestedUnitPrice * 100) / 100,
      isPartialContribution,
    };
  });

  return {
    buyerName,
    buyerEmail,
    buyerPhone,
    message,
    items: normalizedItems,
  };
}
