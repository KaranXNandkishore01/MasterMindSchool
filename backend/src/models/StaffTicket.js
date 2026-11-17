const mongoose = require('mongoose');

const staffTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  employeeId: {
    type: String,
    required: true,
    index: true,
  },
  phone: {
    type: String,
    required: true,
  },
  staffName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      'Attendance Discrepancy',
      'Leave Query',
      'Salary / Pay Slip',
      'Geofence / Camera Technical Issue',
      'ID Card & Profile',
      'Other Support'
    ],
    default: 'Attendance Discrepancy',
  },
  subject: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Under Review', 'Resolved'],
    default: 'Open',
  },
  adminReply: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StaffTicket', staffTicketSchema);
