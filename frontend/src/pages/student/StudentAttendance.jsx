import { Calendar as CalendarIcon, CheckCircle2, XCircle } from 'lucide-react';

const StudentAttendance = () => {
  const attendanceData = [
    { date: '2026-03-20', status: 'Present' },
    { date: '2026-03-21', status: 'Present' },
    { date: '2026-03-22', status: 'Absent' },
    { date: '2026-03-23', status: 'Present' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Attendance</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <span className="text-2xl font-bold">92%</span>
          </div>
          <div>
            <h3 className="text-gray-500 font-medium text-lg">Overall Attendance</h3>
            <p className="text-gray-800 font-bold">Excellent</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
           <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h3 className="text-gray-500 font-medium text-lg">Days Present</h3>
            <p className="text-gray-800 font-bold">145 / 158 Days</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
          <CalendarIcon className="text-blue-500" />
          <h2 className="text-xl font-bold text-gray-800">Recent Records</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
              <th className="py-4 px-6 font-medium">Date</th>
              <th className="py-4 px-6 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {attendanceData.map((record, index) => (
              <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-gray-800">{record.date}</td>
                <td className="py-4 px-6 text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default StudentAttendance;
