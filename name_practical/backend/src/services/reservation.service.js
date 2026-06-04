import { pool } from '../config/db.js';
import { AppError } from '../utils/AppError.js';

export async function getAllReservations() {
  const [rows] = await pool.execute(`
    SELECT r.*, c.full_name AS customer_name, c.national_ID,
           v.plate_number, v.brand, v.model
    FROM reservation_rental r
    JOIN customer c ON c.customerId = r.customerId
    JOIN vehicle v ON v.vehicleId = r.vehicleId
    ORDER BY r.reserveId DESC
  `);
  return rows;
}

export async function getReservationById(id) {
  const [rows] = await pool.execute(`
    SELECT r.*, c.full_name AS customer_name, c.national_ID,
           v.plate_number, v.brand, v.model
    FROM reservation_rental r
    JOIN customer c ON c.customerId = r.customerId
    JOIN vehicle v ON v.vehicleId = r.vehicleId
    WHERE r.reserveId = ?
  `, [id]);
  if (!rows.length) throw new AppError('Reservation not found.', 404, 'NOT_FOUND');
  return rows[0];
}

export async function getReservationsByCustomer(customerId) {
  const [rows] = await pool.execute(`
    SELECT r.*, v.plate_number, v.brand, v.model
    FROM reservation_rental r
    JOIN vehicle v ON v.vehicleId = r.vehicleId
    WHERE r.customerId = ?
    ORDER BY r.reserveId DESC
  `, [customerId]);
  return rows;
}

export async function createReservation(data) {
  const [vehicle] = await pool.execute("SELECT * FROM vehicle WHERE vehicleId = ? AND status = 'available'", [data.vehicleId]);
  if (!vehicle.length) throw new AppError('Vehicle is not available.', 400, 'VEHICLE_UNAVAILABLE');

  const [customer] = await pool.execute('SELECT customerId FROM customer WHERE customerId = ?', [data.customerId]);
  if (!customer.length) throw new AppError('Customer not found.', 404, 'NOT_FOUND');

  const [result] = await pool.execute(
    `INSERT INTO reservation_rental (customerId, vehicleId, reservation_Date, start_date, end_date, reservation_status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.customerId, data.vehicleId, data.reservation_Date || new Date(), data.start_date, data.end_date, data.reservation_status || 'pending']
  );

  await pool.execute("UPDATE vehicle SET status = 'rented' WHERE vehicleId = ?", [data.vehicleId]);
  return getReservationById(result.insertId);
}

export async function updateReservationStatus(id, status) {
  const reservation = await getReservationById(id);
  await pool.execute('UPDATE reservation_rental SET reservation_status = ? WHERE reserveId = ?', [status, id]);

  if (status === 'completed' || status === 'cancelled') {
    await pool.execute("UPDATE vehicle SET status = 'available' WHERE vehicleId = ?", [reservation.vehicleId]);
  }
  return getReservationById(id);
}

export async function deleteReservation(id) {
  const reservation = await getReservationById(id);
  await pool.execute('DELETE FROM reservation_rental WHERE reserveId = ?', [id]);
  await pool.execute("UPDATE vehicle SET status = 'available' WHERE vehicleId = ?", [reservation.vehicleId]);
  return reservation;
}
