const GalleryImage = require('../models/GalleryImage');
const Announcement = require('../models/Announcement');
const Job = require('../models/Job');
const ContactMessage = require('../models/ContactMessage');
const { readStore, writeStore, isDbConnected } = require('../utils/dataStore');
const { getCache, setCache } = require('../utils/cache');

// Public READ endpoints with memory caching for sub-5ms latency
const getImages = async (req, res) => {
  const cached = getCache('gallery');
  if (cached) return res.json(cached);

  try {
    if (isDbConnected()) {
      const images = await GalleryImage.find().sort({ createdAt: -1 }).lean();
      setCache('gallery', images);
      return res.json(images);
    }
    const store = readStore();
    const list = store.images || [];
    setCache('gallery', list);
    res.json(list);
  } catch (error) {
    const store = readStore();
    res.json(store.images || []);
  }
};

const getAnnouncements = async (req, res) => {
  const cached = getCache('announcements');
  if (cached) return res.json(cached);

  try {
    if (isDbConnected()) {
      const announcements = await Announcement.find({ isActive: true }).sort({ date: -1 }).lean();
      setCache('announcements', announcements);
      return res.json(announcements);
    }
    const store = readStore();
    const active = (store.announcements || []).filter(a => a.isActive !== false);
    setCache('announcements', active);
    res.json(active);
  } catch (error) {
    const store = readStore();
    res.json(store.announcements || []);
  }
};

const getJobs = async (req, res) => {
  const cached = getCache('jobs');
  if (cached) return res.json(cached);

  try {
    if (isDbConnected()) {
      const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 }).lean();
      setCache('jobs', jobs);
      return res.json(jobs);
    }
    const store = readStore();
    const active = (store.jobs || []).filter(j => j.isActive !== false);
    setCache('jobs', active);
    res.json(active);
  } catch (error) {
    const store = readStore();
    res.json(store.jobs || []);
  }
};

const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    let createdDoc = null;

    if (isDbConnected()) {
      try {
        createdDoc = await ContactMessage.create({
          name,
          email,
          phone,
          subject,
          message,
          isRead: false
        });
      } catch (err) {
        console.warn('Atlas ContactMessage.create notice:', err.message);
      }
    }

    const newMsg = {
      _id: createdDoc ? String(createdDoc._id) : `msg-${Date.now()}`,
      name,
      email,
      phone,
      subject,
      message,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    const store = readStore();
    store.messages = [newMsg, ...(store.messages || [])];
    writeStore(store);

    res.status(201).json({ success: true, message: 'Message sent successfully', data: newMsg });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getImages,
  getAnnouncements,
  getJobs,
  submitContactMessage
};
