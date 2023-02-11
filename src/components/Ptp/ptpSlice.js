import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currency_order: '',
  currency_fiat: '',
  percent_price: '',
  price: '',
  quantity_order: '',
  limit_order: '',
  currency_type: 'Фиксированная',
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
    },
});

export const { setCurrencyOrder, setCurrencyFiat, setPercentPrice, setQuantityOrder, setLimitOrder, setCurrencyType, setPrice } = ptpSlice.actions;

export const selectCurrencyOrder = (state) => state.ptp.currency_order;
export const selectCurrencyFiat = (state) => state.ptp.currency_fiat;
export const selectPercentPrice = (state) => state.ptp.percent_price;
export const selectQuantityOrder = (state) => state.ptp.quantity_order;
export const selectLimitOrder = (state) => state.ptp.limit_order;
export const selectCurrencyType = (state) => state.ptp.currency_type;
export const selectPrice = (state) => state.ptp.price;


export default ptpSlice.reducer;
