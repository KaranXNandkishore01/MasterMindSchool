const express = require('express');
const router = express.Router();
const { loginUser, registerUser, logoutUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/register', protect, authorize('Management'), registerUser);

module.exports = router;
