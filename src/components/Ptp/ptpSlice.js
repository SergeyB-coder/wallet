import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currency_order: 1,
  currency_fiat: 1,
  percent_price: '',
  price: '',
  quantity_order: '',
  limit_order: '',
  currency_type: 1,
  time_limit: 1
};


export const ptpSlice = createSlice({
  name: 'ptp',
  initialState,
  reducers: {
        setCurrencyOrder: (state, action) => {
            state.currency_order = action.payload;
        },

        setCurrencyFiat: (state, action) => {
            state.currency_fiat = action.payload;
        },

        setPercentPrice: (state, action) => {
            state.percent_price = action.payload;
        },

        setQuantityOrder: (state, action) => {
            state.quantity_order = action.payload;
        },

        setLimitOrder: (state, action) => {
            state.limit_order = action.payload;
        },

        setCurrencyType: (state, action) => {
            state.currency_type = action.payload;
        },

        setPrice: (state, action) => {
            state.price = action.payload;
        },

        setTimeLimit: (state, action) => {
            state.time_limit = action.payload;
        },
    },
});

export const { setTimeLimit, setCurrencyOrder, setCurrencyFiat, setPercentPrice, setQuantityOrder, setLimitOrder, setCurrencyType, setPrice } = ptpSlice.actions;

export const selectCurrencyOrder = (state) => state.ptp.currency_order;
export const selectCurrencyFiat = (state) => state.ptp.currency_fiat;
export const selectPercentPrice = (state) => state.ptp.percent_price;
export const selectQuantityOrder = (state) => state.ptp.quantity_order;
export const selectLimitOrder = (state) => state.ptp.limit_order;
export const selectCurrencyType = (state) => state.ptp.currency_type;
export const selectPrice = (state) => state.ptp.price;
export const selectTimeLimit = (state) => state.ptp.time_limit;


export default ptpSlice.reducer;
