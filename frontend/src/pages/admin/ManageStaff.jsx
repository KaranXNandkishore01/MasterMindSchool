import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff } from '../../features/admin/adminSlice';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

const ManageStaff = () => {
  const dispatch = useDispatch();
  const { staff, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  const displayData = staff.length > 0 ? staff : [
    { _id: '1', firstName: 'Anita', lastName: 'Desai', subject: 'Mathematics', experience: '10 Years', qualification: 'M.Sc, B.Ed' },
    { _id: '2', firstName: 'Vikram', lastName: 'Singh', subject: 'Physics', experience: '8 Years', qualification: 'M.Sc, B.Ed' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Staff</h1>
        <button className="bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-all shadow-md">
          <Plus size={20} /> Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search staff..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-gray-200 rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Subjects</option>
              <option>Mathematics</option>
              <option>Science</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="py-4 px-6 font-medium">Name</th>
                <th className="py-4 px-6 font-medium">Subject</th>
                <th className="py-4 px-6 font-medium">Qualification</th>
                <th className="py-4 px-6 font-medium">Experience</th>
                <th className="py-4 px-6 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && <tr className="text-center"><td colSpan="5" className="py-8">Loading staff...</td></tr>}
              {!isLoading && displayData.map((s) => (
                <tr key={s._id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-800">{s.firstName} {s.lastName}</td>
                  <td className="py-4 px-6 text-blue-900 font-medium">{s.subject}</td>
                  <td className="py-4 px-6 text-gray-600">{s.qualification}</td>
                  <td className="py-4 px-6 text-gray-600">{s.experience}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 p-2 rounded-lg transition-colors"><Edit size={16} /></button>
                      <button className="text-red-500 hover:text-red-700 bg-red-100 hover:bg-red-200 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
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
export default ManageStaff;
