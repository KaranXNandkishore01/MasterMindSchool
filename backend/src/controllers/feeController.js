const Fee = require('../models/Fee');

// @desc    Get all fees
// @route   GET /api/fees
// @access  Private (Admin)
const getFees = async (req, res) => {
  try {
    const fees = await Fee.find({}).populate('student', 'firstName lastName admissionNumber');
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get fee by ID
// @route   GET /api/fees/:id
// @access  Private (Admin, Parent of student)
const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id).populate({
      path: 'student',
      populate: { path: 'parent', select: 'email' }
    });

    if (fee) {
      if (req.user.role === 'Parent' && fee.student.parent && fee.student.parent._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this fee record' });
      }
      res.json(fee);
    } else {
      res.status(404).json({ message: 'Fee record not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new fee record
// @route   POST /api/fees
// @access  Private (Admin)
const createFee = async (req, res) => {
  try {
    const fee = new Fee(req.body);
    const createdFee = await fee.save();
    res.status(201).json(createdFee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update fee record (e.g., mark as paid)
// @route   PUT /api/fees/:id
// @access  Private (Admin)
const updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    
    if (fee) {
      res.json(fee);
    } else {
      res.status(404).json({ message: 'Fee record not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get fees by student
// @route   GET /api/fees/student/:studentId
// @access  Private (Admin, Parent, Student)
const getFeesByStudent = async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId }).sort({ dueDate: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFees,
  getFeeById,
  createFee,
  updateFee,
  getFeesByStudent
};
