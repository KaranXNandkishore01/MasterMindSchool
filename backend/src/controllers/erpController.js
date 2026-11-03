const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const FeeRecord = require('../models/FeeRecord');
const { getCache, setCache, clearCache } = require('../utils/cache');

// Standard MPBSE Class fee structures (can be adjusted)
const CLASS_FEES = {
  'Nursery': 18000,
  'LKG': 18000,
  'UKG': 18000,
  'Class 1': 20000,
  'Class 2': 20000,
  'Class 3': 22000,
  'Class 4': 22000,
  'Class 5': 24000,
  'Class 6': 26000,
  'Class 7': 26000,
  'Class 8': 28000,
  'Class 9': 32000,
  'Class 10': 34000,
  'Class 11': 38000,
  'Class 12': 40000,
};

// @desc    Get ERP Dashboard Overview Metrics
// @route   GET /api/erp/overview
// @access  Private
exports.getERPOverview = async (req, res) => {
  const cached = getCache('erp_overview', 8000);
  if (cached) {
    return res.json({ success: true, data: cached });
  }

  try {
    // Today's Date normalized to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Parallel concurrent execution for all KPI metrics
    const [
      totalStudents,
      maleStudents,
      femaleStudents,
      todayAttendance,
      feeSummary,
      classDistribution,
      recentAdmissions,
    ] = await Promise.all([
      Student.countDocuments({ status: 'Active' }),
      Student.countDocuments({ status: 'Active', gender: 'Male' }),
      Student.countDocuments({ status: 'Active', gender: 'Female' }),
      Attendance.find({ date: { $gte: today, $lt: tomorrow } }).lean(),
      FeeRecord.aggregate([
        {
          $group: {
            _id: null,
            totalExpected: { $sum: '$totalFee' },
            totalCollected: { $sum: '$paidAmount' },
            totalOutstanding: { $sum: '$dueAmount' },
          }
        }
      ]),
      Student.aggregate([
        { $match: { status: 'Active' } },
        { $group: { _id: '$class', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Student.find({ status: 'Active' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('scholarNo firstName lastName class section admissionDate')
        .lean(),
    ]);

    let totalRecordedToday = 0;
    let presentToday = 0;
    let absentToday = 0;

    todayAttendance.forEach(att => {
      totalRecordedToday += (att.totalStudents || 0);
      presentToday += (att.presentCount || 0);
      absentToday += (att.absentCount || 0);
    });

    const attendanceRate = totalRecordedToday > 0 
      ? Math.round((presentToday / totalRecordedToday) * 100) 
      : (totalStudents > 0 ? 100 : 0);

    const fees = feeSummary[0] || {
      totalExpected: 0,
      totalCollected: 0,
      totalOutstanding: 0,
    };

    const overviewData = {
      totalStudents,
      maleStudents,
      femaleStudents,
      attendanceRate,
      todayPresent: presentToday,
      todayAbsent: absentToday,
      totalExpectedFee: fees.totalExpected || 0,
      totalCollectedFee: fees.totalCollected || 0,
      totalOutstandingFee: fees.totalOutstanding || 0,
      classDistribution,
      recentAdmissions,
    };

    setCache('erp_overview', overviewData);

    res.json({
      success: true,
      data: overviewData
    });
  } catch (error) {
    console.error('Error fetching ERP overview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Paginated & Filtered Student List
// @route   GET /api/erp/students
// @access  Private
exports.getStudents = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const { className, section, status = 'Active', search } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (className && className !== 'All') {
      query.class = className;
    }
    if (section && section !== 'All') {
      query.section = section.toUpperCase();
    }
    if (search && search.trim() !== '') {
      const term = search.trim();
      query.$or = [
        { scholarNo: { $regex: term, $options: 'i' } },
        { firstName: { $regex: term, $options: 'i' } },
        { lastName: { $regex: term, $options: 'i' } },
        { parentPhone: { $regex: term, $options: 'i' } },
        { fatherName: { $regex: term, $options: 'i' } },
      ];
    }

    const [students, total] = await Promise.all([
      Student.find(query)
        .sort({ class: 1, section: 1, rollNo: 1, scholarNo: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: students,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Student Details with Fee & Attendance Records
// @route   GET /api/erp/students/:id
// @access  Private
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const fee = await FeeRecord.findOne({ student: student._id });

    res.json({
      success: true,
      data: {
        student,
        fee,
      }
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register / Admit New Student
// @route   POST /api/erp/students
// @access  Private
exports.createStudent = async (req, res) => {
  try {
    const {
      scholarNo,
      rollNo,
      firstName,
      lastName,
      class: studentClass,
      section,
      stream,
      gender,
      dob,
      bloodGroup,
      fatherName,
      motherName,
      parentPhone,
      parentEmail,
      address,
      academicYear = '2026-2027',
    } = req.body;

    // Generate scholar number if not provided
    let finalScholarNo = scholarNo;
    if (!finalScholarNo) {
      const count = await Student.countDocuments();
      const seq = String(count + 1).padStart(4, '0');
      finalScholarNo = `MMPS-2026-${seq}`;
    }

    // Auto-calculate roll number if missing
    let finalRollNo = rollNo;
    if (!finalRollNo) {
      const maxRoll = await Student.findOne({ class: studentClass, section })
        .sort({ rollNo: -1 })
        .select('rollNo');
      finalRollNo = maxRoll ? maxRoll.rollNo + 1 : 1;
    }

    const newStudent = await Student.create({
      scholarNo: finalScholarNo,
      rollNo: finalRollNo,
      firstName,
      lastName,
      class: studentClass,
      section: (section || 'A').toUpperCase(),
      stream: stream || 'None',
      gender,
      dob: dob || new Date('2015-01-01'),
      bloodGroup: bloodGroup || 'Unknown',
      fatherName,
      motherName,
      parentPhone,
      parentEmail,
      address,
      academicYear,
      status: 'Active',
    });

    // Automatically create Fee record
    const baseFee = CLASS_FEES[studentClass] || 24000;
    await FeeRecord.create({
      student: newStudent._id,
      scholarNo: newStudent.scholarNo,
      studentName: `${newStudent.firstName} ${newStudent.lastName}`,
      class: newStudent.class,
      section: newStudent.section,
      academicYear,
      totalFee: baseFee,
      paidAmount: 0,
      dueAmount: baseFee,
      status: 'Unpaid',
    });

    res.status(201).json({
      success: true,
      message: 'Student admitted successfully',
      data: newStudent,
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update Student
// @route   PUT /api/erp/students/:id
// @access  Private
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Keep FeeRecord in sync with student name / class
    await FeeRecord.findOneAndUpdate(
      { student: student._id },
      {
        studentName: `${student.firstName} ${student.lastName}`,
        class: student.class,
        section: student.section,
      }
    );

    res.json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Remove / Withdraw Student from School Register
// @route   DELETE /api/erp/students/:id
// @access  Private
exports.deleteStudent = async (req, res) => {
  try {
    const { permanent = false, reason = 'Admission Withdrawn / TC Issued' } = { ...req.query, ...req.body };

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    if (permanent === true || permanent === 'true') {
      // Complete permanent removal
      await Student.findByIdAndDelete(req.params.id);
      await FeeRecord.deleteMany({ student: req.params.id });
      invalidateCache('erp_overview');
      return res.json({
        success: true,
        message: `Student ${student.firstName} ${student.lastName} (${student.scholarNo}) has been permanently removed from the school register.`,
      });
    }

    // Mark as withdrawn / Inactive with reason
    student.status = 'Inactive';
    student.withdrawalReason = reason;
    student.withdrawalDate = new Date();
    await student.save();

    // Mark corresponding FeeRecord status
    await FeeRecord.findOneAndUpdate(
      { student: student._id },
      { status: 'Inactive' }
    );

    invalidateCache('erp_overview');

    res.json({
      success: true,
      message: `Student ${student.firstName} ${student.lastName} (${student.scholarNo}) marked as Withdrawn (${reason}).`,
      data: student,
    });
  } catch (error) {
    console.error('Error removing student:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Daily Attendance Roster for a Section
// @route   GET /api/erp/attendance
// @access  Private
exports.getAttendanceRoster = async (req, res) => {
  try {
    const { className = 'Class 10', section = 'A', date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      class: className,
      section: section.toUpperCase(),
      date: targetDate,
    });

    if (existing) {
      return res.json({
        success: true,
        alreadySaved: true,
        data: existing,
      });
    }

    // If not marked yet, fetch current active student list for section
    const students = await Student.find({
      class: className,
      section: section.toUpperCase(),
      status: 'Active',
    })
      .sort({ rollNo: 1, scholarNo: 1 })
      .select('scholarNo rollNo firstName lastName');

    const defaultRecords = students.map(st => ({
      student: st._id,
      scholarNo: st.scholarNo,
      rollNo: st.rollNo,
      studentName: `${st.firstName} ${st.lastName}`,
      status: 'Present',
      remarks: '',
    }));

    res.json({
      success: true,
      alreadySaved: false,
      data: {
        class: className,
        section: section.toUpperCase(),
        date: targetDate,
        totalStudents: defaultRecords.length,
        presentCount: defaultRecords.length,
        absentCount: 0,
        records: defaultRecords,
      }
    });
  } catch (error) {
    console.error('Error getting attendance roster:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save / Update Daily Section Attendance & Apply Absent Fine (₹10/day)
// @route   POST /api/erp/attendance
// @access  Private
exports.saveAttendance = async (req, res) => {
  try {
    const { className, section, date, records } = req.body;
    if (!className || !section || !records) {
      return res.status(400).json({ success: false, message: 'Missing required attendance fields' });
    }

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const totalStudents = records.length;
    const presentCount = records.filter(r => r.status === 'Present').length;
    const absentCount = records.filter(r => r.status === 'Absent').length;

    // Check if attendance already existed for this class, section, date to compute fine diff
    const existing = await Attendance.findOne({
      class: className,
      section: section.toUpperCase(),
      date: targetDate,
    }).lean();

    const prevStatusMap = new Map();
    if (existing && existing.records) {
      existing.records.forEach(r => {
        const key = r.scholarNo || String(r.student);
        prevStatusMap.set(key, r.status);
      });
    }

    // Process absent fine (₹10/day) for every student in records
    for (const rec of records) {
      const key = rec.scholarNo || String(rec.student);
      const prevStatus = prevStatusMap.get(key);
      const newStatus = rec.status;

      let diff = 0;
      if (prevStatus !== 'Absent' && newStatus === 'Absent') {
        diff = 1; // Newly marked Absent: +₹10
      } else if (prevStatus === 'Absent' && newStatus !== 'Absent') {
        diff = -1; // Corrected from Absent: -₹10
      }

      if (diff !== 0) {
        let feeRecord = null;
        if (rec.student) {
          feeRecord = await FeeRecord.findOne({ student: rec.student });
        }
        if (!feeRecord && rec.scholarNo) {
          feeRecord = await FeeRecord.findOne({ scholarNo: rec.scholarNo });
        }

        if (feeRecord) {
          const fineChange = diff * 10;
          feeRecord.fine = Math.max(0, (feeRecord.fine || 0) + fineChange);
          feeRecord.dueAmount = Math.max(
            0,
            ((feeRecord.totalFee || 24000) - (feeRecord.discount || 0) + feeRecord.fine) - (feeRecord.paidAmount || 0)
          );

          if (feeRecord.dueAmount === 0 && feeRecord.paidAmount > 0) {
            feeRecord.status = 'Paid';
          } else if (feeRecord.paidAmount > 0) {
            feeRecord.status = 'Partial';
          } else {
            feeRecord.status = 'Unpaid';
          }

          await feeRecord.save();
        }
      }
    }

    const saved = await Attendance.findOneAndUpdate(
      {
        class: className,
        section: section.toUpperCase(),
        date: targetDate,
      },
      {
        class: className,
        section: section.toUpperCase(),
        date: targetDate,
        records,
        totalStudents,
        presentCount,
        absentCount,
        markedBy: req.user?._id,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    invalidateCache('erp_overview');

    res.json({
      success: true,
      message: 'Attendance saved and ₹10/day absent fine synchronized to student fee ledger.',
      data: saved,
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get Class Attendance Summary with % for every student
// @route   GET /api/erp/attendance/summary
// @access  Private
exports.getClassAttendanceSummary = async (req, res) => {
  try {
    const { className = 'Class 10', section = 'A' } = req.query;
    const sec = section.toUpperCase();

    // Fetch all active students in section
    const students = await Student.find({
      class: className,
      section: sec,
      status: 'Active',
    })
      .sort({ rollNo: 1, scholarNo: 1 })
      .lean();

    // Fetch all attendance documents recorded for this section
    const attendanceRecords = await Attendance.find({
      class: className,
      section: sec,
    }).lean();

    const totalWorkingDays = attendanceRecords.length;

    // Map each student's stats
    const studentStats = students.map(st => {
      let presentDays = 0;
      let absentDays = 0;
      let lateDays = 0;
      let leaveDays = 0;

      attendanceRecords.forEach(att => {
        const studentEntry = att.records?.find(
          r => String(r.student) === String(st._id) || r.scholarNo === st.scholarNo
        );
        if (studentEntry) {
          if (studentEntry.status === 'Present') presentDays++;
          else if (studentEntry.status === 'Absent') absentDays++;
          else if (studentEntry.status === 'Late') { lateDays++; presentDays++; }
          else if (studentEntry.status === 'Leave') leaveDays++;
        }
      });

      // If no attendance records yet, default to 100%
      const attendancePercentage = totalWorkingDays > 0
        ? Number(((presentDays / totalWorkingDays) * 100).toFixed(1))
        : 100.0;

      const fine = absentDays * 10;

      return {
        _id: st._id,
        rollNo: st.rollNo,
        scholarNo: st.scholarNo,
        firstName: st.firstName,
        lastName: st.lastName,
        studentName: `${st.firstName} ${st.lastName}`,
        fatherName: st.fatherName,
        motherName: st.motherName || 'N/A',
        parentPhone: st.parentPhone,
        parentEmail: st.parentEmail || '',
        address: st.address || '',
        gender: st.gender,
        bloodGroup: st.bloodGroup || 'Unknown',
        class: st.class,
        section: st.section,
        totalWorkingDays,
        presentDays,
        absentDays,
        lateDays,
        leaveDays,
        attendancePercentage,
        fine,
      };
    });

    const classAveragePercentage = studentStats.length > 0
      ? Number((studentStats.reduce((acc, s) => acc + s.attendancePercentage, 0) / studentStats.length).toFixed(1))
      : 100.0;

    res.json({
      success: true,
      class: className,
      section: sec,
      totalWorkingDays,
      totalStudents: students.length,
      classAveragePercentage,
      data: studentStats,
    });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export Class Attendance as Excel / CSV file
// @route   GET /api/erp/attendance/export
// @access  Private
exports.exportClassAttendanceExcel = async (req, res) => {
  try {
    const { className = 'Class 10', section = 'A' } = req.query;
    const sec = section.toUpperCase();

    const students = await Student.find({
      class: className,
      section: sec,
      status: 'Active',
    })
      .sort({ rollNo: 1, scholarNo: 1 })
      .lean();

    const attendanceRecords = await Attendance.find({
      class: className,
      section: sec,
    }).lean();

    const totalWorkingDays = attendanceRecords.length;

    // Build CSV string with UTF-8 BOM
    const headers = [
      'Roll No',
      'Scholar No',
      'Student Name',
      'Father Name',
      'Mother Name',
      'Parent Contact',
      'Address',
      'Total Working Days',
      'Present Days',
      'Absent Days',
      'Late Days',
      'Leave Days',
      'Attendance % (Out of 100%)',
      'Absent Fine (Rs 10/day)',
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = students.map(st => {
      let presentDays = 0;
      let absentDays = 0;
      let lateDays = 0;
      let leaveDays = 0;

      attendanceRecords.forEach(att => {
        const studentEntry = att.records?.find(
          r => String(r.student) === String(st._id) || r.scholarNo === st.scholarNo
        );
        if (studentEntry) {
          if (studentEntry.status === 'Present') presentDays++;
          else if (studentEntry.status === 'Absent') absentDays++;
          else if (studentEntry.status === 'Late') { lateDays++; presentDays++; }
          else if (studentEntry.status === 'Leave') leaveDays++;
        }
      });

      const attendancePercentage = totalWorkingDays > 0
        ? ((presentDays / totalWorkingDays) * 100).toFixed(1) + '%'
        : '100.0%';

      const fine = absentDays * 10;

      return [
        escapeCsv(st.rollNo),
        escapeCsv(st.scholarNo),
        escapeCsv(`${st.firstName} ${st.lastName}`),
        escapeCsv(st.fatherName),
        escapeCsv(st.motherName || 'N/A'),
        escapeCsv(st.parentPhone),
        escapeCsv(st.address || ''),
        escapeCsv(totalWorkingDays),
        escapeCsv(presentDays),
        escapeCsv(absentDays),
        escapeCsv(lateDays),
        escapeCsv(leaveDays),
        escapeCsv(attendancePercentage),
        escapeCsv(`Rs ${fine}`),
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
    const safeFilename = `MMPS_${className.replace(/\s+/g, '_')}_${sec}_Attendance_Report.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error exporting attendance report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Paginated Fee Records
// @route   GET /api/erp/fees
// @access  Private
exports.getFeeRecords = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const { className, status, search } = req.query;
    const query = {};

    if (className && className !== 'All') {
      query.class = className;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search && search.trim() !== '') {
      const term = search.trim();
      query.$or = [
        { scholarNo: { $regex: term, $options: 'i' } },
        { studentName: { $regex: term, $options: 'i' } },
      ];
    }

    const [fees, total] = await Promise.all([
      FeeRecord.find(query)
        .sort({ class: 1, section: 1, scholarNo: 1 })
        .skip(skip)
        .limit(limit)
        .populate('student', 'parentPhone fatherName address')
        .lean(),
      FeeRecord.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: fees,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      }
    });
  } catch (error) {
    console.error('Error fetching fee records:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Collect Fee Payment & Generate Receipt
// @route   POST /api/erp/fees/collect
// @access  Private
exports.collectFee = async (req, res) => {
  try {
    const { feeId, amount, paymentMode = 'Cash', transactionId = '', remarks = '' } = req.body;
    const payAmount = Number(amount);

    if (!feeId || !payAmount || payAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid fee record ID and amount required' });
    }

    const fee = await FeeRecord.findById(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }

    const receiptNo = `MMPS-REC-${Date.now().toString().slice(-6)}`;
    const newPayment = {
      receiptNo,
      amount: payAmount,
      date: new Date(),
      paymentMode,
      transactionId,
      remarks,
      collectedBy: req.user?.managementId || 'Admin Staff',
    };

    fee.payments.push(newPayment);
    fee.paidAmount = (fee.paidAmount || 0) + payAmount;
    fee.dueAmount = Math.max(0, ((fee.totalFee || 0) - (fee.discount || 0) + (fee.fine || 0)) - fee.paidAmount);

    if (fee.dueAmount === 0) {
      fee.status = 'Paid';
    } else if (fee.paidAmount > 0) {
      fee.status = 'Partial';
    } else {
      fee.status = 'Unpaid';
    }

    await fee.save();
    invalidateCache('erp_overview');

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      receipt: newPayment,
      data: fee,
    });
  } catch (error) {
    console.error('Error collecting fee payment:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

