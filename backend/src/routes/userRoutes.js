const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('Management'), getUsers);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/:id')
  .get(protect, authorize('Management'), getUserById)
  .put(protect, authorize('Management'), updateUser)
  .delete(protect, authorize('Management'), deleteUser);

module.exports = router;
