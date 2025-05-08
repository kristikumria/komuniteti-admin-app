import React, { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { PushNotificationHandler } from './PushNotificationHandler';
import { NotificationToast } from './NotificationToast';
import { Notification } from '../navigation/types';
import { fetchUnreadCount, receiveNotification } from '../store/slices/notificationsSlice';
import { pushNotificationService } from '../services/pushNotificationService';

interface NotificationManagerProps {
  children: React.ReactNode;
}

/**
 * Component to manage all notification-related functionality
 * This includes push notification permissions, displaying toast notifications,
 * and refreshing notification data when the app comes to the foreground
 */
export const NotificationManager: React.FC<NotificationManagerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  
  // Set up app state change handler to refresh notifications when app comes to foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && user?.id) {
        // Refresh unread count when app comes to foreground
        dispatch(fetchUnreadCount(user.id));
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [user?.id, dispatch]);
  
  // Set up a mock push notification listener
  useEffect(() => {
    // In a real app, you would use Firebase Messaging or similar
    // For now, we'll just simulate receiving a notification every 30 seconds
    // for demonstration purposes - this would be removed in production
    
    if (__DEV__ && user?.id) {
      const simulateNotificationInterval = setInterval(() => {
        const mockNotification: Notification = {
          id: `mock-${Date.now()}`,
          title: 'New Notification',
          message: 'This is a simulated push notification for testing purposes.',
          icon: 'bell',
          timestamp: new Date().toISOString(),
          read: false,
          type: 'system',
          recipientId: user.id
        };
        
        // Dispatch to store
        dispatch(receiveNotification(mockNotification));
        
        // Show toast
        setActiveNotification(mockNotification);
        
        // Log for debugging
        console.log('Simulated push notification received:', mockNotification);
      }, 30000); // Every 30 seconds
      
      return () => clearInterval(simulateNotificationInterval);
    }
  }, [user?.id, dispatch]);
  
  const handleDismissToast = () => {
    setActiveNotification(null);
  };
  
  return (
    <>
      <PushNotificationHandler />
      
      <NotificationToast 
        notification={activeNotification}
        onDismiss={handleDismissToast}
      />
      
      {children}
    </>
  );
}; 