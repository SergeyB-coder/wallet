import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  my_orders: [],
  quantity_buy: 0,
  deal_info: null
};


export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setMyOrders: (state, action) => {
      state.my_orders = action.payload;
    },
    setQuantityBuy: (state, action) => {
      state.quantity_buy = action.payload;
    },
    setDealInfo: (state, action) => {
      state.deal_info = action.payload;
    },
  },
});

export const { setOrders, setQuantityBuy, setMyOrders, setDealInfo } = marketSlice.actions;

export const selectOrders = (state) => state.market.orders;
export const selectMyOrders = (state) => state.market.my_orders;
export const selectQuantityBuy = (state) => state.market.quantity_buy;
export const selectDealInfo = (state) => state.market.deal_info;


export default marketSlice.reducer;
