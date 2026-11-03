const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
  receiptNo: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque'],
    default: 'Cash',
  },
  transactionId: {
    type: String,
    default: '',
  },
  remarks: {
    type: String,
    default: '',
  },
  collectedBy: {
    type: String,
    default: 'Admin',
  },
}, { _id: true, timestamps: true });

const feeRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true,
  },
  scholarNo: {
    type: String,
    required: true,
    uppercase: true,
    index: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
    index: true,
  },
  section: {
    type: String,
    required: true,
    uppercase: true,
    index: true,
  },
  academicYear: {
    type: String,
    default: '2026-2027',
    index: true,
  },
  totalFee: {
    type: Number,
    required: true,
    default: 24000,
  },
  discount: {
    type: Number,
    default: 0,
  },
  fine: {
    type: Number,
    default: 0,
    min: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  dueAmount: {
    type: Number,
    default: 24000,
  },
  status: {
    type: String,
    enum: ['Paid', 'Partial', 'Unpaid'],
    default: 'Unpaid',
    index: true,
  },
  payments: [paymentTransactionSchema],
}, {
  timestamps: true,
});

feeRecordSchema.index({ student: 1, academicYear: 1 }, { unique: true });
feeRecordSchema.index({ class: 1, status: 1 });

module.exports = mongoose.model('FeeRecord', feeRecordSchema);

