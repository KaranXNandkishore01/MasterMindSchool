import { useSelector, useDispatch } from 'react-redux';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, Users, BookOpen, Calendar, DollarSign, Settings, Bell } from 'lucide-react';
import { logout, reset } from '../../features/auth/authSlice';

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  const getNavLinks = () => {
    switch(user?.role) {
      case 'Admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <Home size={20} /> },
          { name: 'Students', path: '/admin/students', icon: <Users size={20} /> },
          { name: 'Staff', path: '/admin/staff', icon: <BookOpen size={20} /> },
          { name: 'Fees', path: '/admin/fees', icon: <DollarSign size={20} /> },
          { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
        ];
      case 'Teacher':
        return [
          { name: 'Dashboard', path: '/teacher/dashboard', icon: <Home size={20} /> },
          { name: 'My Classes', path: '/teacher/classes', icon: <BookOpen size={20} /> },
          { name: 'Attendance', path: '/teacher/attendance', icon: <Calendar size={20} /> },
        ];
      case 'Student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: <Home size={20} /> },
          { name: 'My Attendance', path: '/student/attendance', icon: <Calendar size={20} /> },
          { name: 'Study Material', path: '/student/material', icon: <BookOpen size={20} /> },
        ];
      case 'Parent':
        return [
          { name: 'Dashboard', path: '/parent/dashboard', icon: <Home size={20} /> },
          { name: 'Fees & Payments', path: '/parent/fees', icon: <DollarSign size={20} /> },
          { name: 'Communication', path: '/parent/messages', icon: <Bell size={20} /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col shadow-xl z-20">
        <div className="h-20 flex items-center justify-center border-b border-blue-800 shrink-0">
          <Link to="/" className="text-xl font-bold tracking-wider hover:text-yellow-400 transition-colors">
            {user?.role} Portal
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-2 px-4">
            {getNavLinks().map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-blue-800 hover:text-white rounded-xl transition-colors"
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-blue-800 shrink-0">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-blue-900 font-bold shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden text-sm">
              <p className="truncate font-semibold text-gray-200">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-800 hover:bg-red-500 text-white rounded-xl transition-colors font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)]">
        <div className="flex-1 overflow-auto p-8 lg:p-12 bg-gray-50 border-l border-gray-200">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
