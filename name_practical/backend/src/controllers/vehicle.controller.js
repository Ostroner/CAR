import { asyncHandler } from '../utils/asyncHandler.js';
import * as vehicleService from '../services/vehicle.service.js';

export const getAll = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getAllVehicles();
  res.json({ success: true, data: { vehicles } });
});

export const getAvailable = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getAvailableVehicles();
  res.json({ success: true, data: { vehicles } });
});

export const getById = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.id);
  res.json({ success: true, data: { vehicle } });
});

export const create = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.body);
  res.status(201).json({ success: true, message: 'Vehicle created.', data: { vehicle } });
});

export const update = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
  res.json({ success: true, message: 'Vehicle updated.', data: { vehicle } });
});

export const remove = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.deleteVehicle(req.params.id);
  res.json({ success: true, message: 'Vehicle deleted.', data: { vehicle } });
});
