import Joi from 'joi';

export const createVehicleSchema = Joi.object({
  plate_number: Joi.string().max(40).required(),
  brand: Joi.string().max(80).required(),
  model: Joi.string().max(80).required(),
  year: Joi.number().integer().min(1900).max(2100).required(),
  vehicle_type: Joi.string().max(60).required(),
  purchase_price: Joi.number().min(0).required(),
  status: Joi.string().valid('available', 'rented', 'maintenance').default('available')
});

export const updateVehicleSchema = Joi.object({
  plate_number: Joi.string().max(40),
  brand: Joi.string().max(80),
  model: Joi.string().max(80),
  year: Joi.number().integer().min(1900).max(2100),
  vehicle_type: Joi.string().max(60),
  purchase_price: Joi.number().min(0),
  status: Joi.string().valid('available', 'rented', 'maintenance')
}).min(1);
