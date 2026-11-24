import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// All-device session revocation epoch (sessions before this timestamp are purged immediately)
export const GLOBAL_REVOCATION_EPOCH = 1795337000000;

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.sessionEpoch || parsed.sessionEpoch < GLOBAL_REVOCATION_EPOCH) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('mmps_staff_user');
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

const user = getStoredUser();

const initialState = {
  user: user || null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Login user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axios.post('/api/auth/login', userData);
    if (response.data) {
      const userWithEpoch = {
        ...response.data,
        sessionEpoch: Date.now(),
      };
      localStorage.setItem('user', JSON.stringify(userWithEpoch));
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return userWithEpoch;
    }
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Logout user (single device)
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await axios.post('/api/auth/logout');
  } catch {
    // Non-fatal
  }
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('mmps_staff_user');
});

// Logout all devices immediately (teachers & admin)
export const logoutAll = createAsyncThunk('auth/logoutAll', async () => {
  try {
    await axios.post('/api/auth/logout-all');
  } catch {
    // Non-fatal
  }
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('mmps_staff_user');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearError: (state) => {
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logoutAll.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset, clearError } = authSlice.actions;
export default authSlice.reducer;
