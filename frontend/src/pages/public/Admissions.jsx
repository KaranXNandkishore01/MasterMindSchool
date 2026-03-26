import { CheckCircle2, Calendar, FileText, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admissions = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight uppercase">Admissions Open 2025-26</h1>
        <p className="text-blue-200 max-w-3xl mx-auto text-lg md:text-xl font-light">
          Join the Master Mind Family – A center of excellence where we link learning to life.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Overview Section */}
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border-t-4 border-yellow-500">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FileText className="text-blue-900 w-8 h-8" /> 
                Start Your Journey
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                We welcome students who are eager to learn, grow, and become the best versions of themselves. At Master Mind Public School, we ensure a smooth, transparent, and parent-friendly admission process.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <span>📚</span> Classes Offered
                  </h3>
                  <ul className="space-y-2 text-gray-700 font-medium">
                    <li>• Nursery to Class XII</li>
                    <li>• Streams: Science | Commerce | Arts</li>
                    <li>• Session: July 2025</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                  <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                    <span>📋</span> Essential Documents
                  </h3>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>• Birth Certificate (Nursery - Class I)</li>
                    <li>• Transfer Certificate (Class II+)</li>
                    <li>• Previous Year’s Report Card</li>
                    <li>• Aadhar Card (Student & Parent)</li>
                    <li>• 4 Passport-size Photographs</li>
                    <li>• Caste Certificate (if applicable)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Step-by-Step Procedure */}
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-10">Admission Process</h2>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-z-10 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:via-blue-100 before:to-transparent">
                {[
                  { step: 1, title: 'Registration', desc: 'Fill the enquiry or registration form online (see link below) or visit the school office.' },
                  { step: 2, title: 'Interaction', desc: 'Attend a short interaction or entrance test based on the candidate\'s applied class.' },
                  { step: 3, title: 'Documentation', desc: 'Submit all required documents as mentioned in the checklist above.' },
                  { step: 4, title: 'Confirmation', desc: 'Pay the admission fees and confirm your child\'s seat in the Master Mind family.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-6 items-start relative bg-white">
                    <div className="bg-blue-900 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 shadow-lg ring-4 ring-white">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mt-32"></div>
              <h2 className="text-3xl font-bold mb-4 relative z-10">Ready to Enroll Your Child?</h2>
              <p className="text-blue-100 mb-10 text-lg relative z-10">Application phase for Session 2025-26 is now ACTIVE.</p>
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-blue-950 px-10 py-5 rounded-full font-black text-xl transition-all hover:scale-105 shadow-xl relative z-10"
              >
                APPLY ONLINE NOW <ArrowRight size={24} />
              </a>
              <p className="mt-8 text-sm italic opacity-70">
                “A school that invests in your child's future — Choose Master Mind today!”
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Quick Info Sidebar */}
            <div className="bg-yellow-50 rounded-3xl p-8 border border-yellow-200 shadow-sm">
              <h3 className="text-xl font-bold text-yellow-800 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6" /> Key Details
              </h3>
              <ul className="space-y-6">
                <li className="flex flex-col">
                  <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-1">Session Starts</span>
                  <span className="font-bold text-gray-900">July 2025</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-1">Levels</span>
                  <span className="font-bold text-gray-900">Nursery to Class XII</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-yellow-600 text-xs font-bold uppercase tracking-widest mb-1">Assistance</span>
                  <span className="font-bold text-gray-900">Meritorious Scholarships & Sibling Concessions Available</span>
                </li>
              </ul>
            </div>

            {/* Fees Notice */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>💳</span> Fee Schedule
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Fee details can be obtained directly from the school office or requested via our contact form. We maintain a parent-friendly fee structure.
              </p>
              <Link to="/contact" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                Request Fee Details <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Brochures</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center gap-3 text-blue-600 hover:text-blue-800 font-medium p-3 rounded-xl hover:bg-blue-50 transition-colors">
                    <Download className="w-5 h-5" /> Full Prospectus
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admissions;
