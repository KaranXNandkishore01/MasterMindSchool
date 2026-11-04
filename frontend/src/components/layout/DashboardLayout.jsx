import { useState } from 'react';
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
  GraduationCap,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { logout, reset } from '../../features/auth/authSlice';

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Automatically reset mobile drawer when route changes
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsMobileMenuOpen(false);
  }

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

  // Active page title helper for mobile header
  const getPageTitle = () => {
    const allLinks = [...erpNavLinks, ...portalNavLinks];
    const current = allLinks.find((l) => l.path === location.pathname);
    return current ? current.name : 'Management Portal';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop Permanent + Mobile Slide-Over Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-950 text-white flex flex-col shadow-2xl border-r border-white/10 transition-transform duration-300 ease-in-out lg:static lg:w-64 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 lg:h-20 flex items-center justify-between px-5 lg:px-6 border-b border-white/10 shrink-0">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group"
          >
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

          {/* Close Button on Mobile Drawer */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 border border-white/10 cursor-pointer"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 overscroll-contain">
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      active
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {link.icon}
                      <span>{link.name}</span>
                    </div>
                    {active && <ChevronRight size={14} className="opacity-70" />}
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      active
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {link.icon}
                      <span>{link.name}</span>
                    </div>
                    {active && <ChevronRight size={14} className="opacity-70" />}
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
            <div className="overflow-hidden text-xs flex-1">
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
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 min-w-0">
        {/* Mobile Top Navigation Bar (Header) */}
        <header className="lg:hidden bg-slate-950 text-white border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 -ml-1 text-slate-300 hover:text-white rounded-xl bg-white/5 border border-white/10 active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-sm">
                M
              </div>
              <div>
                <span className="font-extrabold text-xs text-white block leading-tight tracking-tight">
                  {getPageTitle()}
                </span>
                <span className="text-[9px] text-amber-400 uppercase tracking-widest font-bold block">
                  {user?.role || 'Management'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-300 hover:text-rose-200 bg-rose-500/15 hover:bg-rose-500/25 rounded-lg border border-rose-500/30 transition-all cursor-pointer font-bold"
              title="Logout"
            >
              <LogOut size={13} />
              <span className="hidden xs:inline">Exit</span>
            </button>
          </div>
        </header>

        {/* Dynamic Outlet Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 lg:p-8 overscroll-contain">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
