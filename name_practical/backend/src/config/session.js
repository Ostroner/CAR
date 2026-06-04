import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import { env } from './env.js';
import { pool } from './db.js';

const MySQLStoreAdapter = MySQLStore(session);

export function createSessionMiddleware() {
  const store = new MySQLStoreAdapter({}, pool);
  
  return session({
    name: env.session.name,
    secret: env.session.secret,
    store: store,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: env.session.secure,
      sameSite: env.isProduction ? 'none' : 'lax',
      maxAge: env.session.maxAgeMs
    }
  });
}
