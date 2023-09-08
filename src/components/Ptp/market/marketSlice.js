import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  my_orders: [],
  quantity_buy: '',
  deal_info: null,
  deal_screen_info: null,
  current_order_id: 0,
  order_deals: [],
  backStepCreateOrder: '',
  buy_order: null,
  market_screen: 'orders',
  companies_pay: [],
  quantity_orders: 0
};


export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setQuantityOrders: (state, action) => {
      state.quantity_orders = action.payload;
    },
    setCompaniesPay: (state, action) => {
      state.companies_pay = action.payload;
    },
    setMarketScreen: (state, action) => {
      state.market_screen = action.payload;
    },
    setBuyOrder: (state, action) => {
      state.buy_order = action.payload;
    },
    setBackStepCreateOrder: (state, action) => {
      state.backStepCreateOrder = action.payload;
    },
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

export const {setQuantityOrders, setCompaniesPay, setMarketScreen, setBuyOrder, setBackStepCreateOrder, setOrderDeals, setOrders, setQuantityBuy, setMyOrders, setDealInfo, setCurrentOrderId, setDealScreenInfo } = marketSlice.actions;

export const selectOrders = (state) => state.market.orders;
export const selectMyOrders = (state) => state.market.my_orders;
export const selectQuantityBuy = (state) => state.market.quantity_buy;
export const selectDealInfo = (state) => state.market.deal_info;
export const selectDealScreenInfo = (state) => state.market.deal_screen_info;
export const selectCurrentOrderId = (state) => state.market.current_order_id;
export const selectOrderDeals = (state) => state.market.order_deals;
export const selectBackStepCreateOrder = (state) => state.market.backStepCreateOrder;
export const selectBuyOrder = (state) => state.market.buy_order;
export const selectMarketScreen = (state) => state.market.market_screen;
export const selectCompaniesPay = (state) => state.market.companies_pay;
export const selectQuantityOrders = (state) => state.market.quantity_orders;


export default marketSlice.reducer;
