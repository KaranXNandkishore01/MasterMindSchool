import { X, ArrowRight, GraduationCap, CheckCircle } from 'lucide-react';

const AdmissionPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-blue-100 transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Background */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-8 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yellow-400 p-3 rounded-2xl shadow-lg">
              <GraduationCap className="text-blue-900 w-8 h-8" />
            </div>
            <div>
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest block mb-1">Session 2026-27</span>
              <h2 className="text-2xl font-black tracking-tight leading-none">ADMISSIONS OPEN</h2>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <p className="text-gray-600 mb-6 font-medium leading-relaxed">
            Take the first step towards a brighter future at Master Mind Public School. We are now accepting registrations for the upcoming academic session.
          </p>

          <div className="space-y-4 mb-8">
            {[
              "Nursery to Class XII",
              "Science | Commerce | Arts",
              "Meritorious Scholarship Available",
              "Expert Faculty & Modern Facilities"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-blue-600">
                  <CheckCircle size={20} />
                </div>
                <span className="text-gray-700 font-bold">{text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-xl group border-b-4 border-yellow-600"
            >
              APPLY ONLINE NOW <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-blue-900 font-bold py-2 transition-colors text-sm uppercase tracking-widest"
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
