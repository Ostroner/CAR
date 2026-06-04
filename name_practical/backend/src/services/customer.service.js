import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export async function getAllCustomers() {
  const [rows] = await pool.execute(`
    SELECT c.*, u.username, u.gender, u.role
    FROM customer c
    JOIN user u ON u.userId = c.userId
    ORDER BY c.customerId DESC
  `);
  return rows;
}

export async function getCustomerById(id) {
  const [rows] = await pool.execute(`
    SELECT c.*, u.username, u.gender, u.role
    FROM customer c
    JOIN user u ON u.userId = c.userId
    WHERE c.customerId = ?
  `, [id]);
  if (!rows.length) throw new AppError('Customer not found.', 404, 'NOT_FOUND');
  return rows[0];
}

export async function getCustomerByUserId(userId) {
  const [rows] = await pool.execute(`
    SELECT c.*, u.username, u.gender, u.role
    FROM customer c
    JOIN user u ON u.userId = c.userId
    WHERE c.userId = ?
  `, [userId]);
  return rows[0] || null;
}

export async function createCustomer(data) {
  const [existing] = await pool.execute('SELECT customerId FROM customer WHERE national_ID = ?', [data.national_ID]);
  if (existing.length) throw new AppError('National ID already exists.', 409, 'NATIONAL_ID_EXISTS');

  let userId = data.userId;

  if (data.username && data.password) {
    const [userExists] = await pool.execute('SELECT userId FROM user WHERE username = ?', [data.username]);
    if (userExists.length) throw new AppError('Username is already taken.', 409, 'USERNAME_EXISTS');

    const passwordHash = await bcrypt.hash(data.password, env.bcryptRounds);
    const [userResult] = await pool.execute(
      `INSERT INTO user (username, password_hash, gender, role) VALUES (?, ?, ?, ?)`,
      [data.username, passwordHash, data.gender || 'male', 'customer']
    );
    userId = userResult.insertId;
  }

  const [result] = await pool.execute(
    `INSERT INTO customer (userId, full_name, national_ID, phone, email, address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, data.full_name, data.national_ID, data.phone || null, data.email || null, data.address || null]
  );
  return getCustomerById(result.insertId);
}

export async function updateCustomer(id, data) {
  const customer = await getCustomerById(id);
  if (data.national_ID && data.national_ID !== customer.national_ID) {
    const [existing] = await pool.execute('SELECT customerId FROM customer WHERE national_ID = ? AND customerId != ?', [data.national_ID, id]);
    if (existing.length) throw new AppError('National ID already exists.', 409, 'NATIONAL_ID_EXISTS');
  }
  const fields = ['full_name', 'national_ID', 'phone', 'email', 'address'];
  const updates = [];
  const values = [];
  for (const field of fields) {
    if (data[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(data[field]);
    }
  }
  if (!updates.length) return customer;
  values.push(id);
  await pool.execute(`UPDATE customer SET ${updates.join(', ')} WHERE customerId = ?`, values);
  return getCustomerById(id);
}

export async function deleteCustomer(id) {
  const customer = await getCustomerById(id);
  await pool.execute('DELETE FROM customer WHERE customerId = ?', [id]);
  await pool.execute('DELETE FROM user WHERE userId = ?', [customer.userId]);
  return customer;
}
