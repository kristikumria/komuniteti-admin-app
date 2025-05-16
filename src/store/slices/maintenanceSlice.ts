import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { MaintenanceRequest, MaintenanceWorker, MaintenanceComment, MaintenanceDocument, MaintenanceAnalytics, MaintenanceStatus, MaintenanceType, MaintenancePriority } from '../../types/maintenanceTypes';
import { maintenanceService } from '../../services/maintenanceService';
import { RootState } from '../store';

// Define the initial state
interface MaintenanceState {
  // Requests
  requests: MaintenanceRequest[];
  requestsLoading: boolean;
  requestsError: string | null;
  currentRequest: MaintenanceRequest | null;
  currentRequestLoading: boolean;
  currentRequestError: string | null;
  
  // Workers
  workers: MaintenanceWorker[];
  workersLoading: boolean;
  workersError: string | null;
  
  // Analytics
  analytics: MaintenanceAnalytics | null;
  analyticsLoading: boolean;
  analyticsError: string | null;
  
  // Filters
  statusFilter: MaintenanceStatus | 'all';
  typeFilter: MaintenanceType | 'all';
  searchQuery: string;
  buildingFilter: string | null;
  unitFilter: string | null;
  dateRangeFilter: {
    startDate: string | null;
    endDate: string | null;
  };
  
  // Workflow operation states
  priorityUpdateLoading: boolean;
  priorityUpdateError: string | null;
  commentAddLoading: boolean;
  commentAddError: string | null;
  assignmentLoading: boolean;
  assignmentError: string | null;
  statusUpdateLoading: boolean;
  statusUpdateError: string | null;
}

const initialState: MaintenanceState = {
  // Requests
  requests: [],
  requestsLoading: false,
  requestsError: null,
  currentRequest: null,
  currentRequestLoading: false,
  currentRequestError: null,
  
  // Workers
  workers: [],
  workersLoading: false,
  workersError: null,
  
  // Analytics
  analytics: null,
  analyticsLoading: false,
  analyticsError: null,
  
  // Filters
  statusFilter: 'all',
  typeFilter: 'all',
  searchQuery: '',
  buildingFilter: null,
  unitFilter: null,
  dateRangeFilter: {
    startDate: null,
    endDate: null,
  },
  
  // Workflow operation states
  priorityUpdateLoading: false,
  priorityUpdateError: null,
  commentAddLoading: false,
  commentAddError: null,
  assignmentLoading: false,
  assignmentError: null,
  statusUpdateLoading: false,
  statusUpdateError: null,
};

// Async thunks
export const fetchAllRequests = createAsyncThunk(
  'maintenance/fetchAllRequests',
  async (_, { rejectWithValue }) => {
    try {
      const requests = await maintenanceService.getAllRequests();
      return requests;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch maintenance requests');
    }
  }
);

export const fetchRequestsByBuilding = createAsyncThunk(
  'maintenance/fetchRequestsByBuilding',
  async (buildingId: string, { rejectWithValue }) => {
    try {
      const requests = await maintenanceService.getRequestsByBuilding(buildingId);
      return { buildingId, requests };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch maintenance requests for building');
    }
  }
);

export const fetchRequestsByUnit = createAsyncThunk(
  'maintenance/fetchRequestsByUnit',
  async (unitId: string, { rejectWithValue }) => {
    try {
      const requests = await maintenanceService.getRequestsByUnit(unitId);
      return { unitId, requests };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch maintenance requests for unit');
    }
  }
);

export const fetchRequestById = createAsyncThunk(
  'maintenance/fetchRequestById',
  async (requestId: string, { rejectWithValue }) => {
    try {
      const request = await maintenanceService.getRequestById(requestId);
      return request;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch maintenance request');
    }
  }
);

export const createRequest = createAsyncThunk(
  'maintenance/createRequest',
  async (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const newRequest = await maintenanceService.createRequest(request);
      return newRequest;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create maintenance request');
    }
  }
);

