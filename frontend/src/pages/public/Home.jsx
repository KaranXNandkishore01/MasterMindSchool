import { ArrowRight, BookOpen, Users, Trophy, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-blue-950">
          <img 
            src="/images/hero-bg.png" 
            alt="School Campus" 
            className="w-full h-full object-cover select-none opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
            Empowering Minds,<br/>
            <span className="text-yellow-400">Shaping the Future</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-50 mb-10 max-w-3xl mx-auto font-light drop-shadow-lg">
            Welcome to Master Mind Public Higher Secondary School, Pipariya. A place where tradition meets innovation in education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/admissions" className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold px-8 py-4 rounded-full transition-transform transform hover:scale-105 shadow-xl flex items-center justify-center gap-2">
              Apply Now <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold px-8 py-4 rounded-full transition-colors shadow-lg">
              Discover More
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Overview Stats */}
      <section className="py-16 bg-white relative -mt-16 mx-4 md:mx-auto max-w-7xl rounded-2xl shadow-2xl z-30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-700">
              <Users size={32} />
            </div>
            <h3 className="text-3xl font-black text-blue-900">1200+</h3>
            <p className="text-gray-600 font-medium mt-1">Students</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-yellow-100 p-4 rounded-full mb-4 text-yellow-600">
              <BookOpen size={32} />
            </div>
            <h3 className="text-3xl font-black text-blue-900">50+</h3>
            <p className="text-gray-600 font-medium mt-1">Expert Faculty</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4 text-green-600">
              <Trophy size={32} />
            </div>
            <h3 className="text-3xl font-black text-blue-900">100%</h3>
            <p className="text-gray-600 font-medium mt-1">Pass Rate</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 p-4 rounded-full mb-4 text-purple-600">
              <Target size={32} />
            </div>
            <h3 className="text-3xl font-black text-blue-900">30+</h3>
            <p className="text-gray-600 font-medium mt-1">Years Legacy</p>
          </div>
        </div>
      </section>

      {/* Principal's Message & News */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Principal's Message */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full shrink-0 flex items-center justify-center overflow-hidden border-4 border-yellow-200 shadow-inner">
                  <span className="text-5xl text-blue-600 font-black">PM</span>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-extrabold text-blue-950 mb-2">Principal's Message</h2>
                  <h4 className="text-lg text-yellow-600 font-bold mb-6 tracking-wide">Dr. A. Sharma</h4>
                  <p className="text-gray-600 leading-relaxed italic text-lg mb-8 relative">
                    <span className="text-5xl text-blue-200 absolute -top-4 -left-6 font-serif">"</span>
                    Education is not just about the accumulation of facts, but the preparation of life itself. At MMPS Pipariya, we strive to ignite a passion for learning and a desire to excel in every student. Our holistic approach ensures that each child grows not only academically, but morally, socially, and emotionally.
                    <span className="text-5xl text-blue-200 absolute -bottom-8 -right-4 font-serif">"</span>
                  </p>
                  <Link to="/about" className="inline-flex text-blue-600 font-bold hover:text-blue-800 items-center gap-2 group">
                    Read Full Message <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Latest Announcements */}
            <div className="bg-gradient-to-br from-blue-950 to-blue-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 border-b border-blue-800/50 pb-4 relative z-10">
                <span className="bg-yellow-400 rounded-full w-3 h-3 animate-ping absolute"></span>
                <span className="bg-yellow-500 rounded-full w-3 h-3 relative z-10"></span>
                Announcements
              </h2>
              <div className="space-y-6 relative z-10">
                <div className="group cursor-pointer bg-blue-800/30 p-4 rounded-xl hover:bg-blue-800/50 transition-colors border border-blue-700/30 hover:border-blue-600 duration-300">
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1 block">March 15, 2026</span>
                  <h4 className="font-semibold text-lg text-white group-hover:text-yellow-300 transition-colors">Admissions Open 2026-27</h4>
                  <p className="text-blue-100/70 text-sm mt-2 line-clamp-2">The admission process for the upcoming academic session has officially begun.</p>
                </div>
                <div className="group cursor-pointer bg-blue-800/30 p-4 rounded-xl hover:bg-blue-800/50 transition-colors border border-blue-700/30 hover:border-blue-600 duration-300">
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1 block">March 28, 2026</span>
                  <h4 className="font-semibold text-lg text-white group-hover:text-yellow-300 transition-colors">Annual Sports Meet</h4>
                  <p className="text-blue-100/70 text-sm mt-2 line-clamp-2">Join us for the 30th Annual Sports Meet at the main campus ground.</p>
                </div>
                <div className="group cursor-pointer bg-blue-800/30 p-4 rounded-xl hover:bg-blue-800/50 transition-colors border border-blue-700/30 hover:border-blue-600 duration-300">
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1 block">April 05, 2026</span>
                  <h4 className="font-semibold text-lg text-white group-hover:text-yellow-300 transition-colors">Parent-Teacher Meeting</h4>
                  <p className="text-blue-100/70 text-sm mt-2 line-clamp-2">Mandatory PTM for classes IX to XII.</p>
                </div>
              </div>
              <button className="w-full mt-8 bg-blue-800/50 hover:bg-blue-700 py-3.5 rounded-xl text-sm font-bold tracking-widest uppercase transition-colors shadow-lg relative z-10">
                View All Notices
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
