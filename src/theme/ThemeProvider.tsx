import React, { ReactNode } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
}; 