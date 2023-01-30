import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import homeReducer from '../components/Home/homeSlice';
import ptpReducer from '../components/Ptp/ptpSlice';
import marketReducer from '../components/Ptp/market/marketSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    home: homeReducer,
    ptp: ptpReducer,
    market: marketReducer
  },
});
