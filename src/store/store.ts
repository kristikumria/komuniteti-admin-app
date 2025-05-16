import { configureStore } from '@reduxjs/toolkit';

// Reducers
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import settingsReducer from './slices/settingsSlice';
import paymentsReducer from './slices/paymentsSlice';
import notificationsReducer from './slices/notificationsSlice';
import servicesReducer from './slices/serviceSlice';
import infoPointsReducer from './slices/infoPointSlice';
import buildingsReducer from './slices/buildingSlice';
import administratorsReducer from './slices/administratorSlice';
import pollsReducer from './slices/pollsSlice';
import contextReducer from './slices/contextSlice';
import businessAccountReducer from './slices/businessAccountSlice';
import maintenanceReducer from './slices/maintenanceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    payments: paymentsReducer,
    notifications: notificationsReducer,
    chat: chatReducer,
    services: servicesReducer,
    infoPoints: infoPointsReducer,
    buildings: buildingsReducer,
    administrators: administratorsReducer,
    polls: pollsReducer,
    context: contextReducer,
    businessAccount: businessAccountReducer,
    maintenance: maintenanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // Enable thunk middleware
      thunk: true,
    }),
});

// Export RootState and AppDispatch types for use in typed hooks and selectors
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 