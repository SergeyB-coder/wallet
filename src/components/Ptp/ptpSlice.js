import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    type_order: 's', // s - sale, b - buy
    currency_order: 1,
    currency_fiat: 1,
    percent_price: '',
    price: '',
    price_market: 0,
    price_market_trx: 0,
    quantity_order: '',
    limit_order: '',
    price_type: 1,
    time_limit: 1,
    method_pay: null,
    rub_dollar: 0,
    comment: ''
};


export const ptpSlice = createSlice({
    name: 'ptp',
    initialState,
    reducers: {
        setComment: (state, action) => {
            state.comment = action.payload;
        },

        setRubDollar: (state, action) => {
            state.rub_dollar = action.payload;
        },

        setPriceMarketTRX: (state, action) => {
            state.price_market_trx = action.payload;
        },

        setPriceMarket: (state, action) => {
            state.price_market = action.payload;
        },

        setTypeOrder: (state, action) => {
            state.type_order = action.payload;
        },

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

        setPriceType: (state, action) => {
            state.price_type = action.payload;
        },

        setPrice: (state, action) => {
            state.price = action.payload;
        },

        setTimeLimit: (state, action) => {
            state.time_limit = action.payload;
        },

        setMethodPay: (state, action) => {
            state.method_pay = action.payload;
        },
    },
});

export const {setComment, setRubDollar, setPriceMarket, setPriceMarketTRX, setTypeOrder, setMethodPay, setTimeLimit, setCurrencyOrder, setCurrencyFiat, setPercentPrice, setQuantityOrder, setLimitOrder, setPriceType, setPrice } = ptpSlice.actions;

export const selectCurrencyOrder = (state) => state.ptp.currency_order;
export const selectCurrencyFiat = (state) => state.ptp.currency_fiat;
export const selectPercentPrice = (state) => state.ptp.percent_price;
export const selectQuantityOrder = (state) => state.ptp.quantity_order;
export const selectLimitOrder = (state) => state.ptp.limit_order;
export const selectPriceType = (state) => state.ptp.price_type;
export const selectPrice = (state) => state.ptp.price;
export const selectPriceMarket = (state) => state.ptp.price_market;
export const selectPriceMarketTRX = (state) => state.ptp.price_market_trx;
export const selectTimeLimit = (state) => state.ptp.time_limit;
export const selectMethodPay = (state) => state.ptp.method_pay;
export const selectTypeOrder = (state) => state.ptp.type_order;
export const selectRubDollar = (state) => state.ptp.rub_dollar;
export const selectComment = (state) => state.ptp.comment;


export default ptpSlice.reducer;
