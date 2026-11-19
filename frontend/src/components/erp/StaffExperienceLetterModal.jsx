import { useRef } from 'react';
import { X, Printer, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
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

const calculateTenure = (joiningDate, relievingDate) => {
  if (!joiningDate) return '1 Year';
  const start = new Date(joiningDate);
  const end = relievingDate ? new Date(relievingDate) : new Date();
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '1 Year';

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'Year' : 'Years'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
  return parts.length > 0 ? parts.join(' and ') : '6 Months';
};

// Role-specific professional appraisal text
const getRoleAppraisal = (role, staffName) => {
  const normRole = (role || '').trim().toLowerCase();

  if (normRole.includes('teach')) {
    return `During their tenure with us, ${staffName} was actively engaged in imparting quality academic curriculum, fostering student inquiry, and demonstrating exemplary classroom pedagogy. They consistently displayed thorough subject mastery, innovated instructional methods, and mentored pupils with utmost compassion and diligence. They also made valuable contributions to school co-curricular assemblies, academic exhibitions, and parent-teacher alignment.`;
  }

  if (normRole.includes('driver')) {
    return `During their tenure with us, ${staffName} was entrusted with the safe daily transportation of students and faculty members across school transit routes. They maintained an impeccable road safety record, demonstrated defensive driving practices, strictly adhered to regulatory speed and safety protocols, and exhibited exemplary punctuality. Their vigilance regarding the welfare and protection of young children in transit has been commendable.`;
  }

  if (normRole.includes('maid') || normRole.includes('ayah') || normRole.includes('housekeep')) {
    return `During their tenure with us, ${staffName} rendered devoted service towards student care, campus hygiene, and classroom cleanliness. They exhibited great affection, patience, and vigilance while attending to young children, toddlers, and primary pupils. Their punctuality, gentle demeanor, honesty, and dedicated work ethic were deeply appreciated across the institution.`;
  }

  if (normRole.includes('assistant') && !normRole.includes('staff')) {
    return `During their tenure with us, ${staffName} provided dedicated administrative and operational support. They demonstrated high organizational competence, maintained accurate institutional records, supported daily office and laboratory operations, and handled official documentation with great reliability, precision, and diligence.`;
  }

  if (normRole.includes('gardener') || normRole.includes('mali')) {
    return `During their tenure with us, ${staffName} took exceptional care of the school grounds, botanical gardens, and sports lawns. Through their dedicated horticulture skills and environmental stewardship, they maintained a verdant, pristine, and uplifting campus ambiance for students and faculty alike.`;
  }

  if (normRole.includes('manager') || normRole.includes('admin')) {
    return `During their tenure with us, ${staffName} demonstrated exceptional administrative leadership, operational oversight, and institutional stewardship. They successfully coordinated school logistical operations, regulatory compliances, staff scheduling, and major campus events with utmost efficiency, tact, and strategic clarity.`;
  }

  if (normRole.includes('staff assistant')) {
    return `During their tenure with us, ${staffName} provided versatile and prompt coordination across school administrative divisions. They demonstrated high adaptability, strong organizational skills, and dependable assistance across daily institutional workflows and academic events.`;
  }

  if (normRole.includes('guard') || normRole.includes('security')) {
    return `During their tenure with us, ${staffName} was entrusted with campus surveillance, perimeter security, and visitor access control. They exhibited highest alertness, discipline, and commitment to student and staff safety protocols, maintaining a secure and orderly school environment around the clock.`;
  }

  return `During their tenure with us, ${staffName} discharged their assigned responsibilities with utmost sincerity, dedication, and professionalism. Their contributions to institutional workflows and campus operations were consistently valuable and appreciated.`;
};

const StaffExperienceLetterModal = ({ staff, onClose }) => {
  const printRef = useRef(null);

  if (!staff) return null;

  const handlePrint = () => {
    window.print();
  };

  const joiningFormatted = formatDateWords(staff.joiningDate || '2023-07-01');
  const relievingFormatted = formatDateWords(staff.relievingDate || new Date().toISOString());
  const todayFormatted = formatDateWords(new Date().toISOString());
  const tenureText = calculateTenure(staff.joiningDate, staff.relievingDate);
  const appraisalText = getRoleAppraisal(staff.role, staff.fullName);

  const cleanId = (staff.employeeId || 'STF').replace(/[^A-Z0-9]/gi, '');
  const refNo = staff.experienceRefNo || `MMPS/EXP/2026/${cleanId}`;

  // Structured verification text for QR code
  const verificationQRText = [
    `MASTER MIND PUBLIC SCHOOL, PIPARIYA (M.P.)`,
    `CBSE AFFILIATION: 1031184 | SCHOOL CODE: 51155`,
    `OFFICIAL EXPERIENCE & RELIEVING VERIFICATION`,
    `Ref No: ${refNo}`,
    `Emp ID: ${staff.employeeId}`,
    `Name: ${staff.fullName}`,
    `Role: ${staff.role}`,
    `Dept: ${staff.department || 'General'}`,
    `Type: ${staff.employmentType || 'Full-Time'}`,
    `Tenure: ${formatDateNumeric(staff.joiningDate)} to ${formatDateNumeric(staff.relievingDate || new Date())}`,
    `Status: Relieved in Good Standing`,
    `Conduct: ${staff.conductRating || 'Exemplary'}`,
    `Auth: Master Mind Public School ERP System`,
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
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Award size={22} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">
                Official School Letterhead Document
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Staff Relieving & Experience Certificate
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all hover:shadow-lg"
            >
              <Printer size={15} />
              <span>Print Official A4 Letter</span>
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

        {/* Printable Official A4 Document */}
        <div
          ref={printRef}
          id="official-staff-experience-letter"
          className="printable-erp-doc bg-white border-2 border-slate-800 p-8 sm:p-12 rounded-xl relative text-slate-900 select-text print:border-2 print:border-black print:p-8 print:m-0 print:shadow-none"
        >
          {/* Subtle Watermark Seal in Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] print:opacity-[0.05]">
            <img src={sitelogo} alt="MMPS Watermark" className="w-96 h-96 object-contain" />
          </div>

          {/* School Header */}
          <div className="relative z-10 border-b-2 border-slate-800 pb-4 mb-6">
            <div className="flex items-center justify-between gap-4">
              <img
                src={sitelogo}
                alt="Master Mind Public School"
                className="h-20 w-auto object-contain print:h-16"
              />
              <div className="text-center flex-1">
                <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-slate-600 uppercase block">
                  Senior Secondary Co-Educational Institution • Affiliated to CBSE, New Delhi
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight uppercase">
                  MASTER MIND PUBLIC SCHOOL
                </h1>
                <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                  Station Road, Pipariya, Dist. Narmadapuram (M.P.) — Pin: 461775
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-3 text-[10px] font-bold text-slate-600 mt-1">
                  <span>CBSE Affiliation: <strong>1031184</strong></span>
                  <span>•</span>
                  <span>School Code: <strong>51155</strong></span>
                  <span>•</span>
                  <span>U-DISE: <strong>23380709812</strong></span>
                  <span>•</span>
                  <span>Email: <strong>mastermindschoolpipariya@gmail.com</strong></span>
                </div>
              </div>

              {/* QR Verification in Top Right Header */}
              <div className="flex flex-col items-center justify-center shrink-0 text-center">
                <QRCodeView value={verificationQRText} size={84} />
                <span className="text-[7px] font-bold text-slate-500 uppercase mt-0.5 tracking-tighter">
                  Scan to Verify
                </span>
              </div>
            </div>
          </div>

          {/* Document Reference Strip */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-6 border-b border-dashed border-slate-300 pb-2">
            <div>
              <span className="text-slate-500 font-semibold uppercase text-[10px] mr-1.5">Ref. No:</span>
              <span className="font-mono text-slate-900 font-black">{refNo}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold uppercase text-[10px] mr-1.5">Date of Issue:</span>
              <span className="text-slate-900 font-black">{todayFormatted}</span>
            </div>
          </div>

          {/* Certificate Title Badge */}
          <div className="text-center my-6">
            <span className="inline-block bg-slate-900 text-amber-300 font-black text-sm sm:text-base px-8 py-1.5 rounded-full uppercase tracking-wider border border-amber-400 print:bg-white print:text-black print:border-black">
              EXPERIENCE & RELIEVING CERTIFICATE
            </span>
          </div>

          {/* Formal Salutation */}
          <div className="mb-4">
            <p className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider underline">
              TO WHOMSOEVER IT MAY CONCERN
            </p>
          </div>

          {/* Certificate Narrative */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed text-justify">
            <p>
              This is to certify that <strong>{staff.gender === 'Female' ? 'Smt. / Kumari' : 'Shri'} {staff.fullName}</strong> (Employee ID: <strong>{staff.employeeId}</strong>) was a bona fide employee of <strong>Master Mind Public School, Pipariya, Dist. Narmadapuram (M.P.)</strong>.
            </p>

            <p>
              They served the institution as <strong>{staff.role}</strong> in the <strong>{staff.department || 'General'}</strong> Department on a <strong>{staff.employmentType || 'Full-Time'}</strong> basis from <strong>{joiningFormatted}</strong> to <strong>{relievingFormatted}</strong> (Total Tenure: <strong>{tenureText}</strong>).
            </p>

            <p>
              {appraisalText}
            </p>

            <p>
              During their tenure with us, we found them to be punctual, diligent, trustworthy, and dedicated with <strong>{staff.conductRating || 'exemplary'}</strong> conduct and character. They maintained cordial relations with management, colleagues, parents, and students.
            </p>

            <p>
              They have been formally relieved of all institutional responsibilities and charges with effect from the close of school hours on <strong>{relievingFormatted}</strong> upon their <strong>{staff.relievingReason || 'formal resignation / completion of service'}</strong>. There are no institutional dues or liabilities outstanding against them.
            </p>

            <p>
              We place on record our appreciation for their dedicated services rendered to Master Mind Public School and wish them all success, fulfillment, and prosperity in their future personal and professional endeavors.
            </p>
          </div>

          {/* Official Signatures & Seal Section */}
          <div className="grid grid-cols-3 gap-6 pt-16 mt-10 text-center text-xs font-bold border-t border-slate-300">
            <div>
              <div className="h-10"></div>
              <div className="border-t border-slate-800 pt-1.5 inline-block w-40">
                <span className="block font-black text-slate-900">Administrative Officer</span>
                <span className="block text-[9px] text-slate-500 font-semibold">Master Mind Public School</span>
              </div>
            </div>

            <div className="relative">
              {/* Official Seal Representation */}
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 text-[8px] font-black uppercase text-slate-700 flex items-center justify-center text-center p-1 mx-auto mb-1 opacity-80">
                MMPS PIPARIYA<br />OFFICIAL SEAL
              </div>
              <span className="block text-[9px] text-slate-500 font-semibold">(Verified & Sealed)</span>
            </div>

            <div>
              <div className="h-10"></div>
              <div className="border-t border-slate-800 pt-1.5 inline-block w-40">
                <span className="block font-black text-slate-900">Principal</span>
                <span className="block text-[9px] text-slate-500 font-semibold">Master Mind Public School</span>
              </div>
            </div>
          </div>

          {/* Small Verification Footer inside Print Area */}
          <div className="mt-8 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-500">
            <span>
              Official Computer-Generated Institutional Certificate • Master Mind Public School ERP • Central Document Verification Reference: {refNo}
            </span>
          </div>
        </div>

        {/* Footer print note */}
        <div className="mt-4 text-center text-[11px] text-slate-400 print:hidden flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Official Institutional Document • CBSE Affiliation No: 1031184 • Verified by Master Mind Public School ERP System</span>
        </div>
      </div>
    </div>
  );
};

export default StaffExperienceLetterModal;
