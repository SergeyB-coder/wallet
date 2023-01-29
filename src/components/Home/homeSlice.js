import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: '',
};


export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setAddress } = homeSlice.actions;

export const selectAddress = (state) => state.home.address;


export default homeSlice.reducer;
