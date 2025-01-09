import express from 'express';
import {
  createCard,
  getAllCards,
  getCardById,
  deleteCard,
} from '../controllers/payment.controller.js';
import { authenticatedUser } from '../middleware/authentication.js';
const router = express.Router();

router
  .route('/')
  .post([authenticatedUser], createCard)
  .get([authenticatedUser], getAllCards);
router
  .route('/:id')
  .get([authenticatedUser], getCardById)
  .delete([authenticatedUser], deleteCard);

export default router;
