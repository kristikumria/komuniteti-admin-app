// API Configuration
export const API_URL = 'https://api.komuniteti.com/v1';

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SETTINGS: 'app_settings',
};

// Date Format
export const DATE_FORMAT = 'MMMM dd, yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'MMMM dd, yyyy HH:mm';

// Status Colors
export const STATUS_COLORS = {
  success: '#4CAF50',  // Green
  warning: '#FFC107',  // Amber
  error: '#F44336',    // Red
  info: '#2196F3',     // Blue
  default: '#9E9E9E',  // Grey
  paid: '#4CAF50',     // Green (same as success)
  pending: '#FFC107',  // Amber (same as warning)
  overdue: '#F44336',  // Red (same as error)
  open: '#2196F3',     // Blue (same as info)
  'in-progress': '#FF9800',  // Orange
  resolved: '#4CAF50',  // Green (same as success)
  low: '#8BC34A',      // Light Green
  medium: '#FF9800',   // Orange
  high: '#F44336',     // Red (same as error)
  urgent: '#D32F2F',   // Dark Red
  disabled: '#9E9E9E', // Grey (same as default)
}; 