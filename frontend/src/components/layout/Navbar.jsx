import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, ArrowRight } from 'lucide-react';
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
    <nav className="bg-slate-950/85 backdrop-blur-xl border-b border-white/10 text-white sticky top-0 z-50 transition-all duration-300 shadow-xl shadow-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
                <img src={sitelogo} alt="MMPS Logo" className="relative h-12 w-auto object-contain drop-shadow" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base sm:text-lg md:text-xl tracking-tight leading-tight text-white group-hover:text-amber-300 transition-colors">
                  Master Mind Public School
                </span>
                <span className="text-[10px] text-amber-400/90 font-medium tracking-[0.25em] uppercase">
                  Link learning to life
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 
                  ${
                    isActive(link.path)
                      ? 'text-amber-400 bg-white/10 shadow-sm border border-amber-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pl-3 flex items-center gap-3">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-extrabold px-4 py-2 rounded-full text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <span>Enroll Now</span>
                <ArrowRight size={14} />
              </a>

              {user && (
                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  <Link
                    to="/management/dashboard"
                    className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all border border-white/10"
                    title="Dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={onLogout}
                    className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full transition-all border border-red-400/20"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider"
            >
              Enroll
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-200 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 animate-fade-in">
          <div className="px-4 pt-4 pb-6 space-y-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all ${
                  isActive(link.path)
                    ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-white/10">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Enroll Now (Session 2026-27)</span>
                <ArrowRight size={16} />
              </a>

              {user && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Link
                    to="/management/dashboard"
                    className="flex items-center justify-center gap-2 bg-white/10 text-white py-2.5 rounded-xl font-bold border border-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <button
                    onClick={onLogout}
                    className="flex items-center justify-center gap-2 bg-red-500 text-white py-2.5 rounded-xl font-bold"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
