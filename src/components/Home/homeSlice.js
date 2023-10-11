import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: '',
  address_trx: '',
  address_btc: '',
  balance: 0,
  balance_v: 0,
  balance_trx: 0,
  balance_trx_v: 0,
  balance_btc: 0,
  user_deals: [1, 1, 1],
  name_user: '',
  first_run: true,
  sum_orders: 0,
  sum_blocks: 0,
};


export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setBalanceBTC: (state, action) => {
      state.balance_btc = action.payload;
    },
    setAddressBTC: (state, action) => {
      state.address_btc = action.payload;
    },
    setSumBlocks: (state, action) => {
      state.sum_blocks = action.payload;
    },
    setSumOrders: (state, action) => {
      state.sum_orders = action.payload;
    },
    setFirstRun: (state, action) => {
      state.first_run = action.payload;
    },
    setNameUser: (state, action) => {
      state.name_user = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setAddressTRX: (state, action) => {
      state.address_trx = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setBalanceV: (state, action) => {
      state.balance_v = action.payload;
    },
    setBalanceTRX: (state, action) => {
      state.balance_trx = action.payload;
    },
    setBalanceTRXv: (state, action) => {
      state.balance_trx_v = action.payload;
    },
    setUserDeals: (state, action) => {
      state.user_deals = action.payload;
    },
  },
});

export const {setBalanceBTC, setAddressBTC, setBalanceV, setSumBlocks, setSumOrders, setFirstRun, setNameUser, setAddress, setAddressTRX, setBalance, setBalanceTRX, setBalanceTRXv, setUserDeals } = homeSlice.actions;

export const selectAddress = (state) => state.home.address;
export const selectAddressTRX = (state) => state.home.address_trx;
export const selectBalance = (state) => state.home.balance;
export const selectBalanceTRX = (state) => state.home.balance_trx;
export const selectBalanceTRXv = (state) => state.home.balance_trx_v;
export const selectUserDeals = (state) => state.home.user_deals;
export const selectNameUser = (state) => state.home.name_user;
export const selectFirstRun = (state) => state.home.first_run;
export const selectSumOrders = (state) => state.home.sum_orders;
export const selectSumBlocks = (state) => state.home.sum_blocks;
export const selectBalanceV = (state) => state.home.balance_v;
export const selectBalanceBTC = (state) => state.home.balance_btc;
export const selectAddressBTC = (state) => state.home.address_btc;


export default homeSlice.reducer;
