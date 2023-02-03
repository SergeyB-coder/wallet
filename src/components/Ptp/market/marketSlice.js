import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  quantity_buy: 0,
};


export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setQuantityBuy: (state, action) => {
      state.quantity_buy = action.payload;
    },
  },
});

export const { setOrders, setQuantityBuy } = marketSlice.actions;

export const selectOrders = (state) => state.market.orders;
export const selectQuantityBuy = (state) => state.market.quantity_buy;


export default marketSlice.reducer;
