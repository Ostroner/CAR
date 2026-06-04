import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import * as controller from '../controllers/report.controller.js';

const router = Router();
router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/overview', controller.overview);
router.get('/reservations', controller.reservations);
router.get('/customers', controller.customers);
router.get('/vehicles', controller.vehicles);
router.get('/export', controller.exportCsv);

export default router;
