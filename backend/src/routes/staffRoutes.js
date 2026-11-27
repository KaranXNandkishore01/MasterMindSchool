const express = require('express');
const router = express.Router();
const {
  getStaffOverview,
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  relieveStaff,
  wipeDummyStaff,
  punchSelfieAttendance,
  getStaffAttendanceRoster,
  adjustStaffAttendance,
  getStaffLeaves,
  createStaffLeave,
  getStaffPayroll,
  disburseStaffSalary,
  staffPortalLogin,
  getStaffPersonalAttendance,
  submitStaffTicket,
  getStaffTickets,
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { authLimiter, publicFormLimiter } = require('../middleware/rateLimiter');

// Public / Mobile Attendance punch route (staff can punch directly from smartphone with camera & geolocation)
router.post('/attendance/punch', publicFormLimiter, punchSelfieAttendance);

// Staff Self-Service Portal Routes (Protected by login credentials & rate-limited)
router.post('/portal/login', authLimiter, staffPortalLogin);
router.get('/portal/my-attendance', getStaffPersonalAttendance);
router.post('/portal/helpdesk', publicFormLimiter, submitStaffTicket);
router.get('/portal/helpdesk', getStaffTickets);

// Protected ERP Routes for Management, Admin & Accountant
router.use(protect);
router.use(authorize('Management', 'Admin', 'Accountant', 'Teacher'));

router.get('/overview', getStaffOverview);

router.route('/')
  .get(getStaff)
  .post(createStaff);

router.get('/attendance/roster', getStaffAttendanceRoster);
router.post('/attendance/adjust', adjustStaffAttendance);

router.route('/leaves')
  .get(getStaffLeaves)
  .post(createStaffLeave);

router.get('/payroll', getStaffPayroll);
router.get('/payroll/list', getStaffPayroll);
router.post('/payroll/disburse', disburseStaffSalary);
router.post('/payroll/disburse/:id', disburseStaffSalary);

router.delete('/wipe/dummy', wipeDummyStaff);
router.post('/:id/relieve', relieveStaff);

router.route('/:id')
  .get(getStaffById)
  .put(updateStaff)
  .delete(deleteStaff);

module.exports = router;
