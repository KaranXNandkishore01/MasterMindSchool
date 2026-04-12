const express = require('express');
const router = express.Router();
const {
  getImages, addImage, deleteImage,
  getAnnouncements, addAnnouncement, deleteAnnouncement,
  getJobs, addJob, deleteJob,
  getMessages, markMessageRead, deleteMessage
} = require('../controllers/managementController');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// All routes here should be protected and only for Management
router.use(protect);
router.use(authorize('Management'));

router.route('/images').get(getImages).post(upload.single('image'), addImage);
router.route('/images/:id').delete(deleteImage);

router.route('/announcements').get(getAnnouncements).post(addAnnouncement);
router.route('/announcements/:id').delete(deleteAnnouncement);

router.route('/jobs').get(getJobs).post(addJob);
router.route('/jobs/:id').delete(deleteJob);

router.route('/messages').get(getMessages);
router.route('/messages/:id').delete(deleteMessage);
router.route('/messages/:id/read').patch(markMessageRead);

module.exports = router;
