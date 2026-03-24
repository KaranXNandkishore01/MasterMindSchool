const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String },
  subjectSpecialization: [{ type: String }],
  contactNumber: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  qualification: { type: String },
  experienceYears: { type: Number },
  joiningDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'On Leave', 'Resigned'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
