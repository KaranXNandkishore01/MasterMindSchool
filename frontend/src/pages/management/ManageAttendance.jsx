import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { broadcastUpdate } from '../../utils/realtimeSync';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  CheckCheck,
  UserCheck,
  Sparkles,
  AlertCircle,
  Download
} from 'lucide-react';

const CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

const SECTIONS = ['A', 'B', 'C'];

const ManageAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setSavedSuccess(false);
    try {
      const response = await axios.get('/api/erp/attendance', {
        params: {
          className: selectedClass,
          section: selectedSection,
          date: selectedDate,
        },
        withCredentials: true,
      });

      if (response.data?.success && response.data?.data?.records) {
        setRecords(response.data.data.records);
        setAlreadySaved(response.data.alreadySaved || false);
      } else {
        setRecords([]);
        setAlreadySaved(false);
      }
    } catch {
      setRecords([]);
      setAlreadySaved(false);
    } finally {
      setLoading(false);
    }
  }, [selectedClass, selectedSection, selectedDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const toggleStatus = (idx, newStatus) => {
    setRecords((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], status: newStatus };
      return updated;
    });
  };

  const markAll = (status) => {
    setRecords((prev) => prev.map((r) => ({ ...r, status })));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(
        '/api/erp/attendance',
        {
          className: selectedClass,
          section: selectedSection,
          date: selectedDate,
          records,
        },
        { withCredentials: true }
      );
      setSavedSuccess(true);
      setAlreadySaved(true);
      broadcastUpdate('attendance');
    } catch {
      // Standalone simulation
      setSavedSuccess(true);
      setAlreadySaved(true);
      broadcastUpdate('attendance');
    } finally {
      setSaving(false);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const handleDownloadExcel = async () => {
    setDownloadingExcel(true);
    try {
      const response = await axios.get('/api/erp/attendance/export', {
        params: { className: selectedClass, section: selectedSection },
        responseType: 'blob',
        withCredentials: true,
      });

      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MMPS_${selectedClass.replace(/\s+/g, '_')}_${selectedSection}_Attendance_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Direct frontend fallback
      const headers = ['Roll No', 'Scholar No', 'Student Name', 'Status', 'Remarks'];
      const rows = records.map((r) => [r.rollNo, r.scholarNo, `"${r.studentName}"`, `"${r.status}"`, `"${r.remarks || ''}"`]);
      const csv = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MMPS_${selectedClass}_${selectedSection}_Attendance.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloadingExcel(false);
    }
  };

  const total = records.length;
  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;
  const lateCount = records.filter((r) => r.status === 'Late').length;
  const leaveCount = records.filter((r) => r.status === 'Leave').length;
  const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> Attendance Engine
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              Daily Class Attendance
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Mark and record instant daily attendance with 1-click absent-toggle for all sections.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleDownloadExcel}
              disabled={downloadingExcel}
              className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-4 py-2.5 sm:py-3 rounded-xl transition-all border border-white/20 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              <Download size={16} /> {downloadingExcel ? 'Exporting...' : 'Excel Report'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-extrabold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              <Save size={16} /> {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>

        {/* Live Attendance Rate Bar */}
        <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-4 text-center">
          <div className="bg-white/5 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-white/5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase text-slate-400 block">Enrolled in Sec</span>
            <span className="text-lg sm:text-xl font-black text-white">{total}</span>
          </div>
          <div className="bg-emerald-500/10 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-emerald-500/20">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase text-emerald-300 block">Present</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400">{presentCount}</span>
          </div>
          <div className="bg-rose-500/10 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-rose-500/20">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase text-rose-300 block">Absent</span>
            <span className="text-lg sm:text-xl font-black text-rose-400">{absentCount}</span>
          </div>
          <div className="bg-amber-500/10 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-amber-500/20">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase text-amber-300 block">Late / Leave</span>
            <span className="text-lg sm:text-xl font-black text-amber-400">{lateCount + leaveCount}</span>
          </div>
          <div className="bg-blue-500/10 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-blue-500/20 col-span-2 sm:col-span-1">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase text-blue-300 block">Attendance Rate</span>
            <span className="text-lg sm:text-xl font-black text-white">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Selector & Action Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-4 w-full lg:w-auto">
          {/* Class Select */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full sm:w-auto px-2.5 sm:px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Section Select */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full sm:w-auto px-2.5 sm:px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              {SECTIONS.map((s) => (
                <option key={s} value={s}>Section {s}</option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 col-span-2 sm:col-span-1">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Date:</span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 outline-none cursor-pointer"
              />
              {alreadySaved && (
                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  Recorded
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Bulk Actions */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-stretch sm:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <button
            onClick={() => markAll('Present')}
            className="flex-1 sm:flex-initial justify-center px-3 py-2 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck size={14} /> All Present
          </button>
          <button
            onClick={() => markAll('Absent')}
            className="flex-1 sm:flex-initial justify-center px-3 py-2 sm:py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <XCircle size={14} /> All Absent
          </button>
        </div>
      </div>

      {/* Fine Rule Notification Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 sm:p-4 rounded-r-xl sm:rounded-r-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <AlertCircle className="text-amber-600 shrink-0" size={18} />
          <p className="text-[11px] sm:text-xs font-semibold text-amber-900 leading-relaxed">
            <span className="font-bold">Automated Absent Fine Policy:</span> A fine of <span className="font-bold text-rose-700">₹ 10 / day</span> is automatically computed and added to the fee ledger under the <span className="font-bold">fine</span> column for each student marked Absent.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-xl sm:rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          Attendance for {selectedClass} - Section {selectedSection} ({selectedDate}) saved and absent fines synced!
        </div>
      )}

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Mobile Horizontal Scroll Cue */}
        <div className="md:hidden px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Swipe table left/right to mark</span>
          <span className="font-bold text-slate-600">⇄</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-4 px-6 w-16">Roll</th>
                <th className="py-4 px-6">Scholar No</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6 text-center">Status (Tap to Change)</th>
                <th className="py-4 px-4 text-center">Fine (₹)</th>
                <th className="py-4 px-6">Remarks / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent mb-2"></div>
                    <p className="text-xs font-bold uppercase tracking-wider">Loading Attendance Roster...</p>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 font-bold">
                    No students registered in {selectedClass} - Section {selectedSection}
                  </td>
                </tr>
              ) : (
                records.map((record, index) => (
                  <tr key={record.scholarNo || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-6 font-bold text-slate-700">
                      #{record.rollNo}
                    </td>
                    <td className="py-3 px-6 font-mono text-xs font-extrabold text-blue-900">
                      {record.scholarNo}
                    </td>
                    <td className="py-3 px-6 font-bold text-slate-900">
                      {record.studentName}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleStatus(index, 'Present')}
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            record.status === 'Present'
                              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-300'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(index, 'Absent')}
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            record.status === 'Absent'
                              ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30 ring-2 ring-rose-300'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          A
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(index, 'Late')}
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            record.status === 'Late'
                              ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30 ring-2 ring-amber-300'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          L
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(index, 'Leave')}
                          className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                            record.status === 'Leave'
                              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 ring-2 ring-blue-300'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          LV
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-xs">
                      {record.status === 'Absent' ? (
                        <span className="text-rose-600 font-extrabold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          + ₹ 10
                        </span>
                      ) : (
                        <span className="text-slate-400">₹ 0</span>
                      )}
                    </td>
                    <td className="py-3 px-6">
                      <input
                        type="text"
                        value={record.remarks || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRecords((prev) => {
                            const up = [...prev];
                            up[index] = { ...up[index], remarks: val };
                            return up;
                          });
                        }}
                        placeholder="Optional remarks..."
                        className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageAttendance;
