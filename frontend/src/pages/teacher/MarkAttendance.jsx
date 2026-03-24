import { useState } from 'react';
import { Check, X, Clock } from 'lucide-react';

const MarkAttendance = () => {
  const [selectedClass, setSelectedClass] = useState('X-A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const students = [
    { id: '1', roll: '101', name: 'Rohan Sharma', status: 'Present' },
    { id: '2', roll: '102', name: 'Priya Patel', status: 'Absent' },
    { id: '3', roll: '103', name: 'Amit Kumar', status: 'Present' },
    { id: '4', roll: '104', name: 'Neha Singh', status: 'Late' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mark Attendance</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-wrap gap-6 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none min-w-[200px]"
          >
            <option value="X-A">Class X-A</option>
            <option value="XII-Sci">Class XII-Sci</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-xl transition-colors">
          Fetch Students
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th className="py-4 px-6 font-medium">Roll No</th>
              <th className="py-4 px-6 font-medium">Student Name</th>
              <th className="py-4 px-6 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="py-4 px-6 font-medium text-gray-600">{s.roll}</td>
                <td className="py-4 px-6 font-bold text-gray-800">{s.name}</td>
                <td className="py-4 px-6 text-center">
                  <div className="flex justify-center gap-2">
                    <button className={`p-2 rounded-full border border-green-200 transition-colors ${s.status === 'Present' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'}`} title="Present">
                      <Check size={18} />
                    </button>
                    <button className={`p-2 rounded-full border border-red-200 transition-colors ${s.status === 'Absent' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`} title="Absent">
                      <X size={18} />
                    </button>
                    <button className={`p-2 rounded-full border border-yellow-200 transition-colors ${s.status === 'Late' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'}`} title="Late">
                      <Clock size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-xl shadow-md transition-all">
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
};
export default MarkAttendance;
