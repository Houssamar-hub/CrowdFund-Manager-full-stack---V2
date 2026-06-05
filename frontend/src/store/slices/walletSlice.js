import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


export const fetchBalance = createAsyncThunk(
  "wallet/fetchBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/wallet/balance");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const fetchTransactions = createAsyncThunk(
  "wallet/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/wallet/transactions");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const addFunds = createAsyncThunk(
  "wallet/addFunds",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await api.post("/wallet/add-funds", { amount });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add funds",
      );
    }
  },
);

const initialState = {
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Balance
      .addCase(fetchBalance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
        state.error = null;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = Array.isArray(action.payload)
          ? action.payload
          : [];
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.transactions = [];
        state.error = action.payload;
      })
      // Add Funds
      .addCase(addFunds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFunds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
        if (action.payload.transaction) {
          state.transactions.unshift({
            _id: Date.now().toString(),
            type: action.payload.transaction.type || "deposit",
            amount: action.payload.transaction.amount,
            description:
              action.payload.transaction.description || "Wallet deposit",
            createdAt: action.payload.transaction.createdAt || new Date(),
          });
        }
        state.error = null;
      })
      .addCase(addFunds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = walletSlice.actions;
export default walletSlice.reducer;
