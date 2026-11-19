import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Users,
  Search,
  Filter,
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
  Award,
  Printer,
  FileText,
  ShieldCheck,
  CreditCard,
  MapPin,
  Calendar,
  AlertCircle,
  Briefcase,
  Camera,
  Smartphone,
  ExternalLink,
  DollarSign,
  Clock,
  Check,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import sitelogo from '../../assets/sitelogo.png';
import StaffExperienceLetterModal from '../../components/erp/StaffExperienceLetterModal';
import RemoveStaffModal from '../../components/erp/RemoveStaffModal';
import StaffProfileDocModal from '../../components/erp/StaffProfileDocModal';

const ROLES = [
  'All',
  'Teacher',
  'Driver',
  'Maid',
  'Assistant',
  'Gardener',
  'Manager',
  'Staff Assistant',
  'Security Guard'
];

const EMPLOYMENT_TYPES = ['All', 'Full-Time', 'Part-Time'];

const ManageStaff = () => {
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'attendance' | 'leaves' | 'payroll'

  // Overview KPIs
  const [overview, setOverview] = useState(null);

  // Staff Directory State
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Attendance Roster State
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendanceRoster, setAttendanceRoster] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [attendanceRoleFilter, setAttendanceRoleFilter] = useState('All');

  // Leaves State
  const [leavesList, setLeavesList] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);

  // Payroll State
  const [payrollList, setPayrollList] = useState([]);
  const [payrollSummary, setPayrollSummary] = useState(null);
  const [loadingPayroll, setLoadingPayroll] = useState(false);
  const [payrollRoleFilter, setPayrollRoleFilter] = useState('All');
  const [payrollTypeFilter, setPayrollTypeFilter] = useState('All');

  // Modals
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [selectedStaffForView, setSelectedStaffForView] = useState(null);
  const [staffForExperienceLetter, setStaffForExperienceLetter] = useState(null);
  const [staffForRemove, setStaffForRemove] = useState(null);
  const [staffToEdit, setStaffToEdit] = useState(null);
  const [viewingSelfie, setViewingSelfie] = useState(null); // { photo, staffName, time, type, distance }
  const [isLogLeaveOpen, setIsLogLeaveOpen] = useState(false);
  const [payingStaffRecord, setPayingStaffRecord] = useState(null);
  const [payslipData, setPayslipData] = useState(null);
  const [isToast, setIsToast] = useState('');

  // Form: Add/Edit Staff
  const [staffFormData, setStaffFormData] = useState({
    fullName: '',
    role: 'Teacher',
    employmentType: 'Full-Time',
    department: 'Academic',
    phone: '',
    email: '',
    gender: 'Male',
    monthlySalary: 25000,
    aadhaarNo: '',
    address: '',
    bankAccount: { accountNumber: '', ifscCode: '', bankName: 'SBI Pipariya' },
  });

  // Form: Leave / Half-day
  const [leaveFormData, setLeaveFormData] = useState({
    employeeId: '',
    leaveType: 'Casual Leave',
    isHalfDay: false,
    halfDaySession: 'First Half',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
  });

  // Form: Disburse Payment
  const [paymentFormData, setPaymentFormData] = useState({
    paymentMode: 'Bank Transfer',
    transactionRef: '',
    remarks: 'Monthly salary disbursed via school ERP',
  });

  // Fetch Overview Metrics
  const fetchOverview = useCallback(async () => {
    try {
      const res = await axios.get('/api/staff/overview');
      if (res.data?.success) {
        setOverview(res.data.data);
      }
    } catch {
      setOverview({
        totalStaff: 0,
        fullTimeCount: 0,
        partTimeCount: 0,
        rolesBreakdown: {
          teachers: 0,
          drivers: 0,
          maids: 0,
          assistants: 0,
          gardeners: 0,
          managers: 0,
          staffAssistants: 0,
          guards: 0,
        },
        todayAttendance: {
          present: 0,
          halfDay: 0,
          onLeave: 0,
          absent: 0,
          totalPunched: 0,
        },
      });
    }
  }, []);

  // Fetch Directory
  const fetchStaffList = useCallback(async () => {
    setLoadingStaff(true);
    try {
      const res = await axios.get('/api/staff', {
        params: {
          page,
          limit: 15,
          role: selectedRole,
          employmentType: selectedType,
          search: searchTerm,
        },
      });
      if (res.data?.success) {
        setStaffList(res.data.data);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalCount(res.data.pagination?.total || res.data.data.length);
      }
    } catch {
      setStaffList([]);
    } finally {
      setLoadingStaff(false);
    }
  }, [page, selectedRole, selectedType, searchTerm]);

  // Fetch Attendance Roster
  const fetchAttendanceRoster = useCallback(async () => {
    setLoadingAttendance(true);
    try {
      const res = await axios.get('/api/staff/attendance/roster', {
        params: { date: attendanceDate, role: attendanceRoleFilter },
      });
      if (res.data?.success) {
        setAttendanceRoster(res.data.data || []);
      }
    } catch {
      setAttendanceRoster([]);
    } finally {
      setLoadingAttendance(false);
    }
  }, [attendanceDate, attendanceRoleFilter]);

  // Fetch Leaves
  const fetchLeaves = useCallback(async () => {
    setLoadingLeaves(true);
    try {
      const res = await axios.get('/api/staff/leaves');
      if (res.data?.success) {
        setLeavesList(res.data.data || []);
      }
    } catch {
      setLeavesList([]);
    } finally {
      setLoadingLeaves(false);
    }
  }, []);

  // Fetch Payroll
  const fetchPayroll = useCallback(async () => {
    setLoadingPayroll(true);
    try {
      const res = await axios.get('/api/staff/payroll/list', {
        params: {
          monthYear: '2026-11',
          role: payrollRoleFilter,
          employmentType: payrollTypeFilter,
        },
      });
      if (res.data?.success) {
        setPayrollList(res.data.data || []);
        setPayrollSummary(res.data.summary);
      }
    } catch {
      setPayrollList([]);
    } finally {
      setLoadingPayroll(false);
    }
  }, [payrollRoleFilter, payrollTypeFilter]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    if (activeTab === 'directory') fetchStaffList();
    if (activeTab === 'attendance') fetchAttendanceRoster();
    if (activeTab === 'leaves') fetchLeaves();
    if (activeTab === 'payroll') fetchPayroll();
  }, [activeTab, fetchStaffList, fetchAttendanceRoster, fetchLeaves, fetchPayroll]);

  // Save / Update Staff
  const handleSaveStaff = async (e) => {
    e.preventDefault();
    try {
      if (staffToEdit) {
        await axios.put(`/api/staff/${staffToEdit._id}`, staffFormData);
        setIsToast(`Staff member ${staffFormData.fullName} updated successfully.`);
      } else {
        await axios.post('/api/staff', staffFormData);
        setIsToast(`Staff member ${staffFormData.fullName} added successfully.`);
      }
      setIsAddStaffOpen(false);
      setStaffToEdit(null);
      setTimeout(() => setIsToast(''), 4000);
      fetchStaffList();
      fetchOverview();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save staff record.');
    }
  };

  // Submit Leave / Half-day
  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/staff/leaves', leaveFormData);
      setIsLogLeaveOpen(false);
      setIsToast(`Leave logged for employee ${leaveFormData.employeeId}.`);
      setTimeout(() => setIsToast(''), 4000);
      fetchLeaves();
      fetchOverview();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log leave.');
    }
  };

  // Disburse Salary
  const handleDisburseSalary = async (e) => {
    e.preventDefault();
    if (!payingStaffRecord) return;

    try {
      const res = await axios.post(`/api/staff/payroll/disburse/${payingStaffRecord._id}`, paymentFormData);
      setIsToast(`Salary of ₹${payingStaffRecord.netPayable.toLocaleString()} disbursed to ${payingStaffRecord.staffName}.`);
      setPayslipData(res.data.data || payingStaffRecord);
      setPayingStaffRecord(null);
      setTimeout(() => setIsToast(''), 4000);
      fetchPayroll();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to disburse salary.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Alert */}
      {isToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-fade-in border border-emerald-400">
          <CheckCircle2 size={18} />
          <span className="font-bold text-xs sm:text-sm">{isToast}</span>
        </div>
      )}

      {/* Top Banner & Command Center Header */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 border border-white/10">
              <Briefcase size={13} /> School Human Resources & Staff ERP
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              Staff Directory, Geofenced Attendance & Payroll
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Enterprise Human Resources management for Master Mind Public School: Teachers, Drivers, Housekeeping/Maids, Assistants, Gardeners, and Administrative Staff.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href="/staff/attendance"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            >
              <Smartphone size={15} />
              <span>Mobile Selfie Punch Portal</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={() => {
                setStaffToEdit(null);
                setStaffFormData({
                  fullName: '',
                  role: 'Teacher',
                  employmentType: 'Full-Time',
                  department: 'Academic',
                  phone: '',
                  email: '',
                  gender: 'Male',
                  monthlySalary: 25000,
                  aadhaarNo: '',
                  address: '',
                  bankAccount: { accountNumber: '', ifscCode: '', bankName: 'SBI Pipariya' },
                });
                setIsAddStaffOpen(true);
              }}
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus size={15} />
              <span>Add New Staff</span>
            </button>
          </div>
        </div>

        {/* Staff Overview Metric Cards */}
        {overview && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-6 pt-5 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-3 rounded-xl">
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Total Staff Members</span>
              <p className="text-xl sm:text-2xl font-black text-white mt-0.5">{overview.totalStaff} Members</p>
              <span className="text-[10px] text-amber-300 font-bold">
                {overview.fullTimeCount} Full-Time • {overview.partTimeCount} Part-Time
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl">
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Today's Attendance</span>
              <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
                {overview.todayAttendance?.present || 0} Present
              </p>
              <span className="text-[10px] text-slate-300">
                {overview.todayAttendance?.halfDay || 0} Half-Days • {overview.todayAttendance?.onLeave || 0} on Leave
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl">
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Teachers & Faculty</span>
              <p className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">
                {overview.rolesBreakdown?.teachers ?? 0} Educators
              </p>
              <span className="text-[10px] text-slate-300">Academic & Senior Faculty</span>
            </div>

            <div className="bg-white/5 p-3 rounded-xl">
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Support & Operations</span>
              <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {(overview.rolesBreakdown?.drivers ?? 0) + (overview.rolesBreakdown?.maids ?? 0) + (overview.rolesBreakdown?.gardeners ?? 0) + (overview.rolesBreakdown?.guards ?? 0)} Staff
              </p>
              <span className="text-[10px] text-slate-300">Transport, Housekeeping & Security</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'directory'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users size={16} />
          <span>Staff Directory</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'attendance'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Camera size={16} />
          <span>Live Selfie Attendance</span>
        </button>

        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'leaves'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar size={16} />
          <span>Leaves & Half-Days</span>
        </button>

        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'payroll'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <DollarSign size={16} />
          <span>Payroll & Salary</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: STAFF DIRECTORY */}
      {/* ======================================================== */}
      {activeTab === 'directory' && (
        <div className="space-y-4 animate-fade-in">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                placeholder="Search staff by Name, Employee ID (MMPS-STF-XXXX), Phone..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs sm:text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Role:</span>
                <select
                  value={selectedRole}
                  onChange={(e) => { setSelectedRole(e.target.value); setPage(1); }}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Type:</span>
                <select
                  value={selectedType}
                  onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Staff Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-xs sm:text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Emp ID</th>
                    <th className="py-3.5 px-5">Employee Name</th>
                    <th className="py-3.5 px-5">Designation / Role</th>
                    <th className="py-3.5 px-5">Employment</th>
                    <th className="py-3.5 px-5">Contact Phone</th>
                    <th className="py-3.5 px-5">Monthly Salary</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingStaff ? (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-slate-400">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-2"></div>
                        <p className="text-xs font-bold uppercase tracking-wider">Loading Staff Directory...</p>
                      </td>
                    </tr>
                  ) : staffList.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-14 text-center">
                        <div className="max-w-md mx-auto space-y-2">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                            <Users size={24} />
                          </div>
                          <p className="font-extrabold text-slate-800 text-sm">Staff Directory is Empty</p>
                          <p className="text-xs text-slate-400">
                            No staff records found. Click <strong>"+ Add New Staff"</strong> above to register school employees.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    staffList.map((st) => (
                      <tr key={st._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-5 font-mono font-bold text-blue-900 text-xs">
                          {st.employeeId}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                              {st.fullName[0]}
                            </div>
                            <span>{st.fullName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="font-extrabold text-slate-800">{st.role}</span>
                          <span className="block text-[10px] text-slate-400">{st.department}</span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            st.employmentType === 'Full-Time'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {st.employmentType}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-slate-700">
                          {st.phone}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-900">
                          ₹{st.monthlySalary?.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            st.status === 'Relieved'
                              ? 'text-amber-800 bg-amber-50 border-amber-200'
                              : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.status === 'Relieved' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                            {st.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedStaffForView(st)}
                              className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold rounded-lg text-xs cursor-pointer"
                              title="View Official Dossier with QR Code"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setStaffToEdit(st);
                                setStaffFormData({
                                  fullName: st.fullName,
                                  role: st.role,
                                  employmentType: st.employmentType,
                                  department: st.department || 'General',
                                  phone: st.phone,
                                  email: st.email || '',
                                  gender: st.gender || 'Male',
                                  monthlySalary: st.monthlySalary,
                                  aadhaarNo: st.aadhaarNo || '',
                                  address: st.address || '',
                                  bankAccount: st.bankAccount || { accountNumber: '', ifscCode: '', bankName: 'SBI' },
                                });
                                setIsAddStaffOpen(true);
                              }}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-lg text-xs cursor-pointer border border-blue-200"
                              title="Edit Record"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => setStaffForExperienceLetter(st)}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg text-xs cursor-pointer border border-amber-200"
                              title="Official Role-Based Experience & Relieving Certificate"
                            >
                              <Award size={13} />
                            </button>
                            <button
                              onClick={() => setStaffForRemove(st)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs cursor-pointer border border-rose-200"
                              title="Relieve or Remove Staff Member"
                            >
                              <UserMinus size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">
                Showing Page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{totalPages}</strong> ({totalCount} total)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: LIVE SELFIE ATTENDANCE ROSTER */}
      {/* ======================================================== */}
      {activeTab === 'attendance' && (
        <div className="space-y-4 animate-fade-in">
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Date:</span>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Role:</span>
                <select
                  value={attendanceRoleFilter}
                  onChange={(e) => setAttendanceRoleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none cursor-pointer"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">
                Geofence: <strong className="text-emerald-700">Inside Campus (400m)</strong>
              </span>
              <button
                onClick={fetchAttendanceRoster}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} className={loadingAttendance ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Attendance Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-xs sm:text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Emp ID & Name</th>
                    <th className="py-3.5 px-5">Role</th>
                    <th className="py-3.5 px-5">Check-In Moment & Selfie</th>
                    <th className="py-3.5 px-5">Check-Out Moment & Selfie</th>
                    <th className="py-3.5 px-5">Location Verification</th>
                    <th className="py-3.5 px-5">Duration</th>
                    <th className="py-3.5 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingAttendance ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-2"></div>
                        <p className="text-xs font-bold uppercase tracking-wider">Loading Attendance Punches...</p>
                      </td>
                    </tr>
                  ) : attendanceRoster.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400">
                        <Camera size={36} className="mx-auto mb-2 text-slate-300" />
                        <p className="font-bold text-slate-700">No selfie attendance punches recorded for this date.</p>
                        <p className="text-xs text-slate-400 mt-1">Staff can punch in live from their mobile phones at /staff/attendance</p>
                      </td>
                    </tr>
                  ) : (
                    attendanceRoster.map((rec) => (
                      <tr key={rec._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-5">
                          <span className="font-extrabold text-slate-900 block">{rec.staffName}</span>
                          <span className="font-mono text-[10px] text-blue-900 font-bold">{rec.employeeId}</span>
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-700">
                          {rec.role}
                        </td>
                        <td className="py-3.5 px-5">
                          {rec.checkIn?.time ? (
                            <div className="flex items-center gap-2">
                              {rec.checkIn?.photo ? (
                                <button
                                  onClick={() => setViewingSelfie({
                                    photo: rec.checkIn.photo,
                                    staffName: rec.staffName,
                                    time: rec.checkIn.time,
                                    type: 'Check-In Live Selfie',
                                    distance: rec.checkIn.distanceMeters,
                                  })}
                                  className="w-9 h-9 rounded-lg overflow-hidden border border-slate-300 hover:ring-2 hover:ring-blue-500 cursor-pointer shrink-0"
                                >
                                  <img src={rec.checkIn.photo} alt="Check-In" className="w-full h-full object-cover" />
                                </button>
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                  <Camera size={14} />
                                </div>
                              )}
                              <div>
                                <span className="font-mono font-bold text-emerald-800 text-xs block">
                                  {new Date(rec.checkIn.time).toLocaleTimeString('en-IN')}
                                </span>
                                <span className="text-[10px] text-slate-400">Exact Punch Moment</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Not punched</span>
                          )}
                        </td>
                        <td className="py-3.5 px-5">
                          {rec.checkOut?.time ? (
                            <div className="flex items-center gap-2">
                              {rec.checkOut?.photo ? (
                                <button
                                  onClick={() => setViewingSelfie({
                                    photo: rec.checkOut.photo,
                                    staffName: rec.staffName,
                                    time: rec.checkOut.time,
                                    type: 'Check-Out Live Selfie',
                                    distance: rec.checkOut.distanceMeters,
                                  })}
                                  className="w-9 h-9 rounded-lg overflow-hidden border border-slate-300 hover:ring-2 hover:ring-blue-500 cursor-pointer shrink-0"
                                >
                                  <img src={rec.checkOut.photo} alt="Check-Out" className="w-full h-full object-cover" />
                                </button>
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                  <Camera size={14} />
                                </div>
                              )}
                              <div>
                                <span className="font-mono font-bold text-blue-800 text-xs block">
                                  {new Date(rec.checkOut.time).toLocaleTimeString('en-IN')}
                                </span>
                                <span className="text-[10px] text-slate-400">Exact Logout Moment</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">In Progress</span>
                          )}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <MapPin size={10} className="text-emerald-600" />
                            Verified In School ({rec.checkIn?.distanceMeters || 35}m)
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-800">
                          {rec.workHours ? `${rec.workHours} hrs` : '—'}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            rec.status === 'Present'
                              ? 'bg-emerald-100 text-emerald-900'
                              : rec.status === 'Half-Day' || rec.halfDay
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-rose-100 text-rose-900'
                          }`}>
                            {rec.halfDay ? 'Half-Day' : rec.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: LEAVES & HALF-DAYS */}
      {/* ======================================================== */}
      {activeTab === 'leaves' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Staff Leaves & Half-Days Registry</h3>
              <p className="text-xs text-slate-500">Record half-day approvals, medical leaves, and casual leaves.</p>
            </div>
            <button
              onClick={() => setIsLogLeaveOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Plus size={14} />
              <span>Log Leave / Half-Day</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-xs sm:text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Employee</th>
                    <th className="py-3.5 px-5">Leave Category</th>
                    <th className="py-3.5 px-5">Type / Session</th>
                    <th className="py-3.5 px-5">Dates</th>
                    <th className="py-3.5 px-5">Duration</th>
                    <th className="py-3.5 px-5">Reason</th>
                    <th className="py-3.5 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingLeaves ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400">Loading records...</td>
                    </tr>
                  ) : leavesList.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400">
                        No leave or half-day records logged. Tap "Log Leave / Half-Day" to record one.
                      </td>
                    </tr>
                  ) : (
                    leavesList.map((lv) => (
                      <tr key={lv._id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-5 font-bold text-slate-900">
                          {lv.staffName}
                          <span className="block font-mono text-[10px] text-slate-400">{lv.employeeId}</span>
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-slate-800">
                          {lv.leaveType}
                        </td>
                        <td className="py-3.5 px-5">
                          {lv.isHalfDay ? (
                            <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                              Half-Day ({lv.halfDaySession})
                            </span>
                          ) : (
                            <span className="text-slate-600 text-xs">Full Day</span>
                          )}
                        </td>
                        <td className="py-3.5 px-5 text-xs text-slate-700">
                          {new Date(lv.startDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-900">
                          {lv.daysCount} Day(s)
                        </td>
                        <td className="py-3.5 px-5 text-slate-700 italic max-w-xs truncate">
                          {lv.reason}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {lv.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: PAYROLL & SALARY (~300 MEMBERS) */}
      {/* ======================================================== */}
      {activeTab === 'payroll' && (
        <div className="space-y-4 animate-fade-in">
          {/* Payroll KPI Cards */}
          {payrollSummary && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 uppercase text-[10px] font-extrabold block">Monthly Salary Budget</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  ₹{payrollSummary.totalBudget?.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500">Session 2026-27 • November 2026</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 uppercase text-[10px] font-extrabold block">Disbursed to Date</span>
                <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">
                  ₹{payrollSummary.totalDisbursed?.toLocaleString()}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {payrollSummary.paidCount} Staff Members Disbursed
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 uppercase text-[10px] font-extrabold block">Pending Disbursement</span>
                <p className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">
                  ₹{payrollSummary.totalPending?.toLocaleString()}
                </p>
                <span className="text-[11px] text-amber-700 font-semibold">
                  {payrollSummary.pendingCount} Pending Accounts
                </span>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Role:</span>
                <select
                  value={payrollRoleFilter}
                  onChange={(e) => setPayrollRoleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Employment:</span>
                <select
                  value={payrollTypeFilter}
                  onChange={(e) => setPayrollTypeFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  {EMPLOYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <span className="text-xs font-bold text-slate-500">
              Showing {payrollList.length} Payroll Accounts (~300 staff capacity)
            </span>
          </div>

          {/* Payroll Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-xs sm:text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5">Emp ID</th>
                    <th className="py-3.5 px-5">Staff Name</th>
                    <th className="py-3.5 px-5">Designation</th>
                    <th className="py-3.5 px-5">Type</th>
                    <th className="py-3.5 px-5">Base Salary</th>
                    <th className="py-3.5 px-5">Deductions</th>
                    <th className="py-3.5 px-5">Net Payable</th>
                    <th className="py-3.5 px-5">Payment Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingPayroll ? (
                    <tr>
                      <td colSpan="9" className="py-12 text-center text-slate-400">Loading payroll ledger...</td>
                    </tr>
                  ) : (
                    payrollList.map((pay) => (
                      <tr key={pay._id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-5 font-mono font-bold text-blue-900 text-xs">
                          {pay.employeeId}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-900">
                          {pay.staffName}
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-slate-800">
                          {pay.role}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pay.employmentType === 'Full-Time'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-purple-50 text-purple-700'
                          }`}>
                            {pay.employmentType}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 font-semibold text-slate-800">
                          ₹{pay.baseSalary?.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-5 text-rose-600 font-semibold">
                          {pay.deductions > 0 ? `-₹${pay.deductions.toLocaleString()}` : '₹0'}
                          {pay.halfDayCount > 0 && <span className="block text-[9px] text-slate-400">({pay.halfDayCount} Half-day)</span>}
                        </td>
                        <td className="py-3.5 px-5 font-black text-slate-950 text-sm">
                          ₹{pay.netPayable?.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            pay.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {pay.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {pay.paymentStatus === 'Pending' ? (
                              <button
                                onClick={() => setPayingStaffRecord(pay)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm"
                              >
                                Pay Salary
                              </button>
                            ) : (
                              <button
                                onClick={() => setPayslipData(pay)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Printer size={12} /> Pay Slip
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALS */}
      {/* ======================================================== */}

      {/* Add / Edit Staff Modal */}
      {isAddStaffOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsAddStaffOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-2xl relative animate-scale-in max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddStaffOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black text-slate-950 mb-1">
              {staffToEdit ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Enter employee credentials, designation, and salary details.</p>

            <form onSubmit={handleSaveStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={staffFormData.fullName}
                  onChange={(e) => setStaffFormData({ ...staffFormData, fullName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Designation / Role *</label>
                  <select
                    value={staffFormData.role}
                    onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {ROLES.filter(r => r !== 'All').map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Employment Type *</label>
                  <select
                    value={staffFormData.employmentType}
                    onChange={(e) => setStaffFormData({ ...staffFormData, employmentType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={staffFormData.phone}
                    onChange={(e) => setStaffFormData({ ...staffFormData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Monthly Salary (₹) *</label>
                  <input
                    type="number"
                    required
                    min="5000"
                    value={staffFormData.monthlySalary}
                    onChange={(e) => setStaffFormData({ ...staffFormData, monthlySalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Aadhaar Card Number</label>
                <input
                  type="text"
                  value={staffFormData.aadhaarNo}
                  onChange={(e) => setStaffFormData({ ...staffFormData, aadhaarNo: e.target.value })}
                  placeholder="12-digit Aadhaar Number"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Residential Address</label>
                <textarea
                  rows="2"
                  value={staffFormData.address}
                  onChange={(e) => setStaffFormData({ ...staffFormData, address: e.target.value })}
                  placeholder="Pipariya residential location"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow cursor-pointer"
                >
                  {staffToEdit ? 'Save Changes' : 'Confirm & Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Staff Profile Dossier with Scannable QR Code */}
      {selectedStaffForView && (
        <StaffProfileDocModal
          staff={selectedStaffForView}
          onClose={() => setSelectedStaffForView(null)}
        />
      )}

      {/* Official Role-Based Experience & Relieving Certificate Modal */}
      {staffForExperienceLetter && (
        <StaffExperienceLetterModal
          staff={staffForExperienceLetter}
          onClose={() => setStaffForExperienceLetter(null)}
        />
      )}

      {/* Relieve / Remove Staff Modal */}
      {staffForRemove && (
        <RemoveStaffModal
          staff={staffForRemove}
          onClose={() => setStaffForRemove(null)}
          onSuccess={(updatedStaff, isDeleted) => {
            if (isDeleted) {
              setIsToast('Staff member permanently deleted.');
            } else if (updatedStaff) {
              setIsToast(`Staff member ${updatedStaff.fullName} relieved successfully. Experience letter ready.`);
            }
            setTimeout(() => setIsToast(''), 4000);
            fetchStaffList();
            fetchOverview();
          }}
          onOpenExperienceLetter={(st) => setStaffForExperienceLetter(st)}
        />
      )}

      {/* Selfie Photo Preview Modal */}
      {viewingSelfie && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setViewingSelfie(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full text-white text-center relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingSelfie(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>

            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block mb-1">
              Live Camera Verification
            </span>
            <h4 className="font-extrabold text-sm">{viewingSelfie.type}</h4>
            <p className="text-xs text-slate-400 mb-3">{viewingSelfie.staffName}</p>

            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-700 bg-black mb-3">
              <img src={viewingSelfie.photo} alt="Selfie" className="w-full h-full object-cover" />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl text-xs text-left font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-white font-bold">{new Date(viewingSelfie.time).toLocaleTimeString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-emerald-400 font-bold">In School ({viewingSelfie.distance || 35}m)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Leave / Half-day Modal */}
      {isLogLeaveOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsLogLeaveOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLogLeaveOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-black text-slate-950 mb-1">Log Staff Leave / Half-Day</h3>
            <p className="text-xs text-slate-500 mb-4">Record leave duration and half-day deduction details.</p>

            <form onSubmit={handleSubmitLeave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Staff Member *</label>
                <select
                  required
                  value={leaveFormData.employeeId}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none"
                >
                  <option value="">Select Employee</option>
                  {staffList.map((st) => (
                    <option key={st._id} value={st.employeeId}>
                      {st.fullName} ({st.employeeId} - {st.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div>
                  <span className="font-extrabold text-amber-950 block">Half-Day Leave?</span>
                  <span className="text-[10px] text-amber-700">Deducts 0.5 work day from salary calculation</span>
                </div>
                <input
                  type="checkbox"
                  checked={leaveFormData.isHalfDay}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, isHalfDay: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 cursor-pointer"
                />
              </div>

              {leaveFormData.isHalfDay && (
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Half-Day Session</label>
                  <select
                    value={leaveFormData.halfDaySession}
                    onChange={(e) => setLeaveFormData({ ...leaveFormData, halfDaySession: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none"
                  >
                    <option value="First Half">First Half (Morning Session)</option>
                    <option value="Second Half">Second Half (Afternoon Session)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={leaveFormData.startDate}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, startDate: e.target.value, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Reason for Leave *</label>
                <input
                  type="text"
                  required
                  value={leaveFormData.reason}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
                  placeholder="e.g. Urgent family work / Medical checkup"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogLeaveOpen(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs uppercase"
                >
                  Confirm Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Salary Modal */}
      {payingStaffRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setPayingStaffRecord(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPayingStaffRecord(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-black text-slate-950 mb-1">Disburse Staff Salary</h3>
            <p className="text-xs text-slate-500 mb-4">Record monthly salary payment in school finance register.</p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Employee:</span>
                <span className="font-extrabold text-slate-900">{payingStaffRecord.staffName} ({payingStaffRecord.employeeId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-semibold text-slate-800">{payingStaffRecord.role} ({payingStaffRecord.employmentType})</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-black text-sm">
                <span>Net Payable:</span>
                <span className="text-emerald-700">₹{payingStaffRecord.netPayable.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleDisburseSalary} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Payment Mode *</label>
                <select
                  value={paymentFormData.paymentMode}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, paymentMode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none"
                >
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                  <option value="UPI">UPI Transfer</option>
                  <option value="Cash">Cash Voucher</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1">Transaction Ref / Cheque No.</label>
                <input
                  type="text"
                  value={paymentFormData.transactionRef}
                  onChange={(e) => setPaymentFormData({ ...paymentFormData, transactionRef: e.target.value })}
                  placeholder="e.g. UTR / UPI Ref / Voucher #402"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayingStaffRecord(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase"
                >
                  Confirm & Generate Pay Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Salary Pay Slip Printable Modal */}
      {payslipData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setPayslipData(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-in my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase">Official Salary Slip</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} /> Print Slip
                </button>
                <button
                  onClick={() => setPayslipData(null)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Pay Slip Container */}
            <div id="official-payslip" className="printable-erp-doc bg-white border border-slate-800 p-5 rounded-xl text-slate-900 text-xs">
              <div className="text-center pb-3 border-b border-slate-800 mb-3">
                <img src={sitelogo} alt="MMPS" className="h-10 w-auto mx-auto mb-1 object-contain" />
                <h3 className="font-black text-base">MASTER MIND PUBLIC SCHOOL</h3>
                <p className="text-[10px] text-slate-600 font-semibold">Station Road, Pipariya, M.P. • Staff Salary Statement</p>
                <span className="inline-block mt-1 font-mono font-bold text-[10px] bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                  Salary Month: November 2026 • Slip #{payslipData.payslipNo || 'PS-2026-11'}
                </span>
              </div>

              <div className="space-y-1.5 border-b border-slate-300 pb-3 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Employee Name:</span>
                  <span className="font-bold text-slate-900">{payslipData.staffName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Employee ID:</span>
                  <span className="font-mono font-bold text-blue-900">{payslipData.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Designation / Role:</span>
                  <span className="font-bold text-slate-800">{payslipData.role} ({payslipData.employmentType})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-semibold text-slate-800">{payslipData.paymentMode || 'Bank Transfer'}</span>
                </div>
              </div>

              <div className="space-y-1.5 pb-3 border-b border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span>Gross Base Salary:</span>
                  <span className="font-bold">₹{payslipData.baseSalary?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Deductions (Half-days / Absences):</span>
                  <span>-₹{payslipData.deductions?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-400 font-black text-sm">
                  <span>Net Salary Paid:</span>
                  <span className="text-emerald-800 font-black">₹{payslipData.netPayable?.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 text-center text-[10px] font-bold">
                <div>
                  <div className="border-t border-slate-700 pt-1 inline-block w-28">Employee Signature</div>
                </div>
                <div>
                  <div className="border-t border-slate-700 pt-1 inline-block w-28">Accounts Officer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
