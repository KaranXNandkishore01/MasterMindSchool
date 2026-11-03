const mongoose = require('mongoose');
const GalleryImage = require('../models/GalleryImage');
const Announcement = require('../models/Announcement');
const Job = require('../models/Job');
const ContactMessage = require('../models/ContactMessage');
const { readStore, writeStore, isDbConnected } = require('../utils/dataStore');
const { clearCache } = require('../utils/cache');

// --- Gallery Management ---
const getImages = async (req, res) => {
  try {
    if (isDbConnected()) {
      const images = await GalleryImage.find().sort({ createdAt: -1 }).lean();
      return res.json(images);
    }
    const store = readStore();
    res.json(store.images || []);
  } catch (error) {
    const store = readStore();
    res.json(store.images || []);
  }
};

const addImage = async (req, res) => {
  try {
    const { caption, category = 'Campus' } = req.body;
    let imageUrl = req.body.imageUrl;
    
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL or File is required' });
    }

    let createdDoc = null;
    if (isDbConnected()) {
      try {
        createdDoc = await GalleryImage.create({ imageUrl, caption: caption || '', category });
      } catch (err) {
        console.warn('Atlas GalleryImage.create notice:', err.message);
      }
    }

    const newImgData = {
      _id: createdDoc ? String(createdDoc._id) : `img-${Date.now()}`,
      imageUrl,
      caption: caption || '',
      category,
      createdAt: createdDoc ? createdDoc.createdAt : new Date().toISOString()
    };

    const store = readStore();
    store.images = [newImgData, ...(store.images || [])];
    writeStore(store);

    // Instant cache invalidation
    clearCache('gallery');

    res.status(201).json(newImgData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const store = readStore();
    store.images = (store.images || []).filter(img => String(img._id) !== String(id) && img.imageUrl !== id);
    writeStore(store);

    if (isDbConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          await GalleryImage.findByIdAndDelete(id);
        } else {
          await GalleryImage.deleteMany({ $or: [{ _id: id }, { imageUrl: id }] });
        }
      } catch (err) {
        console.warn('Atlas delete image notice:', err.message);
      }
    }

    // Instant cache invalidation
    clearCache('gallery');

    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Announcements Management ---
const getAnnouncements = async (req, res) => {
  try {
    if (isDbConnected()) {
      const announcements = await Announcement.find().sort({ date: -1 }).lean();
      return res.json(announcements);
    }
    const store = readStore();
    res.json(store.announcements || []);
  } catch (error) {
    const store = readStore();
    res.json(store.announcements || []);
  }
};

const addAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    let createdDoc = null;
    if (isDbConnected()) {
      try {
        createdDoc = await Announcement.create({
          title,
          content,
          date: new Date(),
          isActive: true
        });
      } catch (err) {
        console.warn('Atlas Announcement.create notice:', err.message);
      }
    }

    const newAnn = {
      _id: createdDoc ? String(createdDoc._id) : `ann-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString(),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const store = readStore();
    store.announcements = [newAnn, ...(store.announcements || [])];
    writeStore(store);

    // Instant cache invalidation
    clearCache('announcements');

    res.status(201).json(newAnn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const store = readStore();
    store.announcements = (store.announcements || []).filter(a => String(a._id) !== String(id));
    writeStore(store);

    if (isDbConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          await Announcement.findByIdAndDelete(id);
        } else {
          await Announcement.deleteMany({ _id: id });
        }
      } catch (err) {
        console.warn('Atlas delete announcement notice:', err.message);
      }
    }

    // Instant cache invalidation
    clearCache('announcements');

    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Jobs Management ---
const getJobs = async (req, res) => {
  try {
    if (isDbConnected()) {
      const jobs = await Job.find().sort({ createdAt: -1 }).lean();
      return res.json(jobs);
    }
    const store = readStore();
    res.json(store.jobs || []);
  } catch (error) {
    const store = readStore();
    res.json(store.jobs || []);
  }
};

const addJob = async (req, res) => {
  try {
    const { title, description, requirements, applyLink } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    let createdDoc = null;
    if (isDbConnected()) {
      try {
        createdDoc = await Job.create({
          title,
          description,
          requirements: requirements || '',
          applyLink: applyLink || 'https://forms.gle/L6r7K6nw5DwewRPF8',
          isActive: true
        });
      } catch (err) {
        console.warn('Atlas Job.create notice:', err.message);
      }
    }

    const newJob = {
      _id: createdDoc ? String(createdDoc._id) : `job-${Date.now()}`,
      title,
      description,
      requirements: requirements || '',
      applyLink: applyLink || 'https://forms.gle/L6r7K6nw5DwewRPF8',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const store = readStore();
    store.jobs = [newJob, ...(store.jobs || [])];
    writeStore(store);

    // Instant cache invalidation
    clearCache('jobs');

    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const store = readStore();
    store.jobs = (store.jobs || []).filter(j => String(j._id) !== String(id));
    writeStore(store);

    if (isDbConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          await Job.findByIdAndDelete(id);
        } else {
          await Job.deleteMany({ _id: id });
        }
      } catch (err) {
        console.warn('Atlas delete job notice:', err.message);
      }
    }

    // Instant cache invalidation
    clearCache('jobs');

    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Contact Messages Management ---
const getMessages = async (req, res) => {
  try {
    if (isDbConnected()) {
      const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
      return res.json(messages);
    }
    const store = readStore();
    res.json(store.messages || []);
  } catch (error) {
    const store = readStore();
    res.json(store.messages || []);
  }
};

const markMessageRead = async (req, res) => {
  try {
    const { id } = req.params;
    const store = readStore();
    const msg = (store.messages || []).find(m => String(m._id) === String(id));
    if (msg) msg.isRead = true;
    writeStore(store);

    if (isDbConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          await ContactMessage.findByIdAndUpdate(id, { isRead: true });
        }
      } catch (err) {
        console.warn('Atlas mark message read notice:', err.message);
      }
    }

    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const store = readStore();
    store.messages = (store.messages || []).filter(m => String(m._id) !== String(id));
    writeStore(store);

    if (isDbConnected()) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          await ContactMessage.findByIdAndDelete(id);
        } else {
          await ContactMessage.deleteMany({ _id: id });
        }
      } catch (err) {
        console.warn('Atlas delete message notice:', err.message);
      }
    }

    res.json({ success: true, message: 'Message deleted' });
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
