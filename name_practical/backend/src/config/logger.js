import pino from 'pino';
import { env } from './env.js';

export const logger = pino({
  level: env.isProduction ? 'info' : 'debug',
  redact: ['req.headers.cookie', 'req.headers.authorization', 'password', 'password_hash']
});
