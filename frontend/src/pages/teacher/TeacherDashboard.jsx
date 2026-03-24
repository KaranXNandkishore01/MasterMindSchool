const TeacherDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Teacher Dashboard</h1>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Today's Schedule</h2>
        <p className="text-gray-600">You have 4 classes scheduled for today.</p>
      </div>
    </div>
  );
};
export default TeacherDashboard;
