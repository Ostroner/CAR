import { pool } from '../config/db.js';

export async function getOverview() {
  const [[{ totalVehicles }]] = await pool.execute('SELECT COUNT(*) AS totalVehicles FROM vehicle');
  const [[{ totalCustomers }]] = await pool.execute('SELECT COUNT(*) AS totalCustomers FROM customer');
  const [[{ totalReservations }]] = await pool.execute('SELECT COUNT(*) AS totalReservations FROM reservation_rental');
  const [[{ activeRentals }]] = await pool.execute("SELECT COUNT(*) AS activeRentals FROM reservation_rental WHERE reservation_status IN ('active','confirmed')");

  const [reservationsByStatus] = await pool.execute(
    'SELECT reservation_status, COUNT(*) AS count FROM reservation_rental GROUP BY reservation_status'
  );

  const [vehiclesByStatus] = await pool.execute(
    'SELECT status, COUNT(*) AS count FROM vehicle GROUP BY status'
  );

  const [customersData] = await pool.execute(
    'SELECT DATE(created_at) AS date, COUNT(*) AS count FROM customer GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30'
  );

  return {
    totals: { vehicles: totalVehicles, customers: totalCustomers, reservations: totalReservations, activeRentals },
    reservationsByStatus,
    vehiclesByStatus,
    customerRegistrations: customersData
  };
}

export async function getReservationReport() {
  const [reservations] = await pool.execute(`
    SELECT r.*, c.full_name AS customer_name, c.national_ID, c.phone, c.email,
           v.plate_number, v.brand, v.model, v.vehicle_type
    FROM reservation_rental r
    JOIN customer c ON c.customerId = r.customerId
    JOIN vehicle v ON v.vehicleId = r.vehicleId
    ORDER BY r.created_at DESC
  `);
  return reservations;
}

export async function getCustomerReport() {
  const [customers] = await pool.execute(`
    SELECT c.*, u.username, u.gender, u.role, u.created_at AS user_created_at
    FROM customer c
    JOIN user u ON u.userId = c.userId
    ORDER BY c.customerId DESC
  `);
  return customers;
}

export async function getVehicleReport() {
  const [vehicles] = await pool.execute(`
    SELECT v.*, COUNT(r.reserveId) AS rental_count
    FROM vehicle v
    LEFT JOIN reservation_rental r ON r.vehicleId = v.vehicleId
    GROUP BY v.vehicleId
    ORDER BY rental_count DESC
  `);
  return vehicles;
}

export function generateCsv(rows, columns) {
  const header = columns.map(c => `"${c.label}"`).join(',');
  const body = rows.map(row =>
    columns.map(c => {
      const val = String(row[c.key] ?? '');
      return `"${val.replace(/"/g, '""')}"`;
    }).join(',')
  ).join('\n');
  return `${header}\n${body}`;
}