export const updateRequest = createAsyncThunk(
  'maintenance/updateRequest',
  async ({ requestId, updates }: { requestId: string; updates: Partial<MaintenanceRequest> }, { rejectWithValue }) => {
    try {
      const updatedRequest = await maintenanceService.updateRequest(requestId, updates);
      return updatedRequest;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update maintenance request');
    }
  }
);

export const deleteRequest = createAsyncThunk(
  'maintenance/deleteRequest',
  async (requestId: string, { rejectWithValue }) => {
    try {
      await maintenanceService.deleteRequest(requestId);
      return requestId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete maintenance request');
    }
  }
);

export const addComment = createAsyncThunk(
  'maintenance/addComment',
  async ({
    requestId,
    comment
  }: { 
    requestId: string; 
    comment: Omit<MaintenanceComment, 'id' | 'maintenanceRequestId' | 'createdAt'>;
  }, { rejectWithValue }) => {
    try {
      const newComment = await maintenanceService.addComment(requestId, comment);
      return { requestId, newComment };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add comment');
    }
  }
);

export const fetchWorkers = createAsyncThunk(
  'maintenance/fetchWorkers',
  async (_, { rejectWithValue }) => {
    try {
      const workers = await maintenanceService.getAllWorkers();
      return workers;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch maintenance workers');
    }
  }
);

export const fetchWorkersBySpecialty = createAsyncThunk(
  'maintenance/fetchWorkersBySpecialty',
  async (specialty: MaintenanceType, { rejectWithValue }) => {
    try {
      const workers = await maintenanceService.getWorkersBySpecialty(specialty);
      return workers;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch maintenance workers by specialty');
    }
  }
);

export const assignRequestToWorker = createAsyncThunk(
  'maintenance/assignRequestToWorker',
  async ({
    requestId,
    workerId,
    workerName
  }: {
    requestId: string;
    workerId: string;
    workerName: string;
  }, { rejectWithValue }) => {
    try {
      const updatedRequest = await maintenanceService.assignRequestToWorker(
        requestId,
        workerId,
        workerName
      );
      return updatedRequest;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to assign maintenance request to worker');
    }
  }
);

