import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchUnreadCount } from '../store/slices/notificationsSlice';
import { getNotificationIcon } from '../utils/notificationUtils';

interface NotificationBadgeProps {
  userId: string;
  size?: number;
  color?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  userId,
  size = 24,
  color,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const { unreadCount } = useAppSelector(state => state.notifications);
  
  // Fetch unread count on mount and when userId changes
  useEffect(() => {
    if (userId) {
      dispatch(fetchUnreadCount(userId));
    }
  }, [userId, dispatch]);
  
  // Refresh unread count every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userId) {
        dispatch(fetchUnreadCount(userId));
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
  if (unreadCount === 0) {
    return (
      <TouchableOpacity onPress={handlePress} style={styles.container}>
        <Bell size={size} color={color || (isDarkMode ? '#fff' : '#333')} />
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Bell size={size} color={color || (isDarkMode ? '#fff' : '#333')} />
      <View
        style={[
          styles.badge,
          {
            backgroundColor: theme.colors.error,
            borderColor: isDarkMode ? '#121212' : '#f5f5f5',
          },
        ]}
      >
        <Text style={styles.badgeText}>
          {unreadCount > 99 ? '99+' : unreadCount}
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
    top: 0,
    right: 0,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});