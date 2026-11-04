import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Trash2, CheckCircle2, Phone, Sparkles } from 'lucide-react';
import { subscribeToUpdates, broadcastUpdate } from '../../utils/realtimeSync';

const DEFAULT_MESSAGES = [
  {
    _id: 'msg-1',
    name: 'Sunita Patel',
    email: 'sunita.patel@gmail.com',
    phone: '+91 98264 51230',
    subject: 'Admission inquiry for Class IX Science Stream',
    message: 'Hello, I want to inquire about admission for my son for the upcoming 2026-27 session. What are the documents required and entrance test dates?',
    createdAt: new Date('2026-04-12T10:30:00').toISOString(),
    isRead: false
  },
  {
    _id: 'msg-2',
    name: 'Rajesh Mehra',
    email: 'rajesh.mehra@yahoo.com',
    phone: '+91 94250 88210',
    subject: 'School bus transport routes towards Sobhapur',
    message: 'Respected Principal, please confirm if the school bus stops near Sobhapur bypass road for primary classes.',
    createdAt: new Date('2026-04-10T14:15:00').toISOString(),
    isRead: true
  }
];

const ParentMessages = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('mmps_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    return DEFAULT_MESSAGES;
  });

  useEffect(() => {
    let isMounted = true;

    axios.get('/api/management/messages', { withCredentials: true })
      .then((res) => {
        if (isMounted && Array.isArray(res.data)) {
          setMessages(res.data);
          localStorage.setItem('mmps_messages', JSON.stringify(res.data));
        }
      })
      .catch(() => {});

    const unsub = subscribeToUpdates('messages', () => {
      axios.get('/api/management/messages', { withCredentials: true })
        .then((res) => {
          if (isMounted && Array.isArray(res.data)) {
            setMessages(res.data);
            localStorage.setItem('mmps_messages', JSON.stringify(res.data));
          }
        })
        .catch(() => {});
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message permanently?')) {
      try {
        await axios.delete(`/api/management/messages/${id}`, { withCredentials: true });
      } catch {
        // Fallback
      }

      const updated = messages.filter((m) => String(m._id) !== String(id));
      setMessages(updated);
      localStorage.setItem('mmps_messages', JSON.stringify(updated));
      broadcastUpdate('messages', updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> Parent Helpdesk & Inquiries
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              Parent & Admission Inquiries
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Direct inquiries and contact forms submitted through the public portal.
            </p>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-slate-400 font-semibold border border-slate-200">
            No parent messages recorded yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white p-4.5 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm hover:border-teal-500/50 transition-all flex flex-col sm:flex-row justify-between gap-4 sm:gap-5 items-start"
            >
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                    <Mail size={16} />
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">{msg.subject || 'General Inquiry'}</h3>
                  {!msg.isRead && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                  <span className="text-slate-800 font-bold">👤 {msg.name}</span>
                  <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">
                    ✉️ {msg.email}
                  </a>
                  <a href={`tel:${msg.phone}`} className="flex items-center gap-1 text-slate-600 hover:text-slate-900">
                    <Phone size={12} /> {msg.phone}
                  </a>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 leading-relaxed italic">
                  "{msg.message}"
                </p>

                <div className="text-[11px] text-slate-400 font-semibold">
                  Received on {new Date(msg.createdAt).toLocaleDateString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <button
                onClick={() => handleDelete(msg._id)}
                className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl transition-colors cursor-pointer shrink-0"
                title="Delete Inquiry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParentMessages;
