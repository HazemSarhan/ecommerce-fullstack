import express from 'express';
import {
  createContact,
  getAllContacts,
} from '../controllers/contact.controller.js';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication.js';
const router = express.Router();

router
  .route('/')
  .post([authenticatedUser], createContact)
  .get([authenticatedUser, authorizePermissions('ADMIN'), getAllContacts]);

export default router;
