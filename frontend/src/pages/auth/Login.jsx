import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../../features/auth/authSlice';
import { Lock, Mail, GraduationCap, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ 
    managementId: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  
  const idInputRef = useRef(null);
  const { managementId, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Clear any previously saved credential traces so the login page always opens completely empty
    localStorage.removeItem('rememberedMgmtId');
  }, []);

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (isSuccess || user) {
      if (user?.role === 'Teacher') {
        navigate('/teacher/dashboard');
      } else if (user?.role === 'Management' || user?.role === 'Admin') {
        navigate('/management/dashboard');
      } else {
        navigate('/');
      }
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Trim inputs to handle accidental spaces
    const trimmedId = managementId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedId || !trimmedPassword) {
      return;
    }

    // Ensure no credentials linger in localStorage
    localStorage.removeItem('rememberedMgmtId');

    const userData = { managementId: trimmedId, password: trimmedPassword };
    const result = await dispatch(login(userData));
    if (login.rejected.match(result)) {
      setFormData((prev) => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 animate-pulse delay-1000"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4 transform -rotate-6">
             <GraduationCap className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight">
             Portal Login
          </h2>
          <p className="mt-2 text-center text-sm text-blue-200 uppercase tracking-widest font-semibold">
            MMPS Management System
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white py-10 px-6 sm:px-10 shadow-2xl rounded-3xl sm:rounded-[2rem] border border-gray-100 backdrop-blur-xl bg-opacity-95">
          <form className="space-y-6" onSubmit={onSubmit} autoComplete="off">
            {/* Decoy fields to swallow aggressive browser auto-fill heuristics */}
            <input type="text" name="decoy_username" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <input type="password" name="decoy_password" tabIndex={-1} autoComplete="new-password" className="hidden" aria-hidden="true" />
            
            {/* Quick Role Selection Pills (Only fills User ID; Password stays empty for security) */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="block text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Quick Role Selector
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsReadOnly(false);
                    setFormData({ managementId: 'teacher_mmps', password: '' });
                  }}
                  className="px-2.5 py-2 text-xs font-bold rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 transition-all text-center cursor-pointer"
                >
                  👩‍🏫 Class Teacher
                  <span className="block text-[10px] text-blue-600 font-normal mt-0.5">teacher_mmps</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsReadOnly(false);
                    setFormData({ managementId: 'mastersagar_mgt', password: '' });
                  }}
                  className="px-2.5 py-2 text-xs font-bold rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition-all text-center cursor-pointer"
                >
                  🏛️ Management
                  <span className="block text-[10px] text-amber-700 font-normal mt-0.5">mastersagar_mgt</span>
                </button>
              </div>
            </div>

            {isError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg">
                <p className="text-sm text-red-700 font-medium">{message}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Management ID</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={idInputRef}
                  type="text"
                  name="managementId"
                  value={managementId}
                  onChange={onChange}
                  readOnly={isReadOnly}
                  onFocus={() => setIsReadOnly(false)}
                  onTouchStart={() => setIsReadOnly(false)}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  className="focus:ring-2 flex-1 block w-full rounded-xl sm:text-sm border-gray-300 px-4 py-3 pl-10 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 border outline-none transition-all focus:bg-white"
                  placeholder="e.g. teacher_mmps or mastersagar_mgt"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={onChange}
                  readOnly={isReadOnly}
                  onFocus={() => setIsReadOnly(false)}
                  onTouchStart={() => setIsReadOnly(false)}
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  className="focus:ring-2 flex-1 block w-full rounded-xl sm:text-sm border-gray-300 px-4 py-3 pl-10 pr-10 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 border outline-none transition-all focus:bg-white"
                  placeholder="Enter your password"
                  required
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-blue-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end mt-1">
              <div className="text-sm">
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-blue-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                   <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                ) : "Secure Login"}
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs">
              <span className="text-gray-500">School Staff Member? </span>
              <Link to="/staff/portal" className="font-bold text-blue-600 hover:text-blue-800 underline">
                Staff Attendance & Employee Portal →
              </Link>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
               Support Line: <span className="font-semibold text-gray-700">1800-MMPS-HELP</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
