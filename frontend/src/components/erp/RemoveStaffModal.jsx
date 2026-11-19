import { useState } from 'react';
import { X, UserMinus, Award, Trash2, AlertTriangle, Calendar, ShieldCheck, Check } from 'lucide-react';
import axios from 'axios';

const DEPARTURE_REASONS = [
  'Formal Resignation / Career Advancement',
  'Completion of Contract / Service Tenure',
  'Relocation / Personal & Family Grounds',
  'Higher Studies & Professional Development',
  'Superannuation / Retirement',
  'Administrative Relieving'
];

const CONDUCT_RATINGS = [
  'Exemplary & Outstanding',
  'Very Good & Commendable',
  'Good & Satisfactory'
];

const RemoveStaffModal = ({ staff, onClose, onSuccess, onOpenExperienceLetter }) => {
  const [activeTab, setActiveTab] = useState('relieve'); // 'relieve' | 'permanent'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Relieving Form Data
  const [relievingDate, setRelievingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [relievingReason, setRelievingReason] = useState(DEPARTURE_REASONS[0]);
  const [conductRating, setConductRating] = useState(CONDUCT_RATINGS[0]);
  const [relievingRemarks, setRelievingRemarks] = useState(
    'Relieved in good standing with exemplary service record and zero pending institutional dues.'
  );

  // Permanent Delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!staff) return null;

  // Handle Formal Relieving & Experience Letter Generation
  const handleRelieveStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`/api/staff/${staff._id}/relieve`, {
        relievingDate,
        relievingReason,
        conductRating,
        relievingRemarks,
      });

      const updatedStaff = res.data?.data || {
        ...staff,
        status: 'Relieved',
        relievingDate,
        relievingReason,
        conductRating,
        relievingRemarks,
        experienceRefNo: `MMPS/EXP/2026/${(staff.employeeId || 'STF').replace(/[^A-Z0-9]/gi, '')}`,
      };

      if (onSuccess) onSuccess(updatedStaff);
      onClose();

      // Open experience letter immediately
      if (onOpenExperienceLetter) {
        onOpenExperienceLetter(updatedStaff);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to relieve staff member.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Hard Deletion
  const handlePermanentDelete = async () => {
    if (!confirmDelete) return;
    setLoading(true);
    setError('');

    try {
      await axios.delete(`/api/staff/${staff._id}?permanent=true`);
      if (onSuccess) onSuccess(null, true);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to permanently delete staff member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-7 shadow-2xl relative animate-scale-in my-auto max-h-[96vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0">
              <UserMinus size={20} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 block">
                Staff Separation & Exit Management
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Relieve / Remove Staff Member
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
          >
            <X size={19} />
          </button>
        </div>

        {/* Staff Snapshot Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-300 font-black text-sm flex items-center justify-center shrink-0">
              {staff.fullName?.[0] || 'S'}
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm">{staff.fullName}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold mt-0.5">
                <span className="font-mono font-bold text-blue-900">{staff.employeeId}</span>
                <span>•</span>
                <span>{staff.role} ({staff.department || 'General'})</span>
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
            {staff.employmentType || 'Full-Time'}
          </span>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('relieve')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'relieve'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award size={14} className="text-amber-400" />
            <span>Relieve & Issue Experience Letter (Recommended)</span>
          </button>
          <button
            onClick={() => setActiveTab('permanent')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'permanent'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Trash2 size={14} />
            <span>Permanent Delete</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* MODE 1: FORMAL RELIEVING & EXPERIENCE LETTER */}
        {activeTab === 'relieve' && (
          <form onSubmit={handleRelieveStaff} className="space-y-3.5 text-xs">
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
              <span className="font-bold block mb-0.5">Formal Staff Relieving Protocol:</span>
              This action updates the staff member's status to <strong>Relieved</strong> and automatically generates an official <strong>Experience & Relieving Certificate</strong> with dual signatures, official school letterhead, and scannable QR verification.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Relieving Date *
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={relievingDate}
                    onChange={(e) => setRelievingDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Conduct & Character Appraisal *
                </label>
                <select
                  value={conductRating}
                  onChange={(e) => setConductRating(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold outline-none cursor-pointer focus:ring-2 focus:ring-blue-600"
                >
                  {CONDUCT_RATINGS.map((cr) => (
                    <option key={cr} value={cr}>{cr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Reason for Separation *
              </label>
              <select
                value={relievingReason}
                onChange={(e) => setRelievingReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-semibold outline-none cursor-pointer focus:ring-2 focus:ring-blue-600"
              >
                {DEPARTURE_REASONS.map((dr) => (
                  <option key={dr} value={dr}>{dr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Official Relieving Remarks
              </label>
              <textarea
                rows={2}
                value={relievingRemarks}
                onChange={(e) => setRelievingRemarks(e.target.value)}
                placeholder="Institutional remarks on conduct, no-dues clearance, and service appraisal..."
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 text-white font-black px-5 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
              >
                <Award size={15} className="text-amber-300" />
                <span>{loading ? 'Processing...' : 'Relieve & Issue Experience Letter'}</span>
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: PERMANENT PURGE / DELETE */}
        {activeTab === 'permanent' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-900 space-y-2">
              <div className="flex items-center gap-2 font-black text-red-800 text-sm">
                <AlertTriangle size={18} />
                <span>Permanent Database Deletion</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-700">
                This action will completely remove <strong>{staff.fullName}</strong> ({staff.employeeId}) from the staff registry. Use this only for erroneous or test entries. If this staff member worked at MMPS, use <strong>Relieve & Issue Experience Letter</strong> instead to keep their verifiable service credentials intact.
              </p>
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <span className="text-[11px] font-bold text-slate-700 leading-snug">
                I confirm that I want to permanently delete this staff member from Master Mind Public School records.
              </span>
            </label>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePermanentDelete}
                disabled={!confirmDelete || loading}
                className="bg-red-600 hover:bg-red-700 text-white font-black px-5 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={15} />
                <span>{loading ? 'Deleting...' : 'Permanently Delete Staff'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveStaffModal;
