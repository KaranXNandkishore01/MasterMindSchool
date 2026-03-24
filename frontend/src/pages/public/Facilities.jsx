import { Monitor, BookOpen, FlaskConical, Trophy, Bus, Coffee } from 'lucide-react';

const Facilities = () => {
  const facilities = [
    {
      title: "Smart Classrooms",
      icon: <Monitor className="w-10 h-10 text-blue-600" />,
      desc: "Fully air-conditioned classrooms equipped with interactive smart boards and high-speed internet to facilitate digital learning."
    },
    {
      title: "Science Laboratories",
      icon: <FlaskConical className="w-10 h-10 text-purple-600" />,
      desc: "State-of-the-art Physics, Chemistry, and Biology labs with advanced equipment ensuring practical, hands-on scientific education."
    },
    {
      title: "Central Library",
      icon: <BookOpen className="w-10 h-10 text-yellow-600" />,
      desc: "A quiet haven boasting over 15,000 physical books, journals, and a modern digital access section for online research."
    },
    {
      title: "Sports Complex",
      icon: <Trophy className="w-10 h-10 text-green-600" />,
      desc: "Extensive playgrounds for football and cricket, alongside dedicated courts for basketball, badminton, and indoor games."
    },
    {
      title: "Transport Fleet",
      icon: <Bus className="w-10 h-10 text-red-600" />,
      desc: "A modern fleet of GPS-enabled buses covering a 30km radius around Pipariya, ensuring safe commute for our students."
    },
    {
      title: "Cafeteria",
      icon: <Coffee className="w-10 h-10 text-orange-600" />,
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
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="bg-gray-50 p-4 rounded-xl inline-block mb-6 group-hover:bg-blue-50 transition-colors">
                {fac.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{fac.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {fac.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Facilities;
