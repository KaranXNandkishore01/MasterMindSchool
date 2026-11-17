import { useState, useId } from 'react';
import {
  ShieldAlert,
  Award,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  X,
  FileCheck,
  Calendar,
  Clock
} from 'lucide-react';

const generateCaptcha = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const WITHDRAWAL_REASONS = [
  'Parent’s Transfer / Relocation to another city',
  'Admission to Higher Secondary / College',
  'Admitted to another institution / board',
  'Course Completed / Board Examination Passed',
  'Distance / Commute difficulties',
  'Personal / Domestic Reasons',
  'Parent Request / Discontinued',
];

const WithdrawStudentModal = ({ student, isOpen, onClose, onConfirm }) => {
  const [removalType, setRemovalType] = useState('withdraw'); // 'withdraw' | 'permanent'
  const [withdrawalReason, setWithdrawalReason] = useState(WITHDRAWAL_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  
  // TC Specific Fields
  const [tcSerialNo, setTcSerialNo] = useState(() => `TC/2026-27/${String(Math.floor(1000 + Math.random() * 9000))}`);
  const [tcIssueDate, setTcIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [tcApplicationDate, setTcApplicationDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [promotionStatus, setPromotionStatus] = useState('Yes, Promoted to Higher Class');
  const [duesClearedUpTo, setDuesClearedUpTo] = useState('All Dues Cleared (March 2027)');
  const [totalWorkingDays, setTotalWorkingDays] = useState(210);
  const [daysPresent, setDaysPresent] = useState(195);
  const [generalConduct, setGeneralConduct] = useState('Exemplary');
  const [remarks, setRemarks] = useState('A sincere, disciplined and well-behaved pupil. We wish them all success.');

  // Captcha for Permanent Removal Protection
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha);
  const [enteredCaptcha, setEnteredCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasonId = useId();
  const captchaInputId = useId();

  if (!isOpen || !student) return null;

  const handleRefreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setEnteredCaptcha('');
    setCaptchaError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCaptchaError('');

    if (removalType === 'permanent') {
      if (enteredCaptcha.trim().toUpperCase() !== captchaCode) {
        setCaptchaError('Incorrect Captcha code. Enter the exact characters displayed above.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const finalReason = customReason.trim() ? customReason.trim() : withdrawalReason;
      const payload = {
        permanent: removalType === 'permanent',
        reason: finalReason,
        tcSerialNo,
        tcIssueDate,
        tcApplicationDate,
        promotionStatus,
        duesClearedUpTo,
        totalWorkingDays: Number(totalWorkingDays) || 210,
        daysPresent: Number(daysPresent) || 195,
        generalConduct,
        remarks,
      };

      await onConfirm(student, payload);
    } catch (err) {
      setCaptchaError(err.message || 'Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-2xl border border-slate-100 relative animate-scale-in max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
            <Award size={24} />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 block">
              Official ERP Student Record Action
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Withdraw Admission & Issue T.C.
            </h3>
          </div>
        </div>

        {/* Student Quick Summary Card */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-4 text-xs space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Student:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {student.firstName} {student.lastName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Scholar No:</span>
            <span className="font-mono font-bold text-blue-900">{student.scholarNo}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Class & Sec:</span>
            <span className="font-bold text-slate-800">
              {student.class} — Sec {student.section} (Roll #{student.rollNo})
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Father's Name:</span>
            <span className="font-semibold text-slate-800">{student.fatherName}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Action Type Toggle */}
          <div>
            <span className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Select Removal Action
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRemovalType('withdraw')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  removalType === 'withdraw'
                    ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Award size={15} className="text-amber-800" />
                  <span className="text-xs font-black text-amber-900">Withdraw & Issue T.C.</span>
                </div>
                <span className="block text-[10px] text-amber-700 leading-tight">
                  Generates an official School Transfer Certificate and preserves student audit ledger.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRemovalType('permanent')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  removalType === 'permanent'
                    ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Trash2 size={15} className="text-rose-700" />
                  <span className="text-xs font-black text-rose-900">Permanent Delete</span>
                </div>
                <span className="block text-[10px] text-rose-700 leading-tight">
                  Irreversibly erases student from database (Captcha required).
                </span>
              </button>
            </div>
          </div>

          {/* WITHDRAWAL FLOW SPECIFIC FIELDS */}
          {removalType === 'withdraw' && (
            <div className="space-y-3.5 p-4 bg-amber-50/40 border border-amber-200 rounded-2xl animate-fade-in">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-200/80">
                <FileCheck size={16} className="text-amber-800" />
                <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">
                  Transfer Certificate (T.C.) Specifications
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    T.C. Serial Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={tcSerialNo}
                    onChange={(e) => setTcSerialNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-mono font-bold bg-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Date of Application
                  </label>
                  <input
                    type="date"
                    value={tcApplicationDate}
                    onChange={(e) => setTcApplicationDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Date of Issue *
                  </label>
                  <input
                    type="date"
                    required
                    value={tcIssueDate}
                    onChange={(e) => setTcIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={reasonId} className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Reason for Leaving School *
                </label>
                <select
                  id={reasonId}
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {WITHDRAWAL_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value="Other">Other (Custom Reason)</option>
                </select>
                {withdrawalReason === 'Other' && (
                  <input
                    type="text"
                    required
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter custom withdrawal reason..."
                    className="w-full mt-2 px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Promotion Status
                  </label>
                  <select
                    value={promotionStatus}
                    onChange={(e) => setPromotionStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Yes, Promoted to Higher Class">Yes, Promoted to Higher Class</option>
                    <option value="Passed Annual Examination">Passed Annual Examination</option>
                    <option value="Mid-term Withdrawal (Studying in Class)">Mid-term Withdrawal (Studying)</option>
                    <option value="Detained in Same Class">Detained in Same Class</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    School Dues Status
                  </label>
                  <input
                    type="text"
                    value={duesClearedUpTo}
                    onChange={(e) => setDuesClearedUpTo(e.target.value)}
                    placeholder="e.g. All Dues Cleared (March 2027)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Working Days
                  </label>
                  <input
                    type="number"
                    value={totalWorkingDays}
                    onChange={(e) => setTotalWorkingDays(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    Days Present
                  </label>
                  <input
                    type="number"
                    value={daysPresent}
                    onChange={(e) => setDaysPresent(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white outline-none"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                    General Conduct
                  </label>
                  <select
                    value={generalConduct}
                    onChange={(e) => setGeneralConduct(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white outline-none"
                  >
                    <option value="Exemplary">Exemplary</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Satisfactory">Satisfactory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-0.5">
                  Remarks / Endorsement
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Endorsement notes for T.C."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white outline-none"
                />
              </div>
            </div>
          )}

          {/* PERMANENT DELETION CAPTCHA PROTECTION */}
          {removalType === 'permanent' && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert size={14} /> Security Verification Code
                </span>
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white cursor-pointer px-2 py-0.5 rounded bg-white/10"
                >
                  <RefreshCw size={12} /> New Code
                </button>
              </div>

              <div className="bg-gradient-to-r from-slate-800 via-rose-950 to-slate-800 border-2 border-dashed border-rose-400/50 rounded-xl py-2.5 px-4 flex items-center justify-center gap-3 select-none">
                {captchaCode.split('').map((char, index) => (
                  <span
                    key={index}
                    className="font-mono text-2xl font-black tracking-widest text-amber-300 transform"
                    style={{
                      display: 'inline-block',
                      transform: `rotate(${((index % 2 === 0 ? 1 : -1) * (index + 1) * 3)}deg)`,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>

              <div>
                <label htmlFor={captchaInputId} className="block text-[11px] font-bold text-slate-300 mb-1">
                  Type the 5-character Captcha code above to confirm permanent deletion:
                </label>
                <input
                  id={captchaInputId}
                  type="text"
                  required
                  maxLength={5}
                  value={enteredCaptcha}
                  onChange={(e) => {
                    setEnteredCaptcha(e.target.value);
                    setCaptchaError('');
                  }}
                  placeholder="Enter code here..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 font-mono text-center tracking-widest text-lg font-black border border-slate-700 outline-none focus:border-rose-400 uppercase"
                />
              </div>
            </div>
          )}

          {captchaError && (
            <div className="bg-rose-50 border border-rose-300 text-rose-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0 text-rose-600" />
              <span>{captchaError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>

            {removalType === 'withdraw' ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black shadow-md cursor-pointer transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Processing Withdrawal...</span>
                  </>
                ) : (
                  <>
                    <Award size={15} />
                    <span>Confirm Withdrawal & Generate T.C.</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                disabled={enteredCaptcha.trim().toUpperCase() !== captchaCode || isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-black shadow-md cursor-pointer transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Confirm Permanent Delete</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawStudentModal;
