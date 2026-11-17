import { HttpError } from '../utils/httpError.js';
import { env } from '../config/env.js';

export function notFoundHandler(req, res) {
  return res.status(404).json({
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Formato JSON inválido no corpo da requisição.',
    });
  }

  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  const safeMessage =
    !env.isProduction && err instanceof Error
      ? err.message
      : 'Erro interno no servidor. Tente novamente em instantes.';

  return res.status(500).json({
    message: safeMessage,
  });
}
