const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  scholarNo: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  rollNo: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  class: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  section: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  stream: {
    type: String,
    enum: ['None', 'Science', 'Commerce', 'Arts'],
    default: 'None',
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown',
  },
  fatherName: {
    type: String,
    required: true,
    trim: true,
  },
  motherName: {
    type: String,
    trim: true,
  },
  parentPhone: {
    type: String,
    required: true,
    trim: true,
  },
  parentEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  address: {
    type: String,
    trim: true,
  },
  admissionDate: {
    type: Date,
    default: Date.now,
  },
  academicYear: {
    type: String,
    default: '2026-2027',
    index: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Alumni', 'Suspended'],
    default: 'Active',
    index: true,
  },
  photoUrl: {
    type: String,
    default: '',
  },
  withdrawalReason: {
    type: String,
    default: '',
  },
  withdrawalDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Compound indexes for sub-10ms queries for 2,000+ students
studentSchema.index({ class: 1, section: 1, status: 1 });
studentSchema.index({ class: 1, rollNo: 1 });
studentSchema.index({ firstName: 'text', lastName: 'text', scholarNo: 'text', fatherName: 'text' });

module.exports = mongoose.model('Student', studentSchema);

