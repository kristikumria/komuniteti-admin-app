import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BusinessAccount } from '../../navigation/types';

// Mock data for business accounts
const mockBusinessAccounts: BusinessAccount[] = [
  {
    id: 'ba-1',
    name: 'Komuniteti Holdings',
    description: 'Main real estate management company',
    type: 'Property Management',
    buildings: 12,
    administrators: 8,
    residents: 450,
    address: 'Rruga Ismail Qemali, Tirana',
    email: 'info@komuniteti.al',
    phone: '+355 69 123 4567',
    logoUrl: 'https://via.placeholder.com/100',
    createdAt: '2022-01-15',
    performanceMetrics: {
      occupancyRate: 94,
      revenueGrowth: 8.5,
      maintenanceCosts: -2.3,
      tenantSatisfaction: 4.7
    },
    pendingIssues: 5
  },
  {
    id: 'ba-2',
    name: 'Urban Spaces',
    description: 'Commercial property management',
    type: 'Commercial Property',
    buildings: 5,
    administrators: 3,
    residents: 65,
    address: 'Rruga Ibrahim Rugova, Tirana',
    email: 'contact@urbanspaces.al',
    phone: '+355 69 876 5432',
    logoUrl: 'https://via.placeholder.com/100',
    createdAt: '2022-05-20',
    performanceMetrics: {
      occupancyRate: 88,
      revenueGrowth: 12.1,
      maintenanceCosts: 1.5,
      tenantSatisfaction: 4.2
    },
    pendingIssues: 2
  },
  {
    id: 'ba-3',
    name: 'Luxury Residences',
    description: 'High-end residential property',
    type: 'Luxury Residential',
    buildings: 3,
    administrators: 2,
    residents: 120,
    address: 'Rruga Mustafa Matohiti, Tirana',
    email: 'info@luxuryresidences.al',
    phone: '+355 69 987 6543',
    logoUrl: 'https://via.placeholder.com/100',
    createdAt: '2022-08-10',
    performanceMetrics: {
      occupancyRate: 97,
      revenueGrowth: 5.2,
      maintenanceCosts: -3.8,
      tenantSatisfaction: 4.9
    },
    pendingIssues: 0
  },
];

export interface BusinessAccountState {
  accounts: BusinessAccount[];
  selectedAccount: BusinessAccount | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessAccountState = {
  accounts: mockBusinessAccounts,
  selectedAccount: mockBusinessAccounts[0],
  loading: false,
  error: null,
};

const businessAccountSlice = createSlice({
  name: 'businessAccount',
  initialState,
  reducers: {
    setSelectedAccount: (state, action: PayloadAction<BusinessAccount>) => {
      state.selectedAccount = action.payload;
    },
    setAccounts: (state, action: PayloadAction<BusinessAccount[]>) => {
      state.accounts = action.payload;
      // If the currently selected account is not in the new list, select the first one
      if (state.selectedAccount && !state.accounts.find(account => account.id === state.selectedAccount?.id)) {
        state.selectedAccount = state.accounts.length > 0 ? state.accounts[0] : null;
      }
    },
    addAccount: (state, action: PayloadAction<BusinessAccount>) => {
      state.accounts.push(action.payload);
    },
    updateAccount: (state, action: PayloadAction<BusinessAccount>) => {
      const index = state.accounts.findIndex(account => account.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
        // Update selected account if it's the one being updated
        if (state.selectedAccount?.id === action.payload.id) {
          state.selectedAccount = action.payload;
        }
      }
    },
    deleteAccount: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(account => account.id !== action.payload);
      // If the deleted account is the selected one, select the first available account
      if (state.selectedAccount?.id === action.payload) {
        state.selectedAccount = state.accounts.length > 0 ? state.accounts[0] : null;
      }
    },
    fetchAccountsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAccountsSuccess: (state, action: PayloadAction<BusinessAccount[]>) => {
      state.accounts = action.payload;
      state.loading = false;
      // If there's no selected account yet, select the first one
      if (!state.selectedAccount && action.payload.length > 0) {
        state.selectedAccount = action.payload[0];
      }
    },
    fetchAccountsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { 
  setSelectedAccount, 
  setAccounts, 
  addAccount, 
  updateAccount, 
  deleteAccount,
  fetchAccountsStart,
  fetchAccountsSuccess,
  fetchAccountsFailure
} = businessAccountSlice.actions;

export default businessAccountSlice.reducer; 