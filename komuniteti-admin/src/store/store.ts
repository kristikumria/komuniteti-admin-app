import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import settingsReducer from './slices/settingsSlice';
import paymentsReducer from './slices/paymentsSlice';
import notificationsReducer from './slices/notificationsSlice';
import chatReducer from './slices/chatSlice';
// Additional reducer imports can be added here if needed

export const store = configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    payments: paymentsReducer,
    notifications: notificationsReducer,
    chat: chatReducer,
    // Additional reducers can be added here when created
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 