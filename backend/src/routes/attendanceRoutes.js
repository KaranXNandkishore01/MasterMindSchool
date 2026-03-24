const express = require('express');
const router = express.Router();
const {
  getAttendance,
  markAttendance,
  getStudentAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorize('Teacher', 'Admin'), getAttendance)
  .post(protect, authorize('Teacher', 'Admin'), markAttendance);

router.route('/student/:id')
  .get(protect, getStudentAttendance);

module.exports = router;
