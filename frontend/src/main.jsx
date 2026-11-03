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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
