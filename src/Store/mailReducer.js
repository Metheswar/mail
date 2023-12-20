import { createSlice } from "@reduxjs/toolkit";

const mailSlice = createSlice({
  name: "mail", 
  initialState: {
    inboxData: [], 
    outboxData: [], 
    unread: 0, 
  },
  reducers: {
  
    inboxHandler(state, action) {
      state.inboxData = action.payload;
    },
 
    outboxHandler(state, action) {
      state.outboxData = action.payload;
    },
  
    unreadHandler(state, action) {
      state.unread = action.payload;
    },
  },
});


export const { inboxHandler, outboxHandler, unreadHandler } = mailSlice.actions;


export default mailSlice.reducer;
