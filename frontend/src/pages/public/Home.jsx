import { ArrowRight, BookOpen, Users, Trophy, Target, ImageIcon, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdmissionPopup from '../../components/common/AdmissionPopup';
import heroBg from '../../assets/Heroimage.jpeg';
import bannerImg from '../../assets/banner.png';
import mlaImg from '../../assets/MLA.png';
import precessionImg from '../../assets/precession.png';
import educatorsImg from "../../assets/sir&ma'am.png";
import mentorsImg from '../../assets/mentors.png';
import top1Img from '../../assets/top1.png';
import top3Img from '../../assets/top3.png';
import directorSirImg from '../../assets/Directorsir.png';
import familyImg from '../../assets/family.png';
import principalImg from '../../assets/principal.png';
import mlaSirImg from '../../assets/MLAsir.png';

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAdmissionPopup, setShowAdmissionPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAdmissionPopup(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const galleryImages = [
    { src: mlaImg, title: "Official Visit", category: "Events" },
    { src: precessionImg, title: "School Procession", category: "Activities" },
    { src: educatorsImg, title: "Our Educators", category: "Legacy" },
    { src: mentorsImg, title: "Guidance & Mentorship", category: "Team" },
    { src: top1Img, title: "Academic Excellence", category: "Achievements" },
    { src: top3Img, title: "Top Performers", category: "Results" },
    { src: familyImg, title: "Our School Family", category: "Community" },
    { src: mlaSirImg, title: "MLA Mr. Thakur Das Ji Nagwanshi and Mr. Arvind Ji Rai Formal Visit to motivate students.", category: "Events" },
  ];

  return (
    <div className="w-full">
      <AdmissionPopup 
        isOpen={showAdmissionPopup} 
        onClose={() => setShowAdmissionPopup(false)} 
      />
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-8 right-8 text-white hover:text-yellow-400 transition-colors bg-white/10 p-2 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <div 
            className="max-w-5xl w-full flex flex-col items-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title} 
              className="max-h-[80vh] w-auto h-auto object-contain rounded-2xl shadow-2xl border-4 border-white/10"
            />
            <div className="text-center">
              <span className="text-yellow-400 text-sm font-bold uppercase tracking-widest block mb-2">
                {selectedImage.category}
              </span>
              <h3 className="text-white text-3xl font-bold">
                {selectedImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-blue-950">
          <img 
            src={heroBg} 
            alt="School Campus" 
            className="w-full h-full object-cover select-none opacity-[0.90] mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent z-10"></div>
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
            Empowering Minds,<br/>
            <span className="text-yellow-400">Shaping the Future</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-50 mb-10 max-w-3xl mx-auto font-light drop-shadow-lg">
            Welcome to Master Mind Public School, Pipariya. Link learning to life. A place where tradition meets innovation in education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform" target="_blank" rel="noopener noreferrer" className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold px-8 py-4 rounded-full transition-transform transform hover:scale-105 shadow-xl flex items-center justify-center gap-2">
              Apply Now <ArrowRight size={20} />
            </a>
            <Link to="/about" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold px-8 py-4 rounded-full transition-colors shadow-lg">
              Discover More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Banner Section */}
      <section className="px-4 -mt-10 mb-16 relative z-30">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img src={bannerImg} alt="MMPS Banner" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Quick Overview Stats */}
      <section className="py-16 bg-white relative mx-4 md:mx-auto max-w-7xl rounded-2xl shadow-xl z-20 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-700">
              <Users size={32} />
            </div>
            <h3 className="text-3xl font-black text-blue-900">5000+</h3>
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
            <h3 className="text-3xl font-black text-blue-900">20+</h3>
            <p className="text-gray-600 font-medium mt-1">Years Legacy</p>
          </div>
        </div>
      </section>

      {/* Principal's Message & News */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Leadership Messages */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transform hover:-translate-y-1 transition-transform duration-300 flex flex-col gap-12">
              
              {/* Director's Message */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full shrink-0 flex items-center justify-center overflow-hidden border-4 border-yellow-200 shadow-inner">
                  <img src={directorSirImg} alt="Director Mr. Lochan Sagar Prajapati" className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 mb-1">Director's Vision</h2>
                  <h4 className="text-md md:text-lg text-yellow-600 font-bold mb-4 tracking-wide">Mr. Lochan Sagar Prajapati</h4>
                  <p className="text-gray-600 leading-relaxed italic text-base md:text-lg relative">
                    <span className="text-5xl text-blue-200 absolute -top-4 -left-6 font-serif hidden md:block">"</span>
                    Welcome to MMPS. Our primary goal is to empower students with knowledge, strong character, and the skills necessary to thrive in an ever-changing world. We are fiercely committed to fostering an innovative educational environment that encourages critical thinking, community service, and a lifelong passion for excellence.
                    <span className="text-5xl text-blue-200 absolute -bottom-8 -right-4 font-serif hidden md:block">"</span>
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

              {/* Principal's Message */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full shrink-0 flex items-center justify-center overflow-hidden border-4 border-yellow-200 shadow-inner">
                  <img src={principalImg} alt="Principal Mrs. Anita Prajapati" className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 mb-1">Principal's Desk</h2>
                  <h4 className="text-md md:text-lg text-yellow-600 font-bold mb-4 tracking-wide">Mrs. Anita Prajapati</h4>
                  <p className="text-gray-600 leading-relaxed italic text-base md:text-lg mb-6 relative">
                    <span className="text-5xl text-blue-200 absolute -top-4 -left-6 font-serif hidden md:block">"</span>
                    Education is not merely about accumulating facts, but preparing for life itself. At MMPS, we strive to ignite curiosity and a desire to excel in every child. Our holistic approach ensures that each student grows academically, morally, socially, and emotionally to become responsible global citizens.
                    <span className="text-5xl text-blue-200 absolute -bottom-8 -right-4 font-serif hidden md:block">"</span>
                  </p>
                  <Link to="/about" className="inline-flex text-blue-600 font-bold hover:text-blue-800 items-center gap-2 group">
                    Discover More <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
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

      {/* Gallery Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
            <div className="max-w-xl">
              <h2 className="text-yellow-500 font-bold uppercase tracking-[0.2em] text-sm mb-3 flex items-center justify-center md:justify-start gap-2">
                <ImageIcon size={18} /> Glimpses of MMPS
              </h2>
              <h1 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tight leading-tight">
                Our Campus Gallery
              </h1>
            </div>
            <p className="text-gray-500 text-lg font-medium max-w-md">
              A visual journey through the events, achievements, and everyday excellence at Master Mind Public School.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-lg border-4 border-white transition-transform duration-500 hover:scale-[1.02] cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image.src} 
                  alt={image.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {image.category}
                  </span>
                  <h3 className="text-white text-2xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    {image.title}
                  </h3>
                </div>
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-all">
                  VIEW FULL
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
