import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: '',
  address_trx: '',
  balance: 0,
  balance_trx: 0,
};


export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setAddressTRX: (state, action) => {
      state.address_trx = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setBalanceTRX: (state, action) => {
      state.balance_trx = action.payload;
    },
  },
});

export const { setAddress, setAddressTRX, setBalance, setBalanceTRX } = homeSlice.actions;

export const selectAddress = (state) => state.home.address;
export const selectAddressTRX = (state) => state.home.address_trx;
export const selectBalance = (state) => state.home.balance;
export const selectBalanceTRX = (state) => state.home.balance_trx;


export default homeSlice.reducer;
