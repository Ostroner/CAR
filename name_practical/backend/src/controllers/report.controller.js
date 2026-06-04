import { asyncHandler } from '../utils/asyncHandler.js';
import * as reportService from '../services/report.service.js';

export const overview = asyncHandler(async (req, res) => {
  const data = await reportService.getOverview();
  res.json({ success: true, data });
});

export const reservations = asyncHandler(async (req, res) => {
  const data = await reportService.getReservationReport();
  res.json({ success: true, data: { reservations: data } });
});

export const customers = asyncHandler(async (req, res) => {
  const data = await reportService.getCustomerReport();
  res.json({ success: true, data: { customers: data } });
});

export const vehicles = asyncHandler(async (req, res) => {
  const data = await reportService.getVehicleReport();
  res.json({ success: true, data: { vehicles: data } });
});

export const exportCsv = asyncHandler(async (req, res) => {
  const { type } = req.query;

  let rows, columns;

  if (type === 'reservations') {
    rows = await reportService.getReservationReport();
    columns = [
      { key: 'reserveId', label: 'ID' },
      { key: 'customer_name', label: 'Customer Name' },
      { key: 'national_ID', label: 'National ID' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'plate_number', label: 'Plate Number' },
      { key: 'brand', label: 'Brand' },
      { key: 'model', label: 'Model' },
      { key: 'vehicle_type', label: 'Vehicle Type' },
      { key: 'start_date', label: 'Start Date' },
      { key: 'end_date', label: 'End Date' },
      { key: 'reservation_status', label: 'Status' },
      { key: 'reservation_Date', label: 'Reservation Date' }
    ];
  } else if (type === 'customers') {
    rows = await reportService.getCustomerReport();
    columns = [
      { key: 'customerId', label: 'ID' },
      { key: 'full_name', label: 'Full Name' },
      { key: 'national_ID', label: 'National ID' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'address', label: 'Address' },
      { key: 'username', label: 'Username' },
      { key: 'gender', label: 'Gender' }
    ];
  } else if (type === 'vehicles') {
    rows = await reportService.getVehicleReport();
    columns = [
      { key: 'vehicleId', label: 'ID' },
      { key: 'plate_number', label: 'Plate Number' },
      { key: 'brand', label: 'Brand' },
      { key: 'model', label: 'Model' },
      { key: 'year', label: 'Year' },
      { key: 'vehicle_type', label: 'Type' },
      { key: 'purchase_price', label: 'Purchase Price' },
      { key: 'status', label: 'Status' },
      { key: 'rental_count', label: 'Rental Count' }
    ];
  } else {
    return res.status(400).json({ success: false, message: 'Invalid export type. Use: reservations, customers, vehicles' });
  }

  const csv = reportService.generateCsv(rows, columns);
  const filename = `${type}-report-${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
});
