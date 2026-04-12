import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../../features/auth/authSlice';
import { Lock, Mail, GraduationCap, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ 
    managementId: localStorage.getItem('rememberedMgmtId') || '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedMgmtId'));
  
  const idInputRef = useRef(null);
  const { managementId, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Auto-focus the Management ID field upon mount
    if (idInputRef.current) {
      idInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isError) {
      // Clear password field on error for security and better UX
      setFormData(prev => ({ ...prev, password: '' }));
      console.error(message);
    }

    if (isSuccess || user) {
      if (user?.role === 'Management') {
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

  const onSubmit = (e) => {
    e.preventDefault();
    
    // Trim inputs to handle accidental spaces
    const trimmedId = managementId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedId || !trimmedPassword) {
      return;
    }

    // Handle "Remember me"
    if (rememberMe) {
      localStorage.setItem('rememberedMgmtId', trimmedId);
    } else {
      localStorage.removeItem('rememberedMgmtId');
    }

    const userData = { managementId: trimmedId, password: trimmedPassword };
    dispatch(login(userData));
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
          <form className="space-y-6" onSubmit={onSubmit}>
            
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
                  className="focus:ring-2 flex-1 block w-full rounded-xl sm:text-sm border-gray-300 px-4 py-3 pl-10 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 border outline-none transition-all focus:bg-white"
                  placeholder="mastersagar_mgt"
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
                  className="focus:ring-2 flex-1 block w-full rounded-xl sm:text-sm border-gray-300 px-4 py-3 pl-10 pr-10 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 border outline-none transition-all focus:bg-white"
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" 
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>

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
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-blue-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                   <div className="w-5 h-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                ) : "Secure Login"}
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
               Support Line: <span className="font-semibold text-gray-700">1800-MMPS-HELP</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
