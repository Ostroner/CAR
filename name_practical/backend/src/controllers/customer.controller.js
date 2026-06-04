import { asyncHandler } from '../utils/asyncHandler.js';
import * as customerService from '../services/customer.service.js';
import { AppError } from '../utils/AppError.js';

export const getAll = asyncHandler(async (req, res) => {
  const customers = await customerService.getAllCustomers();
  res.json({ success: true, data: { customers } });
});

export const getById = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id);
  res.json({ success: true, data: { customer } });
});

export const getProfile = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerByUserId(req.session.user.userId);
  res.json({ success: true, data: { customer } });
});

export const create = asyncHandler(async (req, res) => {
  const { username, password, ...customerData } = req.body;

  if (username || password) {
    if (!req.session?.user || req.session.user.role !== 'admin') {
      throw new AppError('Only admins can create customers with login credentials.', 403, 'FORBIDDEN');
    }
  }

  const customer = await customerService.createCustomer({
    ...customerData,
    username,
    password,
    userId: req.session?.user?.userId
  });
  const { password_hash, ...safeCustomer } = customer;
  res.status(201).json({ success: true, message: 'Customer created.', data: { customer: safeCustomer } });
});

export const update = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(req.params.id, req.body);
  res.json({ success: true, message: 'Customer updated.', data: { customer } });
});

export const remove = asyncHandler(async (req, res) => {
  const customer = await customerService.deleteCustomer(req.params.id);
  res.json({ success: true, message: 'Customer deleted.', data: { customer } });
});
