import { CheckCircle2, Calendar, FileText, ArrowRight, Sparkles, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admissions = () => {
  return (
    <div className="bg-slate-50/70 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 sm:py-24 px-4 text-center overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
            Academic Session 2026-27
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Admissions Open 2026-27
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
            Join the Master Mind Family – A center of excellence where we link learning to life.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Overview Section */}
            <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 block mb-2">
                Enrollment Overview
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
                <FileText className="text-amber-500 w-7 h-7" />
                Start Your Journey With Us
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 font-normal">
                We welcome curious students eager to learn, grow, and lead. Master Mind Public School provides a transparent, parent-friendly admission process focused on each child's potential.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Classes */}
                <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Academic Programs</span>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <span>Classes Offered</span>
                  </h3>
                  <ul className="space-y-2 text-slate-700 font-medium text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Nursery to Class XII
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Senior Secondary: Science & Commerce
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> English & Hindi Medium Support
                    </li>
                  </ul>
                </div>

                {/* Documents */}
                <div className="bg-amber-50/40 p-6 rounded-2xl border border-amber-200/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-2">Checklist</span>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                    <span>Essential Documents</span>
                  </h3>
                  <ul className="space-y-1.5 text-slate-700 text-xs sm:text-sm font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-amber-600 shrink-0" /> Birth Certificate (Nursery - Class I)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-amber-600 shrink-0" /> Transfer Certificate (Class II+)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-amber-600 shrink-0" /> Previous Year's Marksheet
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-amber-600 shrink-0" /> Student & Parent Aadhaar Copies
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-amber-600 shrink-0" /> 4 Passport-size Photographs
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Step-by-Step Procedure */}
            <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 block mb-2">
                Clear & Transparent
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">
                Admission Process
              </h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:-z-10 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-blue-300 before:to-transparent">
                {[
                  { step: 1, title: 'Registration', desc: 'Submit the online application form (via the link below) or visit our campus office in Pipariya.' },
                  { step: 2, title: 'Interaction & Assessment', desc: 'Attend a short friendly interaction or entrance assessment aligned with the student\'s applied grade level.' },
                  { step: 3, title: 'Verification', desc: 'Present and verify student documents (Aadhaar, birth certificate, transfer certificate, and photographs).' },
                  { step: 4, title: 'Seat Confirmation', desc: 'Complete the institutional admission fee schedule and receive your child\'s welcome onboarding package.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-5 items-start relative bg-white">
                    <div className="bg-slate-950 text-amber-400 w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md ring-4 ring-white border border-white/10">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl border border-white/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
                <Sparkles size={14} className="text-amber-400" /> Session 2026-27 Active
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold mb-4 relative z-10 tracking-tight">
                Ready to Enroll Your Child?
              </h2>
              <p className="text-slate-300 mb-8 text-base sm:text-lg max-w-xl mx-auto relative z-10 leading-relaxed">
                Secure your child's seat in an inspiring environment dedicated to character and academic excellence.
              </p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 px-8 sm:px-10 py-4 rounded-full font-extrabold text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5 shadow-xl shadow-amber-500/25 relative z-10"
              >
                <span>Enroll Online Now</span>
                <ArrowRight size={18} />
              </a>
              <p className="mt-6 text-xs text-slate-400 italic">
                “A school that invests in your child's future — Choose Master Mind Public School.”
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Quick Info Sidebar */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-amber-500" />
                Key Admission Details
              </h3>
              <ul className="space-y-5">
                <li className="flex flex-col">
                  <span className="text-amber-600 text-xs font-extrabold uppercase tracking-widest mb-1">Session Starts</span>
                  <span className="font-bold text-slate-900 text-sm">Academic Session 2026-27</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-amber-600 text-xs font-extrabold uppercase tracking-widest mb-1">Eligible Classes</span>
                  <span className="font-bold text-slate-900 text-sm">Nursery to Class XII (Science & Commerce)</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-amber-600 text-xs font-extrabold uppercase tracking-widest mb-1">Scholarships</span>
                  <span className="font-bold text-slate-900 text-sm">Merit Scholarships & Sibling Concessions available upon review</span>
                </li>
              </ul>
            </div>

            {/* Fees Notice */}
            <div id="fees" className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900 mb-3 flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-amber-500" />
                Fee Structure
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                Detailed fee breakdown per grade level is available directly at the campus office or can be requested via our contact inquiry form.
              </p>
              <Link
                to="/contact"
                className="text-blue-700 hover:text-blue-900 font-bold text-sm inline-flex items-center gap-1.5 group"
              >
                <span>Inquire About Fees</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admissions;
