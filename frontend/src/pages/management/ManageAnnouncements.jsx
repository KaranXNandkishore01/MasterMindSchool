import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await axios.get('/api/management/announcements', { withCredentials: true });
    setAnnouncements(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/management/announcements', formData, { withCredentials: true });
    setFormData({ title: '', content: '' });
    fetchAnnouncements();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      await axios.delete(`/api/management/announcements/${id}`, { withCredentials: true });
      fetchAnnouncements();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900 font-serif text-center md:text-left">Manage Announcements</h1>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-10">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">📢</span> Post New Announcement
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Title (e.g. Summer Vacation Notice)" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            className="w-full border p-3 rounded-2xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-indigo-500 outline-none" 
            required 
          />
          <textarea 
            placeholder="Detailed Announcement Message" 
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})} 
            className="w-full border p-4 rounded-2xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]" 
            required
          ></textarea>
          <div className="flex justify-end">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5">
              Publish Announcement
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 px-2">Published Notices</h2>
        {announcements.map(ann => (
          <div key={ann._id} className="group bg-white p-6 rounded-3xl shadow-md border border-gray-50 flex justify-between items-start transition-all hover:shadow-xl hover:border-indigo-100">
            <div className="flex-1">
              <h3 className="font-black text-xl text-indigo-950 mb-2 truncate pr-4">{ann.title}</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
              <span className="text-xs text-gray-400 mt-4 block font-medium">
                {new Date(ann.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <button 
              onClick={() => handleDelete(ann._id)}
              className="ml-4 p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        {announcements.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No announcements found. Start by adding one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAnnouncements;
