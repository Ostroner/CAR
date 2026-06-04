import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createReservationSchema, updateReservationStatusSchema } from '../validators/reservation.validators.js';
import * as controller from '../controllers/reservation.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/', requireRole('admin'), controller.getAll);
router.get('/my/:customerId', controller.getMyReservations);
router.get('/:id', controller.getById);
router.post('/', validate(createReservationSchema), controller.create);
router.patch('/:id/status', requireRole('admin'), validate(updateReservationStatusSchema), controller.updateStatus);
router.delete('/:id', requireRole('admin'), controller.remove);

export default router;
