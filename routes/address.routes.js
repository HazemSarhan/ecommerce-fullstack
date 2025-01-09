import express from 'express';
import {
  createAddress,
  getAllAddresses,
  getAddressById,
  deleteAddress,
} from '../controllers/address.controller.js';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication.js';
const router = express.Router();

router
  .route('/')
  .post([authenticatedUser], createAddress)
  .get([authenticatedUser], getAllAddresses);

router
  .route('/:id')
  .get([authenticatedUser], getAddressById)
  .delete([authenticatedUser], deleteAddress);

export default router;
