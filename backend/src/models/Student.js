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
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown', 'Not Specified', ''],
    default: 'Unknown',
  },
  aadhaarNo: {
    type: String,
    trim: true,
    default: '',
  },
  category: {
    type: String,
    enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'],
    default: 'General',
  },
  nationality: {
    type: String,
    trim: true,
    default: 'Indian',
  },
  religion: {
    type: String,
    trim: true,
    default: '',
  },
  studentPhone: {
    type: String,
    trim: true,
    default: '',
  },
  studentEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  fatherName: {
    type: String,
    required: true,
    trim: true,
  },
  fatherOccupation: {
    type: String,
    trim: true,
    default: '',
  },
  fatherPhone: {
    type: String,
    trim: true,
    default: '',
  },
  fatherAadhaar: {
    type: String,
    trim: true,
    default: '',
  },
  motherName: {
    type: String,
    trim: true,
    default: '',
  },
  motherOccupation: {
    type: String,
    trim: true,
    default: '',
  },
  motherPhone: {
    type: String,
    trim: true,
    default: '',
  },
  motherAadhaar: {
    type: String,
    trim: true,
    default: '',
  },
  emergencyContact: {
    type: String,
    trim: true,
    default: '',
  },
  emergencyRelation: {
    type: String,
    trim: true,
    default: '',
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
  permanentAddress: {
    type: String,
    trim: true,
    default: '',
  },
  isFresher: {
    type: Boolean,
    default: true,
  },
  previousSchool: {
    type: String,
    trim: true,
    default: '',
  },
  previousClass: {
    type: String,
    trim: true,
    default: '',
  },
  previousMarksheet: {
    type: String,
    trim: true,
    default: '',
  },
  previousTcNo: {
    type: String,
    trim: true,
    default: '',
  },
  previousTcDate: {
    type: Date,
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
    enum: ['Active', 'Inactive', 'Alumni', 'Suspended', 'Withdrawn'],
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
  tcSerialNo: {
    type: String,
    trim: true,
    default: '',
  },
  tcIssueDate: {
    type: Date,
  },
  tcApplicationDate: {
    type: Date,
  },
  totalWorkingDays: {
    type: Number,
    default: 210,
  },
  daysPresent: {
    type: Number,
    default: 195,
  },
  generalConduct: {
    type: String,
    default: 'Good',
  },
  duesClearedUpTo: {
    type: String,
    default: 'March 2027',
  },
  promotionStatus: {
    type: String,
    default: 'Promoted to Next Class',
  },
  remarks: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Compound indexes for sub-10ms queries for 2,000+ students
studentSchema.index({ class: 1, section: 1, status: 1 });
studentSchema.index({ class: 1, rollNo: 1 });
studentSchema.index({ firstName: 'text', lastName: 'text', scholarNo: 'text', fatherName: 'text' });

module.exports = mongoose.model('Student', studentSchema);

