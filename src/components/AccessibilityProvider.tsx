import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilityInfo, AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from '../utils/logger';

// Define accessibility settings interface
export interface AccessibilitySettings {
  screenReaderEnabled: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
}

// Define accessibility context interface
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (setting: keyof AccessibilitySettings, value: boolean) => Promise<void>;
  announceForAccessibility: (message: string) => void;
}

// Default settings
const DEFAULT_SETTINGS: AccessibilitySettings = {
  screenReaderEnabled: false,
  reduceMotion: false,
  highContrast: false,
  largeText: false,
};

// Create context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Storage key
const SETTINGS_STORAGE_KEY = 'accessibility_settings';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [appState, setAppState] = useState(AppState.currentState);

  // Load saved settings on mount
  useEffect(() => {
    loadSettings();
    
    // Set up screen reader change listener
    const screenReaderChangedSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      handleScreenReaderChanged
    );
    
    // Set up app state change listener to detect when app comes to foreground
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Initial screen reader check
    checkScreenReaderEnabled();
    
    // Cleanup listeners
    return () => {
      screenReaderChangedSubscription.remove();
      appStateSubscription.remove();
    };
  }, []);
  
  // Check for screen reader changes when app returns to foreground
  useEffect(() => {
    if (appState === 'active') {
      checkScreenReaderEnabled();
    }
  }, [appState]);
  
  const handleAppStateChange = (nextAppState: typeof AppState.currentState) => {
    setAppState(nextAppState);
  };
  
  const handleScreenReaderChanged = (isEnabled: boolean) => {
    updateSetting('screenReaderEnabled', isEnabled);
  };
  
  const checkScreenReaderEnabled = async () => {
    try {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      if (isEnabled !== settings.screenReaderEnabled) {
        updateSetting('screenReaderEnabled', isEnabled);
      }
    } catch (error) {
      logger.error('Error checking screen reader status:', error);
    }
  };
  
  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(currentSettings => ({
          ...currentSettings,
          ...parsedSettings,
        }));
      }
    } catch (error) {
      logger.error('Error loading accessibility settings:', error);
    }
  };
  
  const saveSettings = async (newSettings: AccessibilitySettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      logger.error('Error saving accessibility settings:', error);
    }
  };
  
  const updateSetting = async (setting: keyof AccessibilitySettings, value: boolean) => {
    try {
      const newSettings = {
        ...settings,
        [setting]: value,
      };
      setSettings(newSettings);
      await saveSettings(newSettings);
    } catch (error) {
      logger.error(`Error updating accessibility setting ${setting}:`, error);
    }
  };
  
  const announceForAccessibility = (message: string) => {
    if (settings.screenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  };
  
  return (
    <AccessibilityContext.Provider 
      value={{ 
        settings, 
        updateSetting,
        announceForAccessibility,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook for using accessibility context
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  
  return context;
}; 