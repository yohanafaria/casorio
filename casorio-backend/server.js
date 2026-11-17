import app from './src/app.js';
import {
  env,
  isMercadoPagoConfigured,
  isSupabaseConfigured,
} from './src/config/env.js';

app.listen(env.port, '0.0.0.0', () => {
  console.log(`==========================================================`);
  console.log(`💍 Casório Backend (Daniel & Yohana) rodando na porta ${env.port}`);
  console.log(`🌐 Ambiente: ${env.nodeEnv}`);
  console.log(`🔗 Origens CORS permitidas: ${env.frontendOrigins.join(', ')}`);
  console.log(
    `🗄️  Supabase configurado: ${isSupabaseConfigured() ? 'SIM' : 'NÃO (verifique .env)'}`
  );
  console.log(
    `💳 Mercado Pago configurado: ${isMercadoPagoConfigured() ? 'SIM' : 'NÃO (verifique .env)'}`
  );
  console.log(`==========================================================`);
});
