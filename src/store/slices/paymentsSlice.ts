import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Payment } from '../../navigation/types';
import { paymentService } from '../../services/paymentService';

// Define the state interface
interface PaymentsState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  currentPayment: Payment | null;
}

// Initial state
const initialState: PaymentsState = {
  payments: [],
  loading: false,
  error: null,
  currentPayment: null,
};

// Async thunks
export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      return await paymentService.getPayments();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payments/fetchPaymentById',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      return await paymentService.getPaymentById(paymentId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchResidentPayments = createAsyncThunk(
  'payments/fetchResidentPayments',
  async (residentId: string, { rejectWithValue }) => {
    try {
      return await paymentService.getResidentPayments(residentId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const fetchBuildingPayments = createAsyncThunk(
  'payments/fetchBuildingPayments',
  async (buildingId: string, { rejectWithValue }) => {
    try {
      return await paymentService.getBuildingPayments(buildingId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      return await paymentService.createPayment(paymentData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const updatePayment = createAsyncThunk(
  'payments/updatePayment',
  async ({ paymentId, paymentData }: { paymentId: string; paymentData: Partial<Payment> }, { rejectWithValue }) => {
    try {
      return await paymentService.updatePayment(paymentId, paymentData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const processPayment = createAsyncThunk(
  'payments/processPayment',
  async (
    { 
      paymentId, 
      paymentDetails 
    }: { 
      paymentId: string; 
      paymentDetails: {
        paymentMethod: 'creditCard' | 'bankTransfer' | 'cash' | 'other';
        paymentDate: string;
      } 
    }, 
    { rejectWithValue }
  ) => {
    try {
      return await paymentService.processPayment(paymentId, paymentDetails);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

export const deletePayment = createAsyncThunk(
  'payments/deletePayment',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      await paymentService.deletePayment(paymentId);
      return paymentId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

// Create the slice
const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all payments
    builder.addCase(fetchPayments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPayments.fulfilled, (state, action: PayloadAction<Payment[]>) => {
      state.loading = false;
      state.payments = action.payload;
    });
    builder.addCase(fetchPayments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Fetch payment by ID
    builder.addCase(fetchPaymentById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPaymentById.fulfilled, (state, action: PayloadAction<Payment>) => {
      state.loading = false;
      state.currentPayment = action.payload;
    });
    builder.addCase(fetchPaymentById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Fetch resident payments
    builder.addCase(fetchResidentPayments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchResidentPayments.fulfilled, (state, action: PayloadAction<Payment[]>) => {
      state.loading = false;
      state.payments = action.payload;
    });
    builder.addCase(fetchResidentPayments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Fetch building payments
    builder.addCase(fetchBuildingPayments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBuildingPayments.fulfilled, (state, action: PayloadAction<Payment[]>) => {
      state.loading = false;
      state.payments = action.payload;
    });
    builder.addCase(fetchBuildingPayments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Create payment
    builder.addCase(createPayment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPayment.fulfilled, (state, action: PayloadAction<Payment>) => {
      state.loading = false;
      state.payments.push(action.payload);
      state.currentPayment = action.payload;
    });
    builder.addCase(createPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Update payment
    builder.addCase(updatePayment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePayment.fulfilled, (state, action: PayloadAction<Payment>) => {
      state.loading = false;
      state.payments = state.payments.map(payment => 
        payment.id === action.payload.id ? action.payload : payment
      );
      state.currentPayment = action.payload;
    });
    builder.addCase(updatePayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Process payment
    builder.addCase(processPayment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(processPayment.fulfilled, (state, action: PayloadAction<Payment>) => {
      state.loading = false;
      state.payments = state.payments.map(payment => 
        payment.id === action.payload.id ? action.payload : payment
      );
      state.currentPayment = action.payload;
    });
    builder.addCase(processPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Delete payment
    builder.addCase(deletePayment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deletePayment.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.payments = state.payments.filter(payment => payment.id !== action.payload);
      if (state.currentPayment?.id === action.payload) {
        state.currentPayment = null;
      }
    });
    builder.addCase(deletePayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentPayment } = paymentsSlice.actions;
export default paymentsSlice.reducer; 