import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};


export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { setMessages } = chatSlice.actions;

export const selectMessages = (state) => state.chat.messages;


export default chatSlice.reducer;
