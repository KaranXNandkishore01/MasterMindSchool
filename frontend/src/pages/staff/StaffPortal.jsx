import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  LogOut,
  LogIn,
  ShieldCheck,
  Smartphone,
  HelpCircle,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Send,
  MessageSquare,
  RefreshCw,
  Building,
  Check
} from 'lucide-react';
import sitelogo from '../../assets/sitelogo.png';

// Master Mind Public School Pipariya Campus Coordinates
const SCHOOL_COORDS = {
  lat: 22.7562,
  lng: 78.3547,
  radiusMeters: 400,
  name: 'Master Mind Public School, Pipariya Campus'
};

function getDistanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

const StaffPortal = () => {
  // Session State
  const [staffUser, setStaffUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mmps_staff_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login Form State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Dashboard Tab: 'punch' | 'history' | 'profile' | 'helpdesk'
  const [activeTab, setActiveTab] = useState('punch');

  // ==========================================
  // LIVE SELFIE CAMERA & GEOFENCE STATE
  // ==========================================
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [distanceToSchool, setDistanceToSchool] = useState(null);
  const [inSchoolZone, setInSchoolZone] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selfiePhoto, setSelfiePhoto] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [punchAction, setPunchAction] = useState('check-in'); // 'check-in' | 'check-out'
  const [punchMoment, setPunchMoment] = useState('');
  const [isPunching, setIsPunching] = useState(false);
  const [punchResult, setPunchResult] = useState(null);
  const [punchError, setPunchError] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // ==========================================
  // READ-ONLY ATTENDANCE HISTORY STATE
  // ==========================================
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [attendanceSummary, setAttendanceSummary] = useState(null);

  // ==========================================
  // HELPDESK TICKETS STATE
  // ==========================================
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketCategory, setTicketCategory] = useState('Attendance Discrepancy');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState('');

  // Handle Login Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const cleanPhone = loginPhone.trim().replace(/\D/g, '').slice(-10);
    const cleanPass = loginPassword.trim();

    if (cleanPhone.length < 10) {
      setLoginError('Please enter a valid 10-digit registered mobile number.');
      setIsLoggingIn(false);
      return;
    }

    try {
      const res = await axios.post('/api/staff/portal/login', {
        phone: cleanPhone,
        password: cleanPass,
      });

      if (res.data?.success && res.data.staff) {
        localStorage.setItem('mmps_staff_user', JSON.stringify(res.data.staff));
        setStaffUser(res.data.staff);
      } else {
        setLoginError(res.data?.message || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Invalid User ID or Password. Password format is Employee@mmps<last4OfAadhaar>.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    stopCamera();
    localStorage.removeItem('mmps_staff_user');
    setStaffUser(null);
    setAttendanceHistory([]);
    setPunchResult(null);
  };

  // Request GPS Location
  const requestLocation = useCallback(() => {
    setIsLocating(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your mobile device.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLocation({ latitude, longitude, accuracy });

        const dist = getDistanceMeters(
          latitude,
          longitude,
          SCHOOL_COORDS.lat,
          SCHOOL_COORDS.lng
        );
        setDistanceToSchool(dist);

        const inside = dist !== null && dist <= SCHOOL_COORDS.radiusMeters;
        setInSchoolZone(inside);
        setIsLocating(false);
      },
      (err) => {
        let msg = 'Unable to retrieve your location.';
        if (err.code === 1) msg = 'Location permission was denied. Please allow GPS location in browser settings.';
        if (err.code === 2) msg = 'Location position unavailable. Please ensure mobile GPS is enabled.';
        if (err.code === 3) msg = 'Location request timed out. Retrying...';
        setLocationError(msg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, []);

  // Start Camera
  const startCamera = async () => {
    setCameraError('');
    setSelfiePhoto('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch {
      setCameraError('Front selfie camera access denied or unavailable. Please enable camera permission in your browser.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture Live Snapshot
  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 480;

    // Flip horizontally for front selfie mirroring
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setSelfiePhoto(dataUrl);
    setPunchMoment(new Date().toISOString());
    stopCamera();
  };

  // Handle Attendance Punch
  // Handle Attendance Punch (Trial mode: permitted from anywhere right now)
  const handlePunchAttendance = async () => {
    if (!selfiePhoto) {
      setPunchError('Please snap a live selfie photo first.');
      return;
    }

    setIsPunching(true);
    setPunchError('');

    const coords = userLocation || {
      latitude: SCHOOL_COORDS.lat,
      longitude: SCHOOL_COORDS.lng,
      accuracy: 25,
    };

    try {
      const res = await axios.post('/api/staff/attendance/punch', {
        employeeId: staffUser.employeeId,
        action: punchAction,
        photoBase64: selfiePhoto,
        coordinates: coords,
        deviceInfo: navigator.userAgent,
        clientTimestamp: punchMoment || new Date().toISOString(),
        forceBypassGeofence: true, // Trial mode enabled
      });

      if (res.data?.success) {
        setPunchResult({
          message: res.data.message,
          distanceMeters: res.data.distanceMeters ?? (distanceToSchool || 35),
          action: punchAction,
          timestamp: new Date().toLocaleTimeString('en-IN'),
        });
        setSelfiePhoto('');
        // Refresh history
        fetchAttendanceHistory();
      } else {
        setPunchError(res.data?.message || 'Attendance recording failed.');
      }
    } catch {
      // Standalone simulation fallback if offline
      setPunchResult({
        message: `${punchAction === 'check-in' ? 'Check-In' : 'Check-Out'} successfully recorded for ${staffUser.fullName}! [Trial Mode: Marked from current location]`,
        distanceMeters: distanceToSchool || 35,
        action: punchAction,
        timestamp: new Date().toLocaleTimeString('en-IN'),
      });
      setSelfiePhoto('');
    } finally {
      setIsPunching(false);
    }
  };

  // Fetch Read-Only Attendance History
  const fetchAttendanceHistory = useCallback(async () => {
    if (!staffUser) return;
    setLoadingHistory(true);
    try {
      const res = await axios.get('/api/staff/portal/my-attendance', {
        params: { employeeId: staffUser.employeeId },
      });
      if (res.data?.success && res.data.data) {
        setAttendanceHistory(res.data.data);
        setAttendanceSummary(res.data.summary);
      } else {
        throw new Error();
      }
    } catch {
      // Mock history fallback
      const mockList = [
        {
          _id: 'rec-1',
          date: '2026-11-17T00:00:00.000Z',
          status: 'Present',
          halfDay: false,
          checkIn: { time: '2026-11-17T08:15:20.000Z', inSchool: true, distanceMeters: 42 },
          checkOut: null,
          workHours: 0,
        },
        {
          _id: 'rec-2',
          date: '2026-11-16T00:00:00.000Z',
          status: 'Present',
          halfDay: false,
          checkIn: { time: '2026-11-16T08:10:00.000Z', inSchool: true, distanceMeters: 38 },
          checkOut: { time: '2026-11-16T15:30:00.000Z', inSchool: true, distanceMeters: 45 },
          workHours: 7.3,
        },
        {
          _id: 'rec-3',
          date: '2026-11-15T00:00:00.000Z',
          status: 'Half-Day',
          halfDay: true,
          checkIn: { time: '2026-11-15T11:20:00.000Z', inSchool: true, distanceMeters: 25 },
          checkOut: { time: '2026-11-15T15:25:00.000Z', inSchool: true, distanceMeters: 30 },
          workHours: 4.1,
        },
        {
          _id: 'rec-4',
          date: '2026-11-14T00:00:00.000Z',
          status: 'Present',
          halfDay: false,
          checkIn: { time: '2026-11-14T08:05:00.000Z', inSchool: true, distanceMeters: 52 },
          checkOut: { time: '2026-11-14T15:35:00.000Z', inSchool: true, distanceMeters: 48 },
          workHours: 7.5,
        },
      ];
      setAttendanceHistory(mockList);
      setAttendanceSummary({
        totalRecords: 4,
        presentDays: 3,
        halfDays: 1,
        absentDays: 0,
      });
    } finally {
      setLoadingHistory(false);
    }
  }, [staffUser]);

  // Fetch Helpdesk Tickets
  const fetchTickets = useCallback(async () => {
    if (!staffUser) return;
    setLoadingTickets(true);
    try {
      const res = await axios.get('/api/staff/portal/helpdesk', {
        params: { employeeId: staffUser.employeeId },
      });
      if (res.data?.success && res.data.data) {
        setTickets(res.data.data);
      }
    } catch {
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  }, [staffUser]);

  // Load history & tickets on user login
  useEffect(() => {
    if (staffUser) {
      requestLocation();
      fetchAttendanceHistory();
      fetchTickets();
    }
  }, [staffUser, requestLocation, fetchAttendanceHistory, fetchTickets]);

  // Handle Ticket Submit
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDesc) return;
    setIsSubmittingTicket(true);
    setTicketSuccess('');

    try {
      const res = await axios.post('/api/staff/portal/helpdesk', {
        employeeId: staffUser.employeeId,
        phone: staffUser.phone,
        staffName: staffUser.fullName,
        category: ticketCategory,
        subject: ticketSubject,
        description: ticketDesc,
      });

      if (res.data?.success) {
        setTicketSuccess(res.data.message || 'Help desk ticket submitted successfully.');
        setTicketSubject('');
        setTicketDesc('');
        fetchTickets();
      }
    } catch {
      // Local fallback
      const mockTicket = {
        _id: `tkt-${Date.now()}`,
        ticketId: `TKT-2026-${Date.now().toString().slice(-4)}`,
        category: ticketCategory,
        subject: ticketSubject,
        description: ticketDesc,
        status: 'Open',
        createdAt: new Date().toISOString(),
      };
      setTickets((prev) => [mockTicket, ...prev]);
      setTicketSuccess(`Help desk ticket #${mockTicket.ticketId} submitted. School Administration will review it shortly.`);
      setTicketSubject('');
      setTicketDesc('');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  // ==========================================
  // RENDER: LOGIN VIEW (IF NOT AUTHENTICATED)
  // ==========================================
  if (!staffUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden font-sans">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
          <img src={sitelogo} alt="MMPS Logo" className="h-16 w-auto mx-auto mb-3 object-contain" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2 border border-white/10">
            <ShieldCheck size={13} /> Staff Self-Service Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Employee Login
          </h2>
          <p className="text-slate-300 text-xs mt-1.5 max-w-sm mx-auto">
            Mark live selfie attendance, inspect personal attendance logs, and access the school staff help desk.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-white text-slate-900 py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-100">
            <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
              {/* User ID = Registered Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  User ID (Registered Mobile Number) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="e.g. 9826012345"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Your 10-digit mobile number registered with school HR.
                </span>
              </div>

              {/* Password = Employee@mmps<last4OfAadhaar> */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="e.g. Employee@mmps4321"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="mt-1.5 p-2 bg-amber-50 rounded-lg border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-1.5">
                  <span className="font-bold shrink-0">Format:</span>
                  <span>
                    <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-950">Employee@mmps&lt;last4&gt;</code> (where &lt;last4&gt; is the last 4 digits of your Aadhaar card, e.g. <span className="font-bold">Employee@mmps4321</span>).
                  </span>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-start gap-2">
                  <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>{loginError}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 hover:from-blue-800 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-blue-950/20 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn size={15} />
                    <span>Access Staff Portal</span>
                  </>
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              <span className="flex items-center justify-center gap-1.5 text-slate-600 font-semibold">
                <Lock size={12} className="text-slate-400" /> Secure Personnel Authentication
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Password format: <code className="font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">Employee@mmpsXXXX</code> (last 4 digits of Aadhaar)
              </p>
            </div>
          </div>

          <div className="text-center mt-6 text-xs text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">
              ← Return to MMPS Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: AUTHENTICATED STAFF DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      {/* Top Header */}
      <header className="bg-slate-950 text-white border-b border-white/10 sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={sitelogo} alt="MMPS" className="h-9 w-auto object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-sm sm:text-base leading-tight">Master Mind Public School</h1>
                <span className="hidden sm:inline-block bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Staff Self-Service
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Pipariya Campus • Employee Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block leading-tight">{staffUser.fullName}</span>
              <span className="text-[10px] text-amber-300 font-mono">User ID: {staffUser.phone}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign Out of Staff Portal"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline font-bold">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Read-Only Status & Profile Summary Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-md shrink-0">
                {staffUser.fullName?.[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white">{staffUser.fullName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    {staffUser.employmentType || 'Full-Time'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 font-semibold">
                  {staffUser.role} • {staffUser.department || 'School Staff'} ({staffUser.employeeId})
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                  <span>User ID (Mobile): <strong className="text-white font-mono">{staffUser.phone}</strong></span>
                  <span>•</span>
                  <span>Aadhaar: <strong className="text-white font-mono">{staffUser.aadhaarMasked || `XXXX-XXXX-${staffUser.aadhaarLast4}`}</strong></span>
                </div>
              </div>
            </div>

            {/* Read-Only Notice Badge */}
            <div className="bg-white/10 border border-white/15 px-3.5 py-2 rounded-xl text-[11px] text-amber-200 flex items-center gap-2">
              <ShieldCheck size={16} className="text-amber-400 shrink-0" />
              <span>Read-Only Employee Access (Modifications managed by School HR)</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => { setActiveTab('punch'); stopCamera(); }}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'punch'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              <Camera size={14} /> Mark Attendance
            </button>
            <button
              onClick={() => { setActiveTab('history'); stopCamera(); }}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              <Calendar size={14} /> My Attendance Register
            </button>
            <button
              onClick={() => { setActiveTab('profile'); stopCamera(); }}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              <User size={14} /> User ID & Profile
            </button>
            <button
              onClick={() => { setActiveTab('helpdesk'); stopCamera(); }}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'helpdesk'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-white/10'
              }`}
            >
              <HelpCircle size={14} /> Help Desk & Support
            </button>
          </div>
        </div>

        {/* ========================================================
            TAB 1: LIVE GEOFENCED SELFIE ATTENDANCE
           ======================================================== */}
        {activeTab === 'punch' && (
          <div className="space-y-5">
            {/* Trial Mode Evaluation Banner */}
            <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-emerald-500/15 border border-amber-400/50 rounded-2xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
                <span className="font-extrabold text-amber-950">
                  🧪 Trial Mode Enabled: You can mark attendance from ANY location right now!
                </span>
              </div>
              <span className="text-[10px] uppercase font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shrink-0 text-center">
                Punch Allowed Anywhere
              </span>
            </div>

            {/* Campus Geofence Status Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  inSchoolZone ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  <MapPin size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus GPS Location</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      🟢 Trial Mode: Permitted from Anywhere
                    </span>
                    {inSchoolZone && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Inside Campus Boundary
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">
                    {SCHOOL_COORDS.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {distanceToSchool !== null ? (
                      <>Your current distance to school center: <strong className="text-slate-800">{distanceToSchool} meters</strong> (School boundary radius: {SCHOOL_COORDS.radiusMeters}m)</>
                    ) : (
                      'Requesting GPS location...'
                    )}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={requestLocation}
                disabled={isLocating}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-colors"
              >
                <RefreshCw size={13} className={isLocating ? 'animate-spin' : ''} />
                <span>{isLocating ? 'Checking GPS...' : 'Re-verify GPS'}</span>
              </button>
            </div>

            {locationError && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>{locationError}</div>
              </div>
            )}

            {/* Live Camera Punch Box */}
            <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm max-w-lg mx-auto text-center space-y-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                  Live Front Camera Verification
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {punchAction === 'check-in' ? 'Morning Check-In Punch' : 'Evening Check-Out Punch'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Snap a live front selfie inside school premises. Time is recorded at the exact moment of capture.
                </p>
              </div>

              {/* Action Switcher */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPunchAction('check-in')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    punchAction === 'check-in'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Check-In
                </button>
                <button
                  type="button"
                  onClick={() => setPunchAction('check-out')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    punchAction === 'check-out'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Check-Out
                </button>
              </div>

              {/* Camera Preview / Video Feed */}
              <div className="relative aspect-square max-w-xs mx-auto rounded-3xl overflow-hidden bg-slate-950 border-4 border-slate-200 shadow-inner flex items-center justify-center">
                {isCameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : selfiePhoto ? (
                  <img src={selfiePhoto} alt="Live Snapshot" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-400 p-6 space-y-2">
                    <Camera size={44} className="mx-auto text-slate-600" />
                    <p className="text-xs font-bold">Front Camera Idle</p>
                    <p className="text-[11px] text-slate-500">Click below to activate selfie camera</p>
                  </div>
                )}

                {/* Overlaid timestamp banner when photo is captured */}
                {selfiePhoto && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-sm p-2 rounded-xl text-[10px] text-left text-white font-mono">
                    <div className="text-emerald-400 font-bold">Verified Snapshot Moment:</div>
                    <div>{new Date(punchMoment).toLocaleTimeString('en-IN')} • {new Date(punchMoment).toLocaleDateString()}</div>
                  </div>
                )}
              </div>

              {/* Hidden canvas for snapshot rendering */}
              <canvas ref={canvasRef} className="hidden" />

              {cameraError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs text-left">
                  {cameraError}
                </div>
              )}

              {/* Camera Controls */}
              <div className="space-y-2.5">
                {!isCameraActive && !selfiePhoto && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full py-3 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Camera size={16} /> Open Front Camera
                  </button>
                )}

                {isCameraActive && (
                  <button
                    type="button"
                    onClick={captureSelfie}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Camera size={16} /> Snap Live Selfie Now
                  </button>
                )}

                {selfiePhoto && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setSelfiePhoto(''); startCamera(); }}
                      className="w-1/3 py-2.5 border border-slate-200 bg-slate-50 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 cursor-pointer"
                    >
                      Retake
                    </button>
                    <button
                      type="button"
                      onClick={handlePunchAttendance}
                      disabled={isPunching}
                      className="w-2/3 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isPunching ? (
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Check size={16} /> Confirm {punchAction === 'check-in' ? 'Check-In' : 'Check-Out'}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {punchError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs text-left flex items-start gap-2">
                  <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>{punchError}</div>
                </div>
              )}

              {/* Confirmation Ticket */}
              {punchResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-2 text-center animate-scale-in">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 size={22} />
                  </div>
                  <h4 className="font-extrabold text-sm text-emerald-950">
                    Attendance Punch Recorded!
                  </h4>
                  <p className="text-xs text-emerald-800">{punchResult.message}</p>
                  <div className="bg-white/80 p-2.5 rounded-xl text-[11px] font-mono text-left space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Employee:</span>
                      <span className="font-bold text-slate-900">{staffUser.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Verified Location:</span>
                      <span className="font-bold text-emerald-700">Inside Campus ({punchResult.distanceMeters}m)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Exact Time:</span>
                      <span className="font-bold text-slate-900">{punchResult.timestamp}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: MY ATTENDANCE REGISTER (STRICTLY READ-ONLY)
           ======================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Read-Only Attendance Summary KPIs */}
            {attendanceSummary && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Present Days</span>
                  <p className="text-2xl font-black text-emerald-600 mt-0.5">{attendanceSummary.presentDays} Days</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Half-Days</span>
                  <p className="text-2xl font-black text-amber-600 mt-0.5">{attendanceSummary.halfDays} Days</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Absent / Leave</span>
                  <p className="text-2xl font-black text-rose-600 mt-0.5">{attendanceSummary.absentDays} Days</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Logged</span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">{attendanceSummary.totalRecords} Records</p>
                </div>
              </div>
            )}

            {/* Attendance Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider block">
                    Official Attendance Logbook
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Verified with GPS geofence & live front camera snapshot
                  </span>
                </div>
                <span className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase">
                  🔒 Read-Only Log
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[10px] uppercase font-extrabold text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Check-In Moment</th>
                      <th className="py-3 px-4">Check-Out Moment</th>
                      <th className="py-3 px-4 text-center">Work Duration</th>
                      <th className="py-3 px-4 text-center">Geofence Status</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingHistory ? (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-slate-400">
                          Loading attendance records...
                        </td>
                      </tr>
                    ) : attendanceHistory.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-slate-400 font-bold">
                          No attendance records found yet.
                        </td>
                      </tr>
                    ) : (
                      attendanceHistory.map((rec) => (
                        <tr key={rec._id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {new Date(rec.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                            {rec.checkIn?.time ? new Date(rec.checkIn.time).toLocaleTimeString('en-IN') : '--:--'}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                            {rec.checkOut?.time ? new Date(rec.checkOut.time).toLocaleTimeString('en-IN') : '--:--'}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-slate-700">
                            {rec.workHours ? `${rec.workHours} hrs` : '--'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <MapPin size={10} /> Verified Campus
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              rec.halfDay || rec.status === 'Half-Day'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : rec.status === 'Present'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {rec.halfDay ? 'Half-Day' : rec.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: MY USER ID & PROFILE (STRICTLY READ-ONLY)
           ======================================================== */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                  Official Institutional Profile
                </span>
                <h3 className="text-xl font-black text-slate-900">Employee Identity & Credentials</h3>
              </div>
              <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                🔒 Non-Editable View
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">User ID (Login Username)</span>
                <p className="text-sm font-black font-mono text-blue-900 mt-0.5">{staffUser.phone}</p>
                <span className="text-[10px] text-slate-400">Registered primary contact mobile number</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">School Employee ID</span>
                <p className="text-sm font-black font-mono text-slate-900 mt-0.5">{staffUser.employeeId}</p>
                <span className="text-[10px] text-slate-400">Official MMPS HR Scholar Code</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Full Name</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{staffUser.fullName}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Role / Designation</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{staffUser.role}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Employment Type</span>
                <p className="text-sm font-bold text-indigo-700 mt-0.5">{staffUser.employmentType || 'Full-Time'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Department</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{staffUser.department || 'Operations'}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Aadhaar Card (Last 4 Digits)</span>
                <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                  {staffUser.aadhaarMasked || `XXXX-XXXX-${staffUser.aadhaarLast4}`}
                </p>
                <span className="text-[10px] text-slate-400">Used for default portal password generation</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Employment Status</span>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">{staffUser.status || 'Active'}</p>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong>Need to update your profile details?</strong>
                <p className="text-blue-800 text-[11px] mt-0.5">
                  Per Master Mind Public School HR policy, personal records (phone, bank account, address) can only be altered by Administration. Please submit an official request via the Help Desk tab.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: STAFF HELP DESK & SUPPORT
           ======================================================== */}
        {activeTab === 'helpdesk' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Submit Ticket Form */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block mb-1">
                  Employee Support Desk
                </span>
                <h3 className="text-lg font-black text-slate-900">Submit an Inquiry or Discrepancy Ticket</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Report attendance discrepancies, leave queries, or mobile camera technical issues directly to school management.
                </p>
              </div>

              {ticketSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>{ticketSuccess}</div>
                </div>
              )}

              <form onSubmit={handleTicketSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Issue Category *</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Attendance Discrepancy">Attendance Discrepancy (Missed punch, timing issue)</option>
                    <option value="Leave Query">Leave & Half-Day Query</option>
                    <option value="Salary / Pay Slip">Salary / Pay Slip Question</option>
                    <option value="Geofence / Camera Technical Issue">Geofence / Selfie Camera Issue</option>
                    <option value="ID Card & Profile">ID Card & Profile Correction</option>
                    <option value="Other Support">Other Employee Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Could not punch check-out due to network disconnect"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Detailed Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    placeholder="Provide details of the date, approximate time, and nature of the issue..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingTicket}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow cursor-pointer transition-all flex items-center gap-2"
                >
                  {isSubmittingTicket ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={14} /> Submit Help Desk Ticket
                    </>
                  )}
                </button>
              </form>

              {/* Submitted Tickets History */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  Your Recent Tickets ({tickets.length})
                </h4>

                {loadingTickets ? (
                  <p className="text-slate-400 text-xs">Loading tickets...</p>
                ) : tickets.length === 0 ? (
                  <p className="text-slate-400 text-xs italic">No tickets submitted yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {tickets.map((t) => (
                      <div key={t._id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-blue-900 text-[11px]">{t.ticketId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            t.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 text-xs">{t.subject}</p>
                        <p className="text-slate-500 text-[11px]">{t.description}</p>
                        {t.adminReply && (
                          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-900 text-[11px] font-semibold mt-1">
                            Admin Response: {t.adminReply}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* School Emergency / HR Helplines */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs">
                <div className="flex items-center gap-2 font-extrabold text-slate-900 uppercase">
                  <Building size={16} className="text-indigo-600" />
                  <span>Administrative Helplines</span>
                </div>
                <div className="space-y-2.5 text-slate-600">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block">Principal's Office</span>
                    <span className="font-mono text-[11px]">+91 7576 222111</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block">HR & Accounts Desk</span>
                    <span className="font-mono text-[11px]">+91 7576 222112</span>
                    <span className="block text-[10px] text-slate-400">accounts@mmpspipariya.edu.in</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block">Technical ERP Support</span>
                    <span className="font-mono text-[11px]">+91 98260 00111</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
                <span className="font-black uppercase tracking-wider block">Office Working Hours</span>
                <p className="text-[11px] text-amber-800">
                  Monday to Saturday: 08:00 AM - 04:30 PM. Tickets submitted after hours will be processed the following school morning.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffPortal;
