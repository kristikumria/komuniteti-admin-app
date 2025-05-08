// Type declarations for state slices

export interface NotificationsState {
  notifications: any[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

export interface PaymentsState {
  payments: any[];
  loading: boolean;
  error: string | null;
}

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notificationsEnabled: boolean;
  biometricsEnabled: boolean;
} 