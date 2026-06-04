import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Récupérer les investissements de l'utilisateur
export const fetchMyInvestments = createAsyncThunk(
  'investments/fetchMyInvestments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/investments/mine');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Investir dans un projet
export const investInProject = createAsyncThunk(
  'investments/invest',
  async ({ projectId, amount }, { rejectWithValue }) => {
    try {
      const response = await api.post('/investments', { projectId, amount });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  investments: [],
  isLoading: false,
  error: null,
};

const investmentSlice = createSlice({
  name: 'investments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyInvestments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyInvestments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investments = action.payload;
      })
      .addCase(fetchMyInvestments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(investInProject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(investInProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.investments.push(action.payload);
      })
      .addCase(investInProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = investmentSlice.actions;
export default investmentSlice.reducer;