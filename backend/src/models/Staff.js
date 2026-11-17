const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: [
      'Teacher',
      'Driver',
      'Maid',
      'Assistant',
      'Gardener',
      'Manager',
      'Staff Assistant',
      'Security Guard',
      'Accountant',
      'Other'
    ],
    required: true,
    index: true,
  },
  employmentType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract'],
    default: 'Full-Time',
    index: true,
  },
  department: {
    type: String,
    default: 'General',
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: 'Male',
  },
  dob: {
    type: Date,
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  monthlySalary: {
    type: Number,
    required: true,
    default: 20000,
  },
  dailyRate: {
    type: Number,
    default: 0,
  },
  aadhaarNo: {
    type: String,
    trim: true,
    default: '',
  },
  bankAccount: {
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' },
  },
  address: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Resigned', 'Terminated'],
    default: 'Active',
    index: true,
  },
  photoUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

staffSchema.index({ role: 1, employmentType: 1, status: 1 });
staffSchema.index({ fullName: 'text', employeeId: 'text', phone: 'text' });

module.exports = mongoose.model('Staff', staffSchema);
