import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { store } from '../store/store';
import { receiveNotification } from '../store/slices/notificationsSlice';
import logger from '../utils/logger';

// Constants
const API_URL = process.env.API_URL || 'https://api.komuniteti.com';
const DEVICE_TOKEN_KEY = 'push_notification_device_token';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true
  }),
});

/**
 * Service to handle push notification functionality
 */
export const pushNotificationService = {
  /**
   * Initialize push notifications
   */
  initialize: async (): Promise<void> => {
    try {
      // Set up notification received handler
      const subscription = Notifications.addNotificationReceivedListener(
        notification => {
          const data = notification.request.content.data;
          pushNotificationService.handleNotification(data);
        }
      );
      
      // Set up notification response handler (when user taps on notification)
      const responseSubscription = Notifications.addNotificationResponseReceivedListener(
        response => {
          const data = response.notification.request.content.data;
          pushNotificationService.handleNotificationResponse(data);
        }
      );
      
      // Store subscriptions for later cleanup
      pushNotificationService._subscriptions = [subscription, responseSubscription];
      
      logger.log('Push notification listeners initialized');
    } catch (error) {
      logger.error('Error initializing push notifications:', error);
    }
  },
  
  /**
   * Clean up notification listeners
   */
  cleanup: (): void => {
    try {
      if (pushNotificationService._subscriptions) {
        pushNotificationService._subscriptions.forEach(subscription => 
          subscription.remove()
        );
        pushNotificationService._subscriptions = [];
      }
    } catch (error) {
      logger.error('Error cleaning up push notification listeners:', error);
    }
  },
  
  // Internal storage for notification subscriptions
  _subscriptions: [] as Notifications.Subscription[],
  
  /**
   * Register device token with the backend
   * @param userId - User ID
   * @param token - Device token
   * @returns Promise
   */
  registerDeviceToken: async (userId: string, token: string): Promise<void> => {
    try {
      // Store token locally
      await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);
      
      // Send token to backend
      // Uncomment when API is ready
      // await axios.post(`${API_URL}/users/${userId}/device-tokens`, {
      //   token,
      //   platform: Platform.OS,
      //   appVersion: Constants.expoConfig?.version || '1.0.0',
      // });
      
      // Mock implementation for now
      logger.log(`Device token registered: ${token} for user: ${userId}`);
      return Promise.resolve();
    } catch (error) {
      logger.error('Error registering device token:', error);
      throw error;
    }
  },
  
  /**
   * Unregister device token when user logs out
   * @param userId - User ID
   * @returns Promise
   */
  unregisterDeviceToken: async (userId: string): Promise<void> => {
    try {
      // Get stored token
      const token = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
      
      if (token) {
        // Uncomment when API is ready
        // await axios.delete(`${API_URL}/users/${userId}/device-tokens/${token}`);
        
        // Clear stored token
        await AsyncStorage.removeItem(DEVICE_TOKEN_KEY);
      }
      
      // Clean up notification listeners
      pushNotificationService.cleanup();
      
      // Mock implementation for now
      logger.log(`Device token unregistered for user: ${userId}`);
      return Promise.resolve();
    } catch (error) {
      logger.error('Error unregistering device token:', error);
      throw error;
    }
  },
  
  /**
   * Get the stored device token
   * @returns Promise with token
   */
  getDeviceToken: async (): Promise<string | null> => {
    try {
      const storedToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
      if (storedToken) {
        return storedToken;
      }
      
      // If no stored token, get a new one
      return await pushNotificationService.getExpoPushToken();
    } catch (error) {
      logger.error('Error getting device token:', error);
      return null;
    }
  },
  
  /**
   * Get Expo push token
   * @returns Promise with token
   */
  getExpoPushToken: async (): Promise<string | null> => {
    try {
      // Check if device can receive push notifications
      if (!Constants.isDevice) {
        logger.warn('Push notifications are not available in an emulator/simulator');
        return null;
      }
      
      // Get the Expo push token
      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      
      // Store the token for future use
      await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);
      
      return token;
    } catch (error) {
      logger.error('Error getting Expo push token:', error);
      return null;
    }
  },
  
  /**
   * Request push notification permissions
   * @returns Promise with boolean indicating if permissions were granted
   */
  requestPermissions: async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      // Only ask if permissions have not been determined
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      // Initialize if permissions granted
      if (finalStatus === 'granted') {
        await pushNotificationService.initialize();
      }
      
      return finalStatus === 'granted';
    } catch (error) {
      logger.error('Error requesting push notification permissions:', error);
      return false;
    }
  },
  
  /**
   * Schedule a local notification
   * @param title - Notification title
   * @param body - Notification body
   * @param data - Additional data to include with the notification
   * @param options - Additional options
   * @returns Promise with notification ID
   */
  scheduleLocalNotification: async (
    title: string,
    body: string,
    data: Record<string, any> = {},
    options: {
      delay?: number; // Delay in seconds
      sound?: boolean;
      badge?: number;
    } = {}
  ): Promise<string> => {
    try {
      const notificationContent: Notifications.NotificationContentInput = {
        title,
        body,
        data,
        sound: options.sound !== false,
      };
      
      if (options.badge !== undefined) {
        notificationContent.badge = options.badge;
      }
      
      // Schedule notification
      let notificationId: string;
      
      // Use type assertion to bypass type checking issues
      if (options.delay) {
        // With delay
        notificationId = await Notifications.scheduleNotificationAsync({
          content: notificationContent,
          trigger: { seconds: Math.max(1, Math.round(options.delay)) } as any,
        });
      } else {
        // Immediate notification
        notificationId = await Notifications.scheduleNotificationAsync({
          content: notificationContent,
          // For immediate notifications, pass null explicitly instead of undefined
          trigger: null,
        });
      }
      
      return notificationId;
    } catch (error) {
      logger.error('Error scheduling local notification:', error);
      throw error;
    }
  },
  
  /**
   * Handle a received notification
   * @param notificationData - The notification payload
   */
  handleNotification: (notificationData: any): void => {
    try {
      logger.log('Received notification:', notificationData);
      
      // Add to Redux store if there's an id and title
      if (notificationData?.id && notificationData?.title) {
        store.dispatch(receiveNotification({
          id: notificationData.id,
          title: notificationData.title,
          message: notificationData.message || notificationData.body || '',
          icon: notificationData.icon || 'bell',
          timestamp: notificationData.timestamp || new Date().toISOString(),
          read: false,
          type: notificationData.type || 'system',
          targetId: notificationData.targetId,
          recipientId: notificationData.recipientId,
        }));
      }
    } catch (error) {
      logger.error('Error handling notification:', error);
    }
  },
  
  /**
   * Handle when a user taps on a notification
   * @param notificationData - The notification data
   */
  handleNotificationResponse: (notificationData: any): void => {
    try {
      logger.log('User responded to notification:', notificationData);
      
      // Implement navigation or action based on notification type
      // This will be expanded based on app requirements
      
      // Example:
      // if (notificationData.type === 'message' && notificationData.targetId) {
      //   // Navigate to message conversation
      //   navigation.navigate('ChatConversation', { conversationId: notificationData.targetId });
      // }
    } catch (error) {
      logger.error('Error handling notification response:', error);
    }
  },
  
  /**
   * Set the app badge number
   * @param count - The number to display on the app badge
   */
  setBadgeCount: async (count: number): Promise<void> => {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      logger.error('Error setting badge count:', error);
    }
  },
}; 