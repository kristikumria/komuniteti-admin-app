import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { pushNotificationService } from '../services/pushNotificationService';
import { setPermissionsRequested, setPermissionsGranted } from '../store/slices/notificationsSlice';

interface PushNotificationHandlerProps {
  children?: React.ReactNode;
}

/**
 * Component to handle push notification setup
 * This should be placed near the root of your app
 */
export const PushNotificationHandler: React.FC<PushNotificationHandlerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { permissionsRequested } = useAppSelector(state => state.notifications);
  
  useEffect(() => {
    // Only set up push notifications if user is logged in and permissions haven't been requested yet
    if (user?.id && !permissionsRequested) {
      setupPushNotifications(user.id);
    }
  }, [user?.id, permissionsRequested]);
  
  const setupPushNotifications = async (userId: string) => {
    try {
      // Mark that we've requested permissions
      dispatch(setPermissionsRequested(true));
      
      // Request push notification permissions
      const permissionGranted = await pushNotificationService.requestPermissions();
      
      // Update permission status in store
      dispatch(setPermissionsGranted(permissionGranted));
      
      if (permissionGranted) {
        // In a real app, we would get the token from Firebase, Expo, etc.
        // For now, we'll simulate a token
        const mockDeviceToken = `mock-device-token-${Platform.OS}-${Date.now()}`;
        
        // Register device token with backend
        await pushNotificationService.registerDeviceToken(userId, mockDeviceToken);
        
        console.log('Push notifications set up successfully');
      } else {
        console.log('Push notification permissions denied');
      }
    } catch (error) {
      console.error('Error setting up push notifications:', error);
      
      // Only show alert in development
      if (__DEV__) {
        Alert.alert(
          'Push Notification Setup Error',
          'There was an error setting up push notifications. Please try again later.',
          [{ text: 'OK' }]
        );
      }
    }
  };
  
  // This component doesn't render anything visible
  return <>{children}</>;
}; 