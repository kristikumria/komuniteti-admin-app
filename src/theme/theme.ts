import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { Platform, StyleSheet } from 'react-native';

// Define font config based on MD3 guidelines and React Native Paper API
const fontConfig = {
  displayLarge: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 57,
    fontWeight: '400' as const,
    letterSpacing: -0.25,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 45,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 36,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 32,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 28,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 24,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16,
  },
  labelLarge: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
};

/**
 * MD3 Color System - Enhanced for accessibility
 * All colors have been checked for WCAG AA compliance
 */
const colors = {
  // Primary colors - improved contrast
  primary: '#0D47A1', // Darker than before, better contrast
  onPrimary: '#FFFFFF',
  primaryContainer: '#D8E6FF',
  onPrimaryContainer: '#001A41',
  
  // Secondary colors
  secondary: '#5D6B77', // Better contrast with backgrounds
  onSecondary: '#FFFFFF',
  secondaryContainer: '#DAEDFF', 
  onSecondaryContainer: '#001E2F',
  
  // Tertiary colors
  tertiary: '#4A5A68',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#D7E5F7',
  onTertiaryContainer: '#0E1D29',
  
  // Error colors - improved for accessibility
  error: '#B3261E', // Enhanced contrast for error states
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410E0B',
  
  // Success colors (MD3 extension)
  success: '#00695C', // Darker for better contrast
  onSuccess: '#FFFFFF',
  successContainer: '#B9F6CA',
  onSuccessContainer: '#002018',
  
  // Warning colors (MD3 extension)
  warning: '#B45D00', // Darker than before for better contrast
  onWarning: '#FFFFFF',
  warningContainer: '#FFEAD5',
  onWarningContainer: '#381E00',
  
  // Info colors (MD3 extension)
  info: '#0277BD', // Better contrast
  onInfo: '#FFFFFF',
  infoContainer: '#D4E9FF',
  onInfoContainer: '#001D32',
  
  // Neutral colors - enhanced contrast
  background: '#F8FAFC',
  onBackground: '#1A1C1E',
  surface: '#FFFFFF',
  onSurface: '#1A1C1E',
  surfaceVariant: '#F0F4F8',
  onSurfaceVariant: '#42474E',
  
  // Surface containers - refined for better hierarchy
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F5F7FA',
  surfaceContainer: '#EAEEF2',
  surfaceContainerHigh: '#DFE4E9',
  surfaceContainerHighest: '#D3DAE2',
  
  // Utility colors
  outline: '#6F767E',
  outlineVariant: '#C3C7CF',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#2E3134',
  inverseOnSurface: '#F1F3F6',
  inversePrimary: '#A6C8FF',
  
  // Disabled states - enhanced for better visibility
  surfaceDisabled: 'rgba(26, 28, 30, 0.12)',
  onSurfaceDisabled: 'rgba(26, 28, 30, 0.38)',
};

/**
 * MD3 Spacing System - uses 4px base unit
 * Standardized for consistent spacing
 */
const spacing = {
  xxs: 4,   // 4px
  xs: 8,    // 8px
  s: 12,    // 12px
  m: 16,    // 16px
  l: 24,    // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
  xxxl: 64, // 64px
};

/**
 * MD3 Elevation System - standardized for platform consistency
 */
const elevation = {
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
    elevation: 1,
  },
  level2: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  level3: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  level4: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 9,
  },
  level5: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
};

/**
 * MD3 Shapes System - refined for consistency
 */
const shapes = {
  // Corner radii
  corner: {
    none: 0,
    extraSmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    extraLarge: 24,
    full: 9999,
  },
  
  // Border widths
  border: {
    none: 0,
    hairline: StyleSheet.hairlineWidth,
    thin: 1,
    medium: 2,
    thick: 4,
  },
};

/**
 * Animation timing (ms)
 */
const animation = {
  short: 200,
  medium: 300,
  long: 500,
};

// Create the full theme with improved accessibility
const theme = {
  ...MD3LightTheme,
  dark: false,
  version: 3,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  fonts: configureFonts({ config: fontConfig }),
  spacing,
  shapes,
  animation,
  elevation,
  isV3: true,
  roundness: shapes.corner.small,
};

// Create the dark theme with improved color mapping for dark mode
const darkTheme = {
  ...theme,
  dark: true,
  colors: {
    ...theme.colors,
    primary: '#90CAF9',
    onPrimary: '#003060',
    primaryContainer: '#004787',
    onPrimaryContainer: '#D6E3FF',
    
    secondary: '#B4C8DB', 
    onSecondary: '#1F333F',
    secondaryContainer: '#364B59',
    onSecondaryContainer: '#D6E3FF',
    
    tertiary: '#B5CDE0',
    onTertiary: '#1E333D',
    tertiaryContainer: '#364B54',
    onTertiaryContainer: '#D1E5F9',
    
    // Neutral colors for dark mode
    background: '#131518',
    onBackground: '#E3E3E3',
    surface: '#1A1C1F',
    onSurface: '#E3E3E3',
    surfaceVariant: '#42474E',
    onSurfaceVariant: '#C3C7CF',
    
    // Surface containers - dark mode
    surfaceContainerLowest: '#0D0E11',
    surfaceContainerLow: '#1A1C1F',
    surfaceContainer: '#212329',
    surfaceContainerHigh: '#2A2D35',
    surfaceContainerHighest: '#343840',
    
    // Updated utility colors for dark mode
    outline: '#8B9198',
    outlineVariant: '#42474E',
    surfaceDisabled: 'rgba(227, 227, 227, 0.12)',
    onSurfaceDisabled: 'rgba(227, 227, 227, 0.38)',
    shadow: '#000000',
  },
};

// Export types and themes
export type AppTheme = typeof theme;
export { theme, darkTheme }; 