import { ArrowRight, BookOpen, Users, Trophy, Target, ImageIcon, X, ZoomIn, ZoomOut, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdmissionPopup from '../../components/common/AdmissionPopup';
import heroVideo from '../../assets/HeroVideo.mp4';
import bannerImg from '../../assets/banner.png';
import directorSirImg from '../../assets/Directorsir.png';
import principalImg from '../../assets/principal.png';
import { subscribeToUpdates } from '../../utils/realtimeSync';

const DEFAULT_GALLERY_IMAGES = [
  { _id: 'img-1', imageUrl: '/gallery/schoolphoto.png', caption: 'Main Academic Campus & Courtyard, Pipariya', category: 'Campus' },
  { _id: 'img-2', imageUrl: '/gallery/sportcmplex.png', caption: 'Inter-House Sports Complex & Playground', category: 'Event' },
  { _id: 'img-3', imageUrl: '/gallery/classrooms.png', caption: 'Modern Digital Smart Classrooms', category: 'Campus' },
  { _id: 'img-4', imageUrl: '/gallery/computerlab.png', caption: 'Advanced Computer Science & IT Lab', category: 'Campus' },
  { _id: 'img-5', imageUrl: '/gallery/library.png', caption: 'Central Knowledge & Reading Library', category: 'Campus' },
  { _id: 'img-6', imageUrl: '/gallery/Directorsir.png', caption: 'Director Mr. Lochan Sagar Prajapati Guiding Educators', category: 'Leadership' },
  { _id: 'img-7', imageUrl: '/gallery/felicitation_1.jpg', caption: 'Hon. District Collector Felicitating MMPS Students', category: 'Achievement' },
  { _id: 'img-8', imageUrl: '/gallery/Ourtechers.png', caption: 'Dedicated Faculty & Educators of Master Mind Public School', category: 'Leadership' }
];

const DEFAULT_ANNOUNCEMENTS = [
  {
    _id: 'ann-1',
    title: 'Admissions Open for Session 2026-27 (Nursery to Class XII)',
    content: 'Master Mind Public School (MPBSE Affiliated) welcomes applications for the upcoming 2026-27 session. Merit scholarships, state-of-the-art digital classrooms, and safe bus transport are available. Register online or visit our campus office.',
    date: '2026-04-02',
  },
  {
    _id: 'ann-2',
    title: 'Annual Inter-House Sports Championship 2026',
    content: 'Campus athletic sports complex will host track and field events, cricket, badminton, and kho-kho trials this Wednesday. Students must report in full sports uniform.',
    date: '2026-03-25',
  },
  {
    _id: 'ann-3',
    title: 'Quarterly Parent-Teacher Meeting (PTM) for Classes 1 to 12',
    content: 'Parent-Teacher Conference scheduled for this Saturday from 9:00 AM to 1:00 PM. Parents are invited to discuss academic progress and report cards with class teachers.',
    date: '2026-03-18',
  },
  {
    _id: 'ann-4',
    title: 'District High Scorers & Merit Felicitations Announced',
    content: 'Heartiest congratulations to our Class 10 and 12 toppers for achieving distinction marks across Pipariya district. Special recognition awards will be presented on Saturday.',
    date: '2026-03-10',
  }
];

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAdmissionPopup, setShowAdmissionPopup] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const handleOpenModal = (image) => {
    setZoomLevel(1);
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setZoomLevel(1);
  };

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('mmps_announcements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Fallback
      }
    }
    return DEFAULT_ANNOUNCEMENTS;
  });

  const [galleryImages, setGalleryImages] = useState(() => {
    const saved = localStorage.getItem('mmps_gallery');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Fallback
      }
    }
    return DEFAULT_GALLERY_IMAGES;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAdmissionPopup(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    axios.get('/api/public/announcements')
      .then((res) => {
        if (isMounted && Array.isArray(res.data)) {
          setAnnouncements(res.data);
          localStorage.setItem('mmps_announcements', JSON.stringify(res.data));
        }
      })
      .catch(() => {});

    axios.get('/api/public/images')
      .then((res) => {
        if (isMounted && Array.isArray(res.data)) {
          setGalleryImages(res.data);
          localStorage.setItem('mmps_gallery', JSON.stringify(res.data));
        }
      })
      .catch(() => {});

    const unsubAnn = subscribeToUpdates('announcements', () => {
      axios.get('/api/public/announcements')
        .then((res) => {
          if (isMounted && Array.isArray(res.data)) {
            setAnnouncements(res.data);
            localStorage.setItem('mmps_announcements', JSON.stringify(res.data));
          }
        })
        .catch(() => {});
    });

    const unsubGal = subscribeToUpdates('gallery', () => {
      axios.get('/api/public/images')
        .then((res) => {
          if (isMounted && Array.isArray(res.data)) {
            setGalleryImages(res.data);
            localStorage.setItem('mmps_gallery', JSON.stringify(res.data));
          }
        })
        .catch(() => {});
    });

    return () => {
      isMounted = false;
      unsubAnn();
      unsubGal();
    };
  }, []);

  const displayedImages =
    activeCategory === 'All'
      ? galleryImages
      : galleryImages.filter(
          (img) => img.category?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="w-full bg-white">
      <AdmissionPopup
        isOpen={showAdmissionPopup}
        onClose={() => setShowAdmissionPopup(false)}
      />

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={handleCloseModal}
        >
          <button
            className="absolute top-6 right-6 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors border border-white/10"
            onClick={handleCloseModal}
            aria-label="Close Preview"
          >
            <X size={24} />
          </button>

          <div
            className="max-w-5xl w-full flex flex-col items-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-h-[70vh] overflow-auto flex items-center justify-center rounded-2xl"
              onWheel={(e) => {
                if (e.ctrlKey || e.metaKey) {
                  e.preventDefault();
                  setZoomLevel((prev) => Math.min(Math.max(0.5, prev - e.deltaY * 0.005), 4));
                }
              }}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-auto h-auto max-h-[68vh] object-contain rounded-2xl shadow-2xl border border-white/20 transition-transform duration-200 origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(0.5, prev - 0.25))}
                className="text-slate-300 hover:text-amber-400 p-1.5 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-white font-bold w-12 text-center text-xs tracking-wider">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(4, prev + 0.25))}
                className="text-slate-300 hover:text-amber-400 p-1.5 transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
            </div>

            <div className="text-center px-4">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-1">
                {selectedImage.category}
              </span>
              <h3 className="text-white text-xl sm:text-2xl font-bold tracking-tight">
                {selectedImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Video Container with Dark Gradient Mask */}
        <div className="absolute inset-0 z-0">
          <video
            src={heroVideo}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            className="w-full h-full object-cover select-none opacity-45 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-blue-950/65 to-slate-950"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/30 to-slate-950/90"></div>
        </div>

        {/* Audio Toggle Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-8 right-8 z-30 bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-xl p-3 rounded-full border border-white/15 transition-all duration-300 group shadow-xl hover:scale-105"
          title={isMuted ? "Unmute Background Sound" : "Mute Background Sound"}
          aria-label="Toggle Hero Sound"
        >
          {isMuted ? (
            <VolumeX className="text-slate-300 group-hover:text-amber-400 transition-colors" size={20} />
          ) : (
            <Volume2 className="text-amber-400 transition-colors animate-pulse" size={20} />
          )}
        </button>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto py-24 sm:py-28 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-amber-300 text-xs font-bold tracking-wider uppercase mb-8 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Admissions Open 2026-27 &bull; MPBSE Affiliated</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1] drop-shadow-xl">
            Empowering Young Minds,<br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Shaping the Future
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto font-normal leading-relaxed">
            Welcome to <span className="text-white font-semibold">Master Mind Public School, Pipariya</span>. Link learning to life through academic distinction, personal character, and modern holistic education.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-extrabold px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <span>Enroll Now</span>
              <ArrowRight size={16} />
            </a>
            <Link
              to="/about"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
            >
              <span>Explore Campus</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Overview Floating Bento Bar */}
      <section className="-mt-12 sm:-mt-16 relative z-30 px-4 max-w-6xl mx-auto mb-20">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0 shadow-sm">
                <Users size={26} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">5000+</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Students Enrolled</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
                <BookOpen size={26} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">50+</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Expert Educators</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-13 h-13 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                <Trophy size={26} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">100%</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Board Pass Rate</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 lg:pt-0 lg:px-4">
              <div className="w-13 h-13 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                <Target size={26} />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">20+</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Years of Legacy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Banner Section */}
      <section className="px-4 mb-20 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 relative cursor-pointer group transition-all duration-300 hover:shadow-3xl"
            onClick={() => handleOpenModal({ src: bannerImg, title: "MMPS Featured Banner", category: "Featured" })}
          >
            <img
              src={bannerImg}
              alt="MMPS Banner"
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
            />
            <div className="absolute top-4 right-4 bg-slate-950/70 backdrop-blur-md px-4 py-2 rounded-full text-xs text-white font-bold opacity-0 group-hover:opacity-100 transition-all pointer-events-none flex items-center gap-2 border border-white/10 shadow-lg">
              <ZoomIn size={14} className="text-amber-400" /> Click to Expand
            </div>
            <div className="absolute bottom-4 left-4 bg-slate-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300 border border-white/10 uppercase tracking-wider">
              Campus Spotlight
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Notice Board Section */}
      <section className="py-16 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Leadership Messages */}
            <div className="lg:col-span-2 space-y-8">
              <div className="mb-2">
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 block mb-1">
                  Guiding Philosophy
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Words from Our Leadership
                </h2>
              </div>

              {/* Director's Vision Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/70 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-amber-400/20 shadow-md bg-slate-100">
                      <img src={directorSirImg} alt="Director Mr. Lochan Sagar Prajapati" className="w-full h-full object-cover" />
                    </div>
                    <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm">
                      Director
                    </span>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className="text-xl font-extrabold text-slate-900">Mr. Lochan Sagar Prajapati</h3>
                      <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Director's Vision</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base italic">
                      "Our primary goal is to empower students with knowledge, strong character, and the skills necessary to thrive in an ever-changing world. We are fiercely committed to fostering an innovative educational environment that encourages critical thinking, community service, and a lifelong passion for excellence."
                    </p>
                  </div>
                </div>
              </div>

              {/* Principal's Desk Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/70 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-amber-400/20 shadow-md bg-slate-100">
                      <img src={principalImg} alt="Principal Mrs. Anita Prajapati" className="w-full h-full object-cover" />
                    </div>
                    <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm">
                      Principal
                    </span>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className="text-xl font-extrabold text-slate-900">Mrs. Anita Prajapati</h3>
                      <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Principal's Desk</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base italic mb-4">
                      "Education is not merely about accumulating facts, but preparing for life itself. At MMPS, we strive to ignite curiosity and a desire to excel in every child. Our holistic approach ensures that each student grows academically, morally, socially, and emotionally."
                    </p>
                    <Link to="/about" className="inline-flex text-blue-700 hover:text-blue-900 font-bold text-sm items-center gap-1.5 group">
                      <span>Read More About Our Mission</span>
                      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Announcements / Notice Board */}
            <div id="announcements" className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    <h3 className="text-xl font-extrabold text-white tracking-tight">Notice Board</h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                    Live
                  </span>
                </div>

                <div className="space-y-3.5">
                  {announcements.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">
                      <p>No active public notices currently posted.</p>
                    </div>
                  ) : (
                    announcements.slice(0, 4).map((ann) => (
                      <div
                        key={ann._id}
                        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 group cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                            {new Date(ann.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {ann.title}
                        </h4>
                        <p className="text-xs text-slate-300/80 mt-1 line-clamp-2 leading-relaxed">
                          {ann.content || ann.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <Link
                  to="/contact"
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/10 shadow-sm"
                >
                  <span>Need Assistance? Contact Office</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Campus Gallery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-amber-600 flex items-center gap-2 mb-2">
                <ImageIcon size={16} /> Campus Glimpses
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Life & Achievements at MMPS
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Campus', 'Achievement', 'Event', 'Leadership'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-slate-950 text-amber-400 shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedImages.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-slate-50/80 rounded-3xl border border-dashed border-slate-200">
                <ImageIcon size={40} className="mx-auto text-slate-400 mb-3" />
                <h3 className="text-base font-bold text-slate-700">No Photos In This Category</h3>
                <p className="text-xs text-slate-500 mt-1">Images added by management will appear here live.</p>
              </div>
            ) : (
              displayedImages.map((image, index) => (
                <div
                  key={image._id || image.imageUrl || index}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-md border border-slate-100 bg-slate-900 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  onClick={() => handleOpenModal({ src: image.imageUrl, title: image.caption, category: image.category })}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.caption}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = '/gallery/schoolphoto.png'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-amber-400 text-xs font-extrabold uppercase tracking-widest mb-1.5">
                      {image.category || 'Campus'}
                    </span>
                    <h3 className="text-white text-lg font-bold line-clamp-2 leading-snug">
                      {image.caption}
                    </h3>
                  </div>
                  <div className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold opacity-0 group-hover:opacity-100 transition-all border border-white/10 flex items-center gap-1">
                    <ZoomIn size={12} className="text-amber-400" /> ZOOM
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
