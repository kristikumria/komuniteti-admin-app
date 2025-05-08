import React from 'react';
import { Bell, CreditCard, AlertCircle, User, Building, MessageCircle, RefreshCw, Wrench as ToolIcon } from 'lucide-react-native';
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
  size: number = 20,
  color: string = '#000'
): React.ReactNode => {
  switch (notification.type) {
    case 'payment':
      return <CreditCard size={size} color={color} />;
    case 'maintenance':
      return <ToolIcon size={size} color={color} />;
    case 'resident':
      return <User size={size} color={color} />;
    case 'building':
      return <Building size={size} color={color} />;
    case 'message':
      return <MessageCircle size={size} color={color} />;
    case 'system':
      return <RefreshCw size={size} color={color} />;
    default:
      return <Bell size={size} color={color} />;
  }
};

/**
 * Get descriptive text for notification status
 * @param read Whether the notification has been read
 * @returns Status text
 */
export const getNotificationStatusText = (read: boolean): string => {
  return read ? 'Read' : 'Unread';
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