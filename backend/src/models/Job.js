const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String },
  applyLink: { type: String },
  jobType: { type: String, enum: ['Full-Time', 'Part-Time', 'Contractual'], default: 'Full-Time' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
