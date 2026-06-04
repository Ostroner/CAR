import { asyncHandler } from '../utils/asyncHandler.js';
import { registerUser, loginUser } from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  req.session.user = user;
  res.status(201).json({ success: true, message: 'Account created successfully.', data: { user } });
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body.username, req.body.password);
  req.session.user = user;
  res.json({ success: true, message: 'Login successful.', data: { user } });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.session?.user || null } });
});

export const logout = asyncHandler(async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie(process.env.SESSION_NAME || 'carrental.sid');
    res.json({ success: true, message: 'Logged out successfully.' });
  });
});
