import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  setBusinessAccounts, 
  setAssignedBuildings, 
  setContextLoading, 
  setContextError 
} from '../slices/contextSlice';
import { 
  fetchBusinessAccounts, 
  fetchAssignedBuildings, 
  fetchBuildingsForBusinessAccount 
} from '../../services/contextService';
import { AppDispatch, RootState } from '../store';
import { UserRole } from '../slices/authSlice';

/**
 * Load initial context data based on user role
 */
export const loadContextData = (userRole: UserRole) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setContextLoading(true));
    
    if (userRole === 'business_manager') {
      // Load business accounts for business manager
      const accounts = await fetchBusinessAccounts();
      dispatch(setBusinessAccounts(accounts));
      
      // If we have accounts, fetch buildings for the first account
      if (accounts.length > 0) {
        // This would normally happen when a user selects a business account,
        // but for simplicity, we're loading buildings for the first account
        await dispatch(loadBuildingsForBusinessAccount(accounts[0].id));
      }
    } else {
      // Load assigned buildings for administrator
      const buildings = await fetchAssignedBuildings();
      dispatch(setAssignedBuildings(buildings));
    }
    
    dispatch(setContextLoading(false));
    dispatch(setContextError(null));
  } catch (error) {
    dispatch(setContextLoading(false));
    dispatch(setContextError((error as Error).message));
  }
};

/**
 * Load buildings for a specific business account
 */
export const loadBuildingsForBusinessAccount = (businessAccountId: string) => 
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(setContextLoading(true));
      
      const buildings = await fetchBuildingsForBusinessAccount(businessAccountId);
      
      // In a real app, we might update buildings in a separate slice
      // For this example, we don't need to do anything with the returned buildings
      // as they would be loaded into a buildings slice
      
      dispatch(setContextLoading(false));
      dispatch(setContextError(null));
      
      return buildings;
    } catch (error) {
      dispatch(setContextLoading(false));
      dispatch(setContextError((error as Error).message));
      return [];
    }
  }; 