import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Building } from '../../types/buildingTypes';
import { buildingService } from '../../services/buildingService';
import type { RootState } from '../store';

export interface BuildingState {
  buildings: Building[];
  selectedBuilding: Building | null;
  loading: boolean;
  error: string | null;
}

const initialState: BuildingState = {
  buildings: [],
  selectedBuilding: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchBuildings = createAsyncThunk(
  'buildings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await buildingService.getBuildings();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch buildings');
    }
  }
);

export const fetchBuildingById = createAsyncThunk(
  'buildings/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const building = await buildingService.getBuildingById(id);
      if (!building) {
        throw new Error('Building not found');
      }
      return building;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch building');
    }
  }
);

export const createBuilding = createAsyncThunk(
  'buildings/create',
  async (buildingData: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      return await buildingService.createBuilding(buildingData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create building');
    }
  }
);

export const updateBuilding = createAsyncThunk(
  'buildings/update',
  async (
    { id, updates }: { id: string; updates: Partial<Omit<Building, 'id' | 'createdAt'>> },
    { rejectWithValue }
  ) => {
    try {
      const building = await buildingService.updateBuilding(id, updates);
      if (!building) {
        throw new Error('Building not found');
      }
      return building;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update building');
    }
  }
);

export const deleteBuilding = createAsyncThunk(
  'buildings/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const success = await buildingService.deleteBuilding(id);
      if (!success) {
        throw new Error('Failed to delete building');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete building');
    }
  }
);

const buildingSlice = createSlice({
  name: 'buildings',
  initialState,
  reducers: {
    clearSelectedBuilding: (state) => {
      state.selectedBuilding = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all buildings
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuildings.fulfilled, (state, action: PayloadAction<Building[]>) => {
        state.loading = false;
        state.buildings = action.payload;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch building by ID
      .addCase(fetchBuildingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuildingById.fulfilled, (state, action: PayloadAction<Building>) => {
        state.loading = false;
        state.selectedBuilding = action.payload;
      })
      .addCase(fetchBuildingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create building
      .addCase(createBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBuilding.fulfilled, (state, action: PayloadAction<Building>) => {
        state.loading = false;
        state.buildings.push(action.payload);
      })
      .addCase(createBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update building
      .addCase(updateBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBuilding.fulfilled, (state, action: PayloadAction<Building>) => {
        state.loading = false;
        const index = state.buildings.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.buildings[index] = action.payload;
        }
        state.selectedBuilding = action.payload;
      })
      .addCase(updateBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete building
      .addCase(deleteBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBuilding.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.buildings = state.buildings.filter((b) => b.id !== action.payload);
        if (state.selectedBuilding?.id === action.payload) {
          state.selectedBuilding = null;
        }
      })
      .addCase(deleteBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedBuilding } = buildingSlice.actions;

// Selectors
export const selectBuildings = (state: RootState) => state.buildings.buildings;
export const selectSelectedBuilding = (state: RootState) => state.buildings.selectedBuilding;
export const selectBuildingsLoading = (state: RootState) => state.buildings.loading;
export const selectBuildingsError = (state: RootState) => state.buildings.error;

export default buildingSlice.reducer; 