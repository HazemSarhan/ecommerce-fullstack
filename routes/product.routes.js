import express from 'express';
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication.js';
const router = express.Router();

router
  .route('/')
  .post([authenticatedUser, authorizePermissions('ADMIN'), createProduct])
  .get(getAllProducts);

router
  .route('/:id')
  .get(getSingleProduct)
  .delete([authenticatedUser, authorizePermissions('ADMIN'), deleteProduct]);

export default router;
