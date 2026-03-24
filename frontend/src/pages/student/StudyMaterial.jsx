import { FileText, Download, BookOpen } from 'lucide-react';

const StudyMaterial = () => {
  const materials = [
    { id: 1, title: 'Physics Chapter 4 Notes', subject: 'Physics', type: 'PDF', size: '2.4 MB', date: 'Mar 20, 2026' },
    { id: 2, pass: 'Chemistry Integration Formulas', subject: 'Chemistry', type: 'Document', size: '1.1 MB', date: 'Mar 18, 2026' },
    { id: 3, title: 'Maths Previous Year Papers', subject: 'Mathematics', type: 'ZIP', size: '15.0 MB', date: 'Mar 15, 2026' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Study Material</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
           <div className="flex gap-2">
             <select className="border border-gray-200 rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
               <option>All Subjects</option>
               <option>Physics</option>
               <option>Chemistry</option>
               <option>Mathematics</option>
             </select>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((m) => (
            <div key={m.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-blue-50/30 group cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">{m.title || m.pass}</h3>
              <p className="text-sm text-blue-600 font-semibold mb-3">{m.subject}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-500 mb-6">
                <span>{m.type} • {m.size}</span>
                <span>{m.date}</span>
              </div>
              
              <button className="w-full bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Download size={16} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default StudyMaterial;
