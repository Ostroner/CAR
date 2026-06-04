import bcrypt from 'bcryptjs';
import { pool, transaction } from '../config/db.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const safeUser = (user) => ({
  userId: user.userId,
  username: user.username,
  gender: user.gender,
  role: user.role
});

export async function registerUser(data) {
  const [existing] = await pool.execute('SELECT userId FROM user WHERE username = ?', [data.username]);
  if (existing.length) throw new AppError('Username is already taken.', 409, 'USERNAME_EXISTS');

  const [existingId] = await pool.execute('SELECT customerId FROM customer WHERE national_ID = ?', [data.national_ID]);
  if (existingId.length) throw new AppError('National ID already exists.', 409, 'NATIONAL_ID_EXISTS');

  const passwordHash = await bcrypt.hash(data.password, env.bcryptRounds);

  const result = await transaction(async (conn) => {
    const [userResult] = await conn.execute(
      `INSERT INTO user (username, password_hash, gender, role) VALUES (?, ?, ?, ?)`,
      [data.username, passwordHash, data.gender, data.role || 'customer']
    );
    const userId = userResult.insertId;

    await conn.execute(
      `INSERT INTO customer (userId, full_name, national_ID, phone, email, address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, data.full_name, data.national_ID, data.phone || null, data.email || null, data.address || null]
    );

    const [rows] = await conn.execute('SELECT * FROM user WHERE userId = ?', [userId]);
    return safeUser(rows[0]);
  });

  return result;
}

export async function loginUser(username, password) {
  const [rows] = await pool.execute('SELECT * FROM user WHERE username = ?', [username]);
  if (!rows.length) throw new AppError('Invalid username or password.', 401, 'INVALID_CREDENTIALS');

  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new AppError('Invalid username or password.', 401, 'INVALID_CREDENTIALS');
  return safeUser(user);
}
