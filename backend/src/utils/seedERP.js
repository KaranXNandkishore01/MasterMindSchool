const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../backend/.env') });
const mongoose = require('mongoose');
const Student = require('../models/Student');
const FeeRecord = require('../models/FeeRecord');
const Attendance = require('../models/Attendance');

const FIRST_NAMES_MALE = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith', 'Aaryan', 'Dhruv', 'Kabir', 'Rishi', 'Karan',
  'Nikhil', 'Rohit', 'Aman', 'Shivam', 'Ayush', 'Abhishek', 'Mayank', 'Harsh', 'Mohit', 'Aniket'
];

const FIRST_NAMES_FEMALE = [
  'Aadhya', 'Ananya', 'Diya', 'Saanvi', 'Kiara', 'Ira', 'Myra', 'Prisha', 'Riya', 'Anushka',
  'Pari', 'Avani', 'Sara', 'Aditi', 'Sneha', 'Pooja', 'Tanvi', 'Kavya', 'Priya', 'Khushi',
  'Isha', 'Meera', 'Shruti', 'Anjali', 'Simran', 'Kritika', 'Bhavna', 'Shreya', 'Divya', 'Neha'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Singh', 'Chouhan', 'Tiwari', 'Mishra', 'Yadav', 'Gupta', 'Jain',
  'Dubey', 'Pandey', 'Prajapati', 'Rajput', 'Soni', 'Thakur', 'Mehta', 'Agrawal', 'Nema', 'Malviya'
];

const CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

const SECTIONS = ['A', 'B', 'C'];

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

async function seedERP(targetCount = 2000) {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in .env');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    const currentCount = await Student.countDocuments();
    console.log(`Current student count: ${currentCount}`);

    if (currentCount >= targetCount) {
      console.log(`Database already has ${currentCount} students. Skipping seed generation.`);
      process.exit(0);
    }

    const needed = targetCount - currentCount;
    console.log(`Generating ${needed} mock students to reach ${targetCount} student ERP capacity...`);

    const studentsToInsert = [];
    const feesToInsert = [];

    // Distribute across classes and sections
    const totalSections = CLASSES.length * SECTIONS.length; // 15 * 3 = 45 sections
    const studentsPerSection = Math.ceil(needed / totalSections);

    let globalSeq = currentCount + 1;

    for (const className of CLASSES) {
      const baseFee = CLASS_FEES[className] || 24000;

      for (const section of SECTIONS) {
        for (let rollNo = 1; rollNo <= studentsPerSection; rollNo++) {
          if (studentsToInsert.length >= needed) break;

          const isMale = Math.random() > 0.48;
          const firstName = isMale
            ? FIRST_NAMES_MALE[Math.floor(Math.random() * FIRST_NAMES_MALE.length)]
            : FIRST_NAMES_FEMALE[Math.floor(Math.random() * FIRST_NAMES_FEMALE.length)];
          const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
          const fatherFirstName = FIRST_NAMES_MALE[Math.floor(Math.random() * FIRST_NAMES_MALE.length)];
          const motherFirstName = FIRST_NAMES_FEMALE[Math.floor(Math.random() * FIRST_NAMES_FEMALE.length)];

          const scholarNo = `MMPS-2026-${String(globalSeq).padStart(4, '0')}`;
          const studentId = new mongoose.Types.ObjectId();

          let stream = 'None';
          if (className === 'Class 11' || className === 'Class 12') {
            const streams = ['Science', 'Commerce', 'Arts'];
            stream = streams[Math.floor(Math.random() * streams.length)];
          }

          const studentDoc = {
            _id: studentId,
            scholarNo,
            rollNo,
            firstName,
            lastName,
            class: className,
            section,
            stream,
            gender: isMale ? 'Male' : 'Female',
            dob: new Date(2008 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)),
            bloodGroup: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
            fatherName: `${fatherFirstName} ${lastName}`,
            motherName: `${motherFirstName} ${lastName}`,
            parentPhone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
            parentEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
            address: `Ward ${Math.floor(1 + Math.random() * 15)}, Station Road, Pipariya (M.P.)`,
            admissionDate: new Date('2026-04-01'),
            academicYear: '2026-2027',
            status: 'Active',
          };

          // Fee calculations (70% Paid or Partial, 30% Unpaid)
          const feeStatusRoll = Math.random();
          let paidAmount = 0;
          let feeStatus = 'Unpaid';
          const payments = [];

          if (feeStatusRoll > 0.6) {
            paidAmount = baseFee;
            feeStatus = 'Paid';
            payments.push({
              receiptNo: `REC-${scholarNo}-1`,
              amount: baseFee,
              date: new Date('2026-04-10'),
              paymentMode: ['UPI', 'Cash', 'Bank Transfer'][Math.floor(Math.random() * 3)],
              transactionId: `TXN${Math.floor(100000 + Math.random() * 900000)}`,
              remarks: 'Annual Term Fee cleared',
              collectedBy: 'Finance Staff',
            });
          } else if (feeStatusRoll > 0.25) {
            paidAmount = Math.round(baseFee * 0.5);
            feeStatus = 'Partial';
            payments.push({
              receiptNo: `REC-${scholarNo}-1`,
              amount: paidAmount,
              date: new Date('2026-04-12'),
              paymentMode: 'Cash',
              transactionId: '',
              remarks: 'Installment 1 paid',
              collectedBy: 'Finance Staff',
            });
          }

          const dueAmount = Math.max(0, baseFee - paidAmount);

          const feeDoc = {
            student: studentId,
            scholarNo,
            studentName: `${firstName} ${lastName}`,
            class: className,
            section,
            academicYear: '2026-2027',
            totalFee: baseFee,
            discount: 0,
            paidAmount,
            dueAmount,
            status: feeStatus,
            payments,
          };

          studentsToInsert.push(studentDoc);
          feesToInsert.push(feeDoc);
          globalSeq++;
        }
      }
    }

    console.log(`Inserting ${studentsToInsert.length} students via bulkWrite...`);
    // Insert in chunks of 500 for optimal MongoDB Atlas performance
    const chunkSize = 500;
    for (let i = 0; i < studentsToInsert.length; i += chunkSize) {
      const studentChunk = studentsToInsert.slice(i, i + chunkSize);
      const feeChunk = feesToInsert.slice(i, i + chunkSize);
      await Student.insertMany(studentChunk);
      await FeeRecord.insertMany(feeChunk);
      console.log(`Inserted chunk ${i / chunkSize + 1} (${studentChunk.length} students & fee records)`);
    }

    // Generate sample attendance for Class 10 Section A today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const class10AStudents = await Student.find({ class: 'Class 10', section: 'A' }).select('scholarNo rollNo firstName lastName');

    if (class10AStudents.length > 0) {
      const records = class10AStudents.map((st, idx) => ({
        student: st._id,
        scholarNo: st.scholarNo,
        rollNo: st.rollNo,
        studentName: `${st.firstName} ${st.lastName}`,
        status: idx % 12 === 0 ? 'Absent' : 'Present',
        remarks: idx % 12 === 0 ? 'Medical leave requested' : '',
      }));

      await Attendance.findOneAndUpdate(
        { class: 'Class 10', section: 'A', date: today },
        {
          class: 'Class 10',
          section: 'A',
          date: today,
          academicYear: '2026-2027',
          records,
          totalStudents: records.length,
          presentCount: records.filter(r => r.status === 'Present').length,
          absentCount: records.filter(r => r.status === 'Absent').length,
        },
        { upsert: true }
      );
      console.log('Seeded sample attendance for Class 10-A');
    }

    console.log('✅ ERP seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedERP(2000);

