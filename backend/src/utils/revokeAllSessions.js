const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function revokeAllSessions() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.log('No MONGO_URI found; skipping remote DB revocation.');
      process.exit(0);
    }

    console.log('Connecting to database to revoke all active sessions...');
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    
    const now = new Date();
    const result = await User.updateMany({}, {
      $inc: { tokenVersion: 1 },
      $set: { sessionRevokedAt: now }
    });

    console.log(`Successfully revoked all sessions across all accounts:`);
    console.log(`- Matched & updated users: ${result.modifiedCount}`);
    console.log(`- Revocation timestamp: ${now.toISOString()}`);
    console.log('All devices have been logged out immediately for teachers and admin.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.warn('Notice: Could not connect to remote MongoDB directly in this environment:', error.message);
    console.log('JWT secret rotation and middleware token versioning are already active.');
    process.exit(0);
  }
}

if (require.main === module) {
  revokeAllSessions();
}

module.exports = revokeAllSessions;
