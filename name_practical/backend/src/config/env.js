import dotenv from 'dotenv';

dotenv.config();

const required = ['SESSION_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT || 5000),
  appName: process.env.APP_NAME || 'Car Rental API',
  frontendUrl: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'car_rental',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 20)
  },
  session: {
    secret: process.env.SESSION_SECRET,
    name: process.env.SESSION_NAME || 'carrental.sid',
    secure: process.env.SESSION_COOKIE_SECURE === 'true',
    maxAgeMs: Number(process.env.SESSION_MAX_AGE_HOURS || 24) * 60 * 60 * 1000
  },
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),
  rateLimit: {
    windowMinutes: Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15),
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 250),
    authMaxRequests: Number(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || 25)
  }
};
