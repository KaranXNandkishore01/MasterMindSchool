const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  section: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  records: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late', 'Half-day'], required: true },
    remarks: { type: String }
  }]
}, { timestamps: true });

// Ensure unique attendance record per class/section per day
attendanceSchema.index({ date: 1, class: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
