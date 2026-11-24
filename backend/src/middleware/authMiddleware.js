const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = req.cookies?.jwt;

  // Check Bearer authorization header if no cookie present
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  // Reject obsolete or demo tokens
  if (token === 'local_demo_token' || token === 'local_teacher_token') {
    return res.status(401).json({ message: 'Session expired or logged out. Please log in again.' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'mmps_sec_6c9ba1c3c060bbbef50fc02e0117e19eb3ca77e8a1219ae6558903a107a9c548';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Database lookup to verify user status and ensure session has not been revoked
    let user = null;
    if (mongoose.Types.ObjectId.isValid(decoded.userId)) {
      user = await User.findById(decoded.userId).select('-password');
    }
    if (!user && decoded.managementId) {
      user = await User.findOne({ managementId: decoded.managementId }).select('-password');
    }

    if (user) {
      // Check token version against user's current tokenVersion
      if (user.tokenVersion && decoded.tokenVersion && decoded.tokenVersion < user.tokenVersion) {
        return res.status(401).json({ message: 'All sessions have been revoked. Please log in again.' });
      }
      // Check if session was revoked after token was issued
      if (user.sessionRevokedAt && decoded.iat && (decoded.iat * 1000) < new Date(user.sessionRevokedAt).getTime()) {
        return res.status(401).json({ message: 'Session expired by administrative logout. Please log in again.' });
      }

      req.user = user;
      return next();
    }

    // Fallback if DB is temporarily unreachable: require verified tokenVersion >= 2
    if (decoded.role && decoded.managementId && decoded.tokenVersion && decoded.tokenVersion >= 2) {
      req.user = {
        _id: decoded.userId,
        managementId: decoded.managementId,
        role: decoded.role,
      };
      return next();
    }

    res.status(401).json({ message: 'Not authorized, session revoked or invalid user' });
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed or expired' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role: ${req.user?.role} is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorize };
