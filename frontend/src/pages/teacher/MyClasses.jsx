const MyClasses = () => {
  const dummyClasses = [
    { id: 1, name: 'Class X-A', subject: 'Mathematics', timing: '08:00 AM - 08:45 AM', students: 45 },
    { id: 2, name: 'Class XII-Sci', subject: 'Physics', timing: '09:30 AM - 10:15 AM', students: 38 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Classes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyClasses.map((cls) => (
          <div key={cls.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-blue-900">{cls.name}</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {cls.subject}
              </span>
            </div>
            <div className="space-y-2 text-gray-600">
              <p><strong>Timing:</strong> {cls.timing}</p>
              <p><strong>Total Students:</strong> {cls.students}</p>
            </div>
            <button className="mt-6 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 rounded-lg transition-colors border border-blue-200">
              View Student List
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyClasses;
