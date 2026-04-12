const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String },
  category: { type: String, default: 'Campus' }
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
