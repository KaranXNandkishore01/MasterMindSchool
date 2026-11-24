import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Global Axios configuration for guaranteed authentication and performance
if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}
axios.defaults.withCredentials = true;

// Startup check: immediately purge any pre-existing sessions from all devices
const GLOBAL_REVOCATION_EPOCH = 1795337000000;
try {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (user && (!user.sessionEpoch || user.sessionEpoch < GLOBAL_REVOCATION_EPOCH)) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('mmps_staff_user');
  }
} catch {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

axios.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = localStorage.getItem('token') || user?.token;
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Non-fatal
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: automatically logout and redirect when session is invalidated
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('mmps_staff_user');
      store.dispatch({ type: 'auth/logout/fulfilled' });
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/management') || currentPath.startsWith('/teacher')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
