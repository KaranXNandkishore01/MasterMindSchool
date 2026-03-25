import { Award, Target, Eye, ShieldCheck } from 'lucide-react';
import schoolPhoto from '../../assets/schoolphoto.png';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-blue-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">About MMPS Pipariya</h1>
        <p className="text-blue-200 max-w-2xl mx-auto text-lg">A legacy of excellence in education, shaping minds and building character since 1990.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our History</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Master Mind Public Higher Secondary School was established with a singular vision: to provide quality education accessible to all. Located in the heart of Pipariya, our campus has grown from a humble beginning into a premier educational institution.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Over the decades, we have consistently produced top-ranking students who have gone on to excel in various professional fields across the globe. Our commitment to holistic education remains unwavering.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[300px] border-4 border-white">
              <img src={schoolPhoto} alt="School Campus" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg text-center">
                <h3 className="text-3xl font-black text-blue-900 mb-1">30+</h3>
                <p className="text-sm font-bold text-gray-700">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-8 text-blue-950 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
            <Eye className="w-12 h-12 mb-6 text-blue-900" />
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="font-medium text-blue-900/80 leading-relaxed">
              To be a center of excellence that nurtures intellectual curiosity, social responsibility, and global awareness among the leaders of tomorrow.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
            <Target className="w-12 h-12 mb-6 text-yellow-400" />
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="font-medium text-blue-100 leading-relaxed">
              To provide a dynamic and inclusive learning environment that empowers students to achieve their full potential academically, artistically, and athletically.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
            <ShieldCheck className="w-12 h-12 mb-6 text-white" />
            <h3 className="text-2xl font-bold mb-4">Core Values</h3>
            <ul className="space-y-3 font-medium text-green-50">
              <li className="flex items-center gap-2"><Award size={16}/> Integrity & Honesty</li>
              <li className="flex items-center gap-2"><Award size={16}/> Respect for Diversity</li>
              <li className="flex items-center gap-2"><Award size={16}/> Lifelong Learning</li>
              <li className="flex items-center gap-2"><Award size={16}/> Community Service</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
