import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  classes: [],
  attendanceRecords: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const teacherSlice = createSlice({
  name: 'teacher',
  initialState,
  reducers: {
    resetTeacherState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  }
});

export const { resetTeacherState } = teacherSlice.actions;
export default teacherSlice.reducer;
