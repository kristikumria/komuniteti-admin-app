import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { BusinessAccount, Building, setUserContext, changeBusinessAccount, changeBuilding, refreshContextData } from '../store/slices/contextSlice';

/**
 * Custom hook for accessing and managing context data
 * Makes it easy to access the current context and related actions
 */
export const useContextData = () => {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get user info from auth slice
  const auth = useAppSelector((state) => state.auth);
  const userRole = auth.user?.role;
  
  // Get context data from context slice
  const { 
    businessAccounts,
    currentBusinessAccountId,
    assignedBuildings,
    currentBuildingId,
    isLoading,
    error
  } = useAppSelector((state) => state.context);
  
  // Current business account object
  const currentBusinessAccount = currentBusinessAccountId ? 
    businessAccounts.find(account => account.id === currentBusinessAccountId) || null : null;
  
  // Current building object
  const currentBuilding = currentBuildingId ? 
    assignedBuildings.find(building => building.id === currentBuildingId) || null : null;
  
  // Initialize context data when component mounts
  useEffect(() => {
    if (auth.user && userRole && !isInitialized) {
      console.log('Initializing context for user:', auth.user.id, 'with role:', userRole);
      dispatch(setUserContext({ userId: auth.user.id, userRole }));
      setIsInitialized(true);
    }
  }, [dispatch, auth.user, userRole, isInitialized]);
  
  // Log changes to the context
  useEffect(() => {
    if (currentBuilding) {
      console.log('Current building context changed:', currentBuilding.name);
    } else if (assignedBuildings.length > 0) {
      console.log('No current building selected but has assigned buildings:', assignedBuildings.length);
    }
  }, [currentBuilding, assignedBuildings]);
  
  /**
   * Change the current business account (for business managers)
   */
  const handleChangeBusinessAccount = (accountId: string) => {
    console.log('Changing business account to:', accountId);
    dispatch(changeBusinessAccount(accountId));
  };
  
  /**
   * Change the current building (for administrators)
   */
  const handleChangeBuilding = (buildingId: string) => {
    console.log('Changing building to:', buildingId);
    dispatch(changeBuilding(buildingId));
  };
  
  /**
   * Reload context data
   */
  const handleRefreshContextData = () => {
    console.log('Refreshing context data');
    dispatch(refreshContextData());
  };
  
  /**
   * Determine if the current role is authorized for a specific context
   */
  const isAuthorizedForContext = (requiredRole: string, contextId: string | null): boolean => {
    if (!auth.user) return false;
    
    // If no specific context is required, just check the role
    if (!contextId) {
      return auth.user.role === requiredRole;
    }
    
    // For specific contexts, check access
    if (requiredRole === 'business_manager' && contextId) {
      return businessAccounts.some(account => account.id === contextId);
    }
    
    if (requiredRole === 'administrator' && contextId) {
      return assignedBuildings.some(building => building.id === contextId);
    }
    
    return false;
  };
  
  return {
    // Context data
    userRole,
    businessAccounts,
    currentBusinessAccount,
    assignedBuildings,
    currentBuilding,
    isLoading,
    error,
    
    // Actions
    changeBusinessAccount: handleChangeBusinessAccount,
    changeBuilding: handleChangeBuilding,
    refreshContextData: handleRefreshContextData,
    isAuthorizedForContext,
  };
}; 