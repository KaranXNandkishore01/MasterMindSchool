import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageImages = () => {
  const [images, setImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await axios.get('/api/management/images', { withCredentials: true });
    setImages(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('caption', caption);
    if (file) {
      formData.append('image', file);
    }

    try {
      await axios.post('/api/management/images', formData, { 
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCaption('');
      setFile(null);
      // Reset the file input manually if needed, or just let the state handle it
      fetchImages();
    } catch (error) {
      alert(error.response?.data?.message || 'Error uploading image');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this image?')) {
      await axios.delete(`/api/management/images/${id}`, { withCredentials: true });
      fetchImages();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900 font-serif">Campus Gallery Management</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Image</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Upload from System</label>
            <input 
              type="file" 
              onChange={e => setFile(e.target.files[0])} 
              className="w-full border p-2 rounded-xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-1">Caption</label>
            <input 
              type="text" 
              placeholder="e.g. Annual Sports Day 2026" 
              value={caption} 
              onChange={e => setCaption(e.target.value)} 
              className="w-full border p-2.5 rounded-xl bg-gray-50 focus:bg-white transition-all focus:ring-2 focus:ring-indigo-500 outline-none" 
              required 
            />
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5">
            Add to Gallery
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map(img => (
          <div key={img._id} className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300">
            <div className="relative aspect-video overflow-hidden">
              <img src={img.imageUrl} alt={img.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <button 
                onClick={() => handleDelete(img._id)}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                title="Delete Image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="font-bold text-gray-800 line-clamp-2">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageImages;
