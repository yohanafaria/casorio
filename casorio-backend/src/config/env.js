import 'dotenv/config';

const rawPort = Number(process.env.PORT);

export const env = {
  port: Number.isFinite(rawPort) && rawPort > 0 ? rawPort : 3333,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  frontendOrigins: (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean),
  backendPublicUrl: (
    process.env.BACKEND_PUBLIC_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    `http://localhost:${Number.isFinite(rawPort) && rawPort > 0 ? rawPort : 3333}`
  ).replace(/\/$/, ''),
  supabaseUrl: (process.env.SUPABASE_URL || '').trim(),
  supabaseServiceRoleKey: (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim(),
  mpPublicKey: (process.env.MP_PUBLIC_KEY || '').trim(),
  mpAccessToken: (process.env.MP_ACCESS_TOKEN || '').trim(),
  mpWebhookSecret: (process.env.MP_WEBHOOK_SECRET || '').trim(),
};

export function isSupabaseConfigured() {
  return (
    Boolean(env.supabaseUrl) &&
    Boolean(env.supabaseServiceRoleKey) &&
    !env.supabaseUrl.includes('seu-projeto.supabase.co') &&
    !env.supabaseServiceRoleKey.includes('sua-service-role-key-secreta')
  );
}

export function isMercadoPagoConfigured() {
  return (
    Boolean(env.mpAccessToken) &&
    !env.mpAccessToken.includes('seu-access-token-secreto')
  );
}
