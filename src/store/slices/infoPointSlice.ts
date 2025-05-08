import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InfoPoint, InfoPointCategory } from '../../types/infoPointTypes';
import { infoPointService } from '../../services/infoPointService';
import type { RootState } from '../store';

export interface InfoPointState {
  infoPoints: InfoPoint[];
  selectedInfoPoint: InfoPoint | null;
  loading: boolean;
  error: string | null;
  filterCategory: InfoPointCategory | null;
  filterBuildingId: string | null;
}

const initialState: InfoPointState = {
  infoPoints: [],
  selectedInfoPoint: null,
  loading: false,
  error: null,
  filterCategory: null,
  filterBuildingId: null,
};

// Async thunks
export const fetchInfoPoints = createAsyncThunk(
  'infoPoints/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await infoPointService.getInfoPoints();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch info points');
    }
  }
);

export const fetchInfoPointsByBuilding = createAsyncThunk(
  'infoPoints/fetchByBuilding',
  async (buildingId: string, { rejectWithValue }) => {
    try {
      return {
        infoPoints: await infoPointService.getInfoPointsByBuilding(buildingId),
        buildingId
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch info points for this building');
    }
  }
);

export const fetchInfoPointsByCategory = createAsyncThunk(
  'infoPoints/fetchByCategory',
  async (category: InfoPointCategory, { rejectWithValue }) => {
    try {
      return {
        infoPoints: await infoPointService.getInfoPointsByCategory(category),
        category
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch info points for this category');
    }
  }
);

export const fetchInfoPointById = createAsyncThunk(
  'infoPoints/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const infoPoint = await infoPointService.getInfoPointById(id);
      if (!infoPoint) {
        throw new Error('Info point not found');
      }
      return infoPoint;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch info point');
    }
  }
);

export const createInfoPoint = createAsyncThunk(
  'infoPoints/create',
  async (infoPointData: Omit<InfoPoint, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      return await infoPointService.createInfoPoint(infoPointData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create info point');
    }
  }
);

export const updateInfoPoint = createAsyncThunk(
  'infoPoints/update',
  async (
    { id, updates }: { id: string; updates: Partial<Omit<InfoPoint, 'id' | 'createdAt'>> },
    { rejectWithValue }
  ) => {
    try {
      const infoPoint = await infoPointService.updateInfoPoint(id, updates);
      if (!infoPoint) {
        throw new Error('Info point not found');
      }
      return infoPoint;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update info point');
    }
  }
);

export const deleteInfoPoint = createAsyncThunk(
  'infoPoints/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const success = await infoPointService.deleteInfoPoint(id);
      if (!success) {
        throw new Error('Failed to delete info point');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete info point');
    }
  }
);

export const togglePinStatus = createAsyncThunk(
  'infoPoints/togglePin',
  async (id: string, { rejectWithValue }) => {
    try {
      const infoPoint = await infoPointService.togglePinStatus(id);
      if (!infoPoint) {
        throw new Error('Info point not found');
      }
      return infoPoint;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle pin status');
    }
  }
);

export const togglePublishStatus = createAsyncThunk(
  'infoPoints/togglePublish',
  async (id: string, { rejectWithValue }) => {
    try {
      const infoPoint = await infoPointService.togglePublishStatus(id);
      if (!infoPoint) {
        throw new Error('Info point not found');
      }
      return infoPoint;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle publish status');
    }
  }
);

