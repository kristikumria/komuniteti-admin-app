import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Administrator } from '../../types/administratorTypes';
import { administratorService } from '../../services/administratorService';
import type { RootState } from '../store';

export interface AdministratorState {
  administrators: Administrator[];
  selectedAdministrator: Administrator | null;
  loading: boolean;
  error: string | null;
  filterStatus: 'all' | 'active' | 'inactive';
  filterBuildingId: string | null;
}

const initialState: AdministratorState = {
  administrators: [],
  selectedAdministrator: null,
  loading: false,
  error: null,
  filterStatus: 'all',
  filterBuildingId: null,
};

// Async thunks
export const fetchAdministrators = createAsyncThunk(
  'administrators/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await administratorService.getAdministrators();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch administrators');
    }
  }
);

export const fetchAdministratorById = createAsyncThunk(
  'administrators/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const administrator = await administratorService.getAdministratorById(id);
      if (!administrator) {
        throw new Error('Administrator not found');
      }
      return administrator;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch administrator');
    }
  }
);

export const fetchAdministratorsByBuilding = createAsyncThunk(
  'administrators/fetchByBuilding',
  async (buildingId: string, { rejectWithValue }) => {
    try {
      return {
        administrators: await administratorService.getAdministratorsByBuilding(buildingId),
        buildingId
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch administrators for this building');
    }
  }
);

export const createAdministrator = createAsyncThunk(
  'administrators/create',
  async (administratorData: Omit<Administrator, 'id' | 'role' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      return await administratorService.createAdministrator(administratorData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create administrator');
    }
  }
);

export const updateAdministrator = createAsyncThunk(
  'administrators/update',
  async (
    { id, updates }: { id: string; updates: Partial<Omit<Administrator, 'id' | 'role' | 'createdAt'>> },
    { rejectWithValue }
  ) => {
    try {
      const administrator = await administratorService.updateAdministrator(id, updates);
      if (!administrator) {
        throw new Error('Administrator not found');
      }
      return administrator;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update administrator');
    }
  }
);

export const deleteAdministrator = createAsyncThunk(
  'administrators/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const success = await administratorService.deleteAdministrator(id);
      if (!success) {
        throw new Error('Failed to delete administrator');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete administrator');
    }
  }
);

export const toggleAdministratorStatus = createAsyncThunk(
  'administrators/toggleStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const administrator = await administratorService.toggleAdministratorStatus(id);
      if (!administrator) {
        throw new Error('Administrator not found');
      }
      return administrator;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle administrator status');
    }
  }
);

export const assignBuilding = createAsyncThunk(
  'administrators/assignBuilding',
  async (
    { administratorId, buildingId, buildingName, assign }: 
    { administratorId: string; buildingId: string; buildingName: string; assign: boolean },
    { rejectWithValue }
  ) => {
    try {
      const administrator = await administratorService.assignBuilding(
        administratorId,
        buildingId,
        buildingName,
        assign
      );
      if (!administrator) {
        throw new Error('Administrator not found');
      }
      return administrator;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to assign/unassign building');
    }
  }
);

const administratorSlice = createSlice({
  name: 'administrators',
  initialState,
  reducers: {
    clearSelectedAdministrator: (state) => {
      state.selectedAdministrator = null;
    },
    setFilterStatus: (state, action: PayloadAction<'all' | 'active' | 'inactive'>) => {
      state.filterStatus = action.payload;
    },
    setFilterBuilding: (state, action: PayloadAction<string | null>) => {
      state.filterBuildingId = action.payload;
    },
    clearFilters: (state) => {
      state.filterStatus = 'all';
      state.filterBuildingId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all administrators
      .addCase(fetchAdministrators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdministrators.fulfilled, (state, action: PayloadAction<Administrator[]>) => {
        state.loading = false;
        state.administrators = action.payload;
      })
      .addCase(fetchAdministrators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch administrator by ID
      .addCase(fetchAdministratorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdministratorById.fulfilled, (state, action: PayloadAction<Administrator>) => {
        state.loading = false;
        state.selectedAdministrator = action.payload;
      })
      .addCase(fetchAdministratorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch administrators by building
      .addCase(fetchAdministratorsByBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdministratorsByBuilding.fulfilled, (state, action: PayloadAction<{administrators: Administrator[], buildingId: string}>) => {
        state.loading = false;
        state.administrators = action.payload.administrators;
        state.filterBuildingId = action.payload.buildingId;
      })
      .addCase(fetchAdministratorsByBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create administrator
      .addCase(createAdministrator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdministrator.fulfilled, (state, action: PayloadAction<Administrator>) => {
        state.loading = false;
        state.administrators.push(action.payload);
      })
      .addCase(createAdministrator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update administrator
      .addCase(updateAdministrator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdministrator.fulfilled, (state, action: PayloadAction<Administrator>) => {
        state.loading = false;
        const index = state.administrators.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.administrators[index] = action.payload;
        }
        state.selectedAdministrator = action.payload;
      })
      .addCase(updateAdministrator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete administrator
      .addCase(deleteAdministrator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdministrator.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.administrators = state.administrators.filter((a) => a.id !== action.payload);
        if (state.selectedAdministrator?.id === action.payload) {
          state.selectedAdministrator = null;
        }
      })
      .addCase(deleteAdministrator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle administrator status
      .addCase(toggleAdministratorStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleAdministratorStatus.fulfilled, (state, action: PayloadAction<Administrator>) => {
        state.loading = false;
        const index = state.administrators.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.administrators[index] = action.payload;
        }
        if (state.selectedAdministrator?.id === action.payload.id) {
          state.selectedAdministrator = action.payload;
        }
      })
      .addCase(toggleAdministratorStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Assign/unassign building
      .addCase(assignBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignBuilding.fulfilled, (state, action: PayloadAction<Administrator>) => {
        state.loading = false;
        const index = state.administrators.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.administrators[index] = action.payload;
        }
        if (state.selectedAdministrator?.id === action.payload.id) {
          state.selectedAdministrator = action.payload;
        }
      })
      .addCase(assignBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearSelectedAdministrator, 
  setFilterStatus, 
  setFilterBuilding,
  clearFilters
} = administratorSlice.actions;

// Selectors
export const selectAdministrators = (state: RootState) => state.administrators.administrators;
export const selectSelectedAdministrator = (state: RootState) => state.administrators.selectedAdministrator;
export const selectAdministratorsLoading = (state: RootState) => state.administrators.loading;
export const selectAdministratorsError = (state: RootState) => state.administrators.error;
export const selectFilterStatus = (state: RootState) => state.administrators.filterStatus;
export const selectFilterBuildingId = (state: RootState) => state.administrators.filterBuildingId;

// Filtered selectors
export const selectFilteredAdministrators = (state: RootState) => {
  let filtered = [...state.administrators.administrators];
  
  // Apply status filter if not 'all'
  if (state.administrators.filterStatus !== 'all') {
    filtered = filtered.filter(admin => admin.status === state.administrators.filterStatus);
  }
  
  // Apply building filter if set
  if (state.administrators.filterBuildingId) {
    filtered = filtered.filter(admin => 
      admin.assignedBuildings.includes(state.administrators.filterBuildingId!)
    );
  }
  
  return filtered;
};

export default administratorSlice.reducer; 