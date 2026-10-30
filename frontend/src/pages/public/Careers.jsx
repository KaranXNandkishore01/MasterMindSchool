import { Briefcase, GraduationCap, Heart, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Careers = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('/api/public/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-slate-50/70 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 sm:py-24 px-4 text-center overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
            Work With Us
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Join Our Team
          </h1>
          <p className="text-slate-300 max-w-3xl mx-auto text-base sm:text-lg font-normal leading-relaxed">
            Empowering educators to shape the leaders of tomorrow. Start your inspiring journey with Master Mind Public School.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Why Join Us Section */}
            <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 block mb-2">
                Work Culture & Perks
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 flex items-center gap-3 tracking-tight">
                <Heart className="text-rose-500 w-7 h-7" /> 
                Why Build Your Career at MMPS?
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 font-normal">
                At Master Mind Public School, we believe passionate educators are the heart of our community. We foster an innovative, supportive, and merit-driven workplace where professional growth is prioritized.
              </p>

              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { icon: <GraduationCap className="text-amber-500" />, title: 'Continuous Learning', desc: 'Workshops, modern pedagogical training, and regular curriculum development sessions.' },
                  { icon: <Users className="text-blue-500" />, title: 'Collaborative Environment', desc: 'A united faculty community fostering peer support, mutual respect, and shared goals.' },
                  { icon: <Briefcase className="text-emerald-500" />, title: 'Modern Infrastructure', desc: 'Access to smart digital boards, advanced laboratories, and comprehensive learning aids.' },
                  { icon: <CheckCircle2 className="text-indigo-500" />, title: 'Work-Life Balance', desc: 'Structured academic schedules, fair compensation, and recognition of teacher achievements.' },
                ].map((item, index) => (
                  <div key={index} className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 border border-slate-200/80">
                        {item.icon}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Current Openings */}
            <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 block mb-2">
                Vacancies
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">
                Current Opportunities
              </h2>

              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50/60 rounded-2xl border border-slate-100">
                    <p className="text-slate-500 text-sm">
                      There are currently no listed openings. You may still submit an open resume for upcoming sessions.
                    </p>
                    <a
                      href="https://forms.gle/L6r7K6nw5DwewRPF8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 underline"
                    >
                      Submit Open Application
                    </a>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div
                      key={job._id}
                      className="p-6 rounded-2xl border border-slate-200/80 hover:border-amber-400/50 hover:shadow-md transition-all duration-200 bg-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                        <span className="self-start sm:self-auto px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 text-[11px] font-extrabold rounded-full uppercase tracking-wider">
                          Full-Time
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3 leading-relaxed">{job.description}</p>
                      {job.requirements && (
                        <p className="text-slate-500 text-xs mb-4">
                          <span className="font-bold text-slate-700">Requirements:</span> {job.requirements}
                        </p>
                      )}
                      <div>
                        <a 
                          href={job.applyLink || "https://forms.gle/L6r7K6nw5DwewRPF8"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 px-4 py-2 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-sm"
                        >
                          <span>Apply Now</span>
                          <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {/* Recruitment Sidebar */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-amber-500" />
                Hiring Journey
              </h3>
              <ul className="space-y-5">
                {[
                  { step: '1', title: 'Application Review', desc: 'Submit qualifications via our official Google Form portal.' },
                  { step: '2', title: 'Shortlisting', desc: 'Our academic leadership panel reviews your subject background.' },
                  { step: '3', title: 'Interview Interaction', desc: 'In-person or virtual panel discussion on educational vision.' },
                  { step: '4', title: 'Classroom Demo', desc: 'A real or simulated interactive teaching session with students.' },
                ].map((s) => (
                  <li key={s.step} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-extrabold text-xs shrink-0 border border-white/10">
                      {s.step}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{s.title}</span>
                      <span className="text-slate-500 text-xs leading-relaxed">{s.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Queries Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900 mb-3">
                Recruitment Queries
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">
                Have questions regarding open faculty or staff roles? Reach out to our school recruitment desk:
              </p>
              <a
                href="mailto:mastermindschool2005@gmail.com"
                className="text-amber-600 hover:text-amber-700 font-bold text-sm block break-all"
              >
                mastermindschool2005@gmail.com
              </a>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Link to="/contact" className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1">
                  <span>Visit Campus Contact Page</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Careers;
