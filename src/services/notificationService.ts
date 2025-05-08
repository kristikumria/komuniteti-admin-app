import axios from 'axios';
import { Notification } from '../navigation/types';

// API config (to be replaced with actual API endpoint)
const API_URL = process.env.API_URL || 'https://api.komuniteti.com';

// Mock data for development until API is ready
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Payment Received',
    message: 'Payment of $750 received from Alex Johnson for September rent.',
    icon: 'credit-card',
    timestamp: '2023-09-05T14:30:00Z',
    read: true,
    type: 'payment',
    targetId: '101',
    recipientId: 'admin1',
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

export const notificationService = {
  // Get all notifications for a user
  getNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/users/${userId}/notifications`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          // Filter notifications for this user or for all users
          const userNotifications = MOCK_NOTIFICATIONS.filter(
            notification => notification.recipientId === userId || notification.recipientId === 'all'
          );
          resolve(userNotifications);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },
  
  // Get unread notification count
  getUnreadCount: async (userId: string): Promise<number> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/users/${userId}/notifications/unread/count`);
      // return response.data.count;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const userNotifications = MOCK_NOTIFICATIONS.filter(
            notification => (notification.recipientId === userId || notification.recipientId === 'all') && !notification.read
          );
          resolve(userNotifications.length);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      throw error;
    }
  },
  
  // Get a notification by ID
  getNotificationById: async (notificationId: string): Promise<Notification> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/notifications/${notificationId}`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const notification = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
          if (notification) {
            resolve(notification);
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
  markAsRead: async (notificationId: string): Promise<Notification> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.patch(`${API_URL}/notifications/${notificationId}/read`, { read: true });
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const notificationIndex = MOCK_NOTIFICATIONS.findIndex(n => n.id === notificationId);
          
          if (notificationIndex !== -1) {
            const updatedNotification = {
              ...MOCK_NOTIFICATIONS[notificationIndex],
              read: true,
            };
            
            // In a real implementation, we would update the notification in the database
            // but for mock purposes, we just return the updated notification
            resolve(updatedNotification);
          } else {
            reject(new Error(`Notification with ID ${notificationId} not found`));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  },
  
  // Mark all notifications as read
  markAllAsRead: async (userId: string): Promise<void> => {
    try {
      // Uncomment when API is ready
      // await axios.patch(`${API_URL}/users/${userId}/notifications/read`);
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          // In a real implementation, we would update all notifications in the database
          // but for mock purposes, we just resolve the promise
          resolve();
        }, 500);
      });
    } catch (error) {
      console.error(`Error marking all notifications as read for user ${userId}:`, error);
      throw error;
    }
  },
  
  // Create a new notification
  createNotification: async (notificationData: Omit<Notification, 'id' | 'timestamp'>): Promise<Notification> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.post(`${API_URL}/notifications`, notificationData);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const newNotification: Notification = {
            ...notificationData,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: new Date().toISOString(),
          };
          
          // In a real implementation, we would add the notification to the database
          // but for mock purposes, we just return the new notification
          resolve(newNotification);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },
  
  // Delete a notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    try {
      // Uncomment when API is ready
      // await axios.delete(`${API_URL}/notifications/${notificationId}`);
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const notificationIndex = MOCK_NOTIFICATIONS.findIndex(n => n.id === notificationId);
          
          if (notificationIndex !== -1) {
            // In a real implementation, we would delete the notification from the database
            // but for mock purposes, we just resolve the promise
            resolve();
          } else {
            reject(new Error(`Notification with ID ${notificationId} not found`));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  }
}; 