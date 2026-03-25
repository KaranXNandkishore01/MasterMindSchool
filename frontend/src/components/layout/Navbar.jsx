import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import sitelogo from '../../assets/sitelogo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-900 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src={sitelogo} alt="MMPS Logo" className="h-10 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-wider">MMPS PIPARIYA</span>
                <span className="text-xs text-blue-200 uppercase tracking-widest hidden sm:block">Shaping the Future</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium uppercase tracking-wider transition-colors duration-300 hover:text-yellow-400 p-2 
                  ${isActive(link.path) ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-200'}`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-bold transition-all transform hover:scale-105 shadow-md"
            >
              Portal Login
            </Link>
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
        <div className="md:hidden bg-blue-800 border-t border-blue-700">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                  isActive(link.path) ? 'bg-blue-900 text-yellow-400' : 'text-white hover:bg-blue-700 hover:text-yellow-200'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="block w-full text-center mt-4 bg-yellow-500 text-blue-900 px-3 py-3 rounded-md font-bold shadow-md"
              onClick={() => setIsOpen(false)}
            >
              Portal Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
