const GalleryImage = require('../models/GalleryImage');
const Announcement = require('../models/Announcement');
const Job = require('../models/Job');
const ContactMessage = require('../models/ContactMessage');

// --- Gallery Management ---
const getImages = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addImage = async (req, res) => {
  try {
    const { caption } = req.body;
    let imageUrl = req.body.imageUrl;
    
    // If a file was uploaded, use its path
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL or File is required' });
    }

    const image = await GalleryImage.create({ imageUrl, caption });
    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    await GalleryImage.findByIdAndDelete(id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Announcements Management ---
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create(req.body);
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await Announcement.findByIdAndDelete(id);
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Jobs Management ---
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Contact Messages Management ---
const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findById(id);
    if (message) {
      message.isRead = true;
      await message.save();
      res.json(message);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await ContactMessage.findByIdAndDelete(id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getImages, addImage, deleteImage,
  getAnnouncements, addAnnouncement, deleteAnnouncement,
  getJobs, addJob, deleteJob,
  getMessages, markMessageRead, deleteMessage
};
