import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: '',
  address_trx: '',
  balance: 0,
  balance_trx: 0,
  user_deals: [1, 1, 1]
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
    setUserDeals: (state, action) => {
      state.user_deals = action.payload;
    },
  },
});

export const { setAddress, setAddressTRX, setBalance, setBalanceTRX, setUserDeals } = homeSlice.actions;

export const selectAddress = (state) => state.home.address;
export const selectAddressTRX = (state) => state.home.address_trx;
export const selectBalance = (state) => state.home.balance;
export const selectBalanceTRX = (state) => state.home.balance_trx;
export const selectUserDeals = (state) => state.home.user_deals;


export default homeSlice.reducer;
