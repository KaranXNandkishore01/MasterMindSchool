import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ParentMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const res = await axios.get('/api/management/messages', { withCredentials: true });
    setMessages(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message permanently?')) {
      await axios.delete(`/api/management/messages/${id}`, { withCredentials: true });
      fetchMessages();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-indigo-900 font-serif">Parent & Contact Messages</h1>
      
      <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-medium italic">
            No messages found.
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg._id} className="group relative border border-gray-100 p-6 rounded-3xl bg-gray-50/50 hover:bg-white transition-all hover:shadow-2xl hover:border-indigo-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-xl text-indigo-950 mb-1">{msg.subject || 'Inquiry'}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1 font-semibold text-gray-700">👤 {msg.name}</span>
                    <span className="flex items-center gap-1">✉️ {msg.email}</span>
                    <span className="flex items-center gap-1">📞 {msg.phone}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(msg._id)}
                  className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  title="Delete Message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed bg-white/50 p-4 rounded-2xl border border-gray-100 italic">
                "{msg.message}"
              </p>
              <div className="flex justify-between items-center mt-6">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">
                  Received: {new Date(msg.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}
                </span>
                {!msg.isRead && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase rounded-full animate-pulse">
                    New Message
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParentMessages;
