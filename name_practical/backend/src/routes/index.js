import { Router } from 'express';
import authRoutes from './auth.routes.js';
import customerRoutes from './customer.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import reservationRoutes from './reservation.routes.js';
import reportRoutes from './report.routes.js';
import { pingDatabase } from '../config/db.js';

const router = Router();

router.get('/health', async (req, res) => {
  const db = await pingDatabase();
  res.json({ success: true, service: 'car-rental-api', database: db ? 'ok' : 'down', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/reservations', reservationRoutes);
router.use('/reports', reportRoutes);

export default router;
