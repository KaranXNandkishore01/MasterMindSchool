const mongoose = require('mongoose');

const staffLeaveSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true,
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
  leaveType: {
    type: String,
    enum: ['Casual Leave', 'Medical Leave', 'Half-Day Leave', 'Earned Leave', 'Unpaid Leave'],
    required: true,
  },
  isHalfDay: {
    type: Boolean,
    default: false,
  },
  halfDaySession: {
    type: String,
    enum: ['First Half', 'Second Half', 'None'],
    default: 'None',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  daysCount: {
    type: Number,
    default: 1,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Approved',
  },
  approvedBy: {
    type: String,
    default: 'School Management',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('StaffLeave', staffLeaveSchema);
