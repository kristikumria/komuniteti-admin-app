import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '../navigation/types';
import { pushNotificationService } from './pushNotificationService';
import logger from '../utils/logger';
import { uuidv4 } from '../utils/uuidPatch';

// API config (to be replaced with actual API endpoint)
const API_URL = process.env.API_URL || 'https://api.komuniteti.com';

// Storage keys
const NOTIFICATIONS_STORAGE_KEY = 'komuniteti_notifications';
const READ_TRACKING_KEY = 'komuniteti_notification_reads';

// Target types for notifications
export type NotificationTarget = {
  // Target specific users by ID
  userIds?: string[];
  // Target users with specific roles (e.g., 'admin', 'manager', 'resident')
  roles?: string[];
  // Target residents/administrators of specific buildings
  buildingIds?: string[];
  // Target everyone
  allUsers?: boolean;
};

// Schedule configuration for notifications
export type NotificationSchedule = {
  // Send immediately
  immediate?: boolean;
  // Send at a specific date/time
  scheduledFor?: string;
  // Repeat options: 'none', 'daily', 'weekly', 'monthly'
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  // End date for repeating notifications
  repeatUntil?: string;
};

// Extended notification data with targeting and scheduling
export type NotificationData = Omit<Notification, 'id' | 'timestamp'> & {
  // Targeting information
  target?: NotificationTarget;
  // Scheduling information
  schedule?: NotificationSchedule;
  read: boolean;
};

// Notification with additional metadata for management
export interface ManagedNotification extends Notification {
  // Who created the notification
  createdBy?: string;
  // When the notification was created
  createdAt: string;
  // Targeting information
  target?: NotificationTarget;
  // Scheduling information
  schedule?: NotificationSchedule;
  // Message template variables for personalization
  templateVariables?: Record<string, string>;
  // For scheduled notifications: active, paused, completed, cancelled
  status?: 'active' | 'paused' | 'completed' | 'cancelled';
  // Read tracking by user
  readBy?: string[];
}

// Mock data for development until API is ready
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif1',
    title: 'Building Maintenance Update',
    message: 'The elevator will be under maintenance on Monday, June 15th from 10 AM to 2 PM. Please use the stairs during this time.',
    icon: 'tool',
    timestamp: '2023-06-10T09:00:00Z',
    read: false,
    type: 'maintenance',
    targetId: 'elevator-maintenance',
    recipientId: 'all',
  },
  {
    id: '2',
    title: 'Maintenance Request',
    message: 'New maintenance request submitted for Apartment 304. Plumbing issue reported.',
    icon: 'tool',
    timestamp: '2023-09-04T09:15:00Z',
    read: false,
    type: 'maintenance',
    targetId: '203',
    recipientId: 'admin1',
  },
  {
    id: '3',
    title: 'Overdue Payment',
    message: 'Rent payment for John Smith (Apt 202) is 5 days overdue.',
    icon: 'alert-circle',
    timestamp: '2023-09-03T11:45:00Z',
    read: false,
    type: 'payment',
    targetId: '103',
    recipientId: 'admin1',
  },
  {
    id: '4',
    title: 'New Resident Added',
    message: 'Emily Wilson has been added as a new resident to Apartment 405.',
    icon: 'user-plus',
    timestamp: '2023-09-02T16:20:00Z',
    read: true,
    type: 'resident',
    targetId: '104',
    recipientId: 'admin1',
  },
  {
    id: '5',
    title: 'Building Inspection',
    message: 'Scheduled building inspection for Riviera Towers on September 15th at 10:00 AM.',
    icon: 'clipboard',
    timestamp: '2023-09-01T08:30:00Z',
    read: false,
    type: 'building',
    targetId: '201',
    recipientId: 'admin1',
  },
  {
    id: '6',
    title: 'New Message',
    message: 'You have a new message from David Chen regarding maintenance in Apartment 506.',
    icon: 'message-circle',
    timestamp: '2023-08-31T13:10:00Z',
    read: true,
    type: 'message',
    targetId: 'msg123',
    recipientId: 'admin1',
  },
  {
    id: '7',
    title: 'System Update',
    message: 'Komuniteti system will be undergoing maintenance on September 10th from 2:00 AM to 4:00 AM.',
    icon: 'refresh-cw',
    timestamp: '2023-08-30T09:00:00Z',
    read: true,
    type: 'system',
    targetId: 'sys001',
    recipientId: 'all',
  }
];

