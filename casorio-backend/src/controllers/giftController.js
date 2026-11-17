import { getSupabaseClient } from '../config/supabase.js';
import { HttpError } from '../utils/httpError.js';
import { mapGiftRowToDto } from '../utils/mappers.js';

export async function listGifts(_req, res, next) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: true });

    if (error) {
      throw new HttpError(500, `Erro ao consultar lista de presentes: ${error.message}`);
    }

    const formatted = (data || []).map(mapGiftRowToDto);
    return res.json(formatted);
  } catch (err) {
    return next(err);
  }
}

export async function getGiftById(req, res, next) {
  try {
    const giftId = String(req.params.id || '').trim();
    if (!giftId) {
      throw new HttpError(400, 'Identificador do presente inválido.');
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('id', giftId)
      .eq('active', true)
      .maybeSingle();

    if (error) {
      throw new HttpError(500, `Erro ao buscar presente: ${error.message}`);
    }

    if (!data) {
      throw new HttpError(404, 'Presente não encontrado.');
    }

    return res.json(mapGiftRowToDto(data));
  } catch (err) {
    return next(err);
  }
}
