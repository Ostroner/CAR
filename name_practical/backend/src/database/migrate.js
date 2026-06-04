import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const schemaPath = path.resolve('schema.sql');
const sql = await fs.readFile(schemaPath, 'utf8');
const connection = await mysql.createConnection({ host: env.db.host, port: env.db.port, user: env.db.user, password: env.db.password, multipleStatements: true });
await connection.query(sql);
await connection.end();
logger.info('Database migrated successfully.');
