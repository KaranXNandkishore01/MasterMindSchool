const express = require('express');
const router = express.Router();
const {
  getStaffOverview,
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
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
  getStaffDemoCredentials,
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public / Mobile Attendance punch route (staff can punch directly from smartphone with camera & geolocation)
router.post('/attendance/punch', punchSelfieAttendance);
router.get('/public-overview', getStaffOverview);

// Staff Self-Service Portal Routes (Publicly accessible with Phone UserID & Aadhaar-derived Password)
router.post('/portal/login', staffPortalLogin);
router.get('/portal/my-attendance', getStaffPersonalAttendance);
router.post('/portal/helpdesk', submitStaffTicket);
router.get('/portal/helpdesk', getStaffTickets);
router.get('/portal/demo-credentials', getStaffDemoCredentials);

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

router.route('/:id')
  .get(getStaffById)
  .put(updateStaff)
  .delete(deleteStaff);

module.exports = router;
