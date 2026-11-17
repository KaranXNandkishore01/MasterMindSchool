const mongoose = require('mongoose');

const staffAttendanceSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
    index: true,
  },
  employeeId: {
    type: String,
    required: true,
    index: true,
  },
  staffName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  checkIn: {
    time: Date,
    photo: String, // live camera selfie image data/URI
    latitude: Number,
    longitude: Number,
    inSchool: {
      type: Boolean,
      default: true,
    },
    distanceMeters: Number,
    locationNote: String,
  },
  checkOut: {
    time: Date,
    photo: String, // live checkout selfie image
    latitude: Number,
    longitude: Number,
    inSchool: {
      type: Boolean,
      default: true,
    },
    distanceMeters: Number,
    locationNote: String,
  },
  status: {
    type: String,
    enum: ['Present', 'Half-Day', 'Absent', 'On Leave', 'Late'],
    default: 'Present',
  },
  halfDay: {
    type: Boolean,
    default: false,
  },
  halfDayReason: {
    type: String,
    default: '',
  },
  workHours: {
    type: Number,
    default: 0,
  },
  remarks: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

staffAttendanceSchema.index({ date: 1, employeeId: 1 }, { unique: true });
staffAttendanceSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('StaffAttendance', staffAttendanceSchema);
