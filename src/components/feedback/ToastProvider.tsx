import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastType } from './Toast';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * A provider component that manages toast notifications globally.
 * Allows showing toasts from anywhere in the app.
 */
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ToastOptions>({
    message: '',
    type: 'info',
    duration: 4000,
  });

  const showToast = useCallback((newOptions: ToastOptions) => {
    // Hide any existing toast first
    if (visible) {
      setVisible(false);
      setTimeout(() => {
        setOptions(newOptions);
        setVisible(true);
      }, 300); // Small delay to ensure the previous toast animation completes
    } else {
      setOptions(newOptions);
      setVisible(true);
    }
  }, [visible]);

  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={options.message}
        type={options.type}
        duration={options.duration}
        action={options.action}
        visible={visible}
        onDismiss={handleDismiss}
      />
    </ToastContext.Provider>
  );
};

/**
 * Hook to access the toast functionality.
 * @returns {ToastContextType} The toast context with showToast and hideToast functions
 * 
 * @example
 * const { showToast } = useToast();
 * 
 * // Show a success toast
 * showToast({
 *   message: 'Profile updated successfully!',
 *   type: 'success',
 *   duration: 3000
 * });
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 