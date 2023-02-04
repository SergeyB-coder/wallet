import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: '',
  balance: 0,
};


export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
});

export const { setAddress, setBalance } = homeSlice.actions;

export const selectAddress = (state) => state.home.address;
export const selectBalance = (state) => state.home.balance;


export default homeSlice.reducer;
