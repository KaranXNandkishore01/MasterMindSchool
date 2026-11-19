import { useRef } from 'react';
import { X, Printer, User, ShieldCheck } from 'lucide-react';
import sitelogo from '../../assets/sitelogo.png';
import QRCodeView from '../common/QRCodeView';

const formatDateWords = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
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

const StaffProfileDocModal = ({ staff, onClose }) => {
  const printRef = useRef(null);

  if (!staff) return null;

  const handlePrint = () => {
    window.print();
  };

  const joiningFormatted = formatDateNumeric(staff.joiningDate || '2023-07-01');
  const relievingFormatted = staff.relievingDate ? formatDateNumeric(staff.relievingDate) : null;
  const todayFormatted = formatDateWords(new Date().toISOString());

  // Structured verification text for QR code
  const verificationQRText = [
    `MASTER MIND PUBLIC SCHOOL, PIPARIYA (M.P.)`,
    `CBSE AFFILIATION: 1031184 | SCHOOL CODE: 51155`,
    `OFFICIAL EMPLOYEE CREDENTIAL VERIFICATION`,
    `Emp ID: ${staff.employeeId}`,
    `Name: ${staff.fullName}`,
    `Role: ${staff.role}`,
    `Dept: ${staff.department || 'General'}`,
    `Employment: ${staff.employmentType || 'Full-Time'}`,
    `Joined: ${joiningFormatted}`,
    `Status: ${staff.status || 'Active'}`,
    `Phone: ${staff.phone}`,
    `Issued: ${todayFormatted}`,
    `Auth: Master Mind Public School HR Division`,
    `Verify: https://mastermindpipariya.com/verify/staff/${staff.employeeId}`
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
                Staff Identity Dossier & Official Service Record
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all hover:shadow-lg"
            >
              <Printer size={15} />
              <span>Print A4 Dossier</span>
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

        {/* Printable Official Staff Dossier Container */}
        <div
          ref={printRef}
          id="official-staff-dossier"
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
                  Senior Secondary Co-Educational Institution • CBSE Affiliation No: 1031184
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight uppercase">
                  MASTER MIND PUBLIC SCHOOL
                </h1>
                <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                  Station Road, Pipariya, Dist. Narmadapuram (M.P.) — Pin: 461775
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-3 text-[10px] font-bold text-slate-600 mt-1">
                  <span>School Code: <strong>51155</strong></span>
                  <span>•</span>
                  <span>U-DISE: <strong>23380709812</strong></span>
                  <span>•</span>
                  <span>Email: <strong>mastermindschoolpipariya@gmail.com</strong></span>
                </div>
              </div>

              {/* Photo Box */}
              <div className="w-24 h-28 border-2 border-slate-700 rounded-lg p-1 bg-slate-50 flex flex-col items-center justify-center shrink-0 text-center relative overflow-hidden print:w-20 print:h-24">
                {staff.photoUrl ? (
                  <img src={staff.photoUrl} alt={staff.fullName} className="w-full h-full object-cover rounded" />
                ) : (
                  <div className="text-slate-400 text-[9px] font-bold uppercase p-1">
                    Staff Identity Photo
                  </div>
                )}
              </div>
            </div>

            {/* Document Title Badge */}
            <div className="mt-2">
              <span className="inline-block bg-slate-900 text-amber-300 font-black text-xs sm:text-sm px-6 py-1 rounded-full uppercase tracking-wider border border-amber-400 print:bg-white print:text-black print:border-black">
                OFFICIAL STAFF IDENTITY DOSSIER & SERVICE RECORD
              </span>
            </div>
          </div>

          {/* Identification Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold bg-slate-100 p-2.5 rounded-lg border border-slate-300 mb-4 print:border-black print:bg-transparent">
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-semibold">Employee ID</span>
              <span className="font-mono text-blue-900 print:text-black font-black text-sm">{staff.employeeId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-semibold">Designation</span>
              <span className="font-black text-slate-900">{staff.role}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-semibold">Department</span>
              <span className="font-black text-slate-900">{staff.department || 'General'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-semibold">Employment Type</span>
              <span className="text-slate-900 font-black">{staff.employmentType || 'Full-Time'}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] uppercase font-semibold">Current Status</span>
              <span className={`font-black uppercase text-[10px] ${staff.status === 'Active' ? 'text-emerald-700' : 'text-amber-800'}`}>
                {staff.status}
              </span>
            </div>
          </div>

          {/* SECTION A: PERSONAL & BIOMETRIC DETAILS */}
          <div className="mb-4">
            <div className="bg-slate-800 text-white px-3 py-1 rounded text-[11px] font-black uppercase tracking-wider mb-2 print:bg-slate-200 print:text-black">
              Section A: Employee Personal Details
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Full Legal Name:</span>
                <span className="font-black text-slate-950 uppercase">{staff.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Gender:</span>
                <span className="font-bold text-slate-900">{staff.gender || 'Not Specified'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Registered Mobile Phone:</span>
                <span className="font-mono font-bold text-slate-900">{staff.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Official Email:</span>
                <span className="font-semibold text-slate-800">{staff.email || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Aadhaar Identification:</span>
                <span className="font-mono font-bold text-slate-900">{staff.aadhaarNo || 'Verified On Record'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Date of Joining:</span>
                <span className="font-bold text-slate-900">{joiningFormatted}</span>
              </div>
              <div className="sm:col-span-3">
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Residential Address:</span>
                <span className="font-medium text-slate-900">{staff.address || 'Pipariya, Dist. Narmadapuram, Madhya Pradesh'}</span>
              </div>
            </div>
          </div>

          {/* SECTION B: COMPENSATION & BANKING RECORD */}
          <div className="mb-4">
            <div className="bg-slate-800 text-white px-3 py-1 rounded text-[11px] font-black uppercase tracking-wider mb-2 print:bg-slate-200 print:text-black">
              Section B: Remuneration & Disbursal Structure
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Monthly Base Salary:</span>
                <span className="font-black text-slate-900">₹{staff.monthlySalary?.toLocaleString() || '—'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Standard Daily Rate:</span>
                <span className="font-bold text-slate-900">₹{staff.dailyRate || Math.round((staff.monthlySalary || 0) / 26)} / day</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Bank Disbursal Account:</span>
                <span className="font-mono font-bold text-slate-900">{staff.bankAccount?.accountNumber || 'On Record'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block font-semibold uppercase">Bank IFSC Code:</span>
                <span className="font-mono font-bold text-slate-900">{staff.bankAccount?.ifscCode || 'SBIN0001245'}</span>
              </div>
            </div>
          </div>

          {/* SECTION C: RELIEVING / EXIT RECORD (IF RELIEVED) */}
          {staff.status === 'Relieved' && (
            <div className="mb-4 p-3 bg-amber-50/70 border border-amber-300 rounded-lg text-xs">
              <span className="font-black uppercase text-[10px] text-amber-900 block mb-1">
                Notice of Official Relieving & Experience Certificate
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-slate-500 text-[10px] block">Relieving Date:</span>
                  <span className="font-bold text-slate-900">{relievingFormatted}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Experience Ref No:</span>
                  <span className="font-mono font-black text-amber-950">{staff.experienceRefNo || 'Generated'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Conduct Appraisal:</span>
                  <span className="font-bold text-emerald-800">{staff.conductRating || 'Exemplary'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Departure Reason:</span>
                  <span className="font-bold text-slate-900">{staff.relievingReason || 'Completed Service'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Verification QR & Dual Signatures Strip */}
          <div className="grid grid-cols-3 gap-4 pt-8 mt-6 text-center text-xs font-bold border-t border-slate-400 items-end">
            {/* Scannable QR Code */}
            <div className="flex flex-col items-center justify-center text-center">
              <QRCodeView value={verificationQRText} size={90} />
              <span className="text-[8px] font-bold text-slate-500 uppercase mt-1">
                Scan to Verify Credential
              </span>
            </div>

            <div>
              <div className="h-8"></div>
              <div className="border-t border-slate-800 pt-1 inline-block w-36">
                <span>HR / Office Incharge</span>
                <span className="block text-[9px] text-slate-500 font-normal">Verified & Entered</span>
              </div>
            </div>

            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-700 text-[7px] font-black uppercase text-slate-600 flex items-center justify-center text-center p-1 mx-auto mb-1 opacity-70">
                MMPS PIPARIYA<br />OFFICIAL SEAL
              </div>
              <div className="border-t border-slate-800 pt-1 inline-block w-36">
                <span>Principal</span>
                <span className="block text-[9px] text-slate-500 font-normal">Master Mind Public School</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer print note */}
        <div className="mt-4 text-center text-[11px] text-slate-400 print:hidden flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-blue-600" />
          <span>Official Cumulative Staff Dossier • Master Mind Public School HR ERP System</span>
        </div>
      </div>
    </div>
  );
};

export default StaffProfileDocModal;
