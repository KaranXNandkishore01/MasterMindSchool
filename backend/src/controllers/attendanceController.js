const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Get attendance for a specific class, section, and date
// @route   GET /api/attendance
// @access  Private (Teacher, Admin)
const getAttendance = async (req, res) => {
  try {
    const { classId, section, date } = req.query;
    
    // Parse date to beginning of day
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      class: classId,
      section,
      date: queryDate
    }).populate('records.student', 'firstName lastName admissionNumber');

    if (attendance) {
      res.json(attendance);
    } else {
      res.status(404).json({ message: 'Attendance record not found for this date.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark attendance for a class
// @route   POST /api/attendance
// @access  Private (Teacher, Admin)
const markAttendance = async (req, res) => {
  try {
    const { classId, section, date, records } = req.body;
    
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      class: classId,
      section,
      date: queryDate
    });

    if (attendance) {
      // Update existing record
      attendance.records = records;
      attendance.teacher = req.user.referenceId; // Assuming teacher logs it
      await attendance.save();
      res.json(attendance);
    } else {
      // Create new record
      attendance = new Attendance({
        date: queryDate,
        class: classId,
        section,
        teacher: req.user.referenceId,
        records
      });
      const createdAttendance = await attendance.save();
      res.status(201).json(createdAttendance);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get student attendance report (for parent/student view)
// @route   GET /api/attendance/student/:id
// @access  Private (Student, Parent, Teacher, Admin)
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    // Find all attendance documents where this student appears in records
    const attendances = await Attendance.find({ 'records.student': studentId })
      .sort({ date: -1 });

    const studentRecords = attendances.map(a => {
      const record = a.records.find(r => r.student.toString() === studentId);
      return {
        date: a.date,
        status: record.status,
        remarks: record.remarks
      };
    });

    res.json(studentRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAttendance,
  markAttendance,
  getStudentAttendance
};
