import { StyleSheet } from 'react-native';

/**
 * Common styles to be shared across the application
 * Use these styles to maintain design consistency
 */
export const commonStyles = StyleSheet.create({
  /**
   * Container styles
   */
  screenContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  /**
   * Card styles
   */
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  
  /**
   * Text styles
   */
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    opacity: 0.7,
  },
  
  /**
   * Form styles
   */
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    marginBottom: 8,
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
    right: 16,
    margin: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    zIndex: 9999,
  },
  
  /**
   * Spacing helpers
   */
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  mv8: { marginVertical: 8 },
  mv16: { marginVertical: 16 },
  mh16: { marginHorizontal: 16 },
  p16: { padding: 16 },
  
  /**
   * List items
   */
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  
  /**
   * Dividers
   */
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
}); 