import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  darkMode: boolean;
  language: string;
  notifications: boolean;
}

const initialState: SettingsState = {
  darkMode: false,
  language: 'en',
  notifications: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
    resetSettings: () => initialState,
  },
});

export const { toggleDarkMode, setLanguage, toggleNotifications, resetSettings } = settingsSlice.actions;

export default settingsSlice.reducer; 