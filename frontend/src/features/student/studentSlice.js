import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  attendance: [],
  materials: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    resetStudentState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  }
});

export const { resetStudentState } = studentSlice.actions;
export default studentSlice.reducer;
