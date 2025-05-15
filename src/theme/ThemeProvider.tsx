import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { theme as lightTheme } from './theme';
import { useColorScheme } from 'react-native';
import { useAppSelector } from '../store/hooks';

// ADD THIS GLOBAL MOCK to fix "Property 'theme' doesn't exist" error
// This ensures 'theme' is always available globally
if (typeof global.theme === 'undefined') {
  global.theme = {
    colors: {
      primary: '#1363DF',
      secondary: '#9C27B0',
      error: '#D32F2F'
    }
  };
}

interface ThemeProviderProps {
  children: ReactNode;
}

// Create dark theme colors based on Material Design 3
const darkColors = {
  primary: lightTheme.colors.primary,
  primaryContainer: '#004D9E',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#D1E4FF',
  secondary: lightTheme.colors.secondary,
  secondaryContainer: '#404750',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#DFE4EB',
  tertiary: '#1F1F1F',
  tertiaryContainer: '#2C2C2C',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#E1E1E1',
  error: lightTheme.colors.error,
  errorContainer: '#930012',
  onError: '#FFFFFF',
  onErrorContainer: '#FFDAD6',
  background: '#121212',
  onBackground: '#E1E1E1',
  surface: '#1E1E1E',
  onSurface: '#E1E1E1',
  surfaceVariant: '#2C2C2C',
  onSurfaceVariant: '#C4C7C5',
  surfaceDisabled: 'rgba(255, 255, 255, 0.12)',
  onSurfaceDisabled: 'rgba(255, 255, 255, 0.38)',
  outline: '#8C9199',
  outlineVariant: '#444746',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#F5F5F5',
  inverseOnSurface: '#121212',
  inversePrimary: '#1363DF',
  surfaceContainerLowest: '#121212',
  surfaceContainerLow: '#1A1A1A',
  surfaceContainer: '#1E1E1E',
  surfaceContainerHigh: '#252525',
  surfaceContainerHighest: '#2C2C2C',
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get settings state with proper typing
  const settings = useAppSelector((state) => state.settings);
  const darkMode = settings?.darkMode;
  const systemColorScheme = useColorScheme();
  
  // Determine if we should use dark mode based on user preference or system setting
  const useDarkMode = darkMode ?? (systemColorScheme === 'dark');
  
  // Create a complete dark theme that inherits light theme structure
  const darkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...darkColors,
    },
    fonts: lightTheme.fonts,
    roundness: lightTheme.roundness,
    spacing: lightTheme.spacing,
    elevation: lightTheme.elevation,
  };
  
  // Use the appropriate theme based on the user's preference
  const selectedTheme = useDarkMode ? darkTheme : lightTheme;
  
  return (
    <PaperProvider theme={selectedTheme}>
      {children}
    </PaperProvider>
  );
}; 