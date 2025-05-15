import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchUnreadCount } from '../store/slices/notificationsSlice';
import { getNotificationIcon } from '../utils/notificationUtils';

export interface NotificationBadgeProps {
  userId?: string;
  maxCount?: number;
  size?: number;
  color?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  userId,
  maxCount = 99,
  size = 16,
  color,
}) => {
  const theme = useTheme();
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
      // @ts-ignore
      navigation.navigate('NotificationsScreen');
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to alert if navigation fails
      alert('Notifications feature coming soon');
    }
  };
  
  // If no unread notifications, just show the bell icon
  if (!unreadCount || unreadCount === 0) {
    return (
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Bell size={size} color={color || (isDarkMode ? '#fff' : '#333')} />
      </TouchableOpacity>
    );
  }
  
  // Format the count with a "+" if it exceeds maxCount
  const displayCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount.toString();
  
  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Bell size={size} color={color || (isDarkMode ? '#fff' : '#333')} />
      <View
        style={[
          styles.badge,
          {
            backgroundColor: theme.colors.error,
            borderColor: isDarkMode ? '#121212' : '#f5f5f5',
            width: size,
            height: size,
            borderRadius: size / 2,
            right: -size / 3,
            top: -size / 3,
          },
        ]}
      >
        <Text style={[
          styles.badgeText,
          { fontSize: size * 0.65 }
        ]}>
          {unreadCount < 10 ? displayCount : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    borderWidth: 2,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});