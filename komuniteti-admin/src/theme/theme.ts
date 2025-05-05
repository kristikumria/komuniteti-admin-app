import { MD3LightTheme as DefaultTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1363DF',
    secondary: '#6C757D',
    tertiary: '#F8F9FA',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    error: '#DC3545',
    success: '#28A745',
    warning: '#FFC107',
  },
  fonts: configureFonts({ config: fontConfig }),
};

export type AppTheme = typeof theme; 