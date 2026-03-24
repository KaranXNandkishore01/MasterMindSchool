import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wards: [],
  fees: [],
  messages: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

export const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    resetParentState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  }
});

export const { resetParentState } = parentSlice.actions;
export default parentSlice.reducer;
