import { createClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from './env.js';
import { HttpError } from '../utils/httpError.js';

let supabaseInstance = null;

if (isSupabaseConfigured()) {
  supabaseInstance = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseClient() {
  if (!supabaseInstance) {
    throw new HttpError(
      503,
      'Banco de dados Supabase não configurado. Verifique SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env do backend.'
    );
  }
  return supabaseInstance;
}
