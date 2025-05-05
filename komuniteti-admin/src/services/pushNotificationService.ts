import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
const API_URL = process.env.API_URL || 'https://api.komuniteti.com';
const DEVICE_TOKEN_KEY = 'push_notification_device_token';

/**
 * Service to handle push notification functionality
 */
export const pushNotificationService = {
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
      //   appVersion: DeviceInfo.getVersion(), // You would need to install react-native-device-info for this
      // });
      
      // Mock implementation for now
      console.log(`Device token registered: ${token} for user: ${userId}`);
      return Promise.resolve();
    } catch (error) {
      console.error('Error registering device token:', error);
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
      
      // Mock implementation for now
      console.log(`Device token unregistered for user: ${userId}`);
      return Promise.resolve();
    } catch (error) {
      console.error('Error unregistering device token:', error);
      throw error;
    }
  },
  
  /**
   * Get the stored device token
   * @returns Promise with token
   */
  getDeviceToken: async (): Promise<string | null> => {
    try {
      return AsyncStorage.getItem(DEVICE_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting device token:', error);
      return null;
    }
  },
  
  /**
   * Request push notification permissions
   * @returns Promise with boolean indicating if permissions were granted
   */
  requestPermissions: async (): Promise<boolean> => {
    try {
      // This is a stub implementation
      // In a real app, you would use a package like react-native-firebase/messaging, 
      // expo-notifications, or react-native-push-notification to request permissions
      
      // Mock implementation for now
      console.log('Push notification permissions requested');
      return Promise.resolve(true);
    } catch (error) {
      console.error('Error requesting push notification permissions:', error);
      return false;
    }
  },
  
  /**
   * Handle a received notification
   * @param notification - The notification payload
   */
  handleNotification: (notification: any): void => {
    // This is a stub implementation
    // In a real app, you would implement handling of the notification based on its type
    console.log('Received notification:', notification);
  }
}; 