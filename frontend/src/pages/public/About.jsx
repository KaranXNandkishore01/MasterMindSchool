import { Award, Target, Eye, ShieldCheck } from 'lucide-react';
import schoolPhoto from '../../assets/schoolphoto.png';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-blue-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight uppercase">Building the Future, One Child at a Time</h1>
        <p className="text-blue-200 max-w-3xl mx-auto text-lg md:text-xl font-light">
          Master Mind Public School, Pipariya, was founded with a vision to create a learning environment that blends academic excellence with moral and social values.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-yellow-500 inline-block">Welcome to MMPS</h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                We are committed to shaping responsible, confident, and future-ready individuals who can thrive in a competitive world. Our journey is dedicated to the holistic development of every student who enters our gates.
              </p>
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-900">
                <p className="text-blue-900 font-medium italic">
                  "Education is not just about learning facts, but training the mind to think — and that’s what we do best at Master Mind."
                </p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[350px] border-4 border-white">
              <img src={schoolPhoto} alt="School Campus" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg text-center">
                <h3 className="text-3xl font-black text-blue-900 mb-1">30+</h3>
                <p className="text-sm font-bold text-gray-700 uppercase tracking-widest">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-3xl p-10 text-white shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <Target className="w-16 h-16 mb-6 text-yellow-400" />
            <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-blue-50 text-lg leading-relaxed">
              To provide quality education that empowers students intellectually, emotionally, and socially while instilling strong moral values and a lifelong love for learning.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-10 text-blue-950 shadow-xl transform hover:-translate-y-2 transition-all duration-300">
            <Eye className="w-16 h-16 mb-6 text-blue-900" />
            <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
            <p className="text-blue-950/80 text-lg leading-relaxed">
              To be a leading educational institution that transforms young minds into global citizens through innovation, discipline, and holistic development.
            </p>
          </div>
        </div>

        {/* Approach & Achievements */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <span className="bg-blue-100 p-2 rounded-lg text-blue-600">🏫</span> Our Approach
            </h3>
            <p className="text-gray-600 mb-6">We follow a student-centric approach where learning goes beyond textbooks. Our curriculum is designed to promote:</p>
            <ul className="grid grid-cols-1 gap-4">
              {['Conceptual understanding', 'Problem-solving skills', 'Creativity and collaboration', 'Leadership and character building'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl text-gray-700 font-medium">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <span className="bg-yellow-100 p-2 rounded-lg text-yellow-600">🏅</span> Achievements
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold">01</div>
                <div>
                  <h4 className="font-bold text-gray-800">State / District Topper</h4>
                  <p className="text-gray-600 text-sm">A moment of immense pride for our institution and community.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold">02</div>
                <div>
                  <h4 className="font-bold text-gray-800">Academic & Co-curricular Excellence</h4>
                  <p className="text-gray-600 text-sm">Consistently recognized for top-tier results and all-round student growth.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold">03</div>
                <div>
                  <h4 className="font-bold text-gray-800">Trusted for Over a Decade</h4>
                  <p className="text-gray-600 text-sm">A legacy built on trust and commitment with thousands of satisfied parents.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
