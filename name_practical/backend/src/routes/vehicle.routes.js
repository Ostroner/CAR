import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicle.validators.js';
import * as controller from '../controllers/vehicle.controller.js';

const router = Router();

router.get('/available', controller.getAvailable);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', requireAuth, requireRole('admin'), validate(createVehicleSchema), controller.create);
router.put('/:id', requireAuth, requireRole('admin'), validate(updateVehicleSchema), controller.update);
router.delete('/:id', requireAuth, requireRole('admin'), controller.remove);

export default router;
