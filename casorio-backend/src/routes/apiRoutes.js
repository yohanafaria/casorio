import { Router } from 'express';
import { getGiftById, listGifts } from '../controllers/giftController.js';
import {
  createRsvp,
  getRsvpByTokenOrEmail,
  updateRsvp,
} from '../controllers/rsvpController.js';
import { createOrder } from '../controllers/orderController.js';
import {
  createOrInitPayment,
  getPaymentStatus,
} from '../controllers/paymentController.js';
import { handleMercadoPagoWebhook } from '../controllers/webhookController.js';
import {
  checkoutLimiter,
  rsvpLimiter,
} from '../middlewares/rateLimiters.js';
import { isMercadoPagoConfigured, isSupabaseConfigured } from '../config/env.js';

const router = Router();

// Healthcheck da API (útil para o Render.com e monitoramento)
router.get('/health', (_req, res) => {
  return res.json({
    status: 'ok',
    service: 'casorio-backend',
    timestamp: new Date().toISOString(),
    integrations: {
      supabaseConfigured: isSupabaseConfigured(),
      mercadoPagoConfigured: isMercadoPagoConfigured(),
    },
  });
});

// 1. Presentes (GET /api/gifts e GET /api/gifts/:id)
router.get('/gifts', listGifts);
router.get('/gifts/:id', getGiftById);

// 2. Confirmação de Presença — RSVP (POST /api/rsvp, GET /api/rsvp/:token, PUT /api/rsvp/:token)
router.post('/rsvp', rsvpLimiter, createRsvp);
router.get('/rsvp/:token', getRsvpByTokenOrEmail);
router.put('/rsvp/:token', rsvpLimiter, updateRsvp);

// 3. Pedidos de Presentes (POST /api/orders)
router.post('/orders', checkoutLimiter, createOrder);

// 4. Pagamentos Mercado Pago (POST /api/payments/create e GET /api/payments/:id/status)
router.post('/payments/create', checkoutLimiter, createOrInitPayment);
router.get('/payments/:id/status', getPaymentStatus);

// 5. Webhook Oficial Mercado Pago (POST /api/webhooks/mercadopago)
router.post('/webhooks/mercadopago', handleMercadoPagoWebhook);

export default router;
