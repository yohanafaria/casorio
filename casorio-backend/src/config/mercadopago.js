import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { env, isMercadoPagoConfigured } from './env.js';
import { HttpError } from '../utils/httpError.js';

let mpClientInstance = null;

if (isMercadoPagoConfigured()) {
  mpClientInstance = new MercadoPagoConfig({
    accessToken: env.mpAccessToken,
    options: { timeout: 10000 },
  });
}

export function getMercadoPagoClient() {
  if (!mpClientInstance) {
    throw new HttpError(
      503,
      'Credenciais do Mercado Pago não configuradas. Defina MP_ACCESS_TOKEN no arquivo .env do backend.'
    );
  }
  return mpClientInstance;
}

export function getPaymentClient() {
  return new Payment(getMercadoPagoClient());
}

export function getPreferenceClient() {
  return new Preference(getMercadoPagoClient());
}
