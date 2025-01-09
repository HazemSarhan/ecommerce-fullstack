import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication.js';
const router = express.Router();

router
  .route('/')
  .post([authenticatedUser, authorizePermissions('ADMIN')], createCategory)
  .get(getAllCategories);

router
  .route('/:id')
  .get(getCategoryById)
  .patch([authenticatedUser, authorizePermissions('ADMIN')], updateCategory)
  .delete([authenticatedUser, authorizePermissions('ADMIN'), deleteCategory]);

export default router;
