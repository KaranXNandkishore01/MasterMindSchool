const express = require('express');
const router = express.Router();
const {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTeachers)
  .post(protect, authorize('Admin'), createTeacher);

router.route('/:id')
  .get(protect, getTeacherById)
  .put(protect, authorize('Admin'), updateTeacher)
  .delete(protect, authorize('Admin'), deleteTeacher);

module.exports = router;
