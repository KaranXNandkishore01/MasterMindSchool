const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeType: { 
    type: String, 
    enum: ['Tuition', 'Transport', 'Library', 'Extracurricular', 'Exam'], 
    required: true 
  },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  paymentDate: { type: Date },
  paymentMethod: { type: String, enum: ['Online', 'Cash', 'Cheque', 'Bank Transfer'] },
  transactionId: { type: String }, // For online payments
  receiptNumber: { type: String, unique: true, sparse: true },
  month: { type: String }, // e.g., 'January'
  year: { type: Number },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
