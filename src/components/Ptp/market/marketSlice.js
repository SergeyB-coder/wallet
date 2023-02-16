import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  my_orders: [],
  quantity_buy: '',
  deal_info: null,
  deal_screen_info: null,
  current_order_id: 0,
  order_deals: []
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
    setDealScreenInfo: (state, action) => {
      state.deal_screen_info = action.payload;
    },
    setCurrentOrderId: (state, action) => {
      state.current_order_id = action.payload;
    },
    setOrderDeals: (state, action) => {
      state.order_deals = action.payload;
    },
  },
});

export const { setOrderDeals, setOrders, setQuantityBuy, setMyOrders, setDealInfo, setCurrentOrderId, setDealScreenInfo } = marketSlice.actions;

export const selectOrders = (state) => state.market.orders;
export const selectMyOrders = (state) => state.market.my_orders;
export const selectQuantityBuy = (state) => state.market.quantity_buy;
export const selectDealInfo = (state) => state.market.deal_info;
export const selectDealScreenInfo = (state) => state.market.deal_screen_info;
export const selectCurrentOrderId = (state) => state.market.current_order_id;
export const selectOrderDeals = (state) => state.market.order_deals;


export default marketSlice.reducer;
