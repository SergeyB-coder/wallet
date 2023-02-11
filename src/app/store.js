import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../components/Home/homeSlice';
import ptpReducer from '../components/Ptp/ptpSlice';
import marketReducer from '../components/Ptp/market/marketSlice';

export const store = configureStore({
  reducer: {
    home: homeReducer,
    ptp: ptpReducer,
    market: marketReducer
  },
});