const infoPointSlice = createSlice({
  name: 'infoPoints',
  initialState,
  reducers: {
    clearSelectedInfoPoint: (state) => {
      state.selectedInfoPoint = null;
    },
    setCategoryFilter: (state, action: PayloadAction<InfoPointCategory | null>) => {
      state.filterCategory = action.payload;
    },
    setBuildingFilter: (state, action: PayloadAction<string | null>) => {
      state.filterBuildingId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all info points
      .addCase(fetchInfoPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfoPoints.fulfilled, (state, action: PayloadAction<InfoPoint[]>) => {
        state.loading = false;
        state.infoPoints = action.payload;
      })
      .addCase(fetchInfoPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch info points by building
      .addCase(fetchInfoPointsByBuilding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfoPointsByBuilding.fulfilled, (state, action: PayloadAction<{infoPoints: InfoPoint[], buildingId: string}>) => {
        state.loading = false;
        state.infoPoints = action.payload.infoPoints;
        state.filterBuildingId = action.payload.buildingId;
      })
      .addCase(fetchInfoPointsByBuilding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch info points by category
      .addCase(fetchInfoPointsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfoPointsByCategory.fulfilled, (state, action: PayloadAction<{infoPoints: InfoPoint[], category: InfoPointCategory}>) => {
        state.loading = false;
        state.infoPoints = action.payload.infoPoints;
        state.filterCategory = action.payload.category;
      })
      .addCase(fetchInfoPointsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch info point by ID
      .addCase(fetchInfoPointById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInfoPointById.fulfilled, (state, action: PayloadAction<InfoPoint>) => {
        state.loading = false;
        state.selectedInfoPoint = action.payload;
      })
      .addCase(fetchInfoPointById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create info point
      .addCase(createInfoPoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInfoPoint.fulfilled, (state, action: PayloadAction<InfoPoint>) => {
        state.loading = false;
        state.infoPoints.push(action.payload);
      })
      .addCase(createInfoPoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update info point
      .addCase(updateInfoPoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInfoPoint.fulfilled, (state, action: PayloadAction<InfoPoint>) => {
        state.loading = false;
        const index = state.infoPoints.findIndex((ip) => ip.id === action.payload.id);
        if (index !== -1) {
          state.infoPoints[index] = action.payload;
        }
        state.selectedInfoPoint = action.payload;
      })
      .addCase(updateInfoPoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete info point
      .addCase(deleteInfoPoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInfoPoint.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.infoPoints = state.infoPoints.filter((ip) => ip.id !== action.payload);
        if (state.selectedInfoPoint?.id === action.payload) {
          state.selectedInfoPoint = null;
        }
      })
      .addCase(deleteInfoPoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle pin status
      .addCase(togglePinStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePinStatus.fulfilled, (state, action: PayloadAction<InfoPoint>) => {
        state.loading = false;
        const index = state.infoPoints.findIndex((ip) => ip.id === action.payload.id);
        if (index !== -1) {
          state.infoPoints[index] = action.payload;
        }
        if (state.selectedInfoPoint?.id === action.payload.id) {
          state.selectedInfoPoint = action.payload;
        }
      })
      .addCase(togglePinStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Toggle publish status
      .addCase(togglePublishStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePublishStatus.fulfilled, (state, action: PayloadAction<InfoPoint>) => {
        state.loading = false;
        const index = state.infoPoints.findIndex((ip) => ip.id === action.payload.id);
        if (index !== -1) {
          state.infoPoints[index] = action.payload;
        }
        if (state.selectedInfoPoint?.id === action.payload.id) {
          state.selectedInfoPoint = action.payload;
        }
      })
      .addCase(togglePublishStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedInfoPoint, setCategoryFilter, setBuildingFilter } = infoPointSlice.actions;

// Selectors
export const selectInfoPoints = (state: RootState) => state.infoPoints.infoPoints;
export const selectSelectedInfoPoint = (state: RootState) => state.infoPoints.selectedInfoPoint;
export const selectInfoPointsLoading = (state: RootState) => state.infoPoints.loading;
export const selectInfoPointsError = (state: RootState) => state.infoPoints.error;
export const selectCategoryFilter = (state: RootState) => state.infoPoints.filterCategory;
export const selectBuildingFilter = (state: RootState) => state.infoPoints.filterBuildingId;

// Filtered selectors
export const selectPinnedInfoPoints = (state: RootState) => 
  state.infoPoints.infoPoints.filter(ip => ip.pinned);

export const selectPublishedInfoPoints = (state: RootState) => 
  state.infoPoints.infoPoints.filter(ip => ip.published);

export const selectFilteredInfoPoints = (state: RootState) => {
  let filtered = [...state.infoPoints.infoPoints];
  
  // Apply building filter if set
  if (state.infoPoints.filterBuildingId) {
    filtered = filtered.filter(
      ip => ip.buildingId === state.infoPoints.filterBuildingId || !ip.buildingId
    );
  }
  
  // Apply category filter if set
  if (state.infoPoints.filterCategory) {
    filtered = filtered.filter(ip => ip.category === state.infoPoints.filterCategory);
  }
  
  return filtered;
};

export default infoPointSlice.reducer; 