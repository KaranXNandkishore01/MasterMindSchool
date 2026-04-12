const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const managementId = req.body.managementId?.trim();
  const password = req.body.password?.trim();

  try {
    const user = await User.findOne({ managementId });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      
      user.lastLogin = new Date();
      await user.save();

      res.json({
        _id: user._id,
        managementId: user.managementId,
        role: user.role,
      });
    } else {
      console.warn(`Failed login attempt for managementId: ${managementId} at ${new Date().toISOString()}`);
      res.status(401).json({ message: 'Invalid managementId or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new user (Admin only typically, or initial super admin setup)
// @route   POST /api/auth/register
// @access  Private/Admin
const registerUser = async (req, res) => {
  const { managementId, password } = req.body;

  try {
    const userExists = await User.findOne({ managementId });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      managementId,
      password,
      role: 'Management'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        managementId: user.managementId,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
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

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
};
