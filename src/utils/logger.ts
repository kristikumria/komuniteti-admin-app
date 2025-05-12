/**
 * Logger utility for the application
 * Only logs in development mode to prevent leaking sensitive information in production
 */

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Logger object with methods that mirror console methods
 * In production, these methods will be no-ops
 */
export const logger = {
  log: (...args: any[]): void => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  info: (...args: any[]): void => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  warn: (...args: any[]): void => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]): void => {
    // Always log errors for debugging, but could be adjusted for production
    console.error(...args);
  },
  
  debug: (...args: any[]): void => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};

export default logger; 