// Mock data for managed notifications
const MOCK_MANAGED_NOTIFICATIONS: ManagedNotification[] = [
  {
    id: 'm1',
    title: 'Building-wide Announcement',
    message: 'Please note that the parking garage will be cleaned on Saturday, June 15th from 8 AM to 12 PM. Please remove your vehicles during this time.',
    icon: 'megaphone',
    timestamp: '2023-06-10T08:00:00Z',
    read: false,
    type: 'building',
    targetId: 'bldg001',
    recipientId: 'all',
    createdBy: 'admin1',
    createdAt: '2023-06-05T14:30:00Z',
    target: {
      buildingIds: ['bldg001'],
      allUsers: false
    },
    schedule: {
      immediate: false,
      scheduledFor: '2023-06-10T08:00:00Z',
      repeat: 'none'
    },
    status: 'completed',
    readBy: ['user1', 'user3', 'user7']
  },
  {
    id: 'm2',
    title: 'System Maintenance',
    message: 'The Komuniteti system will be undergoing maintenance on July 5th from 2 AM to 4 AM. The app may be unavailable during this time.',
    icon: 'tool',
    timestamp: '2023-07-01T09:00:00Z',
    read: false,
    type: 'system',
    targetId: 'sys002',
    recipientId: 'all',
    createdBy: 'system',
    createdAt: '2023-06-15T10:00:00Z',
    target: {
      allUsers: true
    },
    schedule: {
      immediate: false,
      scheduledFor: '2023-07-01T09:00:00Z',
      repeat: 'none'
    },
    status: 'active',
    readBy: ['user2', 'user5']
  },
  {
    id: 'm3',
    title: 'Monthly Maintenance Report',
    message: 'The monthly maintenance report for June is now available. Please review at your earliest convenience.',
    icon: 'file-text',
    timestamp: '2023-07-02T10:00:00Z',
    read: false,
    type: 'system',
    targetId: 'report-june',
    recipientId: 'admin1',
    createdBy: 'system',
    createdAt: '2023-07-01T00:00:00Z',
    target: {
      roles: ['administrator', 'business-manager']
    },
    schedule: {
      immediate: false,
      scheduledFor: '2023-07-02T10:00:00Z',
      repeat: 'monthly',
      repeatUntil: '2023-12-31T23:59:59Z'
    },
    status: 'active',
    readBy: []
  }
];

// Utility function to save notifications to local storage
const saveNotifications = async (notifications: ManagedNotification[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    logger.error('Error saving notifications to storage:', error);
  }
};

// Utility function to load notifications from local storage
const loadNotifications = async (): Promise<ManagedNotification[]> => {
  try {
    const storedData = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    logger.error('Error loading notifications from storage:', error);
  }
  return [...MOCK_MANAGED_NOTIFICATIONS]; // Default to mock data if nothing stored
};

/**
 * Fetches notifications for admin management
 * @returns {Promise<Notification[]>} List of notifications
 */
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    // Use the mock notifications for development
    return MOCK_NOTIFICATIONS.map(adaptNotification);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return MOCK_NOTIFICATIONS.map(adaptNotification).slice(0, 5); // Return mock data as fallback
  }
};

/**
 * Adapts notifications from the internal format to the format expected by the UI
 * @param notification The notification to adapt
 * @returns Adapted notification matching the expected interface
 */
const adaptNotification = (notification: {
  id: string;
  title?: string;
  message?: string;
  body?: string;
  icon?: string;
  timestamp?: string;
  createdAt?: string;
  sentAt?: string;
  read?: boolean;
  type?: string;
  targetId?: string;
  recipientId?: string;
  [key: string]: any;
}): Notification => {
  // Convert type to valid notification type
  const validType = (notification.type && 
    ['payment', 'maintenance', 'resident', 'building', 'message', 'system', 'other'].includes(notification.type)) 
    ? notification.type as Notification['type'] 
    : 'system';
    
  // If notification has message property but not title, map it correctly
  if (notification.message && !notification.title && notification.body) {
    return {
      id: notification.id,
      title: notification.title || notification.body.split('\n')[0] || 'Notification',
      message: notification.message || notification.body,
      icon: notification.icon || 'bell',
      timestamp: notification.timestamp || notification.createdAt || notification.sentAt || new Date().toISOString(),
      read: notification.read === undefined ? false : notification.read,
      type: validType,
      targetId: notification.targetId,
      recipientId: notification.recipientId
    };
  }
  
  // If notification has body property but not message, adapt it
  if (notification.body && !notification.message) {
    return {
      id: notification.id,
      title: notification.title || 'Notification',
      message: notification.body,
      icon: notification.icon || 'bell',
      timestamp: notification.timestamp || notification.createdAt || notification.sentAt || new Date().toISOString(),
      read: notification.read === undefined ? false : notification.read,
      type: validType,
      targetId: notification.targetId,
      recipientId: notification.recipientId
    };
  }
  
  // If notification already has the expected format
  return {
    ...notification,
    message: notification.message || notification.body || '',
    icon: notification.icon || 'bell',
    timestamp: notification.timestamp || notification.createdAt || notification.sentAt || new Date().toISOString(),
    read: notification.read === undefined ? false : notification.read,
    type: validType
  } as Notification;
};

