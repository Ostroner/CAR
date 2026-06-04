import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const adminHash = await bcrypt.hash('admin123', env.bcryptRounds);
const customerHash = await bcrypt.hash('customer123', env.bcryptRounds);

await pool.execute(
  `INSERT IGNORE INTO user (username, password_hash, gender, role) VALUES (?, ?, ?, ?), (?, ?, ?, ?)`,
  ['admin', adminHash, 'male', 'admin', 'customer1', customerHash, 'female', 'customer']
);

const [[adminUser]] = await pool.execute('SELECT userId FROM user WHERE username = ?', ['admin']);
const [[customerUser]] = await pool.execute('SELECT userId FROM user WHERE username = ?', ['customer1']);

await pool.execute(
  `INSERT IGNORE INTO customer (userId, full_name, national_ID, phone, email, address) VALUES (?, ?, ?, ?, ?, ?)`,
  [customerUser.userId, 'Test Customer', '1199000123456', '0788111111', 'customer@email.com', 'Kigali']
);

await pool.execute(
  `INSERT IGNORE INTO vehicle (plate_number, brand, model, year, vehicle_type, purchase_price, status) VALUES
   (?, ?, ?, ?, ?, ?, ?),
   (?, ?, ?, ?, ?, ?, ?),
   (?, ?, ?, ?, ?, ?, ?)`,
  ['RAB 123 A', 'Toyota', 'Camry', 2022, 'Sedan', 35000000, 'available',
   'RAC 456 B', 'Honda', 'Civic', 2023, 'Sedan', 32000000, 'available',
   'RAD 789 C', 'Ford', 'Ranger', 2021, 'Pickup', 45000000, 'available']
);

await pool.end();
logger.info('Database seeded successfully.');
