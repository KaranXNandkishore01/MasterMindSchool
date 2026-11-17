import { useState, useRef } from 'react';
import {
  X,
  User,
  GraduationCap,
  Users,
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react';

const CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

const SECTIONS = ['A', 'B', 'C'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'];

const AdmitStudentModal = ({ isOpen, onClose, onAdmit }) => {
  const [activeTab, setActiveTab] = useState('academic');
  const fileInputRef = useRef(null);

  // Pure manual state - NO prefilled dummy blood groups, phone numbers, or dates!
  const [formData, setFormData] = useState({
    // Academic
    class: '',
    section: 'A',
    stream: 'None',
    scholarNo: '',
    rollNo: '',
    admissionDate: new Date().toISOString().split('T')[0],
    academicYear: '2026-2027',

    // Student Demographics
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    bloodGroup: '',
    aadhaarNo: '',
    category: 'General',
    nationality: 'Indian',
    religion: '',
    studentPhone: '',
    studentEmail: '',
    photoUrl: '',

    // Parents & Guardians
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    fatherAadhaar: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    motherAadhaar: '',
    emergencyContact: '',
    emergencyRelation: '',
    parentEmail: '',
    address: '',
    permanentAddress: '',

    // Previous Schooling (Fresher vs Transfer)
    isFresher: true,
    previousSchool: '',
    previousClass: '',
    previousMarksheet: '',
    previousTcNo: '',
    previousTcDate: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formError) setFormError('');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (< 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setFormError('Student photo file size should be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photoUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const copyResidentialAddress = () => {
    setFormData((prev) => ({
      ...prev,
      permanentAddress: prev.address,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validation checks
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormError('Please provide both First Name and Last Name of the student.');
      setActiveTab('personal');
      return;
    }

    if (!formData.class) {
      setFormError('Please select the Enrolling Class.');
      setActiveTab('academic');
      return;
    }

    if (!formData.gender) {
      setFormError('Please select the Student Gender.');
      setActiveTab('personal');
      return;
    }

    if (!formData.dob) {
      setFormError('Please enter the Student Date of Birth.');
      setActiveTab('personal');
      return;
    }

    if (!formData.fatherName.trim()) {
      setFormError("Please enter the Father's Full Name.");
      setActiveTab('parents');
      return;
    }

    const primaryContact = formData.fatherPhone.trim() || formData.motherPhone.trim();
    if (!primaryContact) {
      setFormError("Please enter at least one parent contact number (Father's or Mother's Phone).");
      setActiveTab('parents');
      return;
    }

    if (!formData.address.trim()) {
      setFormError('Please provide the Residential Address.');
      setActiveTab('parents');
      return;
    }

    if (!formData.isFresher && !formData.previousSchool.trim()) {
      setFormError('For Transfer/Lateral students, please enter the Previous School Name.');
      setActiveTab('previous');
      return;
    }

    setIsSubmitting(true);
    try {
      // Normalize primary parent phone for compatibility
      const submissionData = {
        ...formData,
        parentPhone: formData.fatherPhone || formData.motherPhone || '',
        parentEmail: formData.parentEmail || formData.studentEmail || '',
      };
      await onAdmit(submissionData);
    } catch (err) {
      setFormError(err.message || 'Failed to submit admission. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-2xl border border-slate-100 relative animate-scale-in max-h-[94vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
              <Sparkles size={12} /> School ERP Admission Portal
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              Admit New Student (Session 2026-27)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in accurate student, parental, and academic records manually.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 my-4 bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'academic'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap size={14} />
            <span className="hidden sm:inline">1. Academic</span>
            <span className="sm:hidden">Acad</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User size={14} />
            <span className="hidden sm:inline">2. Student</span>
            <span className="sm:hidden">Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('parents')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'parents'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={14} />
            <span className="hidden sm:inline">3. Parents</span>
            <span className="sm:hidden">Parents</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('previous')}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'previous'
                ? 'bg-white text-blue-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText size={14} />
            <span className="hidden sm:inline">4. School History</span>
            <span className="sm:hidden">History</span>
          </button>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          {/* TAB 1: ACADEMIC & CLASS */}
          {activeTab === 'academic' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Enrolling Class *
                  </label>
                  <select
                    name="class"
                    required
                    value={formData.class}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="">Select Class *</option>
                    {CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Section *
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {SECTIONS.map((s) => (
                      <option key={s} value={s}>
                        Section {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Academic Stream (XI/XII)
                  </label>
                  <select
                    name="stream"
                    value={formData.stream}
                    onChange={handleChange}
                    disabled={!formData.class?.includes('11') && !formData.class?.includes('12')}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="None">None (General Curriculum)</option>
                    <option value="Science">Science (PCM / PCB)</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Humanities / Arts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Scholar / Admission No.
                  </label>
                  <input
                    type="text"
                    name="scholarNo"
                    value={formData.scholarNo}
                    onChange={handleChange}
                    placeholder="Leave blank to auto-generate"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    e.g. MMPS-2026-0048 (auto-assigned if left blank)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Roll Number
                  </label>
                  <input
                    type="number"
                    name="rollNo"
                    min="1"
                    max="100"
                    value={formData.rollNo}
                    onChange={handleChange}
                    placeholder="Auto-calculated if blank"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start gap-3 mt-4">
                <CheckCircle2 size={16} className="text-blue-700 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-900">
                  <span className="font-extrabold block">Automatic Fee Ledger Creation</span>
                  <span className="text-blue-700 text-[11px]">
                    Once submitted, the ERP system automatically attaches the official Class {formData.class || '...'} tuition fee schedule to the student ledger.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENT PERSONAL PROFILE */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-fade-in">
              {/* Photo Upload & Basic Names */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shadow-inner">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} alt="Student Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={28} className="text-slate-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <span className="text-xs font-extrabold text-slate-800 block">Student Photograph</span>
                  <span className="text-[11px] text-slate-500 block mb-2">
                    Upload a clean, passport-size photo (JPEG/PNG up to 2MB).
                  </span>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Upload size={13} /> {formData.photoUrl ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, photoUrl: '' }))}
                        className="px-2.5 py-1.5 text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g. Aryan"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Sharma"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="">Select Gender *</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Blood Group (Manual)
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="">Select Blood Group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Student Aadhaar Card No.
                  </label>
                  <input
                    type="text"
                    name="aadhaarNo"
                    maxLength={14}
                    value={formData.aadhaarNo}
                    onChange={handleChange}
                    placeholder="12-digit Aadhaar Number"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Religion / Faith
                  </label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    placeholder="e.g. Hindu, Muslim, Sikh..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Student Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="studentPhone"
                    value={formData.studentPhone}
                    onChange={handleChange}
                    placeholder="Optional student contact"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Student Personal Email
                  </label>
                  <input
                    type="email"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleChange}
                    placeholder="Optional email"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PARENTS & GUARDIANS */}
          {activeTab === 'parents' && (
            <div className="space-y-4 animate-fade-in">
              {/* Father Details */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  👨 Father's Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Father's Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Father's Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      name="fatherPhone"
                      value={formData.fatherPhone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Father's Aadhaar Card No.
                    </label>
                    <input
                      type="text"
                      name="fatherAadhaar"
                      maxLength={14}
                      value={formData.fatherAadhaar}
                      onChange={handleChange}
                      placeholder="12-digit Aadhaar Number"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Father's Occupation
                    </label>
                    <input
                      type="text"
                      name="fatherOccupation"
                      value={formData.fatherOccupation}
                      onChange={handleChange}
                      placeholder="e.g. Business, Agriculture, Govt Service"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Mother Details */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  👩 Mother's Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Mother's Full Name
                    </label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      placeholder="e.g. Sunita Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Mother's Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="motherPhone"
                      value={formData.motherPhone}
                      onChange={handleChange}
                      placeholder="e.g. +91 94250 12345"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Mother's Aadhaar Card No.
                    </label>
                    <input
                      type="text"
                      name="motherAadhaar"
                      maxLength={14}
                      value={formData.motherAadhaar}
                      onChange={handleChange}
                      placeholder="12-digit Aadhaar Number"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Mother's Occupation
                    </label>
                    <input
                      type="text"
                      name="motherOccupation"
                      value={formData.motherOccupation}
                      onChange={handleChange}
                      placeholder="e.g. Homemaker, Teacher, Doctor"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Current Residential Address *
                  </label>
                  <textarea
                    rows="2"
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House No., Street/Ward, Colony, Town/Village, Pipariya"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  ></textarea>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Permanent Address
                    </label>
                    <button
                      type="button"
                      onClick={copyResidentialAddress}
                      className="text-[11px] text-blue-700 font-bold hover:underline cursor-pointer"
                    >
                      Same as Residential
                    </button>
                  </div>
                  <textarea
                    rows="2"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    placeholder="Permanent family address (if different from residential)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PREVIOUS SCHOOL HISTORY & TC (FRESHER VS TRANSFER) */}
          {activeTab === 'previous' && (
            <div className="space-y-4 animate-fade-in">
              {/* Fresher Toggle Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase text-slate-900 block">
                      Fresher Student Enrollment?
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Toggle ON for Nursery, KG, Class 1 or students joining formal schooling for the first time.
                    </span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFresher"
                      checked={formData.isFresher}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {formData.isFresher ? (
                  <div className="mt-3.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>
                      <strong>Fresher Admission Selected:</strong> No previous marksheet or Transfer Certificate is required. The child's Birth Certificate will serve as primary age proof.
                    </span>
                  </div>
                ) : (
                  <div className="mt-3.5 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                    <span>
                      <strong>Transfer / Lateral Admission:</strong> Please fill in the previous school details, marksheet percentage, and Previous Transfer Certificate (TC) records below.
                    </span>
                  </div>
                )}
              </div>

              {/* Conditional Previous Schooling Inputs */}
              {!formData.isFresher && (
                <div className="space-y-3.5 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Previous School Name *
                    </label>
                    <input
                      type="text"
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleChange}
                      placeholder="e.g. St. Joseph Convent School, Pipariya"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Previous Class Passed / Studied
                      </label>
                      <input
                        type="text"
                        name="previousClass"
                        value={formData.previousClass}
                        onChange={handleChange}
                        placeholder="e.g. Class 8"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Previous Marksheet (% / Grade)
                      </label>
                      <input
                        type="text"
                        name="previousMarksheet"
                        value={formData.previousMarksheet}
                        onChange={handleChange}
                        placeholder="e.g. 84.5% - Grade A1"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Previous T.C. Serial Number
                      </label>
                      <input
                        type="text"
                        name="previousTcNo"
                        value={formData.previousTcNo}
                        onChange={handleChange}
                        placeholder="e.g. TC/2025/1102"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Previous T.C. Issue Date
                      </label>
                      <input
                        type="date"
                        name="previousTcDate"
                        value={formData.previousTcDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== 'academic' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'previous') setActiveTab('parents');
                    else if (activeTab === 'parents') setActiveTab('personal');
                    else if (activeTab === 'personal') setActiveTab('academic');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold cursor-pointer"
                >
                  Previous
                </button>
              )}

              {activeTab !== 'previous' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'academic') setActiveTab('personal');
                    else if (activeTab === 'personal') setActiveTab('parents');
                    else if (activeTab === 'parents') setActiveTab('previous');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer shadow"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Confirm & Admit Student'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmitStudentModal;
