import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
};


export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
});

export const { setOrders } = marketSlice.actions;

export const selectOrders = (state) => state.market.orders;


export default marketSlice.reducer;
