const GalleryImage = require('../models/GalleryImage');
const Announcement = require('../models/Announcement');
const Job = require('../models/Job');
const ContactMessage = require('../models/ContactMessage');

// Public READ endpoints
const getImages = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ date: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newMessage = await ContactMessage.create({
      name, email, phone, subject, message
    });
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getImages,
  getAnnouncements,
  getJobs,
  submitContactMessage
};
