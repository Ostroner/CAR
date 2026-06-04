import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createCustomerSchema, updateCustomerSchema } from '../validators/customer.validators.js';
import * as controller from '../controllers/customer.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/', requireRole('admin'), controller.getAll);
router.get('/profile', controller.getProfile);
router.get('/:id', requireRole('admin'), controller.getById);
router.post('/', validate(createCustomerSchema), controller.create);
router.put('/:id', requireRole('admin'), validate(updateCustomerSchema), controller.update);
router.delete('/:id', requireRole('admin'), controller.remove);

export default router;
