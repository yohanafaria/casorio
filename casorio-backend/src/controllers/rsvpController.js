import { getSupabaseClient } from '../config/supabase.js';
import { HttpError } from '../utils/httpError.js';
import { mapRsvpRowToDto } from '../utils/mappers.js';
import {
  generateRsvpToken,
  validateCreateRsvpPayload,
  validateUpdateRsvpPayload,
} from '../utils/validators.js';

async function findRsvpByLookupParam(supabase, rawParam) {
  const param = String(rawParam || '').trim();
  if (!param) return null;

  const upper = param.toUpperCase();

  // 1. Tenta por token exato
  const byToken = await supabase
    .from('rsvps')
    .select('*')
    .eq('token', upper)
    .maybeSingle();

  if (byToken.data) return byToken.data;

  // 2. Tenta por e-mail case-insensitive
  if (param.includes('@')) {
    const byEmail = await supabase
      .from('rsvps')
      .select('*')
      .ilike('email', param)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (byEmail.data) return byEmail.data;
  }

  // 3. Tenta por código do convite case-insensitive
  const byInvite = await supabase
    .from('rsvps')
    .select('*')
    .ilike('invite_code', param)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return byInvite.data || null;
}

export async function createRsvp(req, res, next) {
  try {
    const validated = validateCreateRsvpPayload(req.body);
    const supabase = getSupabaseClient();

    let token = generateRsvpToken();
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await supabase
        .from('rsvps')
        .select('id')
        .eq('token', token)
        .maybeSingle();
      if (!existing.data) break;
      token = generateRsvpToken();
    }

    const nowIso = new Date().toISOString();
    const insertPayload = {
      token,
      full_name: validated.fullName,
      email: validated.email,
      phone: validated.phone,
      invite_code: validated.inviteCode || null,
      attending: validated.attending,
      companions_count: validated.companionsCount,
      companions: validated.companions,
      dietary_restrictions: validated.dietaryRestrictions || null,
      notes: validated.notes || null,
      consent_accepted: validated.consentAccepted,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const { data, error } = await supabase
      .from('rsvps')
      .insert(insertPayload)
      .select('*')
      .single();

    if (error) {
      throw new HttpError(400, `Não foi possível registrar o RSVP: ${error.message}`);
    }

    return res.status(201).json(mapRsvpRowToDto(data));
  } catch (err) {
    return next(err);
  }
}

export async function getRsvpByTokenOrEmail(req, res, next) {
  try {
    const param = String(req.params.token || '').trim();
    if (!param) {
      throw new HttpError(400, 'Informe o código da confirmação ou e-mail.');
    }

    const supabase = getSupabaseClient();
    const found = await findRsvpByLookupParam(supabase, param);

    if (!found) {
      throw new HttpError(404, 'Confirmação não encontrada.');
    }

    return res.json(mapRsvpRowToDto(found));
  } catch (err) {
    return next(err);
  }
}

export async function updateRsvp(req, res, next) {
  try {
    const param = String(req.params.token || '').trim();
    if (!param) {
      throw new HttpError(400, 'Código de confirmação inválido.');
    }

    const supabase = getSupabaseClient();
    const existing = await findRsvpByLookupParam(supabase, param);

    if (!existing) {
      throw new HttpError(404, 'Confirmação não encontrada para o código informado.');
    }

    const validated = validateUpdateRsvpPayload(req.body, existing);

    const { data, error } = await supabase
      .from('rsvps')
      .update({
        full_name: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        invite_code: validated.inviteCode || null,
        attending: validated.attending,
        companions_count: validated.companionsCount,
        companions: validated.companions,
        dietary_restrictions: validated.dietaryRestrictions || null,
        notes: validated.notes || null,
        consent_accepted: validated.consentAccepted,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error || !data) {
      throw new HttpError(
        400,
        error?.message || 'Não foi possível atualizar sua confirmação.'
      );
    }

    return res.json(mapRsvpRowToDto(data));
  } catch (err) {
    return next(err);
  }
}
