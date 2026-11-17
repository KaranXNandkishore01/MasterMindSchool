const Staff = require('../models/Staff');
const StaffPayroll = require('../models/StaffPayroll');

const FIRST_NAMES_MALE = [
  'Rajesh', 'Suresh', 'Mukesh', 'Anil', 'Sunil', 'Ramesh', 'Dinesh', 'Vinod', 'Pramod', 'Santosh',
  'Manoj', 'Deepak', 'Alok', 'Sanjay', 'Ajay', 'Vijay', 'Pankaj', 'Ashok', 'Mahesh', 'Kamlesh',
  'Harish', 'Girish', 'Naresh', 'Rakesh', 'Lalit', 'Jagdish', 'Nitin', 'Sachin', 'Rahul', 'Rohit',
  'Amit', 'Sumit', 'Vikas', 'Vishal', 'Neeraj', 'Dheeraj', 'Anurag', 'Abhishek', 'Gaurav', 'Manish'
];

const FIRST_NAMES_FEMALE = [
  'Sunita', 'Anita', 'Geeta', 'Seema', 'Rekha', 'Kavita', 'Babita', 'Pooja', 'Aarti', 'Neetu',
  'Shashi', 'Usha', 'Sudha', 'Sushma', 'Mamta', 'Sangeeta', 'Manju', 'Saroj', 'Pushpa', 'Chanda',
  'Ritu', 'Swati', 'Priya', 'Neha', 'Shweta', 'Divya', 'Anjali', 'Archana', 'Vandana', 'Rashmi',
  'Monika', 'Preeti', 'Jyoti', 'Shilpa', 'Meenakshi', 'Kiran', 'Sarita', 'Kalpana', 'Alka', 'Bimla'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Patel', 'Tiwari', 'Pandey', 'Mishra', 'Dubey', 'Yadav', 'Singh',
  'Chauhan', 'Rajput', 'Rathore', 'Meena', 'Jain', 'Agarwal', 'Saxena', 'Shrivastava', 'Malviya',
  'Choudhary', 'Thakur', 'Gour', 'Nema', 'Raghuwanshi', 'Ahirwar', 'Kushwaha', 'Lodhi', 'Soni', 'Bhardwaj'
];

// Distribution targeting ~300 total staff members
const ROLE_CONFIGS = [
  { role: 'Teacher', count: 180, salaryRange: [22000, 48000], department: 'Academic', ptRatio: 0.15 },
  { role: 'Driver', count: 35, salaryRange: [16000, 24000], department: 'Transport', ptRatio: 0.10 },
  { role: 'Maid', count: 30, salaryRange: [12000, 18000], department: 'Support & Housekeeping', ptRatio: 0.25 },
  { role: 'Assistant', count: 15, salaryRange: [18000, 26000], department: 'Academic Support', ptRatio: 0.10 },
  { role: 'Gardener', count: 8, salaryRange: [12000, 17000], department: 'Campus Maintenance', ptRatio: 0.20 },
  { role: 'Manager', count: 6, salaryRange: [38000, 65000], department: 'Administration', ptRatio: 0.0 },
  { role: 'Staff Assistant', count: 15, salaryRange: [16000, 25000], department: 'Administration', ptRatio: 0.10 },
  { role: 'Security Guard', count: 11, salaryRange: [14000, 20000], department: 'Security & Safety', ptRatio: 0.0 },
];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedStaffDatabase = async () => {
  try {
    const existingCount = await Staff.countDocuments();
    if (existingCount >= 250) {
      return { seeded: false, count: existingCount };
    }

    console.log(`Current staff count is ${existingCount}. Seeding ~300 staff members...`);
    const staffDocs = [];
    let employeeSeq = 1;

    for (const conf of ROLE_CONFIGS) {
      for (let i = 0; i < conf.count; i++) {
        const isFemale = conf.role === 'Maid' ? true : (conf.role === 'Driver' || conf.role === 'Security Guard' ? false : Math.random() > 0.45);
        const firstName = isFemale ? getRandomElement(FIRST_NAMES_FEMALE) : getRandomElement(FIRST_NAMES_MALE);
        const lastName = getRandomElement(LAST_NAMES);
        const fullName = `${firstName} ${lastName}`;
        const isPartTime = Math.random() < conf.ptRatio;
        const employmentType = isPartTime ? 'Part-Time' : 'Full-Time';

        const baseMonthly = getRandomInt(conf.salaryRange[0], conf.salaryRange[1]);
        const monthlySalary = isPartTime ? Math.round(baseMonthly * 0.65) : baseMonthly;
        const employeeId = `MMPS-STF-${String(employeeSeq).padStart(4, '0')}`;
        employeeSeq++;

        const phone = `9${getRandomInt(100000000, 999999999)}`;
        const aadhaarNo = `${getRandomInt(1000, 9999)} ${getRandomInt(1000, 9999)} ${getRandomInt(1000, 9999)}`;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(1, 99)}@mmpspipariya.edu.in`;

        staffDocs.push({
          employeeId,
          fullName,
          role: conf.role,
          employmentType,
          department: conf.department,
          phone,
          email,
          gender: isFemale ? 'Female' : 'Male',
          monthlySalary,
          dailyRate: Math.round(monthlySalary / 26),
          aadhaarNo,
          bankAccount: {
            accountNumber: `3892019${getRandomInt(100000, 999999)}`,
            ifscCode: 'SBIN0001245',
            bankName: 'State Bank of India, Pipariya',
          },
          address: `Station Road / Ward No. ${getRandomInt(1, 15)}, Pipariya, M.P.`,
          status: 'Active',
        });
      }
    }

    // Insert staff members
    await Staff.deleteMany({});
    await Staff.insertMany(staffDocs);

    // Seed current month payroll records
    const currentMonth = '2026-11';
    await StaffPayroll.deleteMany({ monthYear: currentMonth });

    const insertedStaff = await Staff.find().lean();
    const payrollDocs = insertedStaff.map((st, idx) => {
      const isPaid = idx % 3 !== 0; // ~66% paid, 34% pending for realistic finance tracking
      const halfDayCount = idx % 5 === 0 ? 1 : 0;
      const absentCount = idx % 8 === 0 ? 1 : 0;
      const dailyRate = Math.round(st.monthlySalary / 26);
      const halfDayDeductions = halfDayCount * Math.round(dailyRate / 2);
      const absentDeductions = absentCount * dailyRate;
      const deductions = halfDayDeductions + absentDeductions;
      const netPayable = Math.max(0, st.monthlySalary - deductions);

      return {
        staff: st._id,
        employeeId: st.employeeId,
        staffName: st.fullName,
        role: st.role,
        employmentType: st.employmentType,
        monthYear: currentMonth,
        baseSalary: st.monthlySalary,
        allowances: 0,
        deductions,
        halfDayCount,
        absentCount,
        netPayable,
        paymentStatus: isPaid ? 'Paid' : 'Pending',
        paymentDate: isPaid ? new Date('2026-11-05') : undefined,
        paymentMode: idx % 2 === 0 ? 'Bank Transfer' : 'UPI',
        transactionRef: isPaid ? `UPI-MMPS-${10000 + idx}` : '',
        payslipNo: `PS-2026-11-${String(idx + 1).padStart(4, '0')}`,
      };
    });

    await StaffPayroll.insertMany(payrollDocs);
    console.log(`Successfully seeded ${insertedStaff.length} staff members and payroll records.`);

    return { seeded: true, count: insertedStaff.length };
  } catch (error) {
    console.error('Error seeding staff database:', error);
    return { seeded: false, error: error.message };
  }
};

module.exports = { seedStaffDatabase };