export const updateRequestStatus = createAsyncThunk(
  'maintenance/updateRequestStatus',
  async ({
    requestId,
    status,
    details
  }: {
    requestId: string;
    status: MaintenanceStatus;
    details?: string;
  }, { rejectWithValue }) => {
    try {
      const updatedRequest = await maintenanceService.updateRequestStatus(
        requestId,
        status,
        details
      );
      return updatedRequest;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update maintenance request status');
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  'maintenance/fetchAnalytics',
  async (buildingId: string | undefined, { rejectWithValue }) => {
    try {
      const analytics = await maintenanceService.getAnalytics(buildingId);
      return analytics;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch maintenance analytics');
    }
  }
);

// Add new thunks for maintenance workflow
export const updateRequestPriority = createAsyncThunk(
  'maintenance/updateRequestPriority',
  async ({
    requestId,
    priority
  }: {
    requestId: string;
    priority: MaintenancePriority;
  }, { rejectWithValue }) => {
    try {
      const updatedRequest = await maintenanceService.updateRequest(requestId, { priority });
      return updatedRequest;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update request priority');
    }
  }
);

export const addMaintenanceComment = createAsyncThunk(
  'maintenance/addMaintenanceComment',
  async ({
    requestId,
    comment
  }: {
    requestId: string;
    comment: Omit<MaintenanceComment, 'id' | 'maintenanceRequestId' | 'createdAt'>;
  }, { rejectWithValue }) => {
    try {
      const newComment = await maintenanceService.addComment(requestId, comment);
      return { requestId, newComment };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add comment to maintenance request');
    }
  }
);

export const assignMaintenanceToWorker = createAsyncThunk(
  'maintenance/assignMaintenanceToWorker',
  async ({
    requestId,
    workerId,
    workerName
  }: {
    requestId: string;
    workerId: string;
    workerName: string;
  }, { rejectWithValue }) => {
    try {
      const updatedRequest = await maintenanceService.assignRequestToWorker(
        requestId,
        workerId,
        workerName
      );
      return updatedRequest;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to assign maintenance request to worker');
    }
  }
);

export const updateMaintenanceStatus = createAsyncThunk(
  'maintenance/updateMaintenanceStatus',
  async ({
    requestId,
    status,
    resolutionDetails,
    actualCost
  }: {
    requestId: string;
    status: MaintenanceStatus;
    resolutionDetails?: string;
    actualCost?: number;
  }, { rejectWithValue }) => {
    try {
      // First update the status
      const statusUpdatedRequest = await maintenanceService.updateRequestStatus(
        requestId,
        status,
        resolutionDetails
      );
      
      // If there's a cost, update that too
      if (actualCost !== undefined && status === 'resolved') {
        return await maintenanceService.updateRequest(requestId, { 
          ...statusUpdatedRequest,
          actualCost
        });
      }
      
      return statusUpdatedRequest;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update maintenance status');
    }
  }
);

// Create the maintenance slice
const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    // Filter actions
    setStatusFilter: (state, action: PayloadAction<MaintenanceStatus | 'all'>) => {
      state.statusFilter = action.payload;
    },
    setTypeFilter: (state, action: PayloadAction<MaintenanceType | 'all'>) => {
      state.typeFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setBuildingFilter: (state, action: PayloadAction<string | null>) => {
      state.buildingFilter = action.payload;
    },
    setUnitFilter: (state, action: PayloadAction<string | null>) => {
      state.unitFilter = action.payload;
    },
    setDateRangeFilter: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null }>) => {
      state.dateRangeFilter = action.payload;
    },
    clearFilters: (state) => {
      state.statusFilter = 'all';
      state.typeFilter = 'all';
      state.searchQuery = '';
      state.buildingFilter = null;
      state.unitFilter = null;
      state.dateRangeFilter = {
        startDate: null,
        endDate: null,
      };
    },
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
      state.currentRequestError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all requests
    builder
      .addCase(fetchAllRequests.pending, (state) => {
        state.requestsLoading = true;
        state.requestsError = null;
      })
      .addCase(fetchAllRequests.fulfilled, (state, action) => {
        state.requestsLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchAllRequests.rejected, (state, action) => {
        state.requestsLoading = false;
        state.requestsError = action.payload as string;
      })
      
      // Fetch requests by building
      .addCase(fetchRequestsByBuilding.pending, (state) => {
        state.requestsLoading = true;
        state.requestsError = null;
      })
      .addCase(fetchRequestsByBuilding.fulfilled, (state, action) => {
        state.requestsLoading = false;
        state.requests = action.payload.requests;
        state.buildingFilter = action.payload.buildingId;
      })
      .addCase(fetchRequestsByBuilding.rejected, (state, action) => {
        state.requestsLoading = false;
        state.requestsError = action.payload as string;
      })
      
      // Fetch requests by unit
      .addCase(fetchRequestsByUnit.pending, (state) => {
        state.requestsLoading = true;
        state.requestsError = null;
      })
      .addCase(fetchRequestsByUnit.fulfilled, (state, action) => {
        state.requestsLoading = false;
        state.requests = action.payload.requests;
        state.unitFilter = action.payload.unitId;
      })
      .addCase(fetchRequestsByUnit.rejected, (state, action) => {
        state.requestsLoading = false;
        state.requestsError = action.payload as string;
      })
      
      // Fetch single request
      .addCase(fetchRequestById.pending, (state) => {
        state.currentRequestLoading = true;
        state.currentRequestError = null;
      })
      .addCase(fetchRequestById.fulfilled, (state, action) => {
        state.currentRequestLoading = false;
        state.currentRequest = action.payload;
      })
      .addCase(fetchRequestById.rejected, (state, action) => {
        state.currentRequestLoading = false;
        state.currentRequestError = action.payload as string;
      })
      
      // Create request
      .addCase(createRequest.fulfilled, (state, action) => {
        state.requests.unshift(action.payload);
        state.currentRequest = action.payload;
      })
      
      // Update request
      .addCase(updateRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      
      // Delete request
      .addCase(deleteRequest.fulfilled, (state, action) => {
        state.requests = state.requests.filter(req => req.id !== action.payload);
        if (state.currentRequest?.id === action.payload) {
          state.currentRequest = null;
        }
      })
      
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { requestId, newComment } = action.payload;
        
        // Add to current request if it's the active one
        if (state.currentRequest?.id === requestId) {
          if (!state.currentRequest.comments) {
            state.currentRequest.comments = [];
          }
          state.currentRequest.comments.push(newComment);
        }
        
        // Add to the request in the list
        const requestIndex = state.requests.findIndex(req => req.id === requestId);
        if (requestIndex !== -1) {
          if (!state.requests[requestIndex].comments) {
            state.requests[requestIndex].comments = [];
          }
          state.requests[requestIndex].comments!.push(newComment);
        }
      })
      
      // Fetch workers
      .addCase(fetchWorkers.pending, (state) => {
        state.workersLoading = true;
        state.workersError = null;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.workersLoading = false;
        state.workers = action.payload;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.workersLoading = false;
        state.workersError = action.payload as string;
      })
      
      // Fetch workers by specialty
      .addCase(fetchWorkersBySpecialty.fulfilled, (state, action) => {
        state.workersLoading = false;
        state.workers = action.payload;
      })
      
      // Assign request to worker
      .addCase(assignRequestToWorker.fulfilled, (state, action) => {
        const index = state.requests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      
      // Update request status
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const index = state.requests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      
      // Fetch analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.analyticsError = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsError = action.payload as string;
      })
      
      // Update request priority
      .addCase(updateRequestPriority.pending, (state) => {
        state.priorityUpdateLoading = true;
        state.priorityUpdateError = null;
      })
      .addCase(updateRequestPriority.fulfilled, (state, action) => {
        state.priorityUpdateLoading = false;
        const index = state.requests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(updateRequestPriority.rejected, (state, action) => {
        state.priorityUpdateLoading = false;
        state.priorityUpdateError = action.payload as string;
      })
      
      // Add maintenance comment
      .addCase(addMaintenanceComment.pending, (state) => {
        state.commentAddLoading = true;
        state.commentAddError = null;
      })
      .addCase(addMaintenanceComment.fulfilled, (state, action) => {
        state.commentAddLoading = false;
        const { requestId, newComment } = action.payload;
        
        // Add to current request if it's the active one
        if (state.currentRequest?.id === requestId) {
          if (!state.currentRequest.comments) {
            state.currentRequest.comments = [];
          }
          state.currentRequest.comments.push(newComment);
        }
        
        // Add to the request in the list
        const requestIndex = state.requests.findIndex(req => req.id === requestId);
        if (requestIndex !== -1) {
          if (!state.requests[requestIndex].comments) {
            state.requests[requestIndex].comments = [];
          }
          state.requests[requestIndex].comments!.push(newComment);
        }
      })
      .addCase(addMaintenanceComment.rejected, (state, action) => {
        state.commentAddLoading = false;
        state.commentAddError = action.payload as string;
      })
      
      // Assign maintenance to worker
      .addCase(assignMaintenanceToWorker.pending, (state) => {
        state.assignmentLoading = true;
        state.assignmentError = null;
      })
      .addCase(assignMaintenanceToWorker.fulfilled, (state, action) => {
        state.assignmentLoading = false;
        const index = state.requests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(assignMaintenanceToWorker.rejected, (state, action) => {
        state.assignmentLoading = false;
        state.assignmentError = action.payload as string;
      })
      
      // Update maintenance status
      .addCase(updateMaintenanceStatus.pending, (state) => {
        state.statusUpdateLoading = true;
        state.statusUpdateError = null;
      })
      .addCase(updateMaintenanceStatus.fulfilled, (state, action) => {
        state.statusUpdateLoading = false;
        const index = state.requests.findIndex(req => req.id === action.payload.id);
        if (index !== -1) {
          state.requests[index] = action.payload;
        }
        if (state.currentRequest?.id === action.payload.id) {
          state.currentRequest = action.payload;
        }
      })
      .addCase(updateMaintenanceStatus.rejected, (state, action) => {
        state.statusUpdateLoading = false;
        state.statusUpdateError = action.payload as string;
      });
  },
});

// Export actions
export const {
  setStatusFilter,
  setTypeFilter,
  setSearchQuery,
  setBuildingFilter,
  setUnitFilter,
  setDateRangeFilter,
  clearFilters,
  clearCurrentRequest,
} = maintenanceSlice.actions;

// Export selectors
export const selectAllRequests = (state: RootState) => state.maintenance.requests;
export const selectRequestsLoading = (state: RootState) => state.maintenance.requestsLoading;
export const selectRequestsError = (state: RootState) => state.maintenance.requestsError;
export const selectCurrentRequest = (state: RootState) => state.maintenance.currentRequest;
export const selectCurrentRequestLoading = (state: RootState) => state.maintenance.currentRequestLoading;
export const selectCurrentRequestError = (state: RootState) => state.maintenance.currentRequestError;

export const selectWorkers = (state: RootState) => state.maintenance.workers;
export const selectWorkersLoading = (state: RootState) => state.maintenance.workersLoading;
export const selectWorkersError = (state: RootState) => state.maintenance.workersError;

export const selectAnalytics = (state: RootState) => state.maintenance.analytics;
export const selectAnalyticsLoading = (state: RootState) => state.maintenance.analyticsLoading;
export const selectAnalyticsError = (state: RootState) => state.maintenance.analyticsError;

// Memoized selectors
export const selectMaintenanceState = (state: RootState) => state.maintenance;

export const selectFilters = createSelector(
  [selectMaintenanceState],
  (maintenance) => ({
    statusFilter: maintenance.statusFilter,
    typeFilter: maintenance.typeFilter,
    searchQuery: maintenance.searchQuery,
    buildingFilter: maintenance.buildingFilter,
    unitFilter: maintenance.unitFilter,
    dateRangeFilter: maintenance.dateRangeFilter,
  })
);

// Filter requests based on the current filters
export const selectFilteredRequests = createSelector(
  [selectAllRequests, selectMaintenanceState],
  (requests, maintenance) => {
    const { 
      statusFilter, 
      typeFilter, 
      searchQuery, 
      buildingFilter, 
      unitFilter, 
      dateRangeFilter 
    } = maintenance;
    
    return requests.filter(request => {
      // Status filter
      if (statusFilter !== 'all' && request.status !== statusFilter) {
        return false;
      }
      
      // Type filter
      if (typeFilter !== 'all' && request.type !== typeFilter) {
        return false;
      }
      
      // Building filter
      if (buildingFilter && request.buildingId !== buildingFilter) {
        return false;
      }
      
      // Unit filter
      if (unitFilter && request.unitId !== unitFilter) {
        return false;
      }
      
      // Date range filter
      const createdAt = new Date(request.createdAt).getTime();
      if (dateRangeFilter.startDate && new Date(dateRangeFilter.startDate).getTime() > createdAt) {
        return false;
      }
      if (dateRangeFilter.endDate && new Date(dateRangeFilter.endDate).getTime() < createdAt) {
        return false;
      }
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          request.title.toLowerCase().includes(query) ||
          request.description.toLowerCase().includes(query) ||
          request.location.toLowerCase().includes(query) ||
          request.buildingName.toLowerCase().includes(query) ||
          (request.unitNumber && request.unitNumber.toLowerCase().includes(query)) ||
          (request.submitterName && request.submitterName.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }
);

// Export additional selectors for workflow operation states
export const selectPriorityUpdateLoading = (state: RootState) => state.maintenance.priorityUpdateLoading;
export const selectPriorityUpdateError = (state: RootState) => state.maintenance.priorityUpdateError;
export const selectCommentAddLoading = (state: RootState) => state.maintenance.commentAddLoading;
export const selectCommentAddError = (state: RootState) => state.maintenance.commentAddError;
export const selectAssignmentLoading = (state: RootState) => state.maintenance.assignmentLoading;
export const selectAssignmentError = (state: RootState) => state.maintenance.assignmentError;
export const selectStatusUpdateLoading = (state: RootState) => state.maintenance.statusUpdateLoading;
export const selectStatusUpdateError = (state: RootState) => state.maintenance.statusUpdateError;

// Export reducer
export default maintenanceSlice.reducer; 