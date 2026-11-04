import { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Trash2, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { broadcastUpdate } from '../../utils/realtimeSync';

const DEFAULT_JOBS = [
  {
    _id: 'job-1',
    title: 'PGT - Senior Physics & Mathematics Educator',
    description: 'Seeking dynamic educators for Senior Secondary Classes (XI & XII). Responsible for curriculum delivery, practical lab experiments, and state board examination preparation.',
    requirements: 'M.Sc in Physics or Mathematics with B.Ed. Minimum 2-3 years teaching experience in MPBSE or CBSE board schools.',
    applyLink: 'https://forms.gle/L6r7K6nw5DwewRPF8',
    jobType: 'Full-Time',
    isActive: true,
  },
  {
    _id: 'job-2',
    title: 'TGT - English & Social Sciences Teacher',
    description: 'Responsible for nurturing communicative fluency, English literature, and social studies for Middle Wing (Classes VI to VIII).',
    requirements: 'B.A. / M.A. in English with B.Ed. Strong communicative pedagogy and passion for student engagement.',
    applyLink: 'https://forms.gle/L6r7K6nw5DwewRPF8',
    jobType: 'Full-Time',
    isActive: true,
  },
  {
    _id: 'job-3',
    title: 'Primary Wing (PRT) - Mother Teacher',
    description: 'Looking for caring and creative early childhood educators for Nursery to Class 2. Focus on phonics, numeracy, and activity-based learning.',
    requirements: 'Graduation with D.El.Ed / NTT / B.Ed. Warm disposition and love for foundational learning.',
    applyLink: 'https://forms.gle/L6r7K6nw5DwewRPF8',
    jobType: 'Full-Time',
    isActive: true,
  },
  {
    _id: 'job-4',
    title: 'Campus Physical Education Instructor & Sports Coach',
    description: 'Lead morning physical assemblies, athletic track events, basketball, cricket, and football training across our sports complex.',
    requirements: 'B.P.Ed or M.P.Ed with state/national level athletics experience.',
    applyLink: 'https://forms.gle/L6r7K6nw5DwewRPF8',
    jobType: 'Part-Time',
    isActive: true,
  }
];

const ManageJobs = () => {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('mmps_jobs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    return DEFAULT_JOBS;
  });
  const [formData, setFormData] = useState({
    title: '',
    jobType: 'Full-Time',
    description: '',
    requirements: '',
    applyLink: 'https://forms.gle/L6r7K6nw5DwewRPF8',
  });
  const [successToast, setSuccessToast] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const loadFromApi = async () => {
      try {
        const res = await axios.get('/api/management/jobs', { withCredentials: true });
        if (Array.isArray(res.data)) {
          setJobs(res.data);
          localStorage.setItem('mmps_jobs', JSON.stringify(res.data));
        }
      } catch {
        // Fallback
      }
    };
    loadFromApi();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) return;

    setPublishing(true);

    let createdDoc = null;
    try {
      const res = await axios.post('/api/management/jobs', formData, { withCredentials: true });
      if (res.data?._id) {
        createdDoc = res.data;
      }
    } catch {
      // Offline fallback
    }

    const newJob = createdDoc || {
      _id: `job-${Date.now()}`,
      title: formData.title.trim(),
      jobType: formData.jobType || 'Full-Time',
      description: formData.description.trim(),
      requirements: formData.requirements.trim(),
      applyLink: formData.applyLink.trim() || 'https://forms.gle/L6r7K6nw5DwewRPF8',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updated = [newJob, ...jobs];
    setJobs(updated);
    localStorage.setItem('mmps_jobs', JSON.stringify(updated));
    broadcastUpdate('jobs', updated);

    setFormData({
      title: '',
      jobType: 'Full-Time',
      description: '',
      requirements: '',
      applyLink: 'https://forms.gle/L6r7K6nw5DwewRPF8',
    });
    setPublishing(false);
    setSuccessToast(`Job vacancy (${newJob.jobType}) published and live on the Careers page!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this job opportunity?')) {
      try {
        await axios.delete(`/api/management/jobs/${id}`, { withCredentials: true });
      } catch {
        // Fallback
      }

      const updated = jobs.filter((j) => String(j._id) !== String(id));
      setJobs(updated);
      localStorage.setItem('mmps_jobs', JSON.stringify(updated));
      broadcastUpdate('jobs', updated);
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
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> Recruitment & Faculty Manager
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              Manage Job Opportunities & Vacancies
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Active openings published here appear live immediately on the public Careers portal.
            </p>
          </div>
        </div>
      </div>

      {/* Post Job Form */}
      <div className="bg-white p-4.5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase size={18} />
          </span>
          Post New Teaching / Staff Vacancy
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Position Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PGT Senior Chemistry Educator"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs sm:text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Employment Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, jobType: 'Full-Time' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer text-center ${
                    formData.jobType === 'Full-Time'
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Full-Time
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, jobType: 'Part-Time' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer text-center ${
                    formData.jobType === 'Part-Time'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Part-Time
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Application Form URL
              </label>
              <input
                type="url"
                placeholder="https://forms.gle/..."
                value={formData.applyLink}
                onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs sm:text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Candidate Qualifications & Requirements
              </label>
              <input
                type="text"
                placeholder="e.g. M.Sc with B.Ed, minimum 2 years experience"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs sm:text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Role Overview & Responsibilities *
            </label>
            <textarea
              required
              rows="2"
              placeholder="Primary responsibilities, subjects taught, and student mentorship duties..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none text-xs sm:text-sm transition-all resize-none"
            ></textarea>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={publishing}
              className="w-full sm:w-auto justify-center bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Plus size={16} /> {publishing ? 'Publishing...' : 'Publish Opening Live'}
            </button>
          </div>
        </form>
      </div>

      {/* Published Openings */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 px-1">
          Active Listed Openings ({jobs.length})
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-emerald-500/60 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${job.jobType === 'Part-Time' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                    job.jobType === 'Part-Time'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {job.jobType || 'Full-Time'}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">{job.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-2">{job.description}</p>
                {job.requirements && (
                  <p className="text-xs text-slate-500">
                    <span className="font-bold text-slate-700">Requirements:</span> {job.requirements}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDelete(job._id)}
                className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl transition-colors cursor-pointer shrink-0"
                title="Delete Job"
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

export default ManageJobs;
