import React, { ReactNode } from 'react';
import { Provider as PaperProvider, MD3Theme } from 'react-native-paper';
import { theme as lightTheme, darkTheme } from './theme';
import { useColorScheme } from 'react-native';
import { useAppSelector } from '../store/hooks';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { DarkModeProvider } from '../components/DarkModeProvider';

// ADD THIS GLOBAL MOCK to fix "Property 'theme' doesn't exist" error
// This ensures 'theme' is always available globally
if (typeof global.theme === 'undefined') {
  global.theme = {
    colors: {
      primary: lightTheme.colors.primary,
      secondary: lightTheme.colors.secondary,
      error: lightTheme.colors.error
    }
  };
}

interface ThemeProviderProps {
  children: ReactNode;
}

// Adapt our theme to be compatible with React Native Paper's theme type
const adaptThemeForPaper = (theme: any): MD3Theme => {
  // Return a theme compatible with Paper's expected shape
  return {
    ...theme,
    // Convert our animation format to Paper's expected format
    animation: {
      scale: 1.0,
      defaultAnimationDuration: theme.animation.medium
    }
  };
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Get dark mode preference from the store
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const baseTheme = isDarkMode ? darkTheme : lightTheme;
  
  // Adapt our theme to Paper's expected format
  const paperTheme = adaptThemeForPaper(baseTheme);

  // Use React Navigation's built-in themes with our colors
  const navigationTheme = isDarkMode
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: baseTheme.colors.primary,
          background: baseTheme.colors.background,
          card: baseTheme.colors.surface,
          text: baseTheme.colors.onSurface,
          border: baseTheme.colors.outline,
          notification: baseTheme.colors.error,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: baseTheme.colors.primary,
          background: baseTheme.colors.background,
          card: baseTheme.colors.surface,
          text: baseTheme.colors.onSurface,
          border: baseTheme.colors.outline,
          notification: baseTheme.colors.error,
        },
      };

  return (
    <DarkModeProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navigationTheme}>
          {children}
        </NavigationContainer>
      </PaperProvider>
    </DarkModeProvider>
  );
}; 