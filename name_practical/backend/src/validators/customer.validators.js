import Joi from 'joi';

export const createCustomerSchema = Joi.object({
  full_name: Joi.string().min(2).max(120).required(),
  national_ID: Joi.string().min(5).max(40).required(),
  phone: Joi.string().max(30).allow('', null),
  email: Joi.string().email().max(160).allow('', null),
  address: Joi.string().allow('', null),
  username: Joi.string().min(3).max(80),
  password: Joi.string().min(6).max(100),
  gender: Joi.string().valid('male', 'female')
});

export const updateCustomerSchema = Joi.object({
  full_name: Joi.string().min(2).max(120),
  national_ID: Joi.string().min(5).max(40),
  phone: Joi.string().max(30).allow('', null),
  email: Joi.string().email().max(160).allow('', null),
  address: Joi.string().allow('', null)
}).min(1);
