import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import homeReducer from '../components/Home/homeSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    home: homeReducer
  },
});
