import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import sitelogo from '../../assets/sitelogo.png';
import facebook from '../../assets/facebook.png';
import instagram from '../../assets/instagram.png';
import linkedin from '../../assets/linkedin.png';
import whatsapp from '../../assets/whatsapp.png';
import youtube from '../../assets/youtube.png';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-white/10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-amber-400 rounded-full blur-sm opacity-30 group-hover:opacity-60 transition"></div>
                <img src={sitelogo} alt="MMPS Logo" className="relative h-11 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-tight">Master Mind Public School</span>
                <span className="text-[10px] text-amber-400 font-semibold tracking-widest uppercase">Pipariya (M.P.)</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Link learning to life. Dedicated to academic brilliance, moral character, and lifelong leadership since our inception.
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">Connect With Us</span>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { name: 'Facebook', href: 'https://www.facebook.com/people/MasterMind-PublicSchool/pfbid02LdviifeoE2QCbAUbdBNL1P4BN57MxiXaA7sYKTPn9KAZhWkQswktA4oGWBbj8MRel/', icon: facebook },
                  { name: 'Instagram', href: 'https://www.instagram.com/mastermindschool_pipariya/', icon: instagram },
                  { name: 'YouTube', href: 'https://www.youtube.com/@mastermindschoolpipariyaon7350', icon: youtube },
                  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/lochan-sagar-prajapati-bb8880363/', icon: linkedin },
                  { name: 'WhatsApp', href: 'https://whatsapp.com/channel/0029VbAXqYxBadmUEehN0A0M', icon: whatsapp },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-amber-400/40"
                    title={s.name}
                  >
                    <img src={s.icon} alt={s.name} className="h-4 w-4 object-contain" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Admissions & Process', path: '/admissions' },
                { name: 'Campus Facilities', path: '/facilities' },
                { name: 'Career Opportunities', path: '/careers' },
                { name: 'Contact & Location', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-amber-400 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Student & Parent
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/#announcements" className="text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5">
                  Live Notice Board
                </Link>
              </li>
              <li>
                <Link to="/admissions#fees" className="text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5">
                  Fee Structure 2026-27
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Online Admission Form</span>
                  <ArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <Link to="/contact#contact-form" className="text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5">
                  Parent Helpdesk
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Campus Office
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-amber-400" />
                </div>
                <a
                  href="https://maps.app.goo.gl/vUjrrdx9cuBK6nK68"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors leading-relaxed"
                >
                  Main Road, Pipariya,<br />Madhya Pradesh 461775
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-amber-400" />
                </div>
                <a href="tel:8269420850" className="text-slate-300 hover:text-amber-400 font-medium transition-colors">
                  +91 82694 20850
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-amber-400" />
                </div>
                <Link to="/contact#contact-form" className="text-slate-300 hover:text-amber-400 font-medium transition-colors truncate">
                  mastermindschoolpipariya@gmail.com
                </Link>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Master Mind Public School. Designed & Built by{' '}
            <a
              href="https://sites.google.com/view/thevisarggalaxy/home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-white transition-colors font-medium underline"
            >
              TheVisargGalaxy
            </a>
            . All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
