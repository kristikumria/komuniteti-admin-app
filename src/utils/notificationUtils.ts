import React from 'react';
import { Bell, CreditCard, User, Building, MessageCircle, RefreshCw, Wrench } from 'lucide-react-native';
import { Notification } from '../navigation/types';

/**
 * Get the appropriate icon for a notification based on its type
 * @param notification The notification object
 * @param size Icon size
 * @param color Icon color
 * @returns React component for the icon
 */
export const getNotificationIcon = (
  notification: Notification,
  size = 20,
  color = '#000'
): React.ReactNode => {
  switch (notification.type) {
    case 'payment':
      return React.createElement(CreditCard, { size, color });
    case 'maintenance':
      return React.createElement(Wrench, { size, color });
    case 'resident':
      return React.createElement(User, { size, color });
    case 'building':
      return React.createElement(Building, { size, color });
    case 'message':
      return React.createElement(MessageCircle, { size, color });
    case 'system':
      return React.createElement(RefreshCw, { size, color });
    default:
      return React.createElement(Bell, { size, color });
  }
};

/**
 * Get relative time text for a notification timestamp
 * @param timestamp ISO date string
 * @returns Human-readable relative time
 */
export const getRelativeTimeText = (timestamp: string): string => {
  const now = new Date();
  const notificationDate = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  // For older notifications, return the formatted date
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  
  if (notificationDate.getFullYear() !== now.getFullYear()) {
    options.year = 'numeric';
  }
  
  return notificationDate.toLocaleDateString('en-US', options);
}; 