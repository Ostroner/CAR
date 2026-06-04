import { logger } from '../config/logger.js';
import { env } from '../config/env.js';

export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  if (statusCode >= 500) logger.error({ err: error }, 'Unhandled server error');

  res.status(statusCode).json({
    success: false,
    message: error.isOperational ? error.message : 'Internal server error',
    code: error.code || 'INTERNAL_ERROR',
    details: error.details || undefined,
    stack: env.isProduction ? undefined : error.stack
  });
}
