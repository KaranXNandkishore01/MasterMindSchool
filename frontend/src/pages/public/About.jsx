import { Target, Eye, ShieldCheck, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import schoolPhoto from '../../assets/schoolphoto.png';

const About = () => {
  return (
    <div className="bg-slate-50/70 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 sm:py-24 px-4 text-center overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
            About Master Mind Public School
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Building the Future, One Child at a Time
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
            Founded with a vision to create an environment that seamlessly blends academic brilliance with lifelong moral and ethical values.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {/* Welcome Bento Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.06)] p-8 sm:p-12 mb-12 border border-slate-100">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 block mb-2">
                Our Institutional Legacy
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Welcome to MMPS
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-base sm:text-lg font-normal">
                We are committed to shaping responsible, confident, and future-ready individuals who can thrive in an evolving global landscape. Our journey is dedicated to the holistic intellectual, emotional, and social development of every student who enters our gates.
              </p>
              <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-amber-400 shadow-sm">
                <p className="text-slate-800 font-medium italic text-sm sm:text-base leading-relaxed">
                  "Education is not merely the learning of facts, but training the mind to think critically and lead with empathy — that is what we do best at Master Mind."
                </p>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[340px] sm:min-h-[380px] border border-slate-200/80 group">
              <img
                src={schoolPhoto}
                alt="School Campus"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 right-6 bg-slate-950/80 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-xl border border-white/10 text-center">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 mb-0.5">20+</h3>
                <p className="text-[11px] font-bold text-slate-200 uppercase tracking-widest">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Bento Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Mission */}
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-white/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-amber-400 mb-6 shadow-inner">
              <Target size={28} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-2">Our Purpose</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 tracking-tight">Our Mission</h3>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              To provide empowering education that nurtures students intellectually, emotionally, and socially, while instilling strong moral values, scientific temper, and a lifelong thirst for learning.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 rounded-3xl p-8 sm:p-10 text-slate-900 shadow-sm border border-amber-200/60 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-600 mb-6 shadow-sm">
              <Eye size={28} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">Our Aspiration</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 tracking-tight">Our Vision</h3>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              To be a premier institution recognized for holistic development, transforming passionate young minds into global citizens characterized by discipline, creativity, and purposeful leadership.
            </p>
          </div>
        </div>

        {/* School Anthem Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12 mb-12">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 block mb-2">
              School Heritage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 flex items-center justify-center gap-3 tracking-tight">
              <ShieldCheck className="text-amber-500" size={32} />
              Our School Anthem
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base">
              Listen to the Master Mind Public School Anthem that instills pride, unity, and a shared commitment to lifelong excellence.
            </p>
          </div>

          <div
            className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-2xl border border-slate-200/80 bg-slate-950"
            style={{ paddingTop: '56.25%' }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full border-0"
              src="https://www.youtube.com/embed/Ux3_h4tsaqU?rel=0"
              title="MMPS School Anthem"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Approach & Achievements Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Our Approach */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 block mb-2">
              Teaching Methodology
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-6 tracking-tight flex items-center gap-2.5">
              <span>Our Student-Centric Approach</span>
            </h3>
            <p className="text-slate-600 mb-6 text-sm sm:text-base leading-relaxed">
              We cultivate a dynamic atmosphere where learning reaches beyond textbooks to prepare students for real-world problem-solving:
            </p>
            <div className="space-y-3">
              {[
                { title: 'Conceptual Clarity', desc: 'Deep foundational mastery over rote memorization.' },
                { title: 'Critical Thinking', desc: 'Analytical problem-solving and scientific curiosity.' },
                { title: 'Collaboration & Arts', desc: 'Team projects, public speaking, and fine arts.' },
                { title: 'Ethical Leadership', desc: 'Integrity, social responsibility, and resilience.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                  <CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Milestones */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 block mb-2">
              Institutional Highlights
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-6 tracking-tight flex items-center gap-2.5">
              <span>Why Families Choose MMPS</span>
            </h3>
            <div className="space-y-5">
              {[
                {
                  no: '01',
                  title: 'Consistent State & District Toppers',
                  desc: 'Every year, our students secure top ranks in state board merit examinations.',
                },
                {
                  no: '02',
                  title: 'Academic & Co-curricular Harmony',
                  desc: 'Equal emphasis on competitive academics, athletics, and digital literacy.',
                },
                {
                  no: '03',
                  title: 'Two Decades of Parental Trust',
                  desc: 'Over 20 years of delivering educational excellence to thousands of proud alumni.',
                },
              ].map((item) => (
                <div key={item.no} className="flex gap-4 items-start">
                  <div className="shrink-0 w-11 h-11 rounded-2xl bg-slate-950 text-amber-400 font-extrabold text-sm flex items-center justify-center shadow-sm">
                    {item.no}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                    <p className="text-slate-600 text-sm mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historic Merit Record */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12 mb-12">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 block mb-2">
              Hall of Fame
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 flex items-center justify-center gap-2.5 tracking-tight">
              <Trophy className="text-amber-500" size={32} />
              Historic Merit & Achievement Record
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base">
              Honoring the exceptional achievements of our brilliant students who set benchmarks in regional and state merit lists.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 2022-23 */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="bg-blue-600 text-white font-extrabold py-1 px-3.5 rounded-full inline-block mb-5 text-xs tracking-wider uppercase shadow-sm">
                Session 2022-23
              </div>
              <ul className="space-y-4">
                <li className="flex flex-col gap-1">
                  <span className="text-slate-900 font-bold flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500 shrink-0" /> Varsha Sahu
                  </span>
                  <span className="text-xs font-semibold text-slate-500 pl-5 border-l-2 border-blue-400 ml-1.5">
                    M.P. State Merit (6th Rank)
                  </span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-slate-900 font-bold flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500 shrink-0" /> Ritu Goswami
                  </span>
                  <span className="text-xs font-semibold text-slate-500 pl-5 border-l-2 border-blue-400 ml-1.5">
                    M.P. State Merit (10th Rank)
                  </span>
                </li>
              </ul>
            </div>

            {/* 2023-24 */}
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200/70 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-extrabold py-1 px-3.5 rounded-full inline-block mb-5 text-xs tracking-wider uppercase shadow-sm">
                Session 2023-24
              </div>
              <ul className="space-y-4">
                <li className="flex flex-col gap-1">
                  <span className="text-slate-900 font-bold flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-600 shrink-0" /> Soumya Rai
                  </span>
                  <span className="text-xs font-semibold text-slate-500 pl-5 border-l-2 border-amber-400 ml-1.5">
                    Block Merit List (Topper)
                  </span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-slate-900 font-bold flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-600 shrink-0" /> Arpit Rai
                  </span>
                  <span className="text-xs font-semibold text-slate-500 pl-5 border-l-2 border-amber-400 ml-1.5">
                    Block Merit List (Topper)
                  </span>
                </li>
              </ul>
            </div>

            {/* 2024-25 */}
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200/70 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="bg-emerald-600 text-white font-extrabold py-1 px-3.5 rounded-full inline-block mb-5 text-xs tracking-wider uppercase shadow-sm">
                Session 2024-25
              </div>
              <ul className="space-y-4">
                <li className="flex flex-col gap-1">
                  <span className="text-slate-900 font-bold flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-600 shrink-0" /> Sakshi Kushwaha
                  </span>
                  <span className="text-xs font-semibold text-slate-500 pl-5 border-l-2 border-emerald-400 ml-1.5">
                    M.P. State Merit (8th Rank)
                  </span>
                </li>
                <li className="flex flex-col gap-1">
                  <span className="text-slate-900 font-bold flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-600 shrink-0" /> Shivani Sahu
                  </span>
                  <span className="text-xs font-semibold text-slate-500 pl-5 border-l-2 border-emerald-400 ml-1.5">
                    District Merit List (Topper)
                  </span>
                </li>
              </ul>
            </div>

            {/* 2025-26 */}
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-200/70 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="bg-indigo-600 text-white font-extrabold py-1 px-3.5 rounded-full inline-block mb-5 text-xs tracking-wider uppercase shadow-sm">
                Session 2025-26
              </div>
              <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
                District Merit Toppers:
              </h4>
              <ul className="space-y-2">
                {['Alankritika Malviya', 'Saloni Patel', 'Akanksha Goswami', 'Simran Rajput'].map((name, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-slate-800 font-semibold text-xs bg-white px-3 py-2 rounded-xl border border-indigo-100 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
