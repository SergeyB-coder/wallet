import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../components/Home/homeSlice';
import ptpReducer from '../components/Ptp/ptpSlice';
import marketReducer from '../components/Ptp/market/marketSlice';
import settingsPayReducer from '../components/Ptp/settings_pay/settingsPaySlice';
import chatReducer from '../components/Ptp/chat/chatSlice';

export const store = configureStore({
  reducer: {
    home: homeReducer,
    ptp: ptpReducer,
    market: marketReducer,
    settings_pay: settingsPayReducer,
    chat: chatReducer
  },
});
