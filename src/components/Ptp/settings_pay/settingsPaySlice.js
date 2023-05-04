import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    methods_pay: [],
    companies_pay: [],
    //   new method
    name_method: '',
    bank: '',
    card: '',
    info: '',

    //global states
    backscreen: '',
    new_method: false,
    selected_company_index: 0
};


export const settingsPaySlice = createSlice({
  name: 'settings_pay',
  initialState,
  reducers: {
    setSelectedCompanyIndex: (state, action) => {
      state.selected_company_index = action.payload;
    },
    setNewMethod: (state, action) => {
      state.new_method = action.payload;
    },
    setBackScreen: (state, action) => {
      state.backscreen = action.payload;
    },
    setCompaniesPay: (state, action) => {
        state.companies_pay = action.payload;
      },
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

export const { setSelectedCompanyIndex, setNewMethod, setBackScreen, setCompaniesPay,  setMethodsPay, setNameMethod, setBank, setCard, setInfo } = settingsPaySlice.actions;

export const selectMethodsPay = (state) => state.settings_pay.methods_pay;
export const selectCompaniesPay = (state) => state.settings_pay.companies_pay;
export const selectNameMethod = (state) => state.settings_pay.name_method;
export const selectBank = (state) => state.settings_pay.bank;
export const selectCard = (state) => state.settings_pay.card;
export const selectInfo = (state) => state.settings_pay.info;
export const selectBackScreen = (state) => state.settings_pay.backscreen;
export const selectNewMethod = (state) => state.settings_pay.new_method;
export const selectSelectdCompanyIndex = (state) => state.settings_pay.selected_company_index;


export default settingsPaySlice.reducer;
