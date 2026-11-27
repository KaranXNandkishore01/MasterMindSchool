const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  logoutUser,
  verifySession,
  logoutAllDevices,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, loginUser);
router.post('/logout', logoutUser);
router.get('/verify', protect, verifySession);
router.post('/logout-all', protect, logoutAllDevices);
router.post('/register', protect, authorize('Management'), registerUser);

module.exports = router;
