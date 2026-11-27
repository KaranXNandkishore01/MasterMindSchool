const express = require('express');
const router = express.Router();
const {
  getImages,
  getAnnouncements,
  getJobs,
  submitContactMessage
} = require('../controllers/publicController');
const { publicFormLimiter } = require('../middleware/rateLimiter');

router.get('/images', getImages);
router.get('/announcements', getAnnouncements);
router.get('/jobs', getJobs);
router.post('/contact', publicFormLimiter, submitContactMessage);

module.exports = router;
