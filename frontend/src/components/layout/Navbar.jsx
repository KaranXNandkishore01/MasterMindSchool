import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import sitelogo from '../../assets/sitelogo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-900 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src={sitelogo} alt="MMPS Logo" className="h-12 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="font-bold text-lg md:text-xl tracking-wider leading-tight">Master Mind Public School</span>
                <span className="text-[10px] text-blue-200 tracking-[0.2em] hidden sm:block uppercase">Link learning to life.</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:text-yellow-400 p-2 
                  ${isActive(link.path) ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-200'}`}
              >
                {link.name}
              </Link>
            ))}
            
            {user && (
              <div className="flex items-center gap-4 pl-4 border-l border-blue-800">
                <Link
                  to="/management/dashboard"
                  className="bg-blue-800 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all shadow-md group"
                  title="Dashboard"
                >
                  <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl transition-all shadow-md group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            )}
            {/* Login currently paused 
            {!user && (
              <Link
                to="/login"
                className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-6 py-2.5 rounded-xl font-black text-xs uppercase transition-all transform hover:-translate-y-0.5 shadow-lg tracking-widest"
              >
                Portal Login
              </Link>
            )}
            */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-white focus:outline-none p-2"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-950 border-t border-blue-800 animate-slide-down">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 rounded-2xl text-base font-bold tracking-wide transition-all ${
                  isActive(link.path) ? 'bg-blue-900 text-yellow-400 shadow-inner' : 'text-gray-300 hover:bg-blue-900 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-blue-800">
              {user && (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/management/dashboard"
                    className="flex items-center justify-center gap-2 bg-blue-800 text-white py-4 rounded-2xl font-bold shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard size={20} /> Dashboard
                  </Link>
                  <button
                    onClick={onLogout}
                    className="flex items-center justify-center gap-2 bg-red-500 text-white py-4 rounded-2xl font-bold shadow-lg"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              )}
              {/* Login currently paused
              {!user && (
                <Link
                  to="/login"
                  className="block w-full text-center bg-yellow-500 text-blue-900 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl"
                  onClick={() => setIsOpen(false)}
                >
                  Portal Login
                </Link>
              )}
              */}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
