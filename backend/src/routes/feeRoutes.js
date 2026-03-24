const express = require('express');
const router = express.Router();
const {
  getFees,
  getFeeById,
  createFee,
  updateFee,
  getFeesByStudent
} = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('Admin'), getFees)
  .post(protect, authorize('Admin'), createFee);

router.route('/student/:studentId')
  .get(protect, getFeesByStudent);

router.route('/:id')
  .get(protect, authorize('Admin', 'Parent'), getFeeById)
  .put(protect, authorize('Admin'), updateFee);

module.exports = router;
