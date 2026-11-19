import { useRef } from 'react';
import { X, Printer, User, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import sitelogo from '../../assets/sitelogo.png';
import QRCodeView from '../common/QRCodeView';

// Number to English words helper for authentic Date of Birth rendering
const numberToWords = (num) => {
  const ones = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth',
    'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth'];
  const cardinalOnes = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const ordinalTens = ['', '', 'Twentieth', 'Thirtieth', 'Fortieth', 'Fiftieth', 'Sixtieth', 'Seventieth', 'Eightieth', 'Ninetieth'];

  if (num <= 19) return { ordinal: ones[num], cardinal: cardinalOnes[num] };
  const t = Math.floor(num / 10);
  const o = num % 10;
  return {
    ordinal: o === 0 ? ordinalTens[t] : `${tens[t]} ${ones[o]}`,
    cardinal: o === 0 ? tens[t] : `${tens[t]} ${cardinalOnes[o]}`
  };
};

const formatDateToWords = (dateStr) => {
  if (!dateStr) return 'Not Specified';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  const dayWords = numberToWords(day).ordinal;

  let yearWords = '';
  if (year >= 2000 && year < 2100) {
    const remainder = year - 2000;
    yearWords = remainder === 0 ? 'Two Thousand' : `Two Thousand ${numberToWords(remainder).cardinal}`;
  } else if (year >= 1900 && year < 2000) {
    const suffix = year % 100;
    yearWords = `Nineteen ${numberToWords(suffix).cardinal}`;
  } else {
    yearWords = String(year);
  }

  return `${dayWords} ${month} ${yearWords}`;
};

