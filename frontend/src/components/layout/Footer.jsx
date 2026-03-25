import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import sitelogo from '../../assets/sitelogo.png';
import facebook from '../../assets/facebook.png';
import instagram from '../../assets/instagram.png';
import linkedin from '../../assets/linkedin.png';
import whatsapp from '../../assets/whatsapp.png';
import youtube from '../../assets/youtube.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={sitelogo} alt="MMPS Logo" className="h-10 w-auto object-contain" />
              <span className="font-bold text-xl text-white tracking-wider">MMPS</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Master Mind Public Higher Secondary School, Pipariya. Dedicated to academic excellence and holistic development since our inception.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:opacity-80 transition-opacity" title="Facebook">
                <img src={facebook} alt="Facebook" className="h-6 w-6 object-contain" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity" title="Instagram">
                <img src={instagram} alt="Instagram" className="h-6 w-6 object-contain" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity" title="YouTube">
                <img src={youtube} alt="YouTube" className="h-6 w-6 object-contain" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity" title="LinkedIn">
                <img src={linkedin} alt="LinkedIn" className="h-6 w-6 object-contain" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity" title="WhatsApp">
                <img src={whatsapp} alt="WhatsApp" className="h-6 w-6 object-contain" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-yellow-400 transition-colors">About Us</Link></li>
              <li><Link to="/admissions" className="hover:text-yellow-400 transition-colors">Admissions</Link></li>
              <li><Link to="/facilities" className="hover:text-yellow-400 transition-colors">Facilities</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/login" className="hover:text-yellow-400 transition-colors">Student Portal</Link></li>
              <li><Link to="/login" className="hover:text-yellow-400 transition-colors">Parent Portal</Link></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Notice Board</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Academic Calendar</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                <span className="text-sm">Main Road, Pipariya,<br/>Madhya Pradesh 461775</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-yellow-400 shrink-0" />
                <span className="text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-yellow-400 shrink-0" />
                <span className="text-sm">info@mmpspipariya.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Master Mind Public Higher Secondary School. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
