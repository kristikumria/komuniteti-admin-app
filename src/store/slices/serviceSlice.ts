import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Service } from '../../types/serviceTypes';
import { serviceService } from '../../services/serviceService';
import type { RootState } from '../store';

export interface ServiceState {
  services: Service[];
  selectedService: Service | null;
  loading: boolean;
  error: string | null;
  filterCategory: string | null;
}

const initialState: ServiceState = {
  services: [],
  selectedService: null,
  loading: false,
  error: null,
  filterCategory: null,
};

// Async thunks
export const fetchServices = createAsyncThunk(
  'services/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await serviceService.getServices();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch services');
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const service = await serviceService.getServiceById(id);
      if (!service) {
        throw new Error('Service not found');
      }
      return service;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch service');
    }
  }
);

export const createService = createAsyncThunk(
  'services/create',
  async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      return await serviceService.createService(serviceData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk(
  'services/update',
  async ({ id, updates }: { id: string; updates: Partial<Omit<Service, 'id' | 'createdAt'>> }, { rejectWithValue }) => {
    try {
      const service = await serviceService.updateService(id, updates);
      if (!service) {
        throw new Error('Service not found');
      }
      return service;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const success = await serviceService.deleteService(id);
      if (!success) {
        throw new Error('Failed to delete service');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete service');
    }
  }
);

export const toggleServiceStatus = createAsyncThunk(
  'services/toggleStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const service = await serviceService.toggleServiceStatus(id);
      if (!service) {
        throw new Error('Service not found');
      }
      return service;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle service status');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearSelectedService: (state) => {
      state.selectedService = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch service by ID
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action: PayloadAction<Service>) => {
        state.loading = false;
        state.selectedService = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action: PayloadAction<Service>) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action: PayloadAction<Service>) => {
        state.loading = false;
        const index = state.services.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        state.selectedService = action.payload;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.services = state.services.filter(s => s.id !== action.payload);
        if (state.selectedService?.id === action.payload) {
          state.selectedService = null;
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Toggle service status
      .addCase(toggleServiceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleServiceStatus.fulfilled, (state, action: PayloadAction<Service>) => {
        state.loading = false;
        const index = state.services.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        if (state.selectedService?.id === action.payload.id) {
          state.selectedService = action.payload;
        }
      })
      .addCase(toggleServiceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedService } = serviceSlice.actions;

// Selectors
export const selectServices = (state: RootState) => state.services.services;
export const selectSelectedService = (state: RootState) => state.services.selectedService;
export const selectServicesLoading = (state: RootState) => state.services.loading;
export const selectServicesError = (state: RootState) => state.services.error;

export default serviceSlice.reducer; 