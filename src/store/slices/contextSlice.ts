import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from './authSlice';

// Types for business accounts and buildings
export interface BusinessAccount {
  id: string;
  name: string;
  address?: string;
  logo?: string;
  buildings: Building[];
}

export interface Building {
  id: string;
  name: string;
  address: string;
  image?: string;
  businessAccountId: string;
  stats?: {
    totalUnits?: number;
    occupiedUnits?: number;
    residentialUnits?: number;
    businessUnits?: number;
  };
}

interface ContextState {
  businessAccounts: BusinessAccount[];
  currentBusinessAccountId: string | null;
  assignedBuildings: Building[];
  currentBuildingId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Mock data for context
const mockBusinessAccounts: BusinessAccount[] = [
  {
    id: 'account-1',
    name: 'Urban Property Management',
    address: 'Rruga Ismail Qemali, Tirana',
    buildings: [
      {
        id: 'building-1',
        name: 'Riviera Towers',
        address: 'Rruga Ismail Qemali 45, Tirana',
        businessAccountId: 'account-1',
        stats: {
          totalUnits: 48,
          occupiedUnits: 42,
          residentialUnits: 40,
          businessUnits: 8
        }
      },
      {
        id: 'building-2',
        name: 'Park View Residence',
        address: 'Rruga Ibrahim Rugova 12, Tirana',
        businessAccountId: 'account-1',
        stats: {
          totalUnits: 36,
          occupiedUnits: 30,
          residentialUnits: 32,
          businessUnits: 4
        }
      }
    ]
  },
  {
    id: 'account-2',
    name: 'Adriatic Real Estate',
    address: 'Bulevardi Dëshmorët e Kombit, Tirana',
    buildings: [
      {
        id: 'building-3',
        name: 'Central Plaza',
        address: 'Bulevardi Dëshmorët e Kombit 15, Tirana',
        businessAccountId: 'account-2',
        stats: {
          totalUnits: 60,
          occupiedUnits: 55,
          residentialUnits: 48,
          businessUnits: 12
        }
      },
      {
        id: 'building-4',
        name: 'Seaside Apartments',
        address: 'Rruga Taulantia 24, Durrës',
        businessAccountId: 'account-2',
        stats: {
          totalUnits: 24,
          occupiedUnits: 20,
          residentialUnits: 22,
          businessUnits: 2
        }
      }
    ]
  }
];

// Create the administrator building mapping
const administratorBuildingAssignments: Record<string, string[]> = {
  'admin1': ['building-1', 'building-3'],
  'admin2': ['building-2', 'building-4']
};

const initialState: ContextState = {
  businessAccounts: mockBusinessAccounts,
  currentBusinessAccountId: 'account-1',
  assignedBuildings: [],
  currentBuildingId: null,
  isLoading: false,
  error: null,
};

// Helper function to get all buildings from all business accounts
const getAllBuildings = (accounts: BusinessAccount[]): Building[] => {
  return accounts.reduce((allBuildings, account) => {
    return [...allBuildings, ...account.buildings];
  }, [] as Building[]);
};

export const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {
    setUserContext: (state, action: PayloadAction<{ userId: string, userRole: UserRole }>) => {
      const { userId, userRole } = action.payload;
      state.isLoading = true;
      
      try {
        if (userRole === 'business_manager') {
          // Business managers have access to all accounts by default
          if (state.businessAccounts.length > 0) {
            state.currentBusinessAccountId = state.businessAccounts[0].id;
            state.assignedBuildings = state.businessAccounts[0].buildings;
            state.currentBuildingId = state.assignedBuildings.length > 0 ? state.assignedBuildings[0].id : null;
          }
        } else if (userRole === 'administrator') {
          // Get assigned buildings for this administrator
          const assignedBuildingIds = administratorBuildingAssignments[userId] || [];
          console.log(`Admin ${userId} assigned buildings:`, assignedBuildingIds);
          
          if (assignedBuildingIds.length === 0) {
            console.warn(`No building assignments found for administrator ${userId}`);
          }
          
          const allBuildings = getAllBuildings(state.businessAccounts);
          
          // Filter to just the buildings assigned to this administrator
          state.assignedBuildings = allBuildings.filter(
            building => assignedBuildingIds.includes(building.id)
          );
          
          // Set current building to the first assigned one
          state.currentBuildingId = state.assignedBuildings.length > 0 ? state.assignedBuildings[0].id : null;
          
          // Find which business account the current building belongs to
          if (state.currentBuildingId) {
            const currentBuilding = state.assignedBuildings.find(b => b.id === state.currentBuildingId);
            if (currentBuilding) {
              state.currentBusinessAccountId = currentBuilding.businessAccountId;
            }
          }
        }
        
        state.isLoading = false;
        state.error = null;
      } catch (error) {
        state.isLoading = false;
        state.error = 'Failed to set user context';
        console.error('Error setting user context:', error);
      }
    },
    
    changeBusinessAccount: (state, action: PayloadAction<string>) => {
      const accountId = action.payload;
      const account = state.businessAccounts.find(a => a.id === accountId);
      
      if (account) {
        state.currentBusinessAccountId = accountId;
        state.assignedBuildings = account.buildings;
        state.currentBuildingId = account.buildings.length > 0 ? account.buildings[0].id : null;
      }
    },
    
    changeBuilding: (state, action: PayloadAction<string>) => {
      const buildingId = action.payload;
      const building = state.assignedBuildings.find(b => b.id === buildingId);
      
      if (building) {
        state.currentBuildingId = buildingId;
      }
    },
    
    refreshContextData: (state) => {
      // In a real app, this would trigger a data fetch
      // For simulation, we're just validating the current selections
      
      // Make sure current business account is valid
      if (state.currentBusinessAccountId) {
        const accountExists = state.businessAccounts.some(
          acc => acc.id === state.currentBusinessAccountId
        );
        
        if (!accountExists) {
          state.currentBusinessAccountId = state.businessAccounts.length > 0 ? 
            state.businessAccounts[0].id : null;
        }
      }
      
      // Make sure current building is valid
      if (state.currentBuildingId) {
        const buildingExists = state.assignedBuildings.some(
          b => b.id === state.currentBuildingId
        );
        
        if (!buildingExists) {
          state.currentBuildingId = state.assignedBuildings.length > 0 ? 
            state.assignedBuildings[0].id : null;
        }
      }
    },
  },
});

export const { 
  setUserContext, 
  changeBusinessAccount, 
  changeBuilding,
  refreshContextData
} = contextSlice.actions;

export default contextSlice.reducer; 