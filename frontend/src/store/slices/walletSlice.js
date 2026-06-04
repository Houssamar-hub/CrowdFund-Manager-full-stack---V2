// src/redux/slices/walletSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  transactions: []
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    deposit: (state, action) => {
      const amount = action.payload;

      state.balance += amount;

      state.transactions.unshift({
        id: Date.now(),
        type: "DEPOSIT",
        amount,
        date: new Date().toISOString()
      });
    },

    withdraw: (state, action) => {
      const amount = action.payload;

      if (state.balance >= amount) {
        state.balance -= amount;

        state.transactions.unshift({
          id: Date.now(),
          type: "WITHDRAW",
          amount,
          date: new Date().toISOString()
        });
      }
    }
  }
});

export const { deposit, withdraw } = walletSlice.actions;
export default walletSlice.reducer;