import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  methods_pay: [],

    //   new method
    name_method: '',
    bank: '',
    card: '',
    info: ''
};


export const settingsPaySlice = createSlice({
  name: 'settings_pay',
  initialState,
  reducers: {
    setMethodsPay: (state, action) => {
      state.methods_pay = action.payload;
    },
    setNameMethod: (state, action) => {
        state.name_method = action.payload;
    },
    setBank: (state, action) => {
    state.bank = action.payload;
    },
    setCard: (state, action) => {
    state.card = action.payload;
    },
    setInfo: (state, action) => {
    state.info = action.payload;
    },
  },
});

export const {  setMethodsPay, setNameMethod, setBank, setCard, setInfo } = settingsPaySlice.actions;

export const selectMethodsPay = (state) => state.settings_pay.methods_pay;
export const selectNameMethod = (state) => state.settings_pay.name_method;
export const selectBank = (state) => state.settings_pay.bank;
export const selectCard = (state) => state.settings_pay.card;
export const selectInfo = (state) => state.settings_pay.info;


export default settingsPaySlice.reducer;
