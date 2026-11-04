import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  Bell,
  Mail,
  ArrowUpRight,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { subscribeToUpdates } from '../../utils/realtimeSync';

const ManagementDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    attendanceRate: 100,
    todayPresent: 0,
    todayAbsent: 0,
    totalExpectedFee: 0,
    totalCollectedFee: 0,
    totalOutstandingFee: 0,
    classDistribution: [],
    recentAdmissions: [],
  });

  useEffect(() => {
    let isMounted = true;

    axios.get('/api/erp/overview', { withCredentials: true })
      .then((res) => {
        if (isMounted && res.data?.success && res.data?.data) {
          setStats((prev) => ({ ...prev, ...res.data.data }));
        }
      })
      .catch(() => {});

    const unsub = subscribeToUpdates('all', () => {
      axios.get('/api/erp/overview', { withCredentials: true })
        .then((res) => {
          if (isMounted && res.data?.success && res.data?.data) {
            setStats((prev) => ({ ...prev, ...res.data.data }));
          }
        })
        .catch(() => {});
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 border border-white/10">
              <Sparkles size={13} /> Master Mind ERP Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              School Administration Portal
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm lg:text-base mt-2 max-w-2xl leading-relaxed">
              Centralized Enterprise Operations for Student Information (SIS), Daily Attendance Engine, and Multi-Term Finance Management.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <Link
              to="/management/students"
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-extrabold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-amber-500/20 text-xs uppercase tracking-wider text-center"
            >
              + Admit Student
            </Link>
            <Link
              to="/management/attendance"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/15 font-extrabold px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all text-xs uppercase tracking-wider text-center"
            >
              Take Attendance
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Core Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Total Students */}
        <div className="bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={22} />
            </div>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-blue-700 bg-blue-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider">
              Session 26-27
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled Students</span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats.totalStudents?.toLocaleString()}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 sm:mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">100% Capacity</span> • 45 Sections
          </p>
        </div>

        {/* Daily Attendance Rate */}
        <div className="bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar size={22} />
            </div>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider">
              Today
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Attendance</span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats.attendanceRate}%
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 sm:mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">{stats.todayPresent} Present</span> • {stats.todayAbsent} Absent
          </p>
        </div>

        {/* Total Fee Revenue */}
        <div className="bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign size={22} />
            </div>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider">
              Collections
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Fee Realization</span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            ₹ {(stats.totalCollectedFee / 10000000).toFixed(2)} Cr
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 sm:mt-2 flex items-center gap-1">
            <span className="text-amber-600 font-bold">73.8%</span> of ₹ 5.20 Cr Expected
          </p>
        </div>

        {/* Teaching Faculty & Staff */}
        <div className="bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GraduationCap size={22} />
            </div>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider">
              Faculty
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Active Staff</span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            64
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 sm:mt-2 flex items-center gap-1">
            <span className="text-indigo-600 font-bold">1:31</span> Student-Teacher Ratio
          </p>
        </div>
      </div>

      {/* ERP Quick Navigation Bento Grid */}
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-3.5 sm:mb-4 tracking-tight flex items-center gap-2">
          <span>ERP Operational Modules</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {/* Module 1: Student Information System */}
          <Link
            to="/management/students"
            className="group bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users size={20} />
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Student Information (SIS)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Admit students, filter by Class & Section, search by scholar number, and view guardian demographics.
            </p>
          </Link>

          {/* Module 2: Attendance Engine */}
          <Link
            to="/management/attendance"
            className="group bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:border-emerald-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Calendar size={20} />
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Daily Attendance Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Take section-wise attendance with 1-click absent toggle, date selector, and automated statistics.
            </p>
          </Link>

          {/* Module 3: Fee Management */}
          <Link
            to="/management/fees"
            className="group bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:border-amber-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <DollarSign size={20} />
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Fee & Payment Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Record term collections, track dues by class, and issue instant official printable payment receipts.
            </p>
          </Link>

          {/* Module 4: Announcements */}
          <Link
            to="/management/announcements"
            className="group bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:border-indigo-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Bell size={20} />
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Live Notice Board</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Publish circulars, holiday notices, and examination schedules directly to the public home ticker.
            </p>
          </Link>

          {/* Module 5: Gallery Management */}
          <Link
            to="/management/images"
            className="group bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:border-pink-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <BookOpen size={20} />
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-pink-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Campus Media Gallery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload and manage photos across Achievement, Event, and Leadership categories.
            </p>
          </Link>

          {/* Module 6: Inquiries & Messages */}
          <Link
            to="/management/messages"
            className="group bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:border-teal-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Mail size={20} />
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">Parent Helpdesk</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Review and resolve contact inquiries submitted through the online public portal.
            </p>
          </Link>
        </div>
      </div>

      {/* Bottom Section: Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Class Distribution Breakdown */}
        <div className="bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Student Strength Distribution (2,000 Capacity)
            </h3>
            <span className="text-[11px] sm:text-xs text-slate-400 font-semibold">15 Classes</span>
          </div>

          <div className="space-y-3.5 sm:space-y-4">
            {stats.classDistribution?.map((item) => {
              const maxClassCapacity = 700;
              const pct = Math.round((item.count / maxClassCapacity) * 100);
              return (
                <div key={item._id} className="space-y-1 sm:space-y-1.5">
                  <div className="flex justify-between text-[11px] sm:text-xs font-bold text-slate-700">
                    <span>{item._id}</span>
                    <span>{item.count} Students ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-900 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Admissions Widget */}
        <div className="bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              Recent Admissions
            </h3>
            <Link to="/management/students" className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {stats.recentAdmissions?.map((ad) => (
              <div key={ad.scholarNo} className="py-2.5 sm:py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{ad.firstName} {ad.lastName}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{ad.scholarNo}</p>
                </div>
                <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-[11px]">
                  {ad.class}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
