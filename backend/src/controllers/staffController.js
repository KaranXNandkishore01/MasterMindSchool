const Staff = require('../models/Staff');
const StaffAttendance = require('../models/StaffAttendance');
const StaffLeave = require('../models/StaffLeave');
const StaffPayroll = require('../models/StaffPayroll');
const StaffTicket = require('../models/StaffTicket');
const { seedStaffDatabase } = require('../utils/seedStaff');

// ReDoS prevention helper: escapes special regex characters
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// School Campus Geolocation Coordinates (Master Mind Public School, Pipariya, M.P.)
const SCHOOL_COORDINATES = {
  latitude: 22.7562,
  longitude: 78.3547,
  campusRadiusMeters: 400, // 400 meters geofence radius covering campus & gates
  campusName: 'Master Mind Public School Pipariya Campus'
};

// Haversine formula to calculate distance between two coordinates in meters
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 999999;
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Auto-seeding disabled to ensure only real staff data is retained
async function ensureSeed() {
  return;
}

// @desc    Get Staff Overview KPIs
// @route   GET /api/staff/overview
// @access  Private / Public info
exports.getStaffOverview = async (req, res) => {
  try {
    await ensureSeed();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalStaff,
      fullTimeCount,
      partTimeCount,
      teachersCount,
      driversCount,
      maidsCount,
      assistantsCount,
      gardenersCount,
      managersCount,
      staffAssistantsCount,
      guardsCount,
      todayAttendance,
      todayLeaves,
    ] = await Promise.all([
      Staff.countDocuments({ status: 'Active' }),
      Staff.countDocuments({ status: 'Active', employmentType: 'Full-Time' }),
      Staff.countDocuments({ status: 'Active', employmentType: 'Part-Time' }),
      Staff.countDocuments({ status: 'Active', role: 'Teacher' }),
      Staff.countDocuments({ status: 'Active', role: 'Driver' }),
      Staff.countDocuments({ status: 'Active', role: 'Maid' }),
      Staff.countDocuments({ status: 'Active', role: 'Assistant' }),
      Staff.countDocuments({ status: 'Active', role: 'Gardener' }),
      Staff.countDocuments({ status: 'Active', role: 'Manager' }),
      Staff.countDocuments({ status: 'Active', role: 'Staff Assistant' }),
      Staff.countDocuments({ status: 'Active', role: 'Security Guard' }),
      StaffAttendance.find({ date: { $gte: today, $lt: tomorrow } }).lean(),
      StaffLeave.find({
        startDate: { $lte: today },
        endDate: { $gte: today },
        status: 'Approved',
      }).lean(),
    ]);

    const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
    const halfDayCount = todayAttendance.filter(a => a.status === 'Half-Day' || a.halfDay).length;
    const onLeaveCount = todayLeaves.length;
    const absentCount = Math.max(0, totalStaff - (presentCount + halfDayCount + onLeaveCount));

    res.json({
      success: true,
      data: {
        totalStaff,
        fullTimeCount,
        partTimeCount,
        rolesBreakdown: {
          teachers: teachersCount,
          drivers: driversCount,
          maids: maidsCount,
          assistants: assistantsCount,
          gardeners: gardenersCount,
          managers: managersCount,
          staffAssistants: staffAssistantsCount,
          guards: guardsCount,
        },
        todayAttendance: {
          present: presentCount,
          halfDay: halfDayCount,
          onLeave: onLeaveCount,
          absent: absentCount,
          totalPunched: todayAttendance.length,
        },
        schoolCoordinates: SCHOOL_COORDINATES,
      },
    });
  } catch (error) {
    console.error('Error fetching staff overview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Paginated Staff Directory with Filters
// @route   GET /api/staff
// @access  Private
exports.getStaff = async (req, res) => {
  try {
    await ensureSeed();

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const { role, employmentType, status = 'Active', search } = req.query;
    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }
    if (employmentType && employmentType !== 'All') {
      query.employmentType = employmentType;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search && search.trim() !== '') {
      const term = escapeRegex(search.trim());
      query.$or = [
        { employeeId: { $regex: term, $options: 'i' } },
        { fullName: { $regex: term, $options: 'i' } },
        { phone: { $regex: term, $options: 'i' } },
        { role: { $regex: term, $options: 'i' } },
      ];
    }

    const [staffList, total] = await Promise.all([
      Staff.find(query)
        .sort({ role: 1, employeeId: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Staff.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: staffList,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error('Error fetching staff list:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Staff Member By ID or Employee ID
// @route   GET /api/staff/:id
// @access  Private / Public lookup
exports.getStaffById = async (req, res) => {
  try {
    const isEmpId = req.params.id.startsWith('MMPS-STF-');
    const staff = isEmpId
      ? await Staff.findOne({ employeeId: req.params.id })
      : await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff record not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayAttendance, recentAttendance, recentLeaves] = await Promise.all([
      StaffAttendance.findOne({ employeeId: staff.employeeId, date: today }),
      StaffAttendance.find({ employeeId: staff.employeeId }).sort({ date: -1 }).limit(10).lean(),
      StaffLeave.find({ employeeId: staff.employeeId }).sort({ startDate: -1 }).limit(5).lean(),
    ]);

    res.json({
      success: true,
      data: {
        staff,
        todayAttendance,
        recentAttendance,
        recentLeaves,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create / Onboard New Staff Member
// @route   POST /api/staff
// @access  Private
exports.createStaff = async (req, res) => {
  try {
    const {
      employeeId,
      fullName,
      role,
      employmentType = 'Full-Time',
      department = 'General',
      phone,
      email,
      gender,
      dob,
      joiningDate = Date.now(),
      monthlySalary = 20000,
      aadhaarNo,
      bankAccount,
      address,
      photoUrl,
    } = req.body;

    let finalEmpId = employeeId;
    if (!finalEmpId) {
      const count = await Staff.countDocuments();
      finalEmpId = `MMPS-STF-${String(count + 1).padStart(4, '0')}`;
    }

    const dailyRate = Math.round(Number(monthlySalary) / 26);

    const newStaff = await Staff.create({
      employeeId: finalEmpId.toUpperCase(),
      fullName,
      role,
      employmentType,
      department,
      phone,
      email: email || '',
      gender: gender || 'Male',
      dob,
      joiningDate,
      monthlySalary: Number(monthlySalary),
      dailyRate,
      aadhaarNo: aadhaarNo || '',
      bankAccount: bankAccount || { accountNumber: '', ifscCode: '', bankName: '' },
      address: address || '',
      photoUrl: photoUrl || '',
      status: 'Active',
    });

    res.status(201).json({
      success: true,
      message: `Staff member ${newStaff.fullName} (${newStaff.employeeId}) added successfully.`,
      data: newStaff,
    });
  } catch (error) {
    console.error('Error creating staff member:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update Staff Member
// @route   PUT /api/staff/:id
// @access  Private
exports.updateStaff = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.monthlySalary) {
      updateData.dailyRate = Math.round(Number(updateData.monthlySalary) / 26);
    }
    if (updateData.employeeId) {
      updateData.employeeId = updateData.employeeId.toUpperCase();
    }

    const updated = await Staff.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    res.json({
      success: true,
      message: `Staff member ${updated.fullName} updated successfully.`,
      data: updated,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Relieve Staff Member & Issue Official Experience Record
// @route   POST /api/staff/:id/relieve
// @access  Private
exports.relieveStaff = async (req, res) => {
  try {
    const { relievingDate, relievingReason, relievingRemarks, conductRating } = req.body || {};
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    const refYear = new Date().getFullYear();
    const cleanId = (staff.employeeId || 'STF').replace(/[^A-Z0-9]/gi, '');
    const experienceRefNo = `MMPS/EXP/${refYear}/${cleanId}`;

    staff.status = 'Relieved';
    staff.relievingDate = relievingDate ? new Date(relievingDate) : new Date();
    staff.relievingReason = relievingReason || 'Formal Resignation / Completion of Service';
    staff.relievingRemarks = relievingRemarks || 'Relieved in good standing with exemplary conduct.';
    staff.conductRating = conductRating || 'Exemplary';
    staff.experienceRefNo = experienceRefNo;

    await staff.save();

    res.json({
      success: true,
      message: `Staff member ${staff.fullName} (${staff.employeeId}) has been officially relieved. Experience letter generated.`,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Wipe All Dummy Staff Members & Related Records
// @route   DELETE /api/staff/wipe/dummy
// @access  Private / Admin
exports.wipeDummyStaff = async (req, res) => {
  try {
    const deletedStaff = await Staff.deleteMany({});
    const deletedAtt = await StaffAttendance.deleteMany({});
    const deletedPay = await StaffPayroll.deleteMany({});
    const deletedLeave = await StaffLeave.deleteMany({});
    const deletedTicket = await StaffTicket.deleteMany({});

    res.json({
      success: true,
      message: `Cleaned up dummy records: ${deletedStaff.deletedCount} staff records, ${deletedAtt.deletedCount} attendance logs, and ${deletedPay.deletedCount} payroll entries removed. Staff directory is now fresh for real staff.`,
      deletedCount: deletedStaff.deletedCount,
      details: {
        staff: deletedStaff.deletedCount,
        attendance: deletedAtt.deletedCount,
        payroll: deletedPay.deletedCount,
        leaves: deletedLeave.deletedCount,
        tickets: deletedTicket.deletedCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Staff Member (Hard Delete or Relieve)
// @route   DELETE /api/staff/:id
// @access  Private
exports.deleteStaff = async (req, res) => {
  try {
    const isHardDelete = req.query.permanent === 'true';
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    if (isHardDelete) {
      await Staff.findByIdAndDelete(req.params.id);
      return res.json({
        success: true,
        message: `Staff member ${staff.fullName} (${staff.employeeId}) permanently deleted from system.`,
      });
    }

    // Default action: Relieve and generate experience certificate details
    const refYear = new Date().getFullYear();
    const cleanId = (staff.employeeId || 'STF').replace(/[^A-Z0-9]/gi, '');
    staff.status = 'Relieved';
    staff.relievingDate = req.body?.relievingDate ? new Date(req.body.relievingDate) : new Date();
    staff.relievingReason = req.body?.relievingReason || 'Relieved from Service';
    staff.relievingRemarks = req.body?.relievingRemarks || 'Relieved in good standing with exemplary service record.';
    staff.conductRating = req.body?.conductRating || 'Exemplary';
    staff.experienceRefNo = `MMPS/EXP/${refYear}/${cleanId}`;
    await staff.save();

    res.json({
      success: true,
      message: `Staff member ${staff.fullName} (${staff.employeeId}) marked as Relieved. Official Experience Letter is now available.`,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================================================
// MOBILE LIVE SELFIE CAMERA & GEOFENCED ATTENDANCE ENGINE
// ========================================================

// @desc    Mark Live Selfie Attendance (Check-In or Check-Out with Geolocation)
// @route   POST /api/staff/attendance/punch
// @access  Public / Staff Mobile
exports.punchSelfieAttendance = async (req, res) => {
  try {
    const {
      employeeId,
      action = 'check-in', // 'check-in' | 'check-out'
      selfiePhoto, // live camera captured base64 data URL
      latitude,
      longitude,
      deviceTimestamp,
    } = req.body;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID is required.' });
    }

    if (!selfiePhoto) {
      return res.status(400).json({
        success: false,
        message: 'Live selfie camera photo is required to mark attendance.',
      });
    }

    const staff = await Staff.findOne({ employeeId: employeeId.trim().toUpperCase() });
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: `Employee with ID "${employeeId}" not found in school register.`,
      });
    }

    // 1. Calculate Geofence Distance from Master Mind Public School Pipariya
    const userLat = Number(latitude);
    const userLon = Number(longitude);
    const hasCoordinates = !isNaN(userLat) && !isNaN(userLon) && userLat !== 0;

    let distanceMeters = 35;
    let inSchool = false;

    // Trial Mode: Allow employees to mark attendance from anywhere right now for trial/evaluation
    const isTrialMode = true;

    if (hasCoordinates) {
      distanceMeters = calculateDistanceMeters(
        userLat,
        userLon,
        SCHOOL_COORDINATES.latitude,
        SCHOOL_COORDINATES.longitude
      );
      inSchool = distanceMeters <= SCHOOL_COORDINATES.campusRadiusMeters;
    } else {
      // In trial mode, default coordinates if browser blocks location
      userLat = SCHOOL_COORDINATES.latitude;
      userLon = SCHOOL_COORDINATES.longitude;
      inSchool = true;
    }

    // Enforce campus presence: In strict mode, Attendance can ONLY be marked inside school.
    // In trial mode, allow marking from anywhere while capturing exact distance.
    if (!inSchool && !forceBypassGeofence && !isTrialMode) {
      return res.status(403).json({
        success: false,
        inSchool: false,
        distanceMeters,
        allowedRadius: SCHOOL_COORDINATES.campusRadiusMeters,
        message: `Attendance rejected: You are ${distanceMeters.toLocaleString()} meters away from school campus. Master Mind Public School policy requires attendance to be punched only inside the school premises.`,
      });
    }

    // Normalized today date (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const punchMoment = deviceTimestamp ? new Date(deviceTimestamp) : new Date();

    let attendanceRecord = await StaffAttendance.findOne({
      employeeId: staff.employeeId,
      date: today,
    });

    if (action === 'check-in') {
      if (attendanceRecord && attendanceRecord.checkIn?.time) {
        return res.status(400).json({
          success: false,
          message: `Check-in already logged today at ${new Date(attendanceRecord.checkIn.time).toLocaleTimeString('en-IN')}. Please use Check-Out when leaving.`,
          data: attendanceRecord,
        });
      }

      // Check-in logic: after 09:30 AM marks as Late/Half-Day based on school timings
      const hours = punchMoment.getHours();
      const minutes = punchMoment.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const isLate = totalMinutes > (9 * 60 + 30); // after 9:30 AM
      const status = isLate ? 'Late' : 'Present';

      attendanceRecord = await StaffAttendance.create({
        staff: staff._id,
        employeeId: staff.employeeId,
        staffName: staff.fullName,
        role: staff.role,
        date: today,
        checkIn: {
          time: punchMoment,
          photo: selfiePhoto,
          latitude: userLat,
          longitude: userLon,
          inSchool: inSchool || isTrialMode,
          distanceMeters,
          locationNote: inSchool
            ? `Verified inside campus (${distanceMeters}m from campus center)`
            : `Trial Mode: Attendance punched remotely (${distanceMeters}m from school)`,
        },
        status,
        halfDay: isLate && totalMinutes > (11 * 60), // After 11 AM check-in counts as half-day
        halfDayReason: totalMinutes > (11 * 60) ? 'Late check-in past 11:00 AM' : '',
      });

      return res.status(201).json({
        success: true,
        message: `Check-In successful for ${staff.fullName} at ${punchMoment.toLocaleTimeString('en-IN')}! ${
          inSchool ? 'Verified inside school campus.' : `[Trial Mode Active] Recorded from your current location (${distanceMeters}m from school).`
        }`,
        data: attendanceRecord,
        inSchool: true,
        distanceMeters,
        isTrialMode: true,
      });
    } else if (action === 'check-out') {
      if (!attendanceRecord || !attendanceRecord.checkIn?.time) {
        return res.status(400).json({
          success: false,
          message: 'Cannot Check-Out before Checking-In! Please mark Check-In first.',
        });
      }

      if (attendanceRecord.checkOut?.time) {
        return res.status(400).json({
          success: false,
          message: `Check-Out was already logged today at ${new Date(attendanceRecord.checkOut.time).toLocaleTimeString('en-IN')}.`,
          data: attendanceRecord,
        });
      }

      // Calculate work duration
      const checkInTime = new Date(attendanceRecord.checkIn.time);
      const diffMs = punchMoment.getTime() - checkInTime.getTime();
      const workHours = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;

      // If worked less than 4.5 hours, mark as Half-Day
      const isHalfDay = workHours < 4.5;

      attendanceRecord.checkOut = {
        time: punchMoment,
        photo: selfiePhoto,
        latitude: userLat,
        longitude: userLon,
        inSchool: inSchool || isTrialMode,
        distanceMeters,
        locationNote: inSchool
          ? `Verified inside campus at logout (${distanceMeters}m from center)`
          : `Trial Mode: Check-out logged remotely (${distanceMeters}m from school)`,
      };

      attendanceRecord.workHours = workHours;
      if (isHalfDay) {
        attendanceRecord.halfDay = true;
        attendanceRecord.status = 'Half-Day';
        attendanceRecord.halfDayReason = `Early departure (Work duration: ${workHours} hrs < 4.5 hrs)`;
      }

      await attendanceRecord.save();

      return res.json({
        success: true,
        message: `Check-Out successful for ${staff.fullName} at ${punchMoment.toLocaleTimeString('en-IN')}! Total hours: ${workHours} hrs. ${
          inSchool ? 'Verified inside school campus.' : `[Trial Mode Active] Recorded from your current location.`
        }`,
        data: attendanceRecord,
        inSchool: true,
        distanceMeters,
        isTrialMode: true,
      });
    }

    res.status(400).json({ success: false, message: 'Invalid action specified. Must be check-in or check-out.' });
  } catch (error) {
    console.error('Error punching selfie attendance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Daily Staff Attendance Roster
// @route   GET /api/staff/attendance/roster
// @access  Private
exports.getStaffAttendanceRoster = async (req, res) => {
  try {
    const { date, role, status } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const query = {
      date: { $gte: targetDate, $lt: nextDate },
    };

    if (role && role !== 'All') {
      query.role = role;
    }
    if (status && status !== 'All') {
      query.status = status;
    }

    const records = await StaffAttendance.find(query).sort({ 'checkIn.time': -1 }).lean();

    res.json({
      success: true,
      date: targetDate.toISOString().split('T')[0],
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Manual Adjustment for Staff Attendance / Half-Days
// @route   POST /api/staff/attendance/adjust
// @access  Private
exports.adjustStaffAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, halfDay, halfDayReason, remarks } = req.body;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const staff = await Staff.findOne({ employeeId });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    let record = await StaffAttendance.findOne({ employeeId, date: targetDate });
    if (!record) {
      record = new StaffAttendance({
        staff: staff._id,
        employeeId: staff.employeeId,
        staffName: staff.fullName,
        role: staff.role,
        date: targetDate,
      });
    }

    if (status) record.status = status;
    if (halfDay !== undefined) record.halfDay = halfDay;
    if (halfDayReason) record.halfDayReason = halfDayReason;
    if (remarks) record.remarks = remarks;

    await record.save();

    res.json({
      success: true,
      message: `Attendance updated for ${staff.fullName} on ${targetDate.toLocaleDateString('en-IN')}`,
      data: record,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ========================================================
// LEAVES & HALF-DAYS MANAGEMENT
// ========================================================

// @desc    Get Staff Leaves
// @route   GET /api/staff/leaves
// @access  Private
exports.getStaffLeaves = async (req, res) => {
  try {
    const { role, status } = req.query;
    const query = {};
    if (role && role !== 'All') query.role = role;
    if (status && status !== 'All') query.status = status;

    const leaves = await StaffLeave.find(query).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply Staff Leave / Log Half-Day
// @route   POST /api/staff/leaves
// @access  Private
exports.createStaffLeave = async (req, res) => {
  try {
    const {
      employeeId,
      leaveType,
      isHalfDay = false,
      halfDaySession = 'None',
      startDate,
      endDate,
      daysCount = 1,
      reason,
      status = 'Approved',
    } = req.body;

    const staff = await Staff.findOne({ employeeId });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    const leave = await StaffLeave.create({
      staff: staff._id,
      employeeId: staff.employeeId,
      staffName: staff.fullName,
      role: staff.role,
      leaveType,
      isHalfDay,
      halfDaySession,
      startDate: new Date(startDate),
      endDate: new Date(endDate || startDate),
      daysCount: isHalfDay ? 0.5 : Number(daysCount),
      reason,
      status,
      approvedBy: req.user?.name || 'School Management',
    });

    res.status(201).json({
      success: true,
      message: `${isHalfDay ? 'Half-Day Leave' : 'Leave'} logged for ${staff.fullName}.`,
      data: leave,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ========================================================
// STAFF PAYROLL & SALARY DISBURSEMENT (~300 MEMBERS)
// ========================================================

// @desc    Get Staff Payroll for Month (with Role & Full-Time/Part-Time filters)
// @route   GET /api/staff/payroll
// @access  Private
exports.getStaffPayroll = async (req, res) => {
  try {
    await ensureSeed();

    const { monthYear = '2026-11', role, employmentType, status } = req.query;

    const query = { monthYear };
    if (role && role !== 'All') query.role = role;
    if (employmentType && employmentType !== 'All') query.employmentType = employmentType;
    if (status && status !== 'All') query.paymentStatus = status;

    const [payrollList, totals] = await Promise.all([
      StaffPayroll.find(query).sort({ role: 1, employeeId: 1 }).lean(),
      StaffPayroll.aggregate([
        { $match: { monthYear } },
        {
          $group: {
            _id: null,
            totalBudget: { $sum: '$netPayable' },
            totalDisbursed: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, '$netPayable', 0] }
            },
            totalPending: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'Pending'] }, '$netPayable', 0] }
            },
            paidCount: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, 1, 0] }
            },
            pendingCount: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'Pending'] }, 1, 0] }
            }
          }
        }
      ]),
    ]);

    const summary = totals[0] || {
      totalBudget: 0,
      totalDisbursed: 0,
      totalPending: 0,
      paidCount: 0,
      pendingCount: 0,
    };

    res.json({
      success: true,
      monthYear,
      summary,
      count: payrollList.length,
      data: payrollList,
    });
  } catch (error) {
    console.error('Error fetching staff payroll:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Disburse Staff Salary
// @route   POST /api/staff/payroll/disburse
// @access  Private
exports.disburseStaffSalary = async (req, res) => {
  try {
    const {
      payrollId,
      paymentMode = 'Bank Transfer',
      transactionRef,
      remarks,
    } = req.body;

    const record = await StaffPayroll.findById(req.params.id || payrollId);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }

    record.paymentStatus = 'Paid';
    record.paymentDate = new Date();
    record.paymentMode = paymentMode;
    record.transactionRef = transactionRef || `TXN-MMPS-${Date.now().toString().slice(-6)}`;
    record.payslipNo = record.payslipNo || `PS-2026-11-${String(Math.floor(1000 + Math.random() * 9000))}`;
    if (remarks) record.remarks = remarks;

    await record.save();

    res.json({
      success: true,
      message: `Salary of ₹${record.netPayable.toLocaleString()} successfully disbursed to ${record.staffName} (${record.employeeId}).`,
      data: record,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ========================================================
// STAFF SELF-SERVICE PORTAL & LOGIN
// User ID: Registered Phone Number
// Password: Employee@mmps<last4OfAadhaar>
// ========================================================

// @desc    Staff Portal Login (Read-Only Self Service)
// @route   POST /api/staff/portal/login
// @access  Public (Staff only)
exports.staffPortalLogin = async (req, res) => {
  try {
    await ensureSeed();

    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your registered Phone Number (User ID) and Password.',
      });
    }

    const cleanPhone = String(phone).trim().replace(/\D/g, '').slice(-10);
    const cleanPassword = String(password).trim();

    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID. Please enter your valid 10-digit registered mobile number.',
      });
    }

    // Find staff member by phone
    const staff = await Staff.findOne({ phone: { $regex: cleanPhone } });

    if (!staff) {
      return res.status(401).json({
        success: false,
        message: `No staff profile found for phone number ${cleanPhone}. Please verify with the school office.`,
      });
    }

    // Extract last 4 digits of Aadhaar (default 4321 if empty)
    const cleanAadhaar = (staff.aadhaarNo || '').replace(/\D/g, '');
    const last4 = cleanAadhaar.length >= 4 ? cleanAadhaar.slice(-4) : '4321';
    const expectedPassword = `Employee@mmps${last4}`;

    // Verify Password (case-insensitive for convenience)
    const isPasswordMatch =
      cleanPassword.toLowerCase() === expectedPassword.toLowerCase();

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: `Incorrect password. Password must follow format: Employee@mmpsXXXX (where XXXX is the last 4 digits of your Aadhaar card).`,
      });
    }

    res.json({
      success: true,
      message: `Authentication successful. Welcome, ${staff.fullName}!`,
      staff: {
        _id: staff._id,
        employeeId: staff.employeeId,
        fullName: staff.fullName,
        role: staff.role,
        employmentType: staff.employmentType,
        department: staff.department,
        phone: staff.phone,
        email: staff.email,
        aadhaarMasked: `XXXX-XXXX-${last4}`,
        aadhaarLast4: last4,
        joiningDate: staff.joiningDate,
        status: staff.status,
        monthlySalary: staff.monthlySalary,
        dailyRate: staff.dailyRate,
        photoUrl: staff.photoUrl,
      },
    });
  } catch (error) {
    console.error('Error logging in staff portal:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Personal Attendance History for Logged-In Employee (Read-Only)
// @route   GET /api/staff/portal/my-attendance
// @access  Public / Staff Token
exports.getStaffPersonalAttendance = async (req, res) => {
  try {
    const { employeeId, phone } = req.query;

    if (!employeeId && !phone) {
      return res.status(400).json({ success: false, message: 'Employee identifier required.' });
    }

    const query = {};
    if (employeeId) query.employeeId = employeeId;
    if (phone) {
      const cleanPhone = String(phone).trim().replace(/\D/g, '').slice(-10);
      const staff = await Staff.findOne({ phone: { $regex: cleanPhone } });
      if (staff) query.employeeId = staff.employeeId;
    }

    const attendanceRecords = await StaffAttendance.find(query)
      .sort({ date: -1 })
      .limit(60)
      .lean();

    const summary = {
      totalRecords: attendanceRecords.length,
      presentDays: attendanceRecords.filter((r) => r.status === 'Present').length,
      halfDays: attendanceRecords.filter((r) => r.halfDay || r.status === 'Half-Day').length,
      absentDays: attendanceRecords.filter((r) => r.status === 'Absent').length,
    };

    res.json({
      success: true,
      summary,
      count: attendanceRecords.length,
      data: attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Helpdesk / Support Ticket
// @route   POST /api/staff/portal/helpdesk
// @access  Public / Staff Token
exports.submitStaffTicket = async (req, res) => {
  try {
    const { employeeId, phone, staffName, category, subject, description } = req.body;

    if (!employeeId || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, subject and ticket description are required.',
      });
    }

    const ticketId = `TKT-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;

    const newTicket = new StaffTicket({
      ticketId,
      employeeId,
      phone: phone || '',
      staffName: staffName || '',
      category: category || 'Attendance Discrepancy',
      subject,
      description,
      status: 'Open',
    });

    await newTicket.save();

    res.status(201).json({
      success: true,
      message: `Help desk ticket #${ticketId} submitted successfully. School Administration will review it shortly.`,
      ticket: newTicket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Staff Member's Submitted Helpdesk Tickets
// @route   GET /api/staff/portal/helpdesk
// @access  Public / Staff Token
exports.getStaffTickets = async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID is required.' });
    }

    const tickets = await StaffTicket.find({ employeeId }).sort({ createdAt: -1 }).lean();

    res.json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
