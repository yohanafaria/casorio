import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { generalLimiter } from './middlewares/rateLimiters.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import apiRoutes from './routes/apiRoutes.js';

const app = express();

// Necessário para funcionar atrás do proxy reverso do Render.com (rate-limit por IP real)
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  cors({
    origin(origin, callback) {
      // Permite chamadas server-to-server (ex: Webhook do Mercado Pago, healthchecks, curl)
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, '');
      if (
        env.frontendOrigins.includes('*') ||
        env.frontendOrigins.includes(normalizedOrigin) ||
        (!env.isProduction &&
          /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(normalizedOrigin))
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Origem não autorizada pelo CORS: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key'],
  })
);

app.use(express.json({ limit: '256kb' }));
app.use(generalLimiter);

// Rota raiz informativa e de healthcheck para o Render
app.get('/', (_req, res) => {
  return res.json({
    name: 'Daniel & Yohana — Casório Backend API',
    status: 'online',
    healthEndpoint: '/api/health',
  });
});

app.use('/api', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
