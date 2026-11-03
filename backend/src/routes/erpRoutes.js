const express = require('express');
const router = express.Router();
const {
  getERPOverview,
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getAttendanceRoster,
  saveAttendance,
  getClassAttendanceSummary,
  exportClassAttendanceExcel,
  getFeeRecords,
  collectFee,
} = require('../controllers/erpController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All ERP routes require authentication with role Management or Admin
router.use(protect);
router.use(authorize('Management', 'Admin', 'Teacher', 'Accountant'));

// Dashboard Overview
router.get('/overview', getERPOverview);

// Student Information System (SIS)
router.route('/students')
  .get(getStudents)
  .post(createStudent);

router.route('/students/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

// Attendance Engine
router.get('/attendance/summary', getClassAttendanceSummary);
router.get('/attendance/export', exportClassAttendanceExcel);

router.route('/attendance')
  .get(getAttendanceRoster)
  .post(saveAttendance);

// Fee & Invoice Engine
router.route('/fees')
  .get(getFeeRecords);

router.post('/fees/collect', collectFee);

module.exports = router;

