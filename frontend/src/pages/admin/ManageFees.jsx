import { Plus, Search, CheckCircle, FileText } from 'lucide-react';

const ManageFees = () => {
  const dummyFees = [
    { _id: '1', student: 'Rohan Sharma', class: 'X-A', type: 'Tuition', amount: 5000, dueDate: '2026-04-10', status: 'Paid' },
    { _id: '2', student: 'Priya Patel', class: 'XII-Sci', type: 'Transport', amount: 1500, dueDate: '2026-04-15', status: 'Pending' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Fees</h1>
        <button className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md">
          <Plus size={20} /> Generate Fee Record
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-blue-500 border-gray-100">
          <h3 className="text-gray-500 font-medium mb-1">Total Expected (April)</h3>
          <p className="text-3xl font-bold text-gray-800">₹4,25,000</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-green-500 border-gray-100">
          <h3 className="text-gray-500 font-medium mb-1">Total Collected</h3>
          <p className="text-3xl font-bold text-gray-800">₹3,10,000</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-l-4 border-l-red-500 border-gray-100">
          <h3 className="text-gray-500 font-medium mb-1">Pending Dues</h3>
          <p className="text-3xl font-bold text-gray-800">₹1,15,000</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by student or class..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-gray-200 rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Statuses</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-medium">Student</th>
                <th className="py-4 px-6 font-medium">Class</th>
                <th className="py-4 px-6 font-medium">Fee Type</th>
                <th className="py-4 px-6 font-medium">Amount</th>
                <th className="py-4 px-6 font-medium">Due Date</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dummyFees.map((f) => (
                <tr key={f._id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-800">{f.student}</td>
                  <td className="py-4 px-6 text-gray-600">{f.class}</td>
                  <td className="py-4 px-6 text-gray-600">{f.type}</td>
                  <td className="py-4 px-6 font-semibold text-gray-800">₹{f.amount}</td>
                  <td className="py-4 px-6 text-gray-600">{f.dueDate}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${f.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      {f.status === 'Pending' && <button className="text-green-600 hover:text-green-800 bg-green-100 hover:bg-green-200 p-2 rounded-lg transition-colors" title="Mark Paid"><CheckCircle size={16} /></button>}
                      <button className="text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 p-2 rounded-lg transition-colors" title="Generate Receipt"><FileText size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ManageFees;
