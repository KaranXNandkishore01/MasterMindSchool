const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isDbConnected } = require('../utils/dataStore');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const managementId = req.body.managementId?.trim();
  const password = req.body.password?.trim();

  try {
    let user = null;
    if (isDbConnected()) {
      user = await User.findOne({ managementId });
    }

    // Default admin initialization if not present in DB
    if (!user && managementId === 'mastersagar_mgt' && password === 'Madam28$$') {
      if (isDbConnected()) {
        user = await User.create({
          managementId: 'mastersagar_mgt',
          password: 'Madam28$$',
          name: 'Management Admin',
          role: 'Management',
        }).catch(() => null);
      }
      if (!user) {
        user = {
          _id: '6ae9d480f2a58538d9c90562',
          managementId: 'mastersagar_mgt',
          name: 'Management Admin',
          role: 'Management',
        };
      }
    }

    // Default Class Teacher initialization if not present in DB
    const isTeacherId = managementId === 'teacher_mmps' || managementId === 'teacher';
    const isTeacherPass = password === 'Teacher28$$' || password === 'Teacher@123';
    if (!user && isTeacherId && isTeacherPass) {
      if (isDbConnected()) {
        user = await User.create({
          managementId: 'teacher_mmps',
          password: 'Teacher28$$',
          name: 'Class Teacher',
          role: 'Teacher',
          assignedClass: 'Class 10',
          assignedSection: 'A',
        }).catch(async () => {
          return await User.findOne({ managementId: 'teacher_mmps' });
        });
      }
      if (!user) {
        user = {
          _id: '6be9d480f2a58538d9c90563',
          managementId: 'teacher_mmps',
          name: 'Class Teacher',
          role: 'Teacher',
          assignedClass: 'Class 10',
          assignedSection: 'A',
        };
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid managementId or password' });
    }

    let isMatch = false;
    if (user.matchPassword) {
      isMatch = await user.matchPassword(password);
    } else {
      isMatch = user.password === password;
    }

    // Direct fallback password check for management admin & teacher
    if (!isMatch && managementId === 'mastersagar_mgt' && password === 'Madam28$$') {
      isMatch = true;
    }
    if (!isMatch && isTeacherId && isTeacherPass) {
      isMatch = true;
    }

    if (isMatch) {
      const jwtSecret = process.env.JWT_SECRET || 'mmps_sec_6c9ba1c3c060bbbef50fc02e0117e19eb3ca77e8a1219ae6558903a107a9c548';
      const token = jwt.sign(
        {
          userId: String(user._id),
          managementId: user.managementId,
          role: user.role || 'Management',
          tokenVersion: user.tokenVersion || 2,
        },
        jwtSecret,
        { expiresIn: '30d' }
      );

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      if (user.save) {
        user.lastLogin = new Date();
        await user.save().catch(() => {});
      }

      return res.json({
        _id: String(user._id),
        managementId: user.managementId,
        role: user.role || 'Management',
        name: user.name || (user.role === 'Teacher' ? 'Class Teacher' : 'Management Admin'),
        assignedClass: user.assignedClass || 'Class 10',
        assignedSection: user.assignedSection || 'A',
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid managementId or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Private/Admin
const registerUser = async (req, res) => {
  const { managementId, password, role = 'Management' } = req.body;

  try {
    const userExists = await User.findOne({ managementId });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      managementId,
      password,
      role
    });

    const token = jwt.sign(
      { userId: String(user._id), managementId: user.managementId, role: user.role },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      _id: String(user._id),
      managementId: user.managementId,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Verify current authenticated session
// @route   GET /api/auth/verify
// @access  Private
const verifySession = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      managementId: req.user.managementId,
      name: req.user.name,
      role: req.user.role,
      assignedClass: req.user.assignedClass,
      assignedSection: req.user.assignedSection,
      tokenVersion: req.user.tokenVersion,
    },
  });
};

// @desc    Logout all devices immediately for teachers and admin
// @route   POST /api/auth/logout-all
// @access  Private
const logoutAllDevices = async (req, res) => {
  try {
    const revokedAt = new Date();
    if (isDbConnected()) {
      await User.updateMany({}, {
        $inc: { tokenVersion: 1 },
        $set: { sessionRevokedAt: revokedAt },
      });
    }

    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: 'All devices logged out immediately across all accounts.',
      revokedAt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  verifySession,
  logoutAllDevices,
};
