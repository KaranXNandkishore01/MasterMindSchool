const mongoose = require('mongoose');

const staffPayrollSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
    index: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  staffName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    required: true,
  },
  monthYear: {
    type: String,
    required: true, // e.g. '2026-11'
    index: true,
  },
  baseSalary: {
    type: Number,
    required: true,
  },
  allowances: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  halfDayCount: {
    type: Number,
    default: 0,
  },
  absentCount: {
    type: Number,
    default: 0,
  },
  netPayable: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Processing'],
    default: 'Pending',
    index: true,
  },
  paymentDate: {
    type: Date,
  },
  paymentMode: {
    type: String,
    enum: ['Bank Transfer', 'Cash', 'UPI', 'Cheque'],
    default: 'Bank Transfer',
  },
  transactionRef: {
    type: String,
    default: '',
  },
  payslipNo: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

staffPayrollSchema.index({ monthYear: 1, employeeId: 1 }, { unique: true });

module.exports = mongoose.model('StaffPayroll', staffPayrollSchema);
