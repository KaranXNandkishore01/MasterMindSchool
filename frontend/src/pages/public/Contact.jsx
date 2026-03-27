import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, X } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Contact Us</h1>
        <p className="text-blue-200 max-w-2xl mx-auto text-lg">We'd love to hear from you. Get in touch with us for any inquiries.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          
          {/* Contact Info */}
          <div className="bg-blue-800 text-white p-10 lg:w-1/3 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-yellow-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Our Location</h4>
                    <p className="text-blue-100 leading-relaxed">
                      <a href="https://maps.app.goo.gl/vUjrrdx9cuBK6nK68" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition-all">
                        Main Road, Pipariya,<br/>Madhya Pradesh 461775, India
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-yellow-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Phone Number</h4>
                    <a href="tel:8269420850" className="text-blue-100 hover:text-yellow-400 transition-colors block text-lg font-bold">8269420850</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-yellow-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Email Address</h4>
                    <p className="text-blue-100">info@mmpspipariya.com</p>
                    <p className="text-blue-100">admissions@mmpspipariya.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-yellow-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Office Hours</h4>
                    <p className="text-blue-100">Mon - Sat: 8:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-blue-700">
              <p className="text-sm text-blue-200">For urgent queries, please call the administration numbers directly during office hours.</p>
            </div>
          </div>

          {/* Contact Form & Map */}
          <div className="p-10 lg:w-2/3 flex flex-col relative">
            {/* Success Popup */}
            {submitted && (
              <div className="absolute inset-x-0 top-10 flex justify-center z-50 px-10">
                <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce">
                  <CheckCircle2 size={24} className="text-green-200" />
                  <span className="font-bold text-lg">Thanks for your feedback!</span>
                  <button onClick={() => setSubmitted(false)} className="hover:bg-green-700 p-1 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6 flex-grow mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                    placeholder="Amit Sharma" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                    placeholder="amit.sharma@example.com" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  placeholder="How can we help?" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  rows="4" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" 
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-xl transition-all transform hover:-translate-y-1 shadow-md flex items-center gap-2"
              >
                Send Message <Send size={18} />
              </button>
            </form>
            
            {/* Google Map */}
            <div className="h-64 rounded-2xl w-full border border-gray-300 overflow-hidden relative shadow-inner">
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
