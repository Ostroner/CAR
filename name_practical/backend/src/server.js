import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { pool, pingDatabase } from './config/db.js';

const app = createApp();
const server = app.listen(env.port, () => console.log(`Backend connected server is running on port ${env.port}`));

async function shutdown(signal) {
  logger.info(`${signal} received. Shutting down gracefully.`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (err) => {
  logger.error({ err }, 'Unhandled rejection');
  shutdown('unhandledRejection');
});
