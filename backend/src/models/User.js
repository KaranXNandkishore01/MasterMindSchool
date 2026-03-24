const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Teacher', 'Student', 'Parent'], 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  referenceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'role', // Dynamically references Student, Teacher, Parent, or Admin models
    required: true 
  },
  lastLogin: { type: Date }
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
