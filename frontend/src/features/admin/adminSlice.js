import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  students: [],
  staff: [],
  fees: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const fetchStudents = createAsyncThunk('admin/fetchStudents', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/api/students', {
      headers: { Authorization: `Bearer ${thunkAPI.getState().auth.user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response?.data?.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchStaff = createAsyncThunk('admin/fetchStaff', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/api/teachers', {
      headers: { Authorization: `Bearer ${thunkAPI.getState().auth.user.token}` }
    });
    return response.data;
  } catch (error) {
    const message = (error.response?.data?.message) || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => { state.isLoading = true; })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchStaff.pending, (state) => { state.isLoading = true; })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.staff = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;
