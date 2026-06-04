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

export const addFunds = createAsyncThunk(
    "wallet/addFunds",
    async (amount, { rejectWithValue }) => {
        try {
            const response = await api.post("/wallet/add-funds", { amount });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message);
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
            .addCase(fetchBalance.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchBalance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.balance = action.payload.balance;
            })
            .addCase(fetchBalance.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(addFunds.fulfilled, (state, action) => {
                state.balance = action.payload.balance;

                state.transactions.push({
                    id: Date.now(),
                    type: "DEPOSIT",
                    amount: action.payload.amount || action.payload.balance,
                });
            });
    },
});

export const { clearError } = walletSlice.actions;
export default walletSlice.reducer;
