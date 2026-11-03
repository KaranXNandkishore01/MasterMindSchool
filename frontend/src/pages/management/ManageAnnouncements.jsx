import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Trash2, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { broadcastUpdate } from '../../utils/realtimeSync';

const DEFAULT_ANNOUNCEMENTS = [
  {
    _id: 'ann-1',
    title: 'Admissions Open for Session 2026-27 (Nursery to Class XII)',
    content: 'Master Mind Public School (MPBSE Affiliated) welcomes applications for the upcoming 2026-27 session. Merit scholarships, state-of-the-art digital classrooms, and safe bus transport are available. Register online or visit our campus office.',
    date: new Date('2026-04-02').toISOString(),
    createdAt: new Date('2026-04-02').toISOString()
  },
  {
    _id: 'ann-2',
    title: 'Annual Inter-House Sports Championship 2026',
    content: 'Campus athletic sports complex will host track and field events, cricket, badminton, and kho-kho trials this Wednesday. Students must report in full sports uniform.',
    date: new Date('2026-03-25').toISOString(),
    createdAt: new Date('2026-03-25').toISOString()
  },
  {
    _id: 'ann-3',
    title: 'Quarterly Parent-Teacher Meeting (PTM) for Classes 1 to 12',
    content: 'Parent-Teacher Conference scheduled for this Saturday from 9:00 AM to 1:00 PM. Parents are invited to discuss academic progress and report cards with class teachers.',
    date: new Date('2026-03-18').toISOString(),
    createdAt: new Date('2026-03-18').toISOString()
  },
  {
    _id: 'ann-4',
    title: 'District High Scorers & Merit Felicitations Announced',
    content: 'Heartiest congratulations to our Class 10 and 12 toppers for achieving distinction marks across Pipariya district. Special recognition awards will be presented on Saturday.',
    date: new Date('2026-03-10').toISOString(),
    createdAt: new Date('2026-03-10').toISOString()
  }
];

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('mmps_announcements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    return DEFAULT_ANNOUNCEMENTS;
  });
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [successToast, setSuccessToast] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const loadFromApi = async () => {
      try {
        const res = await axios.get('/api/management/announcements', { withCredentials: true });
        if (Array.isArray(res.data)) {
          setAnnouncements(res.data);
          localStorage.setItem('mmps_announcements', JSON.stringify(res.data));
        }
      } catch {
        // Fallback
      }
    };
    loadFromApi();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setPublishing(true);

    let createdDoc = null;
    try {
      const res = await axios.post('/api/management/announcements', formData, { withCredentials: true });
      if (res.data?._id) {
        createdDoc = res.data;
      }
    } catch {
      // Offline fallback
    }

    const newAnn = createdDoc || {
      _id: `ann-${Date.now()}`,
      title: formData.title.trim(),
      content: formData.content.trim(),
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('mmps_announcements', JSON.stringify(updated));
    broadcastUpdate('announcements', updated);

    setFormData({ title: '', content: '' });
    setPublishing(false);
    setSuccessToast('Announcement published and live on the public notice board!');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement from live board?')) {
      try {
        await axios.delete(`/api/management/announcements/${id}`, { withCredentials: true });
      } catch {
        // Fallback
      }

      const updated = announcements.filter((a) => String(a._id) !== String(id));
      setAnnouncements(updated);
      localStorage.setItem('mmps_announcements', JSON.stringify(updated));
      broadcastUpdate('announcements', updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-emerald-400">
          <CheckCircle2 size={20} />
          <span className="font-semibold text-sm">{successToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-8 border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Live Notice Board Manager
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manage Announcements & Circulars
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Notices published here appear immediately in real-time on the homepage live notice board.
            </p>
          </div>
        </div>
      </div>

      {/* Post Notice Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bell size={18} />
          </span>
          Post New Announcement
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Notice Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Summer Vacation Schedule & Remedial Classes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Notice Description & Details *
            </label>
            <textarea
              required
              rows="3"
              placeholder="Write the full announcement text for students and parents..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={publishing}
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus size={16} /> {publishing ? 'Publishing...' : 'Publish Announcement Live'}
            </button>
          </div>
        </form>
      </div>

      {/* Published Notices List */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 px-1">
          Currently Live Notices ({announcements.length})
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {announcements.map((ann) => (
            <div
              key={ann._id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-amber-400/60 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                    {new Date(ann.date || ann.createdAt).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">{ann.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{ann.content || ann.message}</p>
              </div>

              <button
                onClick={() => handleDelete(ann._id)}
                className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl transition-colors cursor-pointer shrink-0"
                title="Delete Notice"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageAnnouncements;