const formatDateNumeric = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const StudentProfileDocModal = ({ student, onClose }) => {
  const printRef = useRef(null);

  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const dobWords = formatDateToWords(student.dob);
  const dobNumeric = formatDateNumeric(student.dob);
  const admissionDateNumeric = formatDateNumeric(student.admissionDate);
  const studentFullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();

  // Structured verification text for QR code
  const studentVerificationQRText = [
    `MASTER MIND PUBLIC SCHOOL, PIPARIYA (M.P.)`,
    `CBSE AFFILIATION: 1030456 | SCHOOL CODE: 50412`,
    `OFFICIAL STUDENT RECORD VERIFICATION`,
    `Scholar No: ${student.scholarNo}`,
    `Student: ${studentFullName}`,
    `Class & Sec: ${student.class} - ${student.section}`,
    `Roll No: ${student.rollNo}`,
    `Father: ${student.fatherName || 'On Record'}`,
    `DOB: ${dobNumeric}`,
    `Status: ${student.status || 'Active'}`,
    `Auth: MMPS ERP Official Registry`,
    `Verify: https://mastermindpipariya.com/verify/student/${student.scholarNo}`
  ].join('\n');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-8 shadow-2xl relative animate-scale-in my-auto max-h-[96vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls Bar (Hidden during Print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <User size={22} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">
                Official School ERP Document
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Student Admission Dossier & Cumulative Record
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all hover:shadow-lg"
            >
              <Printer size={15} />
              <span>Print A4 Document</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Official Student Dossier Container */}
        <div
          ref={printRef}
          id="official-student-dossier"
          className="printable-erp-doc bg-white border-2 border-slate-800 p-6 sm:p-8 rounded-xl relative text-slate-900 select-text print:border-2 print:border-black print:p-6 print:m-0 print:shadow-none"
        >
          {/* Subtle Watermark Seal in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] print:opacity-[0.05]">
            <img src={sitelogo} alt="MMPS Watermark" className="w-96 h-96 object-contain" />
          </div>

          {/* School Header */}
          <div className="text-center relative z-10 border-b-2 border-slate-800 pb-3 mb-4">
            <div className="flex items-center justify-between gap-4 mb-2">
              <img src={sitelogo} alt="Master Mind Public School" className="h-16 w-auto object-contain print:h-14" />
              <div className="text-center flex-1">
                <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-slate-600 uppercase block">
                  Senior Secondary Co-Educational Institution
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
                  MASTER MIND PUBLIC SCHOOL
                </h1>
                <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                  Station Road, Pipariya, Dist. Narmadapuram (M.P.) — Pin: 461775
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-3 text-[10px] font-bold text-slate-600 mt-1">
                  <span>Affiliation: <strong>1030456</strong></span>
                  <span>•</span>
                  <span>School Code: <strong>50412</strong></span>
                  <span>•</span>
                  <span>U-DISE: <strong>23380709812</strong></span>
                  <span>•</span>
                  <span>Email: <strong>mastermindschoolpipariya@gmail.com</strong></span>
                </div>
              </div>

              {/* Student Photo Box */}
              <div className="w-24 h-28 border-2 border-slate-700 rounded-lg p-1 bg-slate-50 flex flex-col items-center justify-center shrink-0 text-center relative overflow-hidden print:w-20 print:h-24">
                {student.photoUrl ? (
                  <img src={student.photoUrl} alt={studentFullName} className="w-full h-full object-cover rounded" />
                ) : (
                  <div className="text-slate-400 text-[9px] font-bold uppercase p-1">
                    Affix Recent Passport Photo
                  </div>
                )}
              </div>
            </div>

            {/* Document Title Badge */}
            <div className="mt-2">
              <span className="inline-block bg-slate-900 text-amber-300 font-black text-xs sm:text-sm px-6 py-1 rounded-full uppercase tracking-wider border border-amber-400 print:bg-white print:text-black print:border-black">
                STUDENT ADMISSION DOSSIER & CUMULATIVE RECORD
              </span>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                (Official Permanent Student Profile — Academic Session {student.academicYear || '2026-2027'})
              </p>
            </div>
          </div>

          {/* Student Identification Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold bg-slate-100 p-2.5 rounded-lg border border-slate-300 mb-4 print:border-black print:bg-transparent">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-semibold">Scholar / Admission No.</span>
              <span className="font-mono text-blue-900 print:text-black font-black text-sm">{student.scholarNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-semibold">Current Class & Section</span>
              <span className="font-black text-slate-900">{student.class} — Sec {student.section}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-semibold">Roll Number</span>
              <span className="font-black text-slate-900">#{student.rollNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-semibold">Admission Date</span>
              <span className="text-slate-900">{admissionDateNumeric}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-semibold">Registry Status</span>
              <span className={`font-black uppercase text-[10px] ${student.status === 'Active' ? 'text-emerald-700' : 'text-amber-800'}`}>
                {student.status}
              </span>
            </div>
          </div>

          {/* SECTION A: STUDENT PERSONAL PROFILE */}
          <div className="mb-4">
            <div className="bg-slate-800 text-white px-3 py-1 rounded text-[11px] font-black uppercase tracking-wider mb-2 print:bg-slate-200 print:text-black">
              Section A: Pupil Demographic Profile
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Full Name of Pupil:</span>
                <span className="font-black text-slate-950 uppercase">{studentFullName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Gender:</span>
                <span className="font-bold text-slate-900">{student.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Date of Birth (Figures):</span>
                <span className="font-bold text-slate-900">{dobNumeric}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Date of Birth (in Words):</span>
                <span className="font-bold text-slate-900 italic text-[11px]">{dobWords}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Blood Group:</span>
                <span className="font-black text-red-700 print:text-black">{student.bloodGroup || 'Not Specified'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Student Aadhaar Number:</span>
                <span className="font-mono font-bold text-slate-900">{student.aadhaarNo || 'Not Provided'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Social Category:</span>
                <span className="font-bold text-slate-900">{student.category || 'General'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Nationality & Religion:</span>
                <span className="font-bold text-slate-900">{student.nationality || 'Indian'} {student.religion ? `(${student.religion})` : ''}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Student Contact:</span>
                <span className="font-bold text-slate-900">{student.studentPhone || student.parentPhone || '—'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Student Email:</span>
                <span className="font-semibold text-slate-800">{student.studentEmail || student.parentEmail || '—'}</span>
              </div>
            </div>
          </div>

          {/* SECTION B: PARENT & GUARDIAN CREDENTIALS */}
          <div className="mb-4">
            <div className="bg-slate-800 text-white px-3 py-1 rounded text-[11px] font-black uppercase tracking-wider mb-2 print:bg-slate-200 print:text-black">
              Section B: Parent & Guardian Details
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Father's Full Name:</span>
                <span className="font-black text-slate-950">{student.fatherName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Father's Phone:</span>
                <span className="font-bold text-slate-900">{student.fatherPhone || student.parentPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Father's Aadhaar:</span>
                <span className="font-mono text-slate-900 font-bold">{student.fatherAadhaar || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Father's Occupation:</span>
                <span className="font-semibold text-slate-800">{student.fatherOccupation || '—'}</span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Mother's Full Name:</span>
                <span className="font-black text-slate-950">{student.motherName || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Mother's Phone:</span>
                <span className="font-bold text-slate-900">{student.motherPhone || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Mother's Aadhaar:</span>
                <span className="font-mono text-slate-900 font-bold">{student.motherAadhaar || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Mother's Occupation:</span>
                <span className="font-semibold text-slate-800">{student.motherOccupation || '—'}</span>
              </div>

              <div className="col-span-2 sm:col-span-2">
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Current Residential Address:</span>
                <span className="font-semibold text-slate-900">{student.address}</span>
              </div>
              <div className="col-span-2 sm:col-span-2">
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Permanent Address:</span>
                <span className="font-semibold text-slate-900">{student.permanentAddress || student.address}</span>
              </div>
            </div>
          </div>

          {/* SECTION C: ACADEMIC HISTORY & ADMISSION RECORD */}
          <div className="mb-4">
            <div className="bg-slate-800 text-white px-3 py-1 rounded text-[11px] font-black uppercase tracking-wider mb-2 print:bg-slate-200 print:text-black">
              Section C: Academic History & Schooling Status
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Enrollment Type:</span>
                <span className="font-black text-slate-900">
                  {student.isFresher ? 'Fresher (1st Time Formal Schooling)' : 'Transfer / Lateral Admission'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Previous School:</span>
                <span className="font-semibold text-slate-900">{student.previousSchool || 'N/A (Fresher)'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Previous Class Passed:</span>
                <span className="font-semibold text-slate-900">{student.previousClass || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Previous Marksheet / Score:</span>
                <span className="font-semibold text-slate-900">{student.previousMarksheet || 'N/A'}</span>
              </div>

              {!student.isFresher && (
                <>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-semibold uppercase">Previous T.C. Number:</span>
                    <span className="font-mono font-bold text-slate-900">{student.previousTcNo || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-semibold uppercase">Previous T.C. Date:</span>
                    <span className="font-semibold text-slate-900">{formatDateNumeric(student.previousTcDate)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SECTION D: WITHDRAWAL / TC RECORD (IF APPLICABLE) */}
          {student.status !== 'Active' && (
            <div className="mb-4 p-3 bg-amber-50/70 border border-amber-300 rounded-lg text-xs">
              <span className="font-black uppercase text-[10px] text-amber-900 block mb-1">
                Notice of Student Withdrawal / Transfer Certificate Issued
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-slate-500 text-[10px] block">T.C. Serial No:</span>
                  <span className="font-mono font-black text-amber-950">{student.tcSerialNo || 'Generated'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Issue Date:</span>
                  <span className="font-bold text-slate-900">{formatDateNumeric(student.tcIssueDate || student.withdrawalDate)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 text-[10px] block">Reason for Withdrawal:</span>
                  <span className="font-bold text-slate-900">{student.withdrawalReason || 'Admission Withdrawn'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Official Verification QR, Signatures & Seal Section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 mt-6 text-center text-xs font-bold border-t border-slate-400 items-end">
            <div className="flex flex-col items-center justify-center text-center">
              <QRCodeView value={studentVerificationQRText} size={84} />
              <span className="text-[8px] font-bold text-slate-500 uppercase mt-1">
                Scan to Verify Student
              </span>
            </div>

            <div>
              <div className="h-8"></div>
              <div className="border-t border-slate-800 pt-1 inline-block w-32">
                <span>Class Teacher</span>
                <span className="block text-[9px] text-slate-500 font-normal">Signature & Date</span>
              </div>
            </div>

            <div>
              <div className="h-8"></div>
              <div className="border-t border-slate-800 pt-1 inline-block w-32">
                <span>Admission Incharge</span>
                <span className="block text-[9px] text-slate-500 font-normal">Verified & Entered</span>
              </div>
            </div>

            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-700 text-[7px] font-black uppercase text-slate-600 flex items-center justify-center text-center p-1 mx-auto mb-1 opacity-70">
                MMPS PIPARIYA<br/>OFFICIAL SEAL
              </div>
              <div className="border-t border-slate-800 pt-1 inline-block w-32">
                <span>Principal</span>
                <span className="block text-[9px] text-slate-500 font-normal">Master Mind Public School</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer print note */}
        <div className="mt-4 text-center text-[11px] text-slate-400 print:hidden flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-blue-600" />
          <span>Official Cumulative Student Dossier • Master Mind Public School ERP System</span>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileDocModal;
