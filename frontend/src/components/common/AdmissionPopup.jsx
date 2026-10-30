import { X, ArrowRight, GraduationCap, CheckCircle2 } from 'lucide-react';

const AdmissionPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Dark Modern Navy Gradient */}
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8 text-white relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all border border-white/10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-3.5 rounded-2xl shadow-lg shadow-amber-500/20 text-slate-950">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <span className="text-amber-400 text-xs font-extrabold uppercase tracking-widest block mb-1">
                Session 2026-27
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none text-white">
                Admissions Open
              </h2>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <p className="text-slate-600 mb-6 font-normal leading-relaxed text-sm sm:text-base">
            Take the first step towards a brighter future at Master Mind Public School. We are now welcoming registrations for the upcoming academic session.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
            {[
              'Nursery to Class XII',
              'Science & Commerce',
              'Merit Scholarships',
              'Smart Digital Classes',
              'Safe Campus Transport',
              'Sports & Cultural Arts',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-amber-500 shrink-0" />
                <span className="text-slate-700 font-semibold text-xs sm:text-sm">{text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-amber-500/25 text-sm uppercase tracking-wider"
            >
              <span>Enroll Online Now</span>
              <ArrowRight size={18} />
            </a>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 font-semibold py-2 transition-colors text-xs uppercase tracking-wider"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionPopup;
