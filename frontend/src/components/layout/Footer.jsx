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
              Master Mind Public School, Pipariya. Link learning to life.<br/>Dedicated to academic excellence and holistic development since our inception.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/people/MasterMind-PublicSchool/pfbid02LdviifeoE2QCbAUbdBNL1P4BN57MxiXaA7sYKTPn9KAZhWkQswktA4oGWBbj8MRel/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="Facebook">
                <img src={facebook} alt="Facebook" className="h-6 w-6 object-contain" />
              </a>
              <a href="https://www.instagram.com/mastermindschool_pipariya/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="Instagram">
                <img src={instagram} alt="Instagram" className="h-6 w-6 object-contain" />
              </a>
              <a href="https://www.youtube.com/@mastermindschoolpipariyaon7350" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="YouTube">
                <img src={youtube} alt="YouTube" className="h-6 w-6 object-contain" />
              </a>
              <a href="https://www.linkedin.com/in/lochan-sagar-prajapati-bb8880363/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="LinkedIn">
                <img src={linkedin} alt="LinkedIn" className="h-6 w-6 object-contain" />
              </a>
              <a href="https://whatsapp.com/channel/0029VbAXqYxBadmUEehN0A0M" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="WhatsApp Channel">
                <img src={whatsapp} alt="WhatsApp" className="h-6 w-6 object-contain" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-yellow-400 transition-colors">About Us</Link></li>
              <li><Link to="/admissions" className="hover:text-yellow-400 transition-colors">Admissions</Link></li>
              <li><Link to="/careers" className="hover:text-yellow-400 transition-colors">Careers</Link></li>
              <li><Link to="/facilities" className="hover:text-yellow-400 transition-colors">Facilities</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              <li><Link to="/#announcements" className="hover:text-yellow-400 transition-colors">Notice Board</Link></li>

              <li><Link to="/admissions#fees" className="hover:text-yellow-400 transition-colors">Fee Structure</Link></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Academic Calendar</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                <a href="https://maps.app.goo.gl/vUjrrdx9cuBK6nK68" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white hover:underline transition-all">
                  Main Road, Pipariya,<br/>Madhya Pradesh 461775
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-yellow-400 shrink-0" />
                <a href="tel:8269420850" className="text-sm hover:text-yellow-400 transition-colors uppercase tracking-wider font-medium">8269420850</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-yellow-400 shrink-0" />
                <Link to="/contact#contact-form" className="text-sm hover:text-yellow-400 transition-colors uppercase tracking-wider font-medium">info@mmpspipariya.com</Link>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} MMPS Built and Designed by <a href="https://sites.google.com/view/thevisarggalaxy/home" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-white hover:underline transition-colors font-semibold">TheVisargGalaxy</a>. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
