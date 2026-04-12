import React from 'react';

const ManagementDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900">Management Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
        <h2 className="text-xl font-semibold mb-4">Welcome to MMPS Management Portal</h2>
        <p className="text-gray-600">Use the sidebar to navigate the different modules (Announcements, Jobs, Gallery, Messages).</p>
      </div>
    </div>
  );
};

export default ManagementDashboard;
