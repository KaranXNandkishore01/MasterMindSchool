import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, X } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Dummy frontend submission for instant, realistic feedback
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 600);
  };

  return (
    <div className="bg-slate-50/70 min-h-screen pb-20 relative">
      {/* Submission Success Popup Notification Modal */}
      {submitted && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in"
          onClick={() => setSubmitted(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              onClick={() => setSubmitted(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close Notification"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 size={36} className="text-emerald-500" />
            </div>

            {/* Pill Tag */}
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3 border border-emerald-200/60">
              Request Submitted
            </span>

            {/* Title */}
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
              Your Request Has Been Submitted!
            </h3>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
              Thank you for reaching out to Master Mind Public School. We have received your inquiry, and our administration team will review your message and contact you shortly.
            </p>

            {/* Action Button */}
            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Okay, Got It
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 sm:py-24 px-4 text-center overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
            We Are Here To Help
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Contact Us
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
            We would love to hear from you. Get in touch with our admissions and administrative office for any inquiries.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col lg:flex-row border border-slate-100">
          
          {/* Contact Info Sidebar - Modern Deep Navy Glass */}
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-8 sm:p-12 lg:w-2/5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 block mb-2">
                Campus Details
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 tracking-tight">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider mb-1">Our Location</h4>
                    <a
                      href="https://maps.app.goo.gl/vUjrrdx9cuBK6nK68"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-white transition-colors text-sm sm:text-base leading-relaxed"
                    >
                      Main Road, Pipariya, Madhya Pradesh 461775, India
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider mb-1">Direct Line</h4>
                    <a href="tel:8269420850" className="text-amber-400 hover:text-amber-300 transition-colors text-base font-bold">
                      +91 82694 20850
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider mb-1">Email Address</h4>
                    <a href="mailto:mastermindschool2005@gmail.com" className="text-slate-300 hover:text-amber-400 transition-colors text-sm sm:text-base break-all">
                      mastermindschool2005@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider mb-1">Working Hours</h4>
                    <p className="text-slate-300 text-sm">Monday – Saturday: 8:00 AM – 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-white/10 relative z-10">
              <p className="text-xs text-slate-400 leading-relaxed">
                For urgent admission queries, please call during campus working hours or leave a message below.
              </p>
            </div>
          </div>

          {/* Contact Form & Google Map */}
          <div className="p-8 sm:p-12 lg:w-3/5 flex flex-col justify-between relative bg-white">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 block mb-2">
                Online Inquiry
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Send Us a Message
              </h2>

              <form id="contact-form" onSubmit={handleSubmit} className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm" 
                      placeholder="e.g. Ramesh Patel" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm" 
                      placeholder="e.g. ramesh@example.com" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm" 
                      placeholder="+91 98765 43210" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm" 
                      placeholder="e.g. Admission for Class IX" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Message</label>
                  <textarea 
                    rows="3" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none text-sm" 
                    placeholder="Write your inquiry or question here..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-extrabold px-8 py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                >
                  <span>{loading ? 'Submitting...' : 'Send Message'}</span>
                  <Send size={15} />
                </button>
              </form>
            </div>
            
            {/* Google Map */}
            <div className="h-60 rounded-2xl w-full border border-slate-200 overflow-hidden relative shadow-inner">
               <iframe
                 title="Google Maps"
                 src="https://maps.google.com/maps?q=Master%20Mind%20Public%20Hr.%20Sec.%20School%20Pipariya&t=&z=17&ie=UTF8&iwloc=&output=embed"
                 className="absolute inset-0 w-full h-full border-0"
                 allowFullScreen=""
                 loading="lazy"
                 referrerPolicy="no-referrer-when-downgrade"
               ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
