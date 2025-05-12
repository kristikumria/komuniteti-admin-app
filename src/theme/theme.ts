import { MD3LightTheme, configureFonts } from 'react-native-paper';

// Define a more complete font config
const fontConfig = {
  fontFamily: 'System',
  fontWeights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

// Colors based on Material Design 3
const colors = {
  primary: '#1363DF',
  primaryContainer: '#D1E4FF',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#001D36',
  secondary: '#6C757D',
  secondaryContainer: '#DFE4EB',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#1A1D21',
  tertiary: '#F8F9FA',
  tertiaryContainer: '#FFFFFF',
  onTertiary: '#333333',
  onTertiaryContainer: '#1A1D21',
  error: '#DC3545',
  errorContainer: '#FFDAD6',
  onError: '#FFFFFF',
  onErrorContainer: '#410002',
  background: '#FAFAFA',
  onBackground: '#121212',
  surface: '#FFFFFF',
  onSurface: '#121212',
  surfaceVariant: '#F2F2F2',
  onSurfaceVariant: '#444746',
  surfaceDisabled: 'rgba(0, 0, 0, 0.12)',
  onSurfaceDisabled: 'rgba(0, 0, 0, 0.38)',
  outline: '#72777F',
  outlineVariant: '#BFBFBF',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#121212',
  inverseOnSurface: '#FAFAFA',
  inversePrimary: '#D1E4FF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F8F9FA',
  surfaceContainer: '#F2F2F2',
  surfaceContainerHigh: '#EAEAEA',
  surfaceContainerHighest: '#E0E0E0',
};

// Create a complete theme based on MD3LightTheme
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  fonts: configureFonts({ config: fontConfig }),
  // Add standard shape and sizes
  roundness: 8,
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  elevation: {
    level0: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    level1: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 2,
    },
    level2: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    level3: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 8,
    },
  },
};

export type AppTheme = typeof theme; 