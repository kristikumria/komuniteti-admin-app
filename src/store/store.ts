import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';
import paymentsReducer from './slices/paymentsSlice';
import notificationsReducer from './slices/notificationsSlice';
import chatReducer from './slices/chatSlice';
import servicesReducer from './slices/serviceSlice';
import infoPointsReducer from './slices/infoPointSlice';
import buildingsReducer from './slices/buildingSlice';
import administratorsReducer from './slices/administratorSlice';
// Additional reducer imports can be added here if needed

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
    // Additional reducers can be added here when created
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export RootState and AppDispatch types for use in typed hooks and selectors
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 