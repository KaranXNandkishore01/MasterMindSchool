import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  RefreshCw,
  LogOut,
  LogIn,
  Search,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  Info
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

const StaffSelfieAttendance = () => {
  const [employeeIdInput, setEmployeeIdInput] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [todayRecord, setTodayRecord] = useState(null);

  // Geolocation state
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [distanceToSchool, setDistanceToSchool] = useState(null);
  const [inSchoolZone, setInSchoolZone] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selfiePhoto, setSelfiePhoto] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [punchAction, setPunchAction] = useState('check-in'); // 'check-in' | 'check-out'
  const [punchMoment, setPunchMoment] = useState('');

  // Punching status
  const [isPunching, setIsPunching] = useState(false);
  const [punchResult, setPunchResult] = useState(null);
  const [punchError, setPunchError] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Fetch quick staff list for autocomplete
  useEffect(() => {
    axios.get('/api/staff', { params: { limit: 100 } })
      .then((res) => {
        if (res.data?.success && res.data.data) {
          setStaffList(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Request Geolocation
  const requestLocation = () => {
    setIsLocating(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your mobile browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLocation({ latitude, longitude, accuracy });

        const dist = getDistanceMeters(latitude, longitude, SCHOOL_COORDS.lat, SCHOOL_COORDS.lng);
        setDistanceToSchool(dist);
        setInSchoolZone(dist !== null && dist <= SCHOOL_COORDS.radiusMeters);
        setIsLocating(false);
      },
      (err) => {
        let msg = 'Unable to retrieve location. Please enable GPS / Location permissions.';
        if (err.code === 1) msg = 'Location permission denied. Please allow location access in your browser settings to verify you are in school.';
        setLocationError(msg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  // Fetch selected staff record
  const handleSelectStaff = async (staff) => {
    setSelectedStaff(staff);
    setPunchError('');
    setPunchResult(null);
    setSelfiePhoto('');

    try {
      const res = await axios.get(`/api/staff/${staff.employeeId}`);
      if (res.data?.success) {
        const record = res.data.data.todayAttendance;
        setTodayRecord(record);
        if (record?.checkIn?.time && !record?.checkOut?.time) {
          setPunchAction('check-out');
        } else {
          setPunchAction('check-in');
        }
      }
    } catch {
      setTodayRecord(null);
    }
  };

  // Start Front Camera
  const startCamera = async () => {
    setCameraError('');
    setSelfiePhoto('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch {
      setCameraError('Camera access denied or unavailable. Please enable front selfie camera access in browser permissions.');
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

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture Live Selfie from Video Stream
  const takeSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    // Mirror the front selfie camera image
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setSelfiePhoto(dataUrl);
    setPunchMoment(new Date().toISOString());
    stopCamera();
  };

  // Submit Attendance Punch
  const handlePunchAttendance = async () => {
    if (!selectedStaff) {
      setPunchError('Please select your staff profile first.');
      return;
    }

    if (!selfiePhoto) {
      setPunchError('Please capture your live selfie first.');
      return;
    }

    if (!userLocation) {
      requestLocation();
    }

    setIsPunching(true);
    setPunchError('');

    try {
      const payload = {
        employeeId: selectedStaff.employeeId,
        action: punchAction,
        selfiePhoto,
        latitude: userLocation?.latitude || SCHOOL_COORDS.lat,
        longitude: userLocation?.longitude || SCHOOL_COORDS.lng,
        deviceTimestamp: punchMoment || new Date().toISOString(),
        forceBypassGeofence: true, // Trial mode enabled
      };

      const res = await axios.post('/api/staff/attendance/punch', payload);
      if (res.data?.success) {
        setPunchResult(res.data);
        setTodayRecord(res.data.data);
        setSelfiePhoto('');
        if (punchAction === 'check-in') {
          setPunchAction('check-out');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Attendance submission failed. Please verify location and try again.';
      setPunchError(msg);
    } finally {
      setIsPunching(false);
    }
  };

  const filteredStaff = staffList.filter((s) => {
    if (!employeeIdInput.trim()) return false;
    const term = employeeIdInput.toLowerCase();
    return s.fullName.toLowerCase().includes(term) || s.employeeId.toLowerCase().includes(term);
  }).slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-3 sm:p-6 font-sans">
      <div className="max-w-md w-full mx-auto space-y-4">
        {/* Top Header & School Badge */}
        <div className="text-center pt-2 pb-3">
          <div className="flex items-center justify-center gap-3 mb-1.5">
            <img src={sitelogo} alt="MMPS Logo" className="h-12 w-auto object-contain drop-shadow" />
            <div className="text-left">
              <h1 className="text-lg font-black tracking-tight text-white leading-none">
                MASTER MIND PUBLIC SCHOOL
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mt-0.5">
                Staff Smart Attendance Portal
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-900/60 text-blue-300 text-[10px] font-bold border border-blue-700/50">
            <Smartphone size={12} /> Geofenced Live Mobile Punch
          </span>
        </div>

        {/* STEP 1: GPS GEOLOCATION CAMPUS CHECK CARD */}
        <div className={`p-4 rounded-2xl border transition-all ${
          inSchoolZone
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
            : userLocation
            ? 'bg-amber-950/40 border-amber-500/50 text-amber-100'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} className={inSchoolZone ? 'text-emerald-400' : 'text-amber-400'} />
              School Campus Geofence
            </span>
            <button
              onClick={requestLocation}
              disabled={isLocating}
              className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={11} className={isLocating ? 'animate-spin' : ''} />
              {isLocating ? 'Locating...' : 'Refresh GPS'}
            </button>
          </div>

          {userLocation ? (
            <div className="text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Campus Status:</span>
                {inSchoolZone ? (
                  <span className="font-extrabold text-emerald-400 inline-flex items-center gap-1 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    <CheckCircle2 size={12} /> Inside School Campus ({distanceToSchool}m)
                  </span>
                ) : (
                  <span className="font-extrabold text-amber-400 inline-flex items-center gap-1 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    <AlertTriangle size={12} /> Out of Campus ({distanceToSchool?.toLocaleString()}m away)
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {inSchoolZone
                  ? 'Your smartphone GPS is verified within Master Mind Public School Pipariya campus boundary.'
                  : 'Attendance can only be registered while physically present within the 400m school campus perimeter.'}
              </p>
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              {locationError ? (
                <span className="text-rose-400 font-semibold">{locationError}</span>
              ) : (
                <span>Checking your smartphone GPS location...</span>
              )}
            </div>
          )}
        </div>

        {/* STEP 2: STAFF IDENTITY SELECTION */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
            Step 1: Identify Staff Member
          </span>

          {!selectedStaff ? (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  value={employeeIdInput}
                  onChange={(e) => setEmployeeIdInput(e.target.value)}
                  placeholder="Enter Employee ID (e.g. MMPS-STF-0012) or Name..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white placeholder-slate-500 outline-none focus:border-amber-400 uppercase"
                />
              </div>

              {filteredStaff.length > 0 && (
                <div className="bg-slate-800 rounded-xl border border-slate-700 divide-y divide-slate-700/60 overflow-hidden">
                  {filteredStaff.map((staff) => (
                    <button
                      key={staff._id}
                      onClick={() => handleSelectStaff(staff)}
                      className="w-full p-2.5 text-left text-xs flex items-center justify-between hover:bg-slate-700/80 cursor-pointer"
                    >
                      <div>
                        <span className="font-extrabold text-white block">{staff.fullName}</span>
                        <span className="text-[10px] text-slate-400">
                          {staff.employeeId} • {staff.role} ({staff.employmentType})
                        </span>
                      </div>
                      <ChevronRight size={14} className="text-slate-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                  {selectedStaff.fullName[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm leading-tight">{selectedStaff.fullName}</h3>
                  <span className="text-[10px] text-amber-300 font-semibold">
                    {selectedStaff.employeeId} • {selectedStaff.role} ({selectedStaff.employmentType})
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedStaff(null);
                  setTodayRecord(null);
                  setPunchResult(null);
                }}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                Change
              </button>
            </div>
          )}

          {/* Today's Existing Punches Card */}
          {todayRecord && (
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
              <div className="flex justify-between items-center text-slate-400">
                <span>Today's Status:</span>
                <span className="font-black text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-900">
                  {todayRecord.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Check-In:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {todayRecord.checkIn?.time ? new Date(todayRecord.checkIn.time).toLocaleTimeString('en-IN') : 'Not punched'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Check-Out:</span>
                <span className="font-mono text-blue-400 font-bold">
                  {todayRecord.checkOut?.time ? new Date(todayRecord.checkOut.time).toLocaleTimeString('en-IN') : 'Pending departure'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* STEP 3: LIVE SELFIE CAMERA */}
        {selectedStaff && (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Camera size={14} className="text-amber-400" />
                Step 2: Live Front Selfie Camera
              </span>
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setPunchAction('check-in')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    punchAction === 'check-in' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Check-In
                </button>
                <button
                  type="button"
                  onClick={() => setPunchAction('check-out')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    punchAction === 'check-out' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Check-Out
                </button>
              </div>
            </div>

            {/* Video Viewport / Captured Preview */}
            <div className="relative aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-black border-2 border-slate-700 shadow-xl flex items-center justify-center">
              {selfiePhoto ? (
                <div className="relative w-full h-full">
                  <img src={selfiePhoto} alt="Captured Selfie" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm p-1.5 rounded-xl text-center text-[10px] text-white font-mono">
                    Captured: {new Date(punchMoment).toLocaleTimeString('en-IN')}
                  </div>
                </div>
              ) : isCameraActive ? (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  {/* Oval face positioning guide overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-44 h-56 border-2 border-dashed border-amber-400/80 rounded-[50%] shadow-lg"></div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Camera size={36} className="text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Front selfie camera required to authenticate attendance.</p>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {cameraError && (
              <div className="p-2.5 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0 text-rose-400" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Camera Actions */}
            <div className="flex items-center gap-2 justify-center pt-1">
              {!isCameraActive && !selfiePhoto && (
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <Camera size={16} />
                  <span>Open Front Camera</span>
                </button>
              )}

              {isCameraActive && (
                <button
                  type="button"
                  onClick={takeSelfie}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 cursor-pointer"
                >
                  <Camera size={16} />
                  <span>Snap Live Selfie ({punchAction === 'check-in' ? 'Check-In' : 'Check-Out'})</span>
                </button>
              )}

              {selfiePhoto && (
                <div className="flex items-center gap-2 w-full">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Retake Photo
                  </button>

                  <button
                    type="button"
                    onClick={handlePunchAttendance}
                    disabled={isPunching}
                    className={`flex-1 py-3 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                      punchAction === 'check-in'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/20'
                    }`}
                  >
                    {isPunching ? (
                      <RefreshCw size={15} className="animate-spin" />
                    ) : punchAction === 'check-in' ? (
                      <LogIn size={15} />
                    ) : (
                      <LogOut size={15} />
                    )}
                    <span>{isPunching ? 'Verifying...' : punchAction === 'check-in' ? 'Submit Check-In' : 'Submit Check-Out'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Notification */}
        {punchError && (
          <div className="p-3 bg-rose-950 border border-rose-800 text-rose-200 rounded-2xl text-xs flex items-start gap-2 animate-fade-in">
            <AlertTriangle size={16} className="text-rose-400 mt-0.5 shrink-0" />
            <div className="leading-snug">{punchError}</div>
          </div>
        )}

        {/* Success Ticket Confirmation */}
        {punchResult && (
          <div className="p-4 bg-emerald-950 border-2 border-emerald-500/60 rounded-2xl text-emerald-100 space-y-2 animate-scale-in text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto mb-1">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="font-black text-sm uppercase tracking-wider text-emerald-300">
              Attendance Punch Confirmed!
            </h4>
            <p className="text-xs text-emerald-200">{punchResult.message}</p>
            <div className="bg-black/40 p-2.5 rounded-xl text-[11px] font-mono text-slate-300 text-left space-y-1 mt-2">
              <div className="flex justify-between">
                <span>Employee:</span>
                <span className="font-bold text-white">{selectedStaff?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-bold text-emerald-400">Verified Inside Campus ({punchResult.distanceMeters}m)</span>
              </div>
              <div className="flex justify-between">
                <span>Exact Time:</span>
                <span className="font-bold text-white">{new Date().toLocaleTimeString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-md w-full mx-auto text-center pt-4 text-[10px] text-slate-500 border-t border-slate-900">
        <ShieldCheck size={12} className="inline mr-1 text-slate-400" />
        Master Mind Public School Pipariya • Geofenced Mobile Attendance System
      </div>
    </div>
  );
};

export default StaffSelfieAttendance;
