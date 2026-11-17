import { useState, useRef, useEffect } from 'react';
import {
  X,
  User,
  GraduationCap,
  Users,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Save
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

const EditStudentModal = ({ student, isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('academic');
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    class: '',
    section: 'A',
    stream: 'None',
    scholarNo: '',
    rollNo: '',
    admissionDate: '',
    academicYear: '2026-2027',

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

    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    fatherAadhaar: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    motherAadhaar: '',
    parentEmail: '',
    address: '',
    permanentAddress: '',

    isFresher: true,
    previousSchool: '',
    previousClass: '',
    previousMarksheet: '',
    previousTcNo: '',
    previousTcDate: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        class: student.class || '',
        section: student.section || 'A',
        stream: student.stream || 'None',
        scholarNo: student.scholarNo || '',
        rollNo: student.rollNo || '',
        admissionDate: student.admissionDate ? new Date(student.admissionDate).toISOString().split('T')[0] : '',
        academicYear: student.academicYear || '2026-2027',

        firstName: student.firstName || '',
        lastName: student.lastName || '',
        gender: student.gender || '',
        dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
        bloodGroup: student.bloodGroup || '',
        aadhaarNo: student.aadhaarNo || '',
        category: student.category || 'General',
        nationality: student.nationality || 'Indian',
        religion: student.religion || '',
        studentPhone: student.studentPhone || '',
        studentEmail: student.studentEmail || '',
        photoUrl: student.photoUrl || '',

        fatherName: student.fatherName || '',
        fatherOccupation: student.fatherOccupation || '',
        fatherPhone: student.fatherPhone || student.parentPhone || '',
        fatherAadhaar: student.fatherAadhaar || '',
        motherName: student.motherName || '',
        motherOccupation: student.motherOccupation || '',
        motherPhone: student.motherPhone || '',
        motherAadhaar: student.motherAadhaar || '',
        parentEmail: student.parentEmail || '',
        address: student.address || '',
        permanentAddress: student.permanentAddress || student.address || '',

        isFresher: student.isFresher ?? true,
        previousSchool: student.previousSchool || '',
        previousClass: student.previousClass || '',
        previousMarksheet: student.previousMarksheet || '',
        previousTcNo: student.previousTcNo || '',
        previousTcDate: student.previousTcDate ? new Date(student.previousTcDate).toISOString().split('T')[0] : '',
      });
      setFormError('');
    }
  }, [student]);

  if (!isOpen || !student) return null;

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

    if (file.size > 2 * 1024 * 1024) {
      setFormError('Photo file size should be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photoUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormError('Please enter both First Name and Last Name.');
      setActiveTab('personal');
      return;
    }

    if (!formData.class) {
      setFormError('Please select a Class.');
      setActiveTab('academic');
      return;
    }

    if (!formData.fatherName.trim()) {
      setFormError("Father's Name is required.");
      setActiveTab('parents');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        section: formData.section.toUpperCase(),
        parentPhone: formData.fatherPhone || formData.motherPhone || '',
        parentEmail: formData.parentEmail || formData.studentEmail || '',
      };
      await onSave(student._id, payload);
    } catch (err) {
      setFormError(err.message || 'Failed to update student details.');
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
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Scholar ID: {student.scholarNo}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-1">
              Edit Student Record
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update academic, demographic, parental, or previous schooling credentials.
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
            <span className="hidden sm:inline">2. Student Profile</span>
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
          {/* TAB 1: ACADEMIC & ENROLLMENT */}
          {activeTab === 'academic' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Class *
                  </label>
                  <select
                    name="class"
                    required
                    value={formData.class}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="">Select Class</option>
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
                    <option value="None">None (General)</option>
                    <option value="Science">Science (PCM/PCB)</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Humanities / Arts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Scholar Number
                  </label>
                  <input
                    type="text"
                    name="scholarNo"
                    value={formData.scholarNo}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                  />
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
            </div>
          )}

          {/* TAB 2: STUDENT PROFILE */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
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

                <div className="flex-1 text-center sm:text-left">
                  <span className="text-xs font-extrabold text-slate-800 block">Student Photograph</span>
                  <div className="flex items-center gap-2 justify-center sm:justify-start mt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Upload size={13} /> {formData.photoUrl ? 'Replace Photo' : 'Upload Photo'}
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Blood Group
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
                    Religion
                  </label>
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
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
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PARENTS & GUARDIANS */}
          {activeTab === 'parents' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-black uppercase text-slate-800 block">Father Information</span>
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Father's Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      name="fatherPhone"
                      value={formData.fatherPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Father's Aadhaar Number
                    </label>
                    <input
                      type="text"
                      name="fatherAadhaar"
                      maxLength={14}
                      value={formData.fatherAadhaar}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white outline-none focus:ring-2 focus:ring-blue-600"
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-black uppercase text-slate-800 block">Mother Information</span>
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Mother's Phone
                    </label>
                    <input
                      type="tel"
                      name="motherPhone"
                      value={formData.motherPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Mother's Aadhaar Number
                    </label>
                    <input
                      type="text"
                      name="motherAadhaar"
                      maxLength={14}
                      value={formData.motherAadhaar}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono bg-white outline-none focus:ring-2 focus:ring-blue-600"
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
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Current Residential Address
                  </label>
                  <textarea
                    rows="2"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Permanent Address
                  </label>
                  <textarea
                    rows="2"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PREVIOUS SCHOOLING */}
          {activeTab === 'previous' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase text-slate-900 block">
                    Fresher Student Enrollment?
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Toggle ON if joining formal schooling for the first time.
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

              {!formData.isFresher && (
                <div className="space-y-3.5 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Previous School Name
                    </label>
                    <input
                      type="text"
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Previous Class Passed
                      </label>
                      <input
                        type="text"
                        name="previousClass"
                        value={formData.previousClass}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Marksheet (% / Grade)
                      </label>
                      <input
                        type="text"
                        name="previousMarksheet"
                        value={formData.previousMarksheet}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Previous T.C. Number
                      </label>
                      <input
                        type="text"
                        name="previousTcNo"
                        value={formData.previousTcNo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono outline-none focus:ring-2 focus:ring-blue-600"
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
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-600"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Save size={15} />
              <span>{isSubmitting ? 'Saving Changes...' : 'Save & Update Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
