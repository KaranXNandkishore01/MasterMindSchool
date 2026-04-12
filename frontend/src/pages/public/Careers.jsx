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
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-blue-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight uppercase">Join Our Team</h1>
        <p className="text-blue-200 max-w-3xl mx-auto text-lg md:text-xl font-light">
          Empowering educators to shape the leaders of tomorrow. Start your journey with Master Mind Public School.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Why Join Us Section */}
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border-t-4 border-yellow-500">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Heart className="text-red-500 w-8 h-8" /> 
                Why Work at MMPS?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                At Master Mind Public School, we believe that teachers are the backbone of our institution. We provide a supportive, innovative, and growth-oriented environment where your passion for teaching can truly flourish.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: <GraduationCap className="text-blue-600" />, title: 'Professional Growth', desc: 'Regular workshops and training sessions to enhance your pedagogical skills.' },
                  { icon: <Users className="text-blue-600" />, title: 'Collaborative Culture', desc: 'Work with a dedicated team of educators in a vibrant academic atmosphere.' },
                  { icon: <Briefcase className="text-blue-600" />, title: 'Competitive Environment', desc: 'State-of-the-art facilities and a curriculum that challenges and rewards.' },
                  { icon: <CheckCircle2 className="text-blue-600" />, title: 'Work-Life Balance', desc: 'A structured environment that respects your personal time and professional commitment.' },
                ].map((item, index) => (
                  <div key={index} className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Current Openings */}
            <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Current Opportunities</h2>
              <div className="space-y-6">
                {jobs.length === 0 ? (
                  <p className="text-gray-600">There are no current openings at this time.</p>
                ) : (
                  jobs.map(job => (
                    <div key={job._id} className="p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                      <p className="text-gray-600 mb-2">{job.description}</p>
                      {job.requirements && <p className="text-gray-500 text-sm mb-4"><span className="font-semibold">Requirements:</span> {job.requirements}</p>}
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase">Full-Time</span>
                        </div>
                        <a 
                          href={job.applyLink || "https://forms.gle/L6r7K6nw5DwewRPF8"} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105 shadow-md uppercase"
                        >
                          Apply Now <ArrowRight size={16} />
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
            <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100 shadow-sm">
              <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6" /> Hiring Process
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold shrink-0">1</div>
                  <div>
                    <span className="font-bold text-gray-900 block">Online Application</span>
                    <span className="text-gray-600 text-sm">Submit your details via our Google Form.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold shrink-0">2</div>
                  <div>
                    <span className="font-bold text-gray-900 block">Shortlisting</span>
                    <span className="text-gray-600 text-sm">Our team reviews your profile and experience.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold shrink-0">3</div>
                  <div>
                    <span className="font-bold text-gray-900 block">Interview</span>
                    <span className="text-gray-600 text-sm">Personal or virtual interaction with our panel.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold shrink-0">4</div>
                  <div>
                    <span className="font-bold text-gray-900 block">Demo Session</span>
                    <span className="text-gray-600 text-sm">A practical classroom demonstration (for teachers).</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Contact for Careers */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📧</span> Queries?
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                If you have any questions regarding recruitment or open positions, feel free to reach out to our HR department.
              </p>
              <Link to="/contact#contact-form" className="text-blue-600 font-bold hover:underline">
                info@mmpspipariya.com
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Careers;
