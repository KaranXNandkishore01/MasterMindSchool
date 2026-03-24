const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-blue-900">1,248</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-2">Total Staff</h3>
          <p className="text-3xl font-bold text-blue-900">86</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-2">Fee Collection</h3>
          <p className="text-3xl font-bold text-green-600">82%</p>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
