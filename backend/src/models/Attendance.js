const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  scholarNo: {
    type: String,
    required: true,
  },
  rollNo: {
    type: Number,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Leave'],
    default: 'Present',
    required: true,
  },
  remarks: {
    type: String,
    trim: true,
    default: '',
  },
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
    index: true,
  },
  academicYear: {
    type: String,
    default: '2026-2027',
  },
  records: [attendanceRecordSchema],
  totalStudents: {
    type: Number,
    default: 0,
  },
  presentCount: {
    type: Number,
    default: 0,
  },
  absentCount: {
    type: Number,
    default: 0,
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Enforce one attendance record per class + section + date
attendanceSchema.index({ class: 1, section: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

