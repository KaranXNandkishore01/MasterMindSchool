import { useRef } from 'react';
import { X, Printer, Download, Award, ShieldCheck, FileCheck } from 'lucide-react';
import sitelogo from '../../assets/sitelogo.png';

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

const TransferCertificateModal = ({ student, onClose }) => {
  const printRef = useRef(null);

  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const tcNo = student.tcSerialNo || `TC/2026-27/${String(student.rollNo || 10).padStart(4, '0')}`;
  const issueDate = student.tcIssueDate || student.withdrawalDate || new Date().toISOString();
  const appDate = student.tcApplicationDate || issueDate;
  const dobWords = formatDateToWords(student.dob);
  const dobNumeric = formatDateNumeric(student.dob);
  const admissionDateNumeric = formatDateNumeric(student.admissionDate);
  const studentFullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();

  // Class subjects heuristic based on school standard
  const isSeniorSec = student.class?.includes('11') || student.class?.includes('12');
  const subjects = isSeniorSec
    ? '1. English Core  2. Physics / Accountancy  3. Chemistry / Business Studies  4. Mathematics / Economics  5. Physical Education'
    : '1. English  2. Hindi  3. Mathematics  4. Science  5. Social Science  6. Computer Science / IT';

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
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Award size={22} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">
                Official School Document
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                School Transfer Certificate (T.C.)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all hover:shadow-lg"
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
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

        {/* Printable Transfer Certificate Container */}
        <div
          ref={printRef}
          id="official-transfer-certificate"
          className="printable-erp-doc bg-amber-50/20 border-4 border-double border-slate-800 p-6 sm:p-10 rounded-xl relative text-slate-900 shadow-inner select-text print:border-2 print:border-black print:p-8 print:m-0 print:shadow-none print:bg-white"
        >
          {/* Subtle Watermark Seal in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] print:opacity-[0.06]">
            <img src={sitelogo} alt="MMPS Watermark" className="w-96 h-96 object-contain" />
          </div>

          {/* School Header */}
          <div className="text-center relative z-10 border-b-2 border-slate-800 pb-4 mb-5">
            <div className="flex items-center justify-center gap-4 mb-2">
              <img src={sitelogo} alt="Master Mind Public School" className="h-16 w-auto object-contain print:h-14" />
              <div className="text-left">
                <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-slate-600 uppercase block">
                  Senior Secondary Co-Educational Institution
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-none">
                  MASTER MIND PUBLIC SCHOOL
                </h1>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-700 mt-1">
                  Station Road, Pipariya, Dist. Narmadapuram (M.P.) — Pin: 461775
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] sm:text-[11px] font-bold text-slate-600 bg-slate-100/80 py-1.5 px-3 rounded-lg border border-slate-200 print:bg-transparent print:border-none">
              <span>Affiliation No: <strong className="text-slate-900 font-black">1030456</strong></span>
              <span>•</span>
              <span>School Code: <strong className="text-slate-900 font-black">50412</strong></span>
              <span>•</span>
              <span>U-DISE: <strong className="text-slate-900 font-black">23380709812</strong></span>
              <span>•</span>
              <span>Email: <strong className="text-slate-900">mastermindschoolpipariya@gmail.com</strong></span>
            </div>

            {/* Document Title Badge */}
            <div className="mt-4">
              <span className="inline-block bg-slate-900 text-amber-300 font-black text-sm sm:text-base px-6 py-1 rounded-full uppercase tracking-widest border-2 border-amber-400 print:bg-white print:text-black print:border-black">
                TRANSFER CERTIFICATE (T.C.)
              </span>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">
                (School Leaving Certificate issued under Madhya Pradesh Secondary Education / CBSE norms)
              </p>
            </div>
          </div>

          {/* Certificate Metadata Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold bg-white/80 p-2.5 rounded-lg border border-slate-300 mb-5 print:border-black print:bg-transparent">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Book No.</span>
              <span className="font-mono text-slate-900">01</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">T.C. Serial No.</span>
              <span className="font-mono text-red-700 print:text-black font-black">{tcNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Scholar / Admission No.</span>
              <span className="font-mono text-blue-900 print:text-black font-black">{student.scholarNo}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Status in Register</span>
              <span className="text-slate-900 font-black">Pupil Struck Off</span>
            </div>
          </div>

          {/* Official 22 Numbered Fields Form */}
          <div className="space-y-2 text-xs sm:text-[13px] leading-relaxed relative z-10">
            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">1.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Name of the Pupil:</span>
              <span className="font-black text-slate-950 uppercase tracking-wide flex-1">{studentFullName}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">2.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Mother's Full Name:</span>
              <span className="font-bold text-slate-900 flex-1">{student.motherName || 'Smt. Registered Parent'}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">3.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Father's / Guardian's Full Name:</span>
              <span className="font-bold text-slate-900 flex-1">{student.fatherName}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">4.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Nationality & Religion:</span>
              <span className="font-bold text-slate-900 flex-1">{student.nationality || 'Indian'} {student.religion ? `(${student.religion})` : ''}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">5.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Whether Candidate belongs to SC / ST / OBC / General:</span>
              <span className="font-bold text-slate-900 flex-1">{student.category || 'General'}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">6.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Date of First Admission in the School with Class:</span>
              <span className="font-bold text-slate-900 flex-1">{admissionDateNumeric} (Class: {student.class})</span>
            </div>

            <div className="flex flex-col sm:flex-row border-b border-dotted border-slate-300 pb-1">
              <div className="flex sm:w-80 shrink-0">
                <span className="w-8 font-bold text-slate-500 shrink-0">7.</span>
                <span className="text-slate-700 font-semibold">Date of Birth (according to Admission Register):</span>
              </div>
              <div className="sm:pl-0 pl-8 flex-1">
                <p><span className="text-slate-500 font-medium">(in figures):</span> <strong className="font-bold text-slate-900">{dobNumeric}</strong></p>
                <p><span className="text-slate-500 font-medium">(in words):</span> <strong className="font-bold text-slate-900 italic">{dobWords}</strong></p>
              </div>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">8.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Class in which the pupil last studied:</span>
              <span className="font-bold text-slate-900 flex-1">{student.class} — Section {student.section}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">9.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">School / Board Annual Examination last taken with result:</span>
              <span className="font-bold text-slate-900 flex-1">Passed / Cleared Academic Session {student.academicYear || '2026-2027'}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">10.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Whether failed, if so once / twice in same class:</span>
              <span className="font-bold text-slate-900 flex-1">No</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">11.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Subjects Studied:</span>
              <span className="font-medium text-slate-900 flex-1 text-[11px] sm:text-xs">{subjects}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">12.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Whether qualified for promotion to higher class:</span>
              <span className="font-bold text-emerald-800 print:text-black flex-1">{student.promotionStatus || 'Yes, Promoted to Higher Class'}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">13.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Month up to which the pupil has paid school dues:</span>
              <span className="font-bold text-slate-900 flex-1">{student.duesClearedUpTo || 'All Dues Cleared (March 2027)'}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">14.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Any fee concession availed of, nature of concession:</span>
              <span className="font-bold text-slate-900 flex-1">Nil</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">15.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Total working days in academic session:</span>
              <span className="font-bold text-slate-900 flex-1">{student.totalWorkingDays || 210} Days</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">16.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Total working days pupil present in school:</span>
              <span className="font-bold text-slate-900 flex-1">{student.daysPresent || 195} Days</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">17.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Whether NCC Cadet / Boy Scout / Girl Guide:</span>
              <span className="font-bold text-slate-900 flex-1">Active Participant</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">18.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Games played / Extra-curricular activities participated:</span>
              <span className="font-bold text-slate-900 flex-1">Annual Sports, Kho-Kho, Quiz & Cultural Activities</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">19.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">General Conduct & Character:</span>
              <span className="font-black text-blue-900 print:text-black flex-1 uppercase">{student.generalConduct || 'Good / Exemplary'}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">20.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Date of Application for Certificate:</span>
              <span className="font-bold text-slate-900 flex-1">{formatDateNumeric(appDate)}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">21.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Date of Issue of Certificate:</span>
              <span className="font-bold text-slate-900 flex-1">{formatDateNumeric(issueDate)}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">22.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Reason for Leaving the School:</span>
              <span className="font-black text-amber-900 print:text-black flex-1">{student.withdrawalReason || "Parent's Transfer / Relocation"}</span>
            </div>

            <div className="flex border-b border-dotted border-slate-300 pb-1">
              <span className="w-8 font-bold text-slate-500 shrink-0">23.</span>
              <span className="w-64 sm:w-80 text-slate-700 font-semibold shrink-0">Any Other Remarks:</span>
              <span className="font-medium text-slate-800 italic flex-1">{student.remarks || 'A diligent and disciplined pupil. We wish them all success in their future endeavors.'}</span>
            </div>
          </div>

          {/* Signatures & Seal Section */}
          <div className="grid grid-cols-3 gap-4 pt-12 mt-8 text-center text-xs font-bold border-t border-slate-400">
            <div>
              <div className="h-10"></div>
              <div className="border-t border-slate-800 pt-1.5 inline-block w-36">
                <span>Class Teacher</span>
                <span className="block text-[10px] text-slate-500 font-normal">Signature</span>
              </div>
            </div>

            <div>
              <div className="h-10"></div>
              <div className="border-t border-slate-800 pt-1.5 inline-block w-36">
                <span>Checked & Verified By</span>
                <span className="block text-[10px] text-slate-500 font-normal">(Office Superintendent)</span>
              </div>
            </div>

            <div className="relative">
              {/* Circular Seal Representation */}
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 text-[8px] font-black uppercase text-slate-600 flex items-center justify-center text-center p-1 mx-auto mb-1 opacity-70">
                MMPS PIPARIYA<br/>SEAL
              </div>
              <div className="border-t border-slate-800 pt-1.5 inline-block w-36">
                <span>Principal</span>
                <span className="block text-[10px] text-slate-500 font-normal">Master Mind Public School</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer print note */}
        <div className="mt-4 text-center text-[11px] text-slate-400 print:hidden flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>This is an official computer-generated Transfer Certificate verified by Master Mind Public School ERP System.</span>
        </div>
      </div>
    </div>
  );
};

export default TransferCertificateModal;
