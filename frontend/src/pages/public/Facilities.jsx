import { Monitor, BookOpen, FlaskConical, Trophy, Bus, Coffee, Palette, Cpu } from 'lucide-react';
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
      desc: "Fully air-conditioned classrooms equipped with interactive smart boards and high-speed internet to facilitate digital learning."
    },
    {
      title: "Computer Laboratory",
      image: computerLabImg,
      desc: "Advanced computing facility with latest hardware and software, promoting digital literacy and technical skills."
    },
    {
      title: "Science Laboratories",
      image: labsImg,
      desc: "State-of-the-art Physics, Chemistry, and Biology labs with advanced equipment ensuring practical, hands-on scientific education."
    },
    {
      title: "Central Library",
      image: libraryImg,
      desc: "A quiet haven boasting over 15,000 physical books, journals, and a modern digital access section for online research."
    },
    {
      title: "Sports Complex",
      image: sportsImg,
      desc: "Extensive playgrounds for football and cricket, alongside dedicated courts for basketball, badminton, and indoor games."
    },
    {
      title: "Art & Design Studio",
      image: artImg,
      desc: "A creative space for students to explore their artistic talents in painting, sculpture, and digital design."
    },
    {
      title: "Transport Fleet",
      image: transportImg,
      desc: "A modern fleet of GPS-enabled buses covering a 30km radius around Pipariya, ensuring safe commute for our students."
    },
    {
      title: "Cafeteria",
      image: cafeteriaImg,
      desc: "Hygienic and spacious cafeteria providing nutritious meals and snacks prepared under strict quality guidelines."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-blue-900 py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">World-Class Facilities</h1>
        <p className="text-blue-200 max-w-2xl mx-auto text-lg">Infrastructure designed to support and enhance the holistic development of our students.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 hover:shadow-xl transition-all duration-300 group overflow-hidden">
              <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
                <img 
                  src={fac.image} 
                  alt={fac.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{fac.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {fac.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Admissions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-t-4 border-yellow-500">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-4 tracking-tight">
              Join the Master Mind Family – Admissions Open for 2026-27!
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We welcome students who are eager to learn, grow, and become the best versions of themselves. At Master Mind Public School, we ensure a smooth, transparent, and parent-friendly admission process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">📚</span> Classes Offered
              </h3>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li><strong className="text-gray-800">Nursery to Class XII</strong></li>
                <li><strong className="text-gray-800">Streams Available for Senior Secondary:</strong> Science | Commerce | Arts</li>
                <li><strong className="text-gray-800">Session Begins:</strong> First week of July</li>
              </ul>

              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">📋</span> Documents Required
              </h3>
              <ul className="space-y-2 text-gray-600 list-disc list-inside">
                <li>Birth Certificate (for Nursery to Class I)</li>
                <li>Transfer Certificate (for Class II and above)</li>
                <li>Previous Year’s Report Card</li>
                <li>Aadhar Card (Student & Parent)</li>
                <li>Passport-size Photographs (4 copies)</li>
                <li>Caste Certificate (if applicable)</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">🧾</span> Admission Process
              </h3>
              <div className="space-y-4 text-gray-700">
                <p><strong>Step 1:</strong> <a href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">Fill the enquiry or registration form online</a> or visit the school office</p>
                <p><strong>Step 2:</strong> Attend a short interaction/entrance (as per class)</p>
                <p><strong>Step 3:</strong> Submit required documents</p>
                <p><strong>Step 4:</strong> Pay the admission fees and confirm your seat</p>
              </div>

              <div className="mt-8 pt-8 border-t border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">💳</span> Fee Structure
                </h3>
                <p className="text-gray-600 mb-4">
                  Fee details can be obtained from the school office or requested via our contact form.
                </p>
                <p className="text-sm font-semibold text-blue-800 flex items-start gap-2">
                  <span className="text-lg">🎯</span> Scholarships and concessions available for meritorious students and siblings.
                </p>
                <div className="mt-6">
                  <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdcsCPrfDn5Xafwkq_xi5JiZygyOk_v3dvTOIsBjYzSEZGMrw/viewform" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block bg-blue-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors shadow-md"
                  >
                    Register Online Now
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center bg-blue-900 text-white py-6 rounded-xl shadow-md">
            <p className="text-xl font-bold italic">
              “A school that invests in your child's future — Choose Master Mind today!”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Facilities;