// Utility function to save read tracking data
const saveReadTracking = async (readData: Record<string, string[]>): Promise<void> => {
  try {
    await AsyncStorage.setItem(READ_TRACKING_KEY, JSON.stringify(readData));
  } catch (error) {
    logger.error('Error saving read tracking data to storage:', error);
  }
};

// Utility function to load read tracking data
const loadReadTracking = async (): Promise<Record<string, string[]>> => {
  try {
    const storedData = await AsyncStorage.getItem(READ_TRACKING_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    logger.error('Error loading read tracking data from storage:', error);
  }
  return {}; // Default empty if nothing stored
};

export const notificationService = {
  // Get all notifications for a user
  getNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/users/${userId}/notifications`);
      // return response.data.map(adaptNotification);
      
      // Load from storage or use mock data
      const managedNotifications = await loadNotifications();
      
      // Filter notifications for this user based on targeting rules
      const userNotifications = managedNotifications.filter(notification => {
        // Check if notification is active
        if (notification.status && notification.status !== 'active' && notification.status !== 'completed') {
          return false;
        }
        
        // If recipientId is specific, check it
        if (notification.recipientId && notification.recipientId !== 'all' && notification.recipientId !== userId) {
          return false;
        }
        
        // Check targeting rules
        if (notification.target) {
          // If targeting specific users, check if this user is included
          if (notification.target.userIds && notification.target.userIds.length > 0) {
            if (!notification.target.userIds.includes(userId)) {
              return false;
            }
          }
          
          // If targeting is for all users, include it
          if (notification.target.allUsers) {
            return true;
          }
          
          // Other targeting logic would go here (roles, buildings, etc.)
          // This would require user context with role and building information
        }
        
        return true;
      });
      
      // Convert managed notifications to regular notifications
      return userNotifications.map(managed => adaptNotification({
        id: managed.id,
        title: managed.title,
        message: managed.message,
        icon: managed.icon,
        timestamp: managed.timestamp,
        read: managed.readBy ? managed.readBy.includes(userId) : managed.read,
        type: managed.type,
        targetId: managed.targetId,
        recipientId: managed.recipientId
      }));
    } catch (error) {
      logger.error('Error fetching notifications:', error);
      throw error;
    }
  },
  
  // Get unread notification count
  getUnreadCount: async (userId: string): Promise<number> => {
    try {
      // Get all notifications for the user
      const notifications = await notificationService.getNotifications(userId);
      
      // Count unread notifications
      return notifications.filter(notification => !notification.read).length;
    } catch (error) {
      logger.error('Error fetching unread notification count:', error);
      throw error;
    }
  },
  
  // Get a notification by ID
  getNotificationById: async (notificationId: string): Promise<Notification> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/notifications/${notificationId}`);
      // return adaptNotification(response.data);
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const notification = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
          if (notification) {
            resolve(adaptNotification(notification));
          } else {
            reject(new Error(`Notification with ID ${notificationId} not found`));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error fetching notification ${notificationId}:`, error);
      throw error;
    }
  },
  
  // Mark notification as read
  markAsRead: async (notificationId: string, userId: string): Promise<Notification> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.patch(`${API_URL}/notifications/${notificationId}/read`, { read: true });
      // return response.data;
      
      // Get all managed notifications
      const managedNotifications = await loadNotifications();
      
      // Find the notification
      const notificationIndex = managedNotifications.findIndex(n => n.id === notificationId);
          
          if (notificationIndex !== -1) {
        // Create updated notification with read status
        const notification = managedNotifications[notificationIndex];
            const updatedNotification = {
          ...notification,
          readBy: notification.readBy ? [...notification.readBy, userId] : [userId]
            };
            
        // Update notification in list
        managedNotifications[notificationIndex] = updatedNotification;
        
        // Save updated list
        await saveNotifications(managedNotifications);
        
        // Return the regular notification format
        return {
          id: updatedNotification.id,
          title: updatedNotification.title,
          message: updatedNotification.message,
          icon: updatedNotification.icon,
          timestamp: updatedNotification.timestamp,
          read: true,
          type: updatedNotification.type,
          targetId: updatedNotification.targetId,
          recipientId: updatedNotification.recipientId
        };
          } else {
        throw new Error(`Notification with ID ${notificationId} not found`);
          }
    } catch (error) {
      logger.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  },
  
  // Mark all notifications as read
  markAllAsRead: async (userId: string): Promise<void> => {
    try {
      // Uncomment when API is ready
      // await axios.patch(`${API_URL}/users/${userId}/notifications/read`);
      
      // Get all managed notifications
      const managedNotifications = await loadNotifications();
      
      // Update read status for all applicable notifications
      const updatedNotifications = managedNotifications.map(notification => {
        // Check if this notification applies to this user
        const isForUser = notification.recipientId === userId || 
          notification.recipientId === 'all' || 
          (notification.target?.userIds?.includes(userId)) ||
          notification.target?.allUsers;
        
        if (isForUser) {
          return {
            ...notification,
            readBy: notification.readBy ? 
              (notification.readBy.includes(userId) ? notification.readBy : [...notification.readBy, userId]) : 
              [userId]
          };
        }
        
        return notification;
      });
      
      // Save updated notifications
      await saveNotifications(updatedNotifications);
    } catch (error) {
      logger.error(`Error marking all notifications as read for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Create a new notification
  createNotification: async (
    notificationData: NotificationData, 
    creatorId: string
  ): Promise<ManagedNotification> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.post(`${API_URL}/notifications`, notificationData);
      // return response.data;
      
      const now = new Date();
      const newManagedNotification: ManagedNotification = {
            ...notificationData,
        id: uuidv4(),
        timestamp: notificationData.schedule?.scheduledFor || now.toISOString(),
        read: false,
        createdBy: creatorId,
        createdAt: now.toISOString(),
        status: 'active',
        readBy: []
          };
          
      // Get existing notifications
      const managedNotifications = await loadNotifications();
      
      // Add new notification
      const updatedNotifications = [...managedNotifications, newManagedNotification];
      
      // Save updated notifications
      await saveNotifications(updatedNotifications);
      
      // If scheduled for immediate delivery, use pushNotificationService
      if (!notificationData.schedule || notificationData.schedule.immediate) {
        // For immediate notifications, send push notification if applicable
        await notificationService.deliverNotification(newManagedNotification);
      }
      
      return newManagedNotification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw error;
    }
  },
  
  // Delete a notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    try {
      // Uncomment when API is ready
      // await axios.delete(`${API_URL}/notifications/${notificationId}`);
      
      // Get existing notifications
      const managedNotifications = await loadNotifications();
      
      // Remove the notification
      const updatedNotifications = managedNotifications.filter(n => n.id !== notificationId);
      
      // Save updated notifications
      await saveNotifications(updatedNotifications);
    } catch (error) {
      logger.error(`Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  },
  
  // NEW METHODS FOR NOTIFICATION MANAGEMENT
  
  /**
   * Create a notification targeted to specific users or groups
   */
  createTargetedNotification: async (
    title: string,
    message: string,
    options: {
      type?: Notification['type'];
      icon?: string;
      targetId?: string;
      target: NotificationTarget;
      schedule?: NotificationSchedule;
      templateVariables?: Record<string, string>;
    },
    creatorId: string
  ): Promise<ManagedNotification> => {
    try {
      const notificationData: NotificationData = {
        title,
        message,
        icon: options.icon || 'bell',
        type: options.type || 'system',
        targetId: options.targetId,
        recipientId: options.target?.userIds?.length === 1 ? options.target.userIds[0] : 'all',
        target: options.target,
        schedule: options.schedule || { immediate: true },
        read: false
      };
      
      return await notificationService.createNotification(notificationData, creatorId);
    } catch (error) {
      logger.error('Error creating targeted notification:', error);
      throw error;
    }
  },
  
  /**
   * Schedule a notification for future delivery
   */
  scheduleNotification: async (
    title: string,
    message: string,
    scheduledFor: string, // ISO date string
    options: {
      type?: Notification['type'];
      icon?: string;
      targetId?: string;
      target?: NotificationTarget;
      repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
      repeatUntil?: string; // ISO date string
      templateVariables?: Record<string, string>;
    },
    creatorId: string
  ): Promise<ManagedNotification> => {
    try {
      const notificationData: NotificationData = {
        title,
        message,
        icon: options.icon || 'bell',
        type: options.type || 'system',
        targetId: options.targetId,
        recipientId: options.target?.userIds?.length === 1 ? options.target.userIds[0] : 'all',
        target: options.target || { allUsers: true },
        schedule: {
          immediate: false,
          scheduledFor,
          repeat: options.repeat || 'none',
          repeatUntil: options.repeatUntil
        },
        read: false
      };
      
      return await notificationService.createNotification(notificationData, creatorId);
    } catch (error) {
      logger.error('Error scheduling notification:', error);
      throw error;
    }
  },
  
  /**
   * Update notification status (active, paused, cancelled)
   */
  updateNotificationStatus: async (
    notificationId: string,
    status: 'active' | 'paused' | 'completed' | 'cancelled'
  ): Promise<ManagedNotification> => {
    try {
      // Get existing notifications
      const managedNotifications = await loadNotifications();
      
      // Find the notification
      const notificationIndex = managedNotifications.findIndex(n => n.id === notificationId);
          
      if (notificationIndex === -1) {
        throw new Error(`Notification with ID ${notificationId} not found`);
      }
      
      // Update status
      const updatedNotification = {
        ...managedNotifications[notificationIndex],
        status
      };
      
      // Update in list
      managedNotifications[notificationIndex] = updatedNotification;
      
      // Save updated list
      await saveNotifications(managedNotifications);
      
      return updatedNotification;
    } catch (error) {
      logger.error(`Error updating notification status for ${notificationId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get notification management statistics
   */
  getNotificationStats: async (): Promise<{
    total: number;
    active: number;
    scheduled: number;
    delivered: number;
    cancelled: number;
    readRate: number;
  }> => {
    try {
      // Get all managed notifications
      const managedNotifications = await loadNotifications();
      
      // Count stats
      const total = managedNotifications.length;
      const active = managedNotifications.filter(n => n.status === 'active').length;
      const scheduled = managedNotifications.filter(n => 
        n.status === 'active' && 
        n.schedule && 
        !n.schedule.immediate && 
        n.schedule.scheduledFor && 
        new Date(n.schedule.scheduledFor) > new Date()
      ).length;
      const delivered = managedNotifications.filter(n => 
        n.status === 'active' || 
        n.status === 'completed'
      ).length;
      const cancelled = managedNotifications.filter(n => n.status === 'cancelled').length;
      
      // Calculate read rate
      const deliveredNotifications = managedNotifications.filter(n => 
        n.status === 'active' || 
        n.status === 'completed'
      );
      
      let totalReadCount = 0;
      let totalTargetCount = 0;
      
      deliveredNotifications.forEach(notification => {
        // Count total potential recipients
        let recipientCount = 0;
        if (notification.target?.userIds) {
          recipientCount = notification.target.userIds.length;
        } else if (notification.target?.allUsers) {
          recipientCount = 100; // Placeholder, would need actual user count
        } else if (notification.recipientId && notification.recipientId !== 'all') {
          recipientCount = 1;
        }
        
        // Count read recipients
        const readCount = notification.readBy ? notification.readBy.length : 0;
        
        totalReadCount += readCount;
        totalTargetCount += recipientCount;
      });
      
      const readRate = totalTargetCount > 0 ? (totalReadCount / totalTargetCount) * 100 : 0;
      
      return {
        total,
        active,
        scheduled,
        delivered,
        cancelled,
        readRate
      };
    } catch (error) {
      logger.error('Error getting notification stats:', error);
      throw error;
    }
  },
  
  /**
   * Get notifications by management status
   */
  getNotificationsByStatus: async (
    status: 'active' | 'paused' | 'completed' | 'cancelled'
  ): Promise<ManagedNotification[]> => {
    try {
      // Get all managed notifications
      const managedNotifications = await loadNotifications();
      
      // Filter by status
      return managedNotifications.filter(n => n.status === status);
    } catch (error) {
      logger.error(`Error getting notifications with status ${status}:`, error);
      throw error;
    }
  },
  
  /**
   * Get scheduled notifications
   */
  getScheduledNotifications: async (): Promise<ManagedNotification[]> => {
    try {
      // Get all managed notifications
      const managedNotifications = await loadNotifications();
      
      // Get current time
      const now = new Date();
      
      // Filter for active scheduled notifications
      return managedNotifications.filter(n => 
        n.status === 'active' && 
        n.schedule && 
        !n.schedule.immediate && 
        n.schedule.scheduledFor && 
        new Date(n.schedule.scheduledFor) > now
      );
    } catch (error) {
      logger.error('Error getting scheduled notifications:', error);
      throw error;
    }
  },
  
  /**
   * Deliver a notification to recipients (internal method)
   */
  deliverNotification: async (notification: ManagedNotification): Promise<void> => {
    try {
      // In a real app, this would send the notification to a messaging service
      // or use pushNotificationService to deliver to devices
      
      // For now, just log that we're delivering
      logger.log(`Delivering notification: ${notification.id} - ${notification.title}`);
      
      // Schedule as a local notification for testing on device
      await pushNotificationService.scheduleLocalNotification(
        notification.title,
        notification.message,
        {
          id: notification.id,
          type: notification.type,
          targetId: notification.targetId,
          recipientId: notification.recipientId
        }
      );
    } catch (error) {
      logger.error(`Error delivering notification ${notification.id}:`, error);
    }
  },
  
  /**
   * Process scheduled notifications (to be called by a background task)
   */
  processScheduledNotifications: async (): Promise<void> => {
    try {
      // Get all managed notifications
      const managedNotifications = await loadNotifications();
      
      // Get current time
      const now = new Date();
      
      // Find notifications that need to be delivered
      const notificationsToDeliver = managedNotifications.filter(n => 
        n.status === 'active' && 
        n.schedule && 
        !n.schedule.immediate && 
        n.schedule.scheduledFor && 
        new Date(n.schedule.scheduledFor) <= now && 
        // Don't re-deliver already delivered non-repeating notifications
        (n.schedule.repeat !== 'none' || !n.timestamp || new Date(n.timestamp) <= new Date(n.schedule.scheduledFor))
      );
      
      // Process each notification
      for (const notification of notificationsToDeliver) {
        // Mark as delivered by updating timestamp
        const updatedNotification = { ...notification, timestamp: now.toISOString() };
        
        // If it's a repeating notification, schedule the next one
        if (notification.schedule?.repeat && notification.schedule.repeat !== 'none' && notification.schedule.scheduledFor) {
          const nextSchedule = calculateNextSchedule(
            notification.schedule.scheduledFor,
            notification.schedule.repeat,
            notification.schedule.repeatUntil
          );
          
          if (nextSchedule) {
            // Update the schedule
            updatedNotification.schedule = {
              ...notification.schedule,
              scheduledFor: nextSchedule
            };
          } else {
            // End of schedule reached
            updatedNotification.status = 'completed';
          }
        } else {
          // Non-repeating notification is now completed
          updatedNotification.status = 'completed';
        }
        
        // Update in the list
        const notificationIndex = managedNotifications.findIndex(n => n.id === notification.id);
        managedNotifications[notificationIndex] = updatedNotification;
        
        // Deliver the notification
        await notificationService.deliverNotification(notification);
          }
      
      // Save updated notifications
      if (notificationsToDeliver.length > 0) {
        await saveNotifications(managedNotifications);
      }
    } catch (error) {
      logger.error('Error processing scheduled notifications:', error);
    }
  }
};

/**
 * Calculate the next scheduled time for a repeating notification
 */
function calculateNextSchedule(
  currentSchedule: string,
  repeatType: 'daily' | 'weekly' | 'monthly',
  repeatUntil?: string
): string | null {
  if (!currentSchedule) {
    return null; // Early return if currentSchedule is undefined
  }
  
  const currentDate = new Date(currentSchedule);
  let nextDate: Date;
  
  switch (repeatType) {
    case 'daily':
      nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate = new Date(currentDate);
      nextDate.setMonth(currentDate.getMonth() + 1);
      break;
    default:
      return null;
    }
  
  // Check if we've reached the end date
  if (repeatUntil && new Date(repeatUntil) < nextDate) {
    return null;
  }
  
  return nextDate.toISOString();
}

export default notificationService; 