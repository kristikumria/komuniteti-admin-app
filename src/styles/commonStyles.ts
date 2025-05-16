import { StyleSheet } from 'react-native';
import type { AppTheme } from '../theme/theme';

/**
 * Common styles to be shared across the application
 * Uses Material Design 3 tokens for consistent design
 * @param theme The app theme from useTheme hook
 */
export const getCommonStyles = (theme: AppTheme) => StyleSheet.create({
  /**
   * Container styles using MD3 surface container tokens
   */
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
  /**
   * Card styles using MD3 elevation and surface tokens
   */
  card: {
    marginBottom: theme.spacing.m,
    borderRadius: theme.shapes.corner.medium,
    backgroundColor: theme.colors.surface,
    ...theme.elevation.level1,
  },
  cardContainer: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.shapes.corner.medium,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.elevation.level1,
  },
  cardTitle: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onSurface,
    // Use Paper Text component with variants instead where possible
  },
  
  /**
   * Text styles following MD3 typography system
   */
  heading: {
    marginBottom: theme.spacing.m,
    color: theme.colors.onBackground,
    // Use Paper Text component with headlineMedium variant instead where possible
  },
  subheading: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onBackground,
    // Use Paper Text component with titleMedium variant instead where possible
  },
  paragraph: {
    marginBottom: theme.spacing.s,
    lineHeight: 20,
    color: theme.colors.onBackground,
    // Use Paper Text component with bodyMedium variant instead where possible
  },
  caption: {
    opacity: 0.7,
    color: theme.colors.onSurfaceVariant,
    // Use Paper Text component with labelSmall variant instead where possible
  },
  
  /**
   * Form styles using MD3 input tokens
   */
  formGroup: {
    marginBottom: theme.spacing.m,
  },
  formLabel: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onSurface,
    // Use Paper Text component with labelMedium variant instead where possible
  },
  formInput: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.shapes.corner.small,
    borderWidth: theme.shapes.border.thin,
    borderColor: theme.colors.outline,
    padding: theme.spacing.m,
  },
  
  /**
   * Button styles using MD3 states and colors
   */
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.shapes.corner.small,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondaryContainer,
    borderRadius: theme.shapes.corner.small,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  textButton: {
    borderRadius: theme.shapes.corner.small,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  
  /**
   * Layout helpers
   */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  /**
   * Standard FAB (Floating Action Button) styling using MD3 tokens
   */
  fab: {
    position: 'absolute',
    bottom: 100,
    right: theme.spacing.m,
    margin: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    zIndex: 9999,
    backgroundColor: theme.colors.primary,
    ...theme.elevation.level3,
  },
  
  /**
   * Touch target sizing for proper interactive areas, following MD3 guidelines
   */
  touchTarget: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchTargetTablet: {
    minWidth: 48,
    minHeight: 48,
  },
  
  /**
   * Responsive container for tablet layouts
   */
  tabletContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  tabletSidebar: {
    width: '30%',
    borderRightWidth: theme.shapes.border.thin,
    borderRightColor: theme.colors.outlineVariant,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  tabletContent: {
    width: '70%',
    backgroundColor: theme.colors.surfaceContainer,
  },
  
  /**
   * Surface variants for different container types following MD3 guidelines
   */
  surfaceLowest: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.shapes.corner.small,
  },
  surfaceLow: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.shapes.corner.small,
  },
  surfaceContainer: {
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: theme.shapes.corner.small,
  },
  surfaceHigh: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: theme.shapes.corner.small,
  },
  surfaceHighest: {
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: theme.shapes.corner.small,
  },
  
  /**
   * Spacing helpers
   */
  mt8: { marginTop: theme.spacing.s },
  mt16: { marginTop: theme.spacing.m },
  mb8: { marginBottom: theme.spacing.s },
  mb16: { marginBottom: theme.spacing.m },
  mv8: { marginVertical: theme.spacing.s },
  mv16: { marginVertical: theme.spacing.m },
  mh16: { marginHorizontal: theme.spacing.m },
  p16: { padding: theme.spacing.m },
  
  /**
   * List items with MD3 styling
   */
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    borderBottomWidth: theme.shapes.border.thin,
    borderBottomColor: theme.colors.outlineVariant,
    backgroundColor: theme.colors.surface,
  },
  
  /**
   * Dividers following MD3 specs
   */
  divider: {
    height: 1,
    width: '100%',
    marginVertical: theme.spacing.s,
    backgroundColor: theme.colors.outlineVariant,
  },
  
  /**
   * State styles for interactive elements
   */
  stateLayer: {
    // Base for pressed/hover states in MD3
    borderRadius: theme.shapes.corner.small,
  },
  stateLayerHover: {
    backgroundColor: theme.colors.onSurface + '08', // Using 8% opacity for hover state
  },
  stateLayerPressed: {
    backgroundColor: theme.colors.onSurface + '12', // Using 12% opacity for pressed state
  },
  
  /**
   * Feedback states following MD3 guidelines
   */
  successContainer: {
    backgroundColor: theme.colors.successContainer,
    borderRadius: theme.shapes.corner.small,
    padding: theme.spacing.m,
    borderLeftWidth: theme.shapes.border.thick,
    borderLeftColor: theme.colors.success,
  },
  errorContainer: {
    backgroundColor: theme.colors.errorContainer,
    borderRadius: theme.shapes.corner.small,
    padding: theme.spacing.m,
    borderLeftWidth: theme.shapes.border.thick,
    borderLeftColor: theme.colors.error,
  },
  warningContainer: {
    backgroundColor: theme.colors.warningContainer,
    borderRadius: theme.shapes.corner.small,
    padding: theme.spacing.m,
    borderLeftWidth: theme.shapes.border.thick,
    borderLeftColor: theme.colors.warning,
  },
  infoContainer: {
    backgroundColor: theme.colors.infoContainer,
    borderRadius: theme.shapes.corner.small,
    padding: theme.spacing.m,
    borderLeftWidth: theme.shapes.border.thick,
    borderLeftColor: theme.colors.info,
  },
}); 