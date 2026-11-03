import { ArrowRight, CheckCircle2 } from 'lucide-react';
import classroomImg from '../../assets/classrooms.png';
import computerLabImg from '../../assets/computerlab.png';
import labsImg from '../../assets/labs.png';
import libraryImg from '../../assets/library.png';
import sportsImg from '../../assets/sportcmplex.png';
import artImg from '../../assets/artstudio.png';
import transportImg from '../../assets/transportbus.png';
import cafeteriaImg from '../../assets/cafeteria.png';

const Facilities = () => {
  const facilities = [
    {
      title: "Smart Classrooms",
      image: classroomImg,
      tag: "Digital Learning",
      desc: "Fully air-conditioned classrooms equipped with interactive smart boards and high-speed multimedia tools to facilitate engaging modern learning."
    },
    {
      title: "Computer Laboratory",
      image: computerLabImg,
      tag: "Technology Hub",
      desc: "Advanced computing facility with high-performance hardware, programming suites, and high-speed internet promoting coding and digital literacy."
    },
    {
      title: "Science Laboratories",
      image: labsImg,
      tag: "Hands-on Discovery",
      desc: "State-of-the-art Physics, Chemistry, and Biology laboratories equipped with modern apparatus for safe, curriculum-guided scientific experiments."
    },
    {
      title: "Comprehensive Library",
      image: libraryImg,
      tag: "Knowledge Center",
      desc: "A quiet, resource-rich haven featuring thousands of curriculum titles, reference encyclopedias, literary classics, and digital periodicals."
    },
    {
      title: "Sports Complex",
      image: sportsImg,
      tag: "Athletics & Fitness",
      desc: "Extensive sports grounds for cricket and football, alongside dedicated courts for volleyball, badminton, athletics, and indoor games."
    },
    {
      title: "Art & Creativity Studio",
      image: artImg,
      tag: "Visual Arts",
      desc: "A vibrant creative space inspiring students to express their artistic talents through painting, sketching, sculpture, and craftwork."
    },
    {
      title: "GPS-Enabled Transport",
      image: transportImg,
      tag: "Safe Commute",
      desc: "A well-maintained fleet of GPS-equipped school buses with trained drivers and conductors covering Pipariya and surrounding regional routes."
    },
    {
      title: "Hygienic Cafeteria",
      image: cafeteriaImg,
      tag: "Nutrition & Dining",
      desc: "Clean, spacious cafeteria providing fresh, healthy, and wholesome vegetarian snacks and meals prepared under stringent hygiene guidelines."
    }
  ];

  return (
    <div className="bg-slate-50/70 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 sm:py-24 px-4 text-center overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
            Campus Infrastructure
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            World-Class Facilities
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
            Infrastructure designed to support and enhance the holistic growth, safety, and development of every student.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-3xl bg-slate-900">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                      {fac.tag}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2.5 tracking-tight">{fac.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{fac.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Admissions Callout Box */}
        <div className="mt-20 bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 block mb-2">
              Admissions Open 2026-27
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Join the Master Mind Public School Family
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We welcome students who are eager to learn, grow, and achieve. We ensure a smooth, transparent, and parent-friendly admission process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="space-y-6">
              <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span>Classes Offered</span>
                </h3>
                <ul className="space-y-2 text-slate-700 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Nursery to Class XII
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Senior Secondary: Science & Commerce
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Session: 2026-27
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50/40 p-6 rounded-2xl border border-amber-200/50">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span>Key Documents Required</span>
                </h3>
                <ul className="space-y-2 text-slate-700 text-xs sm:text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-600 shrink-0" /> Birth Certificate (Nursery - Class I)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-600 shrink-0" /> Transfer Certificate (Class II and above)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-600 shrink-0" /> Previous Year's Report Card
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-amber-600 shrink-0" /> Student & Parent Aadhaar Copies
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50/70 rounded-2xl p-6 sm:p-8 border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Admission Steps</h3>
              <div className="space-y-3.5 text-sm text-slate-700">
                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 font-extrabold text-xs flex items-center justify-center shrink-0">1</span>
                  <span>Fill the enquiry or online registration form below.</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 font-extrabold text-xs flex items-center justify-center shrink-0">2</span>
                  <span>Attend a short interaction or entrance session as per class.</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 font-extrabold text-xs flex items-center justify-center shrink-0">3</span>
                  <span>Submit required verification documents.</span>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 font-extrabold text-xs flex items-center justify-center shrink-0">4</span>
                  <span>Confirm admission fees and welcome onboarding.</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md uppercase tracking-wider text-xs transition-all transform hover:-translate-y-0.5"
                >
                  <span>Register Online for 2026-27</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facilities;
