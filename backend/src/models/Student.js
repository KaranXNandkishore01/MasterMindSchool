const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  admissionNumber: { type: String, required: true, unique: true },
  rollNumber: { type: Number },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String },
  contactNumber: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
  currentClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  section: { type: String },
  documents: {
    photoUrl: String,
    birthCertificateUrl: String
  },
  enrollmentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Alumni', 'Suspended'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
