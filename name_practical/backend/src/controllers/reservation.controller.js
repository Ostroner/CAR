import { asyncHandler } from '../utils/asyncHandler.js';
import * as reservationService from '../services/reservation.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const reservations = await reservationService.getAllReservations();
  res.json({ success: true, data: { reservations } });
});

export const getById = asyncHandler(async (req, res) => {
  const reservation = await reservationService.getReservationById(req.params.id);
  res.json({ success: true, data: { reservation } });
});

export const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await reservationService.getReservationsByCustomer(req.params.customerId);
  res.json({ success: true, data: { reservations } });
});

export const create = asyncHandler(async (req, res) => {
  const reservation = await reservationService.createReservation(req.body);
  res.status(201).json({ success: true, message: 'Reservation created.', data: { reservation } });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const reservation = await reservationService.updateReservationStatus(req.params.id, req.body.status);
  res.json({ success: true, message: 'Reservation updated.', data: { reservation } });
});

export const remove = asyncHandler(async (req, res) => {
  const reservation = await reservationService.deleteReservation(req.params.id);
  res.json({ success: true, message: 'Reservation deleted.', data: { reservation } });
});
