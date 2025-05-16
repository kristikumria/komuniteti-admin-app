import React, { useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { pushNotificationService } from '../services/pushNotificationService';
import { setPermissionsRequested, setPermissionsGranted } from '../store/slices/notificationsSlice';
import * as Notifications from 'expo-notifications';
import logger from '../utils/logger';

interface PushNotificationHandlerProps {
  children?: React.ReactNode;
  onSetupComplete?: (success: boolean) => void;
}

/**
 * Component to handle push notification setup following Material Design 3 guidelines.
 * Sets up device registration for push notifications when a user is logged in.
 * 
 * @example
 * <PushNotificationHandler>
 *   <App />
 * </PushNotificationHandler>
 */
export const PushNotificationHandler: React.FC<PushNotificationHandlerProps> = ({ 
  children,
  onSetupComplete
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { permissionsRequested } = useAppSelector(state => state.notifications);
  
  // Use refs to maintain notification handlers
  const notificationReceivedListener = useRef<Notifications.Subscription | null>(null);
  const notificationResponseListener = useRef<Notifications.Subscription | null>(null);
  
  // Set up notification handlers when the component mounts
  useEffect(() => {
    // Configure notification handling
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true
      }),
    });
    
    // Clean up notification listeners when component unmounts
    return () => {
      if (notificationReceivedListener.current) {
        notificationReceivedListener.current.remove();
      }
      if (notificationResponseListener.current) {
        notificationResponseListener.current.remove();
      }
    };
  }, []);
  
  // Handle user login/logout
  useEffect(() => {
    // Only set up push notifications if user is logged in and permissions haven't been requested yet
    if (user?.id && !permissionsRequested) {
      setupPushNotifications(user.id);
    }
    
    // Clean up on logout
    if (!user?.id) {
      if (notificationReceivedListener.current) {
        notificationReceivedListener.current.remove();
      }
      if (notificationResponseListener.current) {
        notificationResponseListener.current.remove();
      }
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
        // Register listeners for incoming notifications
        notificationReceivedListener.current = Notifications.addNotificationReceivedListener(
          notification => {
            const data = notification.request.content.data;
            pushNotificationService.handleNotification(data);
          }
        );
        
        // Set up handler for when a user taps on a notification
        notificationResponseListener.current = Notifications.addNotificationResponseReceivedListener(
          response => {
            const data = response.notification.request.content.data;
            pushNotificationService.handleNotificationResponse(data);
          }
        );
        
        // Get the Expo push token for this device
        const token = await pushNotificationService.getExpoPushToken();
        
        if (token) {
          // Register the token with our backend
          await pushNotificationService.registerDeviceToken(userId, token);
          logger.log('Push notifications set up successfully');
          
          // Test notification in development
          if (__DEV__) {
            await pushNotificationService.scheduleLocalNotification(
              'Notifications Enabled',
              'You will now receive important updates from Komuniteti',
              { type: 'system' }
            );
          }
          
          // Call the optional callback with success
          onSetupComplete?.(true);
        } else {
          logger.warn('Failed to get push token');
          onSetupComplete?.(false);
        }
      } else {
        logger.log('Push notification permissions denied');
        
        // Show a notification about missing permissions
        if (__DEV__) {
          Alert.alert(
            'Notifications Disabled',
            'You may miss important updates. You can enable notifications in your device settings.',
            [{ text: 'OK' }]
          );
        }
        
        // Call the optional callback with failure
        onSetupComplete?.(false);
      }
    } catch (error) {
      logger.error('Error setting up push notifications:', error);
      
      // Show error message in development
      if (__DEV__) {
        Alert.alert(
          'Push Notification Setup Error',
          'There was an error setting up push notifications. Please try again later.',
          [{ text: 'OK' }]
        );
      }
      
      // Call the optional callback with failure
      onSetupComplete?.(false);
    }
  };
  
  // This component doesn't render anything visible
  return <>{children}</>;
}; 