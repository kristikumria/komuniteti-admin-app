/**
 * Format date to a readable string
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Format date to a time ago string (e.g., "5 minutes ago", "2 hours ago")
 * @param date Date to format
 * @returns Time ago string
 */
export const formatTimeAgo = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // Fallback to formatted date
  return formatDate(date);
};

/**
 * Format a date string to a readable format with time
 * @param dateString ISO date string
 * @returns formatted date and time string (e.g. "Jan 15, 2025, 9:30 AM")
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

/**
 * Calculate time difference between two dates
 * @param startDate ISO date string
 * @param endDate ISO date string (defaults to now)
 * @returns formatted duration (e.g. "2 days", "3 hours", "45 minutes", etc.)
 */
export const formatTimeDifference = (startDate: string, endDate?: string): string => {
  const start = new Date(startDate).getTime();
  const end = endDate ? new Date(endDate).getTime() : new Date().getTime();
  const diffMs = Math.abs(end - start);
  
  // Convert to minutes, hours, and days
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
  } else if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}`;
  } else {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'}`;
  }
};

/**
 * Get a relative time string (e.g. "2 days ago", "just now", etc.)
 * @param dateString ISO date string
 * @returns relative time string
 */
export const getRelativeTimeString = (dateString: string): string => {
  const date = new Date(dateString).getTime();
  const now = new Date().getTime();
  
  const diffMs = now - date;
  if (diffMs < 0) {
    // Future date
    return formatDate(dateString);
  }
  
  // Convert to minutes, hours, and days
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else {
    return formatDate(dateString);
  }
}; 