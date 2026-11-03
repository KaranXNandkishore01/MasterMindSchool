import { useState, useEffect } from 'react';
import axios from 'axios';
import { Image as ImageIcon, Trash2, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { broadcastUpdate } from '../../utils/realtimeSync';

const DEFAULT_GALLERY = [
  {
    _id: 'img-1',
    imageUrl: '/gallery/schoolphoto.png',
    caption: 'Main Academic Campus & Courtyard, Pipariya',
    category: 'Campus',
  },
  {
    _id: 'img-2',
    imageUrl: '/gallery/sportcmplex.png',
    caption: 'Inter-House Sports Complex & Playground',
    category: 'Event',
  },
  {
    _id: 'img-3',
    imageUrl: '/gallery/classrooms.png',
    caption: 'Modern Digital Smart Classrooms',
    category: 'Campus',
  },
  {
    _id: 'img-4',
    imageUrl: '/gallery/computerlab.png',
    caption: 'Advanced Computer Science & IT Lab',
    category: 'Campus',
  },
  {
    _id: 'img-5',
    imageUrl: '/gallery/library.png',
    caption: 'Central Knowledge & Reading Library',
    category: 'Campus',
  },
  {
    _id: 'img-6',
    imageUrl: '/gallery/Directorsir.png',
    caption: 'Director Mr. Lochan Sagar Prajapati Guiding Educators',
    category: 'Leadership',
  },
  {
    _id: 'img-7',
    imageUrl: '/gallery/felicitation_1.jpg',
    caption: 'Hon. District Collector Felicitating MMPS Students',
    category: 'Achievement',
  },
  {
    _id: 'img-8',
    imageUrl: '/gallery/Ourtechers.png',
    caption: 'Dedicated Faculty & Educators of Master Mind Public School',
    category: 'Leadership',
  },
];

const ManageImages = () => {
  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem('mmps_gallery');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Fallback
      }
    }
    return DEFAULT_GALLERY;
  });
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Campus');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [successToast, setSuccessToast] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadFromApi = async () => {
      try {
        const res = await axios.get('/api/management/images', { withCredentials: true });
        if (Array.isArray(res.data)) {
          setImages(res.data);
          localStorage.setItem('mmps_gallery', JSON.stringify(res.data));
        }
      } catch {
        // Fallback
      }
    };
    loadFromApi();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !file && !imageUrl) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('category', category);
    if (file) {
      formData.append('image', file);
    } else if (imageUrl) {
      formData.append('imageUrl', imageUrl);
    }

    let previewUrl = imageUrl;
    if (file) {
      previewUrl = URL.createObjectURL(file);
    }

    let createdItem = null;
    try {
      const res = await axios.post('/api/management/images', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?._id) {
        createdItem = res.data;
      }
    } catch {
      // Offline fallback
    }

    const newImg = createdItem || {
      _id: `img-${Date.now()}`,
      imageUrl: previewUrl || '/gallery/schoolphoto.png',
      caption: caption || 'Campus Photograph',
      category: category || 'Campus',
      createdAt: new Date().toISOString(),
    };

    const updated = [newImg, ...images];
    setImages(updated);
    localStorage.setItem('mmps_gallery', JSON.stringify(updated));
    broadcastUpdate('gallery', updated);

    setCaption('');
    setImageUrl('');
    setFile(null);
    setUploading(false);
    setSuccessToast('Photo added and live in the school gallery!');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this photo from the gallery?')) {
      try {
        await axios.delete(`/api/management/images/${id}`, { withCredentials: true });
      } catch {
        // Fallback
      }

      const updated = images.filter((img) => String(img._id) !== String(id));
      setImages(updated);
      localStorage.setItem('mmps_gallery', JSON.stringify(updated));
      broadcastUpdate('gallery', updated);
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <ImageIcon size={24} />
            </span>
            Campus Gallery Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Upload and curate high-resolution photos that automatically update across the public website gallery.
          </p>
        </div>
      </div>

      {/* Add New Photo Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-amber-500" size={18} />
          <h2 className="text-lg font-extrabold text-slate-900">Upload New Photo</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Caption / Description *
              </label>
              <input
                type="text"
                required
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Annual Sports Day 100m Sprint Finals"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
              >
                <option value="Campus">Campus</option>
                <option value="Achievement">Achievement</option>
                <option value="Event">Event</option>
                <option value="Leadership">Leadership</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Option A: Upload Image File
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none text-sm text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Option B: Or Direct Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... or /gallery/..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-3 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus size={16} />
              <span>{uploading ? 'Publishing...' : 'Add Photo to Gallery'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Live Photos List */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 px-1">
          Currently Live Photos ({images.length})
        </h2>

        {images.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
            No photos in the gallery currently. Use the form above to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div
                key={img._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all"
              >
                <div className="relative aspect-video bg-slate-100 overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.src = '/gallery/schoolphoto.png'; }}
                  />
                  <span className="absolute top-2 left-2 bg-slate-950/70 text-amber-300 backdrop-blur-sm text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                    {img.category || 'Campus'}
                  </span>
                </div>

                <div className="p-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{img.caption}</p>
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Delete Photo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageImages;
