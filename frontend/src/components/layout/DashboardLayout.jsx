import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  Home,
  Users,
  BookOpen,
  Calendar,
  DollarSign,
  Settings,
  Bell,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { logout, reset } from '../../features/auth/authSlice';

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const erpNavLinks = [
    { name: 'Dashboard', path: '/management/dashboard', icon: <Home size={19} /> },
    { name: 'Students (SIS)', path: '/management/students', icon: <Users size={19} /> },
    { name: 'Daily Attendance', path: '/management/attendance', icon: <Calendar size={19} /> },
    { name: 'Fees & Finance', path: '/management/fees', icon: <DollarSign size={19} /> },
    { name: "Teacher's Desk", path: '/teacher/dashboard', icon: <GraduationCap size={19} /> },
  ];

  const portalNavLinks = [
    { name: 'Announcements', path: '/management/announcements', icon: <Bell size={19} /> },
    { name: 'Media Gallery', path: '/management/images', icon: <BookOpen size={19} /> },
    { name: 'Job Openings', path: '/management/jobs', icon: <Briefcase size={19} /> },
    { name: 'Contact Inquiries', path: '/management/messages', icon: <Settings size={19} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col shadow-2xl z-20 border-r border-white/10">
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold shadow-sm">
              M
            </div>
            <div>
              <span className="font-extrabold text-sm text-white block leading-tight tracking-tight">
                MMPS ERP
              </span>
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">
                {user?.role || 'Management'}
              </span>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {/* Section 1: Core ERP Engines */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 block mb-2">
              ERP Engines
            </span>
            <nav className="space-y-1">
              {erpNavLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      active
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section 2: Website & Portal Operations */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 block mb-2">
              Web CMS & Helpdesk
            </span>
            <nav className="space-y-1">
              {portalNavLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      active
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-slate-900/40">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0">
              {user?.managementId?.charAt(0).toUpperCase() || 'M'}
            </div>
            <div className="overflow-hidden text-xs">
              <p className="font-bold text-white truncate">{user?.managementId || 'Admin User'}</p>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 rounded-xl transition-all font-bold text-xs border border-white/10 cursor-pointer"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
        <div className="flex-1 overflow-auto p-6 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
