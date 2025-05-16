import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTheme, Text, Badge } from 'react-native-paper';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchUnreadCount } from '../store/slices/notificationsSlice';
import { getNotificationIcon } from '../utils/notificationUtils';
import type { AppTheme } from '../theme/theme';

export interface NotificationBadgeProps {
  userId?: string;
  maxCount?: number;
  size?: number;
  color?: string;
  showIcon?: boolean;
}

/**
 * A notification badge component that displays unread notification count.
 * Follows Material Design 3 guidelines for badges with proper scaling and theming.
 * 
 * @example
 * <NotificationBadge size={20} />
 */
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  userId,
  maxCount = 99,
  size = 16,
  color,
  showIcon = false,
}) => {
  const theme = useTheme() as AppTheme;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const isDarkMode = useAppSelector(state => state.settings?.darkMode || false);
  const unreadCount = useAppSelector(state => state.notifications?.unreadCount || 0);
  
  // Fetch unread count on mount and when userId changes
  useEffect(() => {
    if (userId) {
      try {
        dispatch(fetchUnreadCount(userId));
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    }
  }, [userId, dispatch]);
  
  // Refresh unread count every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userId) {
        try {
          dispatch(fetchUnreadCount(userId));
        } catch (error) {
          console.error('Error fetching notification count:', error);
        }
      }
    }, 60000); // 60 seconds
    
    return () => clearInterval(intervalId);
  }, [userId, dispatch]);
  
  const handlePress = () => {
    // Navigate directly to the notifications screen
    try {
      // @ts-ignore - Use type assertion for navigation
      navigation.navigate('NotificationsScreen' as never);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to alert if navigation fails
      alert('Notifications feature coming soon');
    }
  };
  
  // Format the count with a "+" if it exceeds maxCount
  const displayCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount.toString();
  
  // If no unread notifications and not showing icon, return null
  if (!unreadCount && !showIcon) {
    return null;
  }
  
  // If no unread notifications but showing icon, return just the icon
  if (!unreadCount && showIcon) {
    return (
      <TouchableOpacity 
        onPress={handlePress} 
        style={styles(theme, size).container}
        accessibilityLabel="Notifications"
        accessibilityRole="button"
      >
        <Bell 
          size={size} 
          color={color || theme.colors.onSurfaceVariant} 
        />
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={styles(theme, size).container}
      accessibilityLabel={`${unreadCount} unread notifications`}
      accessibilityRole="button"
    >
      {showIcon && (
        <Bell 
          size={size} 
          color={color || theme.colors.onSurfaceVariant} 
        />
      )}
      <Badge
        size={size * 0.9}
        style={[
          styles(theme, size).badge,
          !showIcon && styles(theme, size).standaloneBadge,
        ]}
      >
        {unreadCount < 100 ? displayCount : '99+'}
      </Badge>
    </TouchableOpacity>
  );
};

const styles = (theme: AppTheme, size: number) => StyleSheet.create({
  container: {
    position: 'relative',
    width: size * 1.5,
    height: size * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    backgroundColor: theme.colors.error,
    color: theme.colors.onError,
    fontSize: size * 0.5,
    right: -size / 3,
    top: -size / 3,
    minWidth: size * 0.9,
    height: size * 0.9,
    borderWidth: 1,
    borderColor: theme.colors.surface,
    zIndex: 10,
    elevation: 2,
  },
  standaloneBadge: {
    position: 'relative',
    right: 0,
    top: 0,
    marginLeft: 0,
    marginRight: 0,
  }
});