import { pool } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export async function getAllVehicles() {
  const [rows] = await pool.execute('SELECT * FROM vehicle ORDER BY vehicleId DESC');
  return rows;
}

export async function getVehicleById(id) {
  const [rows] = await pool.execute('SELECT * FROM vehicle WHERE vehicleId = ?', [id]);
  if (!rows.length) throw new AppError('Vehicle not found.', 404, 'NOT_FOUND');
  return rows[0];
}

export async function getAvailableVehicles() {
  const [rows] = await pool.execute("SELECT * FROM vehicle WHERE status = 'available' ORDER BY brand, model");
  return rows;
}

export async function createVehicle(data) {
  const [existing] = await pool.execute('SELECT vehicleId FROM vehicle WHERE plate_number = ?', [data.plate_number]);
  if (existing.length) throw new AppError('Plate number already exists.', 409, 'PLATE_EXISTS');

  const [result] = await pool.execute(
    `INSERT INTO vehicle (plate_number, brand, model, year, vehicle_type, purchase_price, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.plate_number, data.brand, data.model, data.year, data.vehicle_type, data.purchase_price, data.status || 'available']
  );
  return getVehicleById(result.insertId);
}

export async function updateVehicle(id, data) {
  await getVehicleById(id);
  const fields = ['plate_number', 'brand', 'model', 'year', 'vehicle_type', 'purchase_price', 'status'];
  const updates = [];
  const values = [];
  for (const field of fields) {
    if (data[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(data[field]);
    }
  }
  if (!updates.length) return getVehicleById(id);
  values.push(id);
  await pool.execute(`UPDATE vehicle SET ${updates.join(', ')} WHERE vehicleId = ?`, values);
  return getVehicleById(id);
}

export async function deleteVehicle(id) {
  const vehicle = await getVehicleById(id);
  await pool.execute('DELETE FROM vehicle WHERE vehicleId = ?', [id]);
  return vehicle;
}
