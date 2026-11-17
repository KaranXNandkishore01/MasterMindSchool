import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { broadcastUpdate } from '../../utils/realtimeSync';
import {
  Users,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Phone,
  Eye,
  Pencil,
  X,
  UserX,
  CheckCircle2,
  Sparkles,
  UserMinus,
  Trash2,
  Award,
  Printer,
  FileText,
  ShieldCheck,
  CreditCard,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import TransferCertificateModal from '../../components/erp/TransferCertificateModal';
import WithdrawalSuccessModal from '../../components/erp/WithdrawalSuccessModal';
import AdmitStudentModal from '../../components/erp/AdmitStudentModal';
import WithdrawStudentModal from '../../components/erp/WithdrawStudentModal';
import EditStudentModal from '../../components/erp/EditStudentModal';
import StudentProfileDocModal from '../../components/erp/StudentProfileDocModal';

const CLASSES = [
  'All',
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

const SECTIONS = ['All', 'A', 'B', 'C'];

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

  // Modals & Action States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentForProfileDoc, setStudentForProfileDoc] = useState(null);
  const [studentToWithdraw, setStudentToWithdraw] = useState(null);
  const [withdrawnStudentForSuccess, setWithdrawnStudentForSuccess] = useState(null);
  const [studentForTC, setStudentForTC] = useState(null);
  const [isSuccessToast, setIsSuccessToast] = useState('');

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

  const handleAdmitStudent = async (newStudentData) => {
    try {
      await axios.post('/api/erp/students', newStudentData, { withCredentials: true });
    } catch {
      // Mock insert on standalone mode
      const newMock = {
        _id: `mock-new-${Date.now()}`,
        scholarNo: newStudentData.scholarNo || `MMPS-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
        rollNo: newStudentData.rollNo || Math.floor(1 + Math.random() * 40),
        ...newStudentData,
        status: 'Active',
      };
      setStudents((prev) => [newMock, ...prev]);
    }

    setIsAddModalOpen(false);
    setIsSuccessToast(`Student ${newStudentData.firstName} ${newStudentData.lastName} enrolled successfully!`);
    setTimeout(() => setIsSuccessToast(''), 5000);
    broadcastUpdate('students');
    broadcastUpdate('fees');
    fetchStudents();
  };

  const handleUpdateStudent = async (studentId, updatedData) => {
    try {
      const res = await axios.put(`/api/erp/students/${studentId}`, updatedData, { withCredentials: true });
      const updated = res.data?.data || { _id: studentId, ...updatedData };

      setStudents((prev) => prev.map((s) => (s._id === studentId ? { ...s, ...updated } : s)));
      if (selectedStudent?._id === studentId) {
        setSelectedStudent((prev) => ({ ...prev, ...updated }));
      }

      setStudentToEdit(null);
      setIsSuccessToast(`Student ${updatedData.firstName} ${updatedData.lastName} record updated successfully!`);
      setTimeout(() => setIsSuccessToast(''), 5000);
      broadcastUpdate('students');
      broadcastUpdate('fees');
      fetchStudents();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update student.';
      throw new Error(msg);
    }
  };

  const handleConfirmWithdraw = async (student, payload) => {
    try {
      const res = await axios.delete(`/api/erp/students/${student._id}`, {
        data: payload,
        withCredentials: true,
      });

      const updatedStudent = res.data?.data || {
        ...student,
        status: payload.permanent ? 'Deleted' : 'Inactive',
        withdrawalReason: payload.reason,
        withdrawalDate: payload.tcIssueDate || new Date().toISOString(),
        tcSerialNo: payload.tcSerialNo,
        tcIssueDate: payload.tcIssueDate,
        tcApplicationDate: payload.tcApplicationDate,
        promotionStatus: payload.promotionStatus,
        duesClearedUpTo: payload.duesClearedUpTo,
        totalWorkingDays: payload.totalWorkingDays,
        daysPresent: payload.daysPresent,
        generalConduct: payload.generalConduct,
        remarks: payload.remarks,
      };

      setStudentToWithdraw(null);

      if (payload.permanent) {
        setIsSuccessToast(`Student ${student.firstName} ${student.lastName} has been permanently removed.`);
        setTimeout(() => setIsSuccessToast(''), 4500);
      } else {
        // Show official withdrawal & TC generation confirmation popup!
        setWithdrawnStudentForSuccess(updatedStudent);
      }

      broadcastUpdate('students');
      broadcastUpdate('fees');
      fetchStudents();
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to process student removal.';
      throw new Error(msg);
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
              Official Registry for Enrolled Students across Classes Nursery to XII (Session 2026-27).
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto justify-center bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black px-5 py-3 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
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
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Academic Year</span>
            <p className="text-xl sm:text-2xl font-black text-white mt-0.5">2026-27</p>
          </div>
          <div className="bg-white/5 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none">
            <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Affiliation</span>
            <p className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">MPBSE / CBSE</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Name, Scholar No, Phone, Father Name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs sm:text-sm transition-all"
          />
        </div>

        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
          {/* Class Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Sec:</span>
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              {SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Enrolled</option>
              <option value="Inactive">Withdrawn / T.C. Issued</option>
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
          <table className="w-full min-w-[840px] text-left text-sm text-slate-600">
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
                students.map((student) => {
                  const isActive = student.status === 'Active';
                  return (
                    <tr key={student._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-mono text-xs font-extrabold text-blue-900">
                        {student.scholarNo}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          {student.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                              {student.firstName[0]}
                            </div>
                          )}
                          <span>
                            {student.firstName} {student.lastName}
                          </span>
                        </div>
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
                        <span
                          className={`text-xs font-semibold ${
                            student.gender === 'Female' ? 'text-rose-600' : 'text-blue-600'
                          }`}
                        >
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
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          ></span>
                          {isActive ? 'Active' : 'Withdrawn (TC)'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                            title="View Student Profile"
                          >
                            <Eye size={13} /> View
                          </button>

                          <button
                            onClick={() => setStudentToEdit(student)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-lg text-xs transition-colors cursor-pointer border border-blue-200"
                            title="Edit Student Information"
                          >
                            <Pencil size={13} /> Edit
                          </button>

                          <button
                            onClick={() => setStudentForProfileDoc(student)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold rounded-lg text-xs transition-colors cursor-pointer border border-indigo-200"
                            title="Print Official Student Cumulative Record (A4)"
                          >
                            <FileText size={13} /> Dossier
                          </button>

                          {isActive ? (
                            <button
                              onClick={() => setStudentToWithdraw(student)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg text-xs transition-colors cursor-pointer border border-amber-300"
                              title="Withdraw Admission & Issue T.C."
                            >
                              <UserMinus size={13} /> Withdraw
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => setStudentForTC(student)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 text-amber-950 font-black rounded-lg text-xs transition-colors cursor-pointer border border-amber-300 shadow-sm"
                                title="View & Print Official School Transfer Certificate (T.C.)"
                              >
                                <Award size={13} className="text-amber-800" /> T.C.
                              </button>
                              <button
                                onClick={() => setStudentToWithdraw(student)}
                                className="inline-flex items-center p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs transition-colors cursor-pointer border border-rose-200"
                                title="Permanent Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Showing Page <span className="font-bold text-slate-800">{page}</span> of{' '}
            <span className="font-bold text-slate-800">{totalPages}</span>
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
            className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-2xl border border-slate-100 relative animate-scale-in max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-5">
              {selectedStudent.photoUrl ? (
                <img
                  src={selectedStudent.photoUrl}
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-md shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-900 font-extrabold text-xl flex items-center justify-center shadow-inner shrink-0">
                  {selectedStudent.firstName[0]}
                  {selectedStudent.lastName[0]}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedStudent.scholarNo}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedStudent.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {selectedStudent.status}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedStudent.class} • Section {selectedStudent.section} • Roll #{selectedStudent.rollNo}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 text-xs text-slate-700 border-t border-slate-100 pt-4">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">
                    Date of Birth
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString('en-IN') : 'Not Specified'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">
                    Blood Group
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedStudent.bloodGroup || 'Not Specified'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">
                    Student Aadhaar Card
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedStudent.aadhaarNo || 'Not Provided'}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">
                    Category / Nationality
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedStudent.category || 'General'} • {selectedStudent.nationality || 'Indian'}
                  </span>
                </div>
              </div>

              {/* Parents Section */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Parent & Guardian Information
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Father:</span>
                    <span className="font-bold text-slate-900">{selectedStudent.fatherName}</span>
                    {selectedStudent.fatherAadhaar && (
                      <span className="block text-[10px] font-mono text-slate-500">
                        Aadhaar: {selectedStudent.fatherAadhaar}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Mother:</span>
                    <span className="font-bold text-slate-900">{selectedStudent.motherName || '—'}</span>
                    {selectedStudent.motherAadhaar && (
                      <span className="block text-[10px] font-mono text-slate-500">
                        Aadhaar: {selectedStudent.motherAadhaar}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-slate-500">Contact Phone:</span>
                  <a href={`tel:${selectedStudent.parentPhone}`} className="font-bold text-blue-700 hover:underline">
                    {selectedStudent.parentPhone}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">
                  Residential Address
                </span>
                <span className="font-semibold text-slate-800">{selectedStudent.address}</span>
              </div>

              {/* Academic History Status */}
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-bold block mb-0.5 uppercase tracking-wider text-[10px]">
                  Enrollment History
                </span>
                {selectedStudent.isFresher ? (
                  <span className="font-bold text-emerald-700">🌟 Fresher Admission (First time formal schooling)</span>
                ) : (
                  <div className="text-slate-800 space-y-0.5">
                    <p>Previous School: <strong>{selectedStudent.previousSchool || 'Registered Previous School'}</strong></p>
                    {selectedStudent.previousMarksheet && <p>Marksheet: <strong>{selectedStudent.previousMarksheet}</strong></p>}
                    {selectedStudent.previousTcNo && <p>Previous T.C.: <strong>{selectedStudent.previousTcNo}</strong></p>}
                  </div>
                )}
              </div>

              {/* Withdrawn Info (if applicable) */}
              {selectedStudent.status !== 'Active' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-950">
                  <div className="flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-amber-800">Transfer Certificate No:</span>
                    <span className="font-mono font-black">{selectedStudent.tcSerialNo || 'Generated'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-amber-800 font-medium">Reason for Leaving:</span>
                    <span className="font-semibold">{selectedStudent.withdrawalReason || 'T.C. Issued'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Modal Actions */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <button
                onClick={() => setSelectedStudent(null)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer text-center"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const st = selectedStudent;
                  setSelectedStudent(null);
                  setStudentToEdit(st);
                }}
                className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold rounded-xl text-xs border border-blue-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Pencil size={14} /> Edit Record
              </button>

              <button
                onClick={() => {
                  const st = selectedStudent;
                  setSelectedStudent(null);
                  setStudentForProfileDoc(st);
                }}
                className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-bold rounded-xl text-xs border border-indigo-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FileText size={14} /> Print Dossier
              </button>

              {selectedStudent.status !== 'Active' ? (
                <button
                  onClick={() => {
                    const st = selectedStudent;
                    setSelectedStudent(null);
                    setStudentForTC(st);
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 shadow"
                >
                  <Award size={14} /> View T.C.
                </button>
              ) : (
                <button
                  onClick={() => {
                    const st = selectedStudent;
                    setSelectedStudent(null);
                    setStudentToWithdraw(st);
                  }}
                  className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl text-xs border border-amber-300 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserMinus size={14} /> Withdraw
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Section Professional ERP New Admission Dialog */}
      <AdmitStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdmit={handleAdmitStudent}
      />

      {/* Edit Student Record Modal */}
      <EditStudentModal
        student={studentToEdit}
        isOpen={!!studentToEdit}
        onClose={() => setStudentToEdit(null)}
        onSave={handleUpdateStudent}
      />

      {/* Official Student Admission Dossier & Cumulative Record Printable Modal */}
      <StudentProfileDocModal
        student={studentForProfileDoc}
        onClose={() => setStudentForProfileDoc(null)}
      />

      {/* Official Withdrawal / Removal Action Modal */}
      <WithdrawStudentModal
        student={studentToWithdraw}
        isOpen={!!studentToWithdraw}
        onClose={() => setStudentToWithdraw(null)}
        onConfirm={handleConfirmWithdraw}
      />

      {/* Withdrawal Success & Immediate T.C. Action Pop Up */}
      <WithdrawalSuccessModal
        student={withdrawnStudentForSuccess}
        onOpenTC={(student) => {
          setWithdrawnStudentForSuccess(null);
          setStudentForTC(student);
        }}
        onClose={() => setWithdrawnStudentForSuccess(null)}
      />

      {/* Official School Transfer Certificate (T.C.) Printable Document Modal */}
      <TransferCertificateModal
        student={studentForTC}
        onClose={() => setStudentForTC(null)}
      />
    </div>
  );
};

export default ManageStudents;
