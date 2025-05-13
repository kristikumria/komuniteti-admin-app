import { StyleSheet } from 'react-native';
import type { AppTheme } from '../theme/theme';

/**
 * Common styles to be shared across the application
 * Uses theme tokens for consistent design
 * @param theme The app theme from useTheme hook
 */
export const getCommonStyles = (theme: AppTheme) => StyleSheet.create({
  /**
   * Container styles
   */
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.m,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  
  /**
   * Card styles
   */
  card: {
    marginBottom: theme.spacing.m,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
  },
  cardTitle: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onSurface,
    // Use Paper Text component with variants instead where possible
  },
  
  /**
   * Text styles
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
   * Form styles
   */
  formGroup: {
    marginBottom: theme.spacing.m,
  },
  formLabel: {
    marginBottom: theme.spacing.s,
    color: theme.colors.onSurface,
    // Use Paper Text component with labelMedium variant instead where possible
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
   * Standard FAB (Floating Action Button) styling
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
   * List items
   */
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  
  /**
   * Dividers
   */
  divider: {
    height: 1,
    width: '100%',
    marginVertical: theme.spacing.s,
    backgroundColor: theme.colors.outlineVariant,
  },
}); 