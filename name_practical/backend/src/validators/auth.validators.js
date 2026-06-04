import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(80).required(),
  password: Joi.string().min(6).max(100).required(),
  gender: Joi.string().valid('male', 'female').required(),
  role: Joi.string().valid('customer', 'admin').default('customer'),
  full_name: Joi.string().min(2).max(120).required(),
  national_ID: Joi.string().min(5).max(40).required(),
  phone: Joi.string().max(30).allow('', null),
  email: Joi.string().email().max(160).allow('', null),
  address: Joi.string().allow('', null)
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});
