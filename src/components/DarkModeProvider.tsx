import React, { createContext, useContext, ReactNode } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleDarkMode } from '../store/slices/settingsSlice';

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

/**
 * Provider component that exposes dark mode state and toggling function
 * Makes it easier to access dark mode status across the app
 */
export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);

  const toggleTheme = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

/**
 * Hook to access dark mode state and toggling function
 * @returns {DarkModeContextType} Object containing isDarkMode and toggleTheme
 */
export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}; 