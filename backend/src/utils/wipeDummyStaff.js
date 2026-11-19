const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Staff = require('../models/Staff');
const StaffAttendance = require('../models/StaffAttendance');
const StaffLeave = require('../models/StaffLeave');
const StaffPayroll = require('../models/StaffPayroll');
const StaffTicket = require('../models/StaffTicket');

async function wipeDummyStaff() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not defined in backend/.env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB. Beginning clean wipe of dummy staff...');

    const staffDel = await Staff.deleteMany({});
    const attDel = await StaffAttendance.deleteMany({});
    const leaveDel = await StaffLeave.deleteMany({});
    const payDel = await StaffPayroll.deleteMany({});
    const ticketDel = await StaffTicket.deleteMany({});

    console.log(`Wipe completed successfully:`);
    console.log(`- Staff records deleted: ${staffDel.deletedCount}`);
    console.log(`- Attendance punches deleted: ${attDel.deletedCount}`);
    console.log(`- Leaves deleted: ${leaveDel.deletedCount}`);
    console.log(`- Payroll records deleted: ${payDel.deletedCount}`);
    console.log(`- Helpdesk tickets deleted: ${ticketDel.deletedCount}`);
    console.log('Staff directory is now completely clean and ready for real staff onboarding.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error wiping dummy staff:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  wipeDummyStaff();
}

module.exports = wipeDummyStaff;
