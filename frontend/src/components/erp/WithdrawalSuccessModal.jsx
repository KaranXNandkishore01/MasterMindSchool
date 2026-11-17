import { CheckCircle2, Award, Printer, ArrowRight, X, FileText, UserX } from 'lucide-react';

const WithdrawalSuccessModal = ({ student, onOpenTC, onClose }) => {
  if (!student) return null;

  const tcNo = student.tcSerialNo || `TC/2026-27/${String(student.rollNo || 10).padStart(4, '0')}`;
  const issueDate = student.tcIssueDate || student.withdrawalDate || new Date().toISOString();
  const formattedDate = new Date(issueDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-scale-in text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Icon & Title */}
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Award size={32} />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-2">
          <CheckCircle2 size={14} /> Action Completed Successfully
        </span>

        <h3 className="text-xl sm:text-2xl font-black text-slate-950">
          Admission Withdrawn & T.C. Generated
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          The student's status has been transitioned to Withdrawn and an official Transfer Certificate has been drafted.
        </p>

        {/* Withdrawn Student & TC Details Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 my-5 text-left text-xs space-y-2.5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-semibold">Student Name:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {student.firstName} {student.lastName}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Scholar / Admission No:</span>
            <span className="font-mono font-bold text-blue-900">{student.scholarNo}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Class Last Enrolled:</span>
            <span className="font-bold text-slate-800">{student.class} — Sec {student.section}</span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-slate-200">
            <span className="text-amber-800 font-bold uppercase text-[10px]">T.C. Serial No:</span>
            <span className="font-mono font-black text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {tcNo}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Issue Date:</span>
            <span className="font-bold text-slate-800">{formattedDate}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-semibold">Reason:</span>
            <span className="font-semibold text-slate-700 italic truncate max-w-[200px]">
              {student.withdrawalReason || "Parent's Transfer / Relocation"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => {
              onClose();
              onOpenTC(student);
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-950/20 cursor-pointer transition-all transform hover:-translate-y-0.5"
          >
            <Printer size={16} />
            <span>View & Print Official Transfer Certificate</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Return to Student Directory
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalSuccessModal;
