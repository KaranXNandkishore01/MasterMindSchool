import { useState, useEffect, useCallback, useId } from 'react';
import axios from 'axios';
import { broadcastUpdate } from '../../utils/realtimeSync';
import {
  Users,
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Phone,
  Eye,
  X,
  UserCheck,
  UserX,
  CheckCircle2,
  Calendar,
  Sparkles,
  UserMinus,
  Trash2,
  RefreshCw,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';

const CLASSES = [
  'All',
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

const SECTIONS = ['All', 'A', 'B', 'C'];

const generateCaptcha = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSuccessToast, setIsSuccessToast] = useState('');

  // Remove / Withdrawal Captcha Protection states
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [captchaCode, setCaptchaCode] = useState('');
  const [enteredCaptcha, setEnteredCaptcha] = useState('');
  const [removalType, setRemovalType] = useState('withdraw');
  const [withdrawalReason, setWithdrawalReason] = useState('Admission Withdrawn (Transfer Certificate / TC Issued)');
  const [isRemoving, setIsRemoving] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const captchaReasonId = useId();
  const captchaInputId = useId();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    class: 'Class 10',
    section: 'A',
    stream: 'None',
    gender: 'Male',
    dob: '2012-01-01',
    bloodGroup: 'B+',
    fatherName: '',
    motherName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
  });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/erp/students', {
        params: {
          page,
          limit: 15,
          className: selectedClass,
          section: selectedSection,
          status: selectedStatus,
          search: searchTerm,
        },
        withCredentials: true,
      });

      if (response.data?.success) {
        setStudents(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalCount(response.data.pagination?.total || (response.data.data ? response.data.data.length : 0));
      } else {
        setStudents([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch {
      setStudents([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, selectedClass, selectedSection, selectedStatus, searchTerm]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/erp/students', formData, { withCredentials: true });
    } catch {
      // Mock insert on standalone
      const newMock = {
        _id: `mock-new-${Date.now()}`,
        scholarNo: `MMPS-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
        rollNo: Math.floor(1 + Math.random() * 40),
        ...formData,
        status: 'Active',
      };
      setStudents(prev => [newMock, ...prev]);
    }

    setIsAddModalOpen(false);
    setIsSuccessToast(`Student ${formData.firstName} ${formData.lastName} enrolled successfully!`);
    setTimeout(() => setIsSuccessToast(''), 4000);
    broadcastUpdate('students');
    fetchStudents();
  };

  const handleOpenRemove = (student) => {
    setStudentToRemove(student);
    setCaptchaCode(generateCaptcha());
    setEnteredCaptcha('');
    setRemovalType('withdraw');
    setWithdrawalReason('Admission Withdrawn (Transfer Certificate / TC Issued)');
    setCaptchaError('');
  };

  const handleRefreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setEnteredCaptcha('');
    setCaptchaError('');
  };

  const handleConfirmRemove = async (e) => {
    e.preventDefault();
    if (!studentToRemove) return;

    if (enteredCaptcha.trim().toUpperCase() !== captchaCode) {
      setCaptchaError('Incorrect Captcha code. Please enter the exact code shown above.');
      return;
    }

    setIsRemoving(true);
    setCaptchaError('');

    try {
      const res = await axios.delete(`/api/erp/students/${studentToRemove._id}`, {
        data: {
          permanent: removalType === 'permanent',
          reason: withdrawalReason,
        },
        withCredentials: true,
      });

      setIsSuccessToast(res.data?.message || `Student ${studentToRemove.firstName} ${studentToRemove.lastName} removed successfully.`);
      setTimeout(() => setIsSuccessToast(''), 5000);
      setStudentToRemove(null);
      broadcastUpdate('students');
      broadcastUpdate('fees');
      fetchStudents();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to remove student. Please try again.';
      setCaptchaError(msg);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      {isSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-emerald-400">
          <CheckCircle2 size={20} />
          <span className="font-semibold text-sm">{isSuccessToast}</span>
        </div>
      )}

      {/* Top Banner / Metrics */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> Student Information System (SIS)
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              Student Directory & Enrollment
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Active Registry for Enrolled Students across Classes Nursery to XII (Session 2026-27).
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto justify-center bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-extrabold px-5 py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
            >
              <Plus size={16} /> Admit New Student
            </button>
          </div>
        </div>

        {/* Quick SIS Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
          <div className="bg-white/5 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Total Registry</span>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">{totalCount.toLocaleString()}</p>
          </div>
          <div className="bg-white/5 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Classes Active</span>
            <p className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">15 (NUR - XII)</p>
          </div>
          <div className="bg-white/5 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Gender Balance</span>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">52% 👦 / 48% 👧</p>
          </div>
          <div className="bg-white/5 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Affiliation</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">MPBSE Board</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Search Name, Scholar No, Phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs sm:text-sm transition-all"
          />
        </div>

        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
          {/* Class Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value); setPage(1); }}
              className="w-full sm:w-auto px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Sec:</span>
            <select
              value={selectedSection}
              onChange={(e) => { setSelectedSection(e.target.value); setPage(1); }}
              className="w-full sm:w-auto px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              {SECTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setPage(1); }}
              className="w-full sm:w-auto px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Table Container */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Mobile Horizontal Scroll Cue */}
        <div className="md:hidden px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Swipe table left/right for details</span>
          <span className="font-bold text-slate-600">⇄</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Scholar No</th>
                <th className="py-4 px-6">Student Name</th>
                <th className="py-4 px-6">Class & Sec</th>
                <th className="py-4 px-6">Roll No</th>
                <th className="py-4 px-6">Gender</th>
                <th className="py-4 px-6">Parent & Contact</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-2"></div>
                    <p className="text-xs font-bold uppercase tracking-wider">Loading Student Records...</p>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-400">
                    <UserX size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-700">No students found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search criteria or class filters</p>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-xs font-extrabold text-blue-900">
                      {student.scholarNo}
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-block bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-200/60">
                        {student.class} - {student.section}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-700">
                      #{student.rollNo}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`text-xs font-semibold ${student.gender === 'Female' ? 'text-rose-600' : 'text-blue-600'}`}>
                        {student.gender}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-xs">
                      <div className="font-semibold text-slate-800">{student.fatherName}</div>
                      <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone size={12} className="text-slate-400" />
                        {student.parentPhone}
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        student.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          onClick={() => handleOpenRemove(student)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs transition-colors cursor-pointer border border-rose-200"
                          title="Withdraw Admission / Remove Student"
                        >
                          <UserMinus size={14} /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Showing Page <span className="font-bold text-slate-800">{page}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Student Details Drawer / Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-slate-100 relative animate-scale-in max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3.5 sm:gap-4 mb-5 sm:mb-6">
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-100 text-blue-900 font-extrabold text-lg sm:text-xl flex items-center justify-center shadow-inner shrink-0">
                {selectedStudent.firstName[0]}{selectedStudent.lastName[0]}
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedStudent.scholarNo}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5 sm:mt-1">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedStudent.class} • Section {selectedStudent.section} • Roll #{selectedStudent.rollNo}
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-3.5 text-xs text-slate-700 border-t border-slate-100 pt-4 sm:pt-5">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">Father Name</span>
                  <span className="font-bold text-slate-900">{selectedStudent.fatherName}</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">Blood Group</span>
                  <span className="font-bold text-slate-900">{selectedStudent.bloodGroup}</span>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">Parent Phone</span>
                <a href={`tel:${selectedStudent.parentPhone}`} className="font-bold text-blue-700 hover:underline">
                  {selectedStudent.parentPhone}
                </a>
              </div>

              <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">Residential Address</span>
                <span className="font-semibold text-slate-800">{selectedStudent.address}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 mt-5 sm:mt-6">
              <button
                onClick={() => setSelectedStudent(null)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer text-center"
              >
                Close Details
              </button>
              <button
                onClick={() => {
                  const st = selectedStudent;
                  setSelectedStudent(null);
                  handleOpenRemove(st);
                }}
                className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 cursor-pointer flex items-center justify-center gap-1.5"
                title="Withdraw Admission"
              >
                <UserMinus size={14} /> Withdraw / Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Admission Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="mb-5 sm:mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Admission Portal 2026-27
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Admit New Student</h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter student and parent demographic information to register in MMPS ERP.
              </p>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. Shaurya"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. Rajput"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Class *</label>
                  <select
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {CLASSES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Section *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Father Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. Ramesh Rajput"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Parent Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Residential Address *</label>
                <textarea
                  rows="2"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  placeholder="Street, Colony, Town, Pipariya"
                ></textarea>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove / Withdraw Student Captcha Protection Modal */}
      {studentToRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setStudentToRemove(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-rose-100 relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setStudentToRemove(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <ShieldAlert size={24} />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 block">
                  Security Protected Action
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Withdraw / Remove Student
                </h3>
              </div>
            </div>

            {/* Student Info Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-4 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Student Name:</span>
                <span className="font-extrabold text-slate-900">{studentToRemove.firstName} {studentToRemove.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Scholar Number:</span>
                <span className="font-mono font-bold text-blue-900">{studentToRemove.scholarNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Class & Section:</span>
                <span className="font-bold text-slate-800">{studentToRemove.class} - {studentToRemove.section} (Roll #{studentToRemove.rollNo})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Father's Name:</span>
                <span className="font-semibold text-slate-800">{studentToRemove.fatherName}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmRemove} className="space-y-4">
              {/* Removal Type Choice */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Action Type</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRemovalType('withdraw')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      removalType === 'withdraw'
                        ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs font-extrabold text-amber-900">Withdraw Admission</span>
                    <span className="block text-[10px] text-amber-700 leading-tight mt-0.5">Issue TC & mark Inactive (keeps audit ledger)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemovalType('permanent')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      removalType === 'permanent'
                        ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs font-extrabold text-rose-900">Permanent Delete</span>
                    <span className="block text-[10px] text-rose-700 leading-tight mt-0.5">Completely erase student & fee records</span>
                  </button>
                </div>
              </div>

              {/* Reason Dropdown */}
              <div>
                <label htmlFor={captchaReasonId} className="block text-xs font-bold text-slate-700 uppercase mb-1">Reason for Removal *</label>
                <select
                  id={captchaReasonId}
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                >
                  <option value="Admission Withdrawn (Transfer Certificate / TC Issued)">Admission Withdrawn (Transfer Certificate / TC Issued)</option>
                  <option value="Family Relocated to another city">Family Relocated to another city</option>
                  <option value="Admitted to another institution">Admitted to another institution</option>
                  <option value="Parent Request / Discontinued">Parent Request / Discontinued</option>
                  <option value="Erroneously registered entry">Erroneously registered entry</option>
                </select>
              </div>

              {/* Captcha Box */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Security Verification Code
                  </span>
                  <button
                    type="button"
                    onClick={handleRefreshCaptcha}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white cursor-pointer px-2 py-0.5 rounded bg-white/10"
                    title="Generate new Captcha"
                  >
                    <RefreshCw size={12} /> New Code
                  </button>
                </div>

                {/* Visual Distorted Captcha Display */}
                <div className="bg-gradient-to-r from-slate-800 via-blue-950 to-slate-800 border-2 border-dashed border-amber-400/50 rounded-xl py-3 px-4 flex items-center justify-center gap-3 select-none">
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

                {/* Input */}
                <div>
                  <label htmlFor={captchaInputId} className="block text-[11px] font-bold text-slate-300 mb-1">
                    Type the 5-character Captcha code above to confirm:
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 font-mono text-center tracking-widest text-lg font-black border border-slate-700 outline-none focus:border-amber-400 uppercase"
                  />
                </div>

                {/* Status indicator */}
                <div className="text-center text-xs">
                  {enteredCaptcha.trim().toUpperCase() === captchaCode ? (
                    <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                      <CheckCircle2 size={13} /> Captcha verified! Ready to confirm removal.
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">
                      Type exact code to enable the removal button
                    </span>
                  )}
                </div>
              </div>

              {captchaError && (
                <div className="bg-rose-50 border border-rose-300 text-rose-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertTriangle size={15} className="shrink-0 text-rose-600" />
                  <span>{captchaError}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setStudentToRemove(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enteredCaptcha.trim().toUpperCase() !== captchaCode || isRemoving}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-black shadow-md cursor-pointer transition-all flex items-center gap-2"
                >
                  {isRemoving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Removing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      <span>Confirm & Remove Student</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;

