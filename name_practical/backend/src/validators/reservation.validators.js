import Joi from 'joi';

export const createReservationSchema = Joi.object({
  customerId: Joi.number().integer().required(),
  vehicleId: Joi.number().integer().required(),
  reservation_Date: Joi.date().default(() => new Date()),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  reservation_status: Joi.string().valid('pending', 'confirmed', 'active', 'completed', 'cancelled').default('pending')
});

export const updateReservationStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'active', 'completed', 'cancelled').required()
});
