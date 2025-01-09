import express from 'express';
import {
  getAllUsers,
  getUserById,
  showMe,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication.js';
const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/showMe').get([authenticatedUser], showMe);
router
  .route('/:id')
  .get([authenticatedUser], getUserById)
  .patch([authenticatedUser], updateUser)
  .delete([authenticatedUser, authorizePermissions('ADMIN')], deleteUser);

export default router;
