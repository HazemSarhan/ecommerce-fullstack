import express from 'express';
import {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  deleteDiscount,
} from '../controllers/discount.controller.js';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication.js';
const router = express.Router();

router
  .route('/')
  .post([authenticatedUser, authorizePermissions('ADMIN'), createDiscount])
  .get(getAllDiscounts);
router
  .route('/:id')
  .get(getDiscountById)
  .delete([authenticatedUser, authorizePermissions('ADMIN'), deleteDiscount]);

export default router;
