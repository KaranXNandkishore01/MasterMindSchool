import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', requirements: '', applyLink: '' });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await axios.get('/api/management/jobs', { withCredentials: true });
    setJobs(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/management/jobs', formData, { withCredentials: true });
    setFormData({ title: '', description: '', requirements: '', applyLink: '' });
    fetchJobs();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job opportunity?')) {
      await axios.delete(`/api/management/jobs/${id}`, { withCredentials: true });
      fetchJobs();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-indigo-900 font-serif">Manage Job Opportunities</h1>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="bg-green-100 p-2 rounded-lg text-green-600">💼</span> Post New Opening
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Job Title</label>
            <input 
              type="text" 
              placeholder="e.g. Senior Mathematics Teacher" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full border p-3 rounded-2xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-indigo-500 outline-none" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
            <textarea 
              placeholder="Primary responsibilities and role overview..." 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full border p-4 rounded-2xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]" 
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Requirements</label>
            <textarea 
              placeholder="Necessary qualifications, experience, etc." 
              value={formData.requirements} 
              onChange={e => setFormData({...formData, requirements: e.target.value})} 
              className="w-full border p-4 rounded-2xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]" 
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Application Form Link (Google Form URL)</label>
            <input 
              type="url" 
              placeholder="https://forms.google.com/..." 
              value={formData.applyLink} 
              onChange={e => setFormData({...formData, applyLink: e.target.value})} 
              className="w-full border p-3 rounded-2xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div className="md:col-span-2 flex justify-end pt-2">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5">
              Create Job Listing
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {jobs.map(job => (
          <div key={job._id} className="group bg-white p-8 rounded-3xl shadow-md border border-gray-50 flex justify-between items-start transition-all hover:shadow-xl overflow-hidden">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-black text-xl text-gray-900 truncate">{job.title}</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {job.isActive ? 'Active' : 'Archived'}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">{job.description}</p>
              {job.applyLink && (
                <div className="flex items-start gap-2 text-indigo-600 text-xs font-bold border-t border-gray-100 pt-4 overflow-hidden">
                  <span className="p-1.5 bg-indigo-50 rounded-lg shrink-0">🔗</span> 
                  <span className="break-all pt-1 leading-normal">{job.applyLink}</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => handleDelete(job._id)}
              className="ml-4 p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0"
              title="Delete Opportunity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageJobs;
