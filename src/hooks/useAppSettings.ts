import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettings {
  darkMode: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  language: string;
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  pushNotifications: true,
  emailNotifications: true,
  language: 'en',
};

export const useAppSettings = () => {
  const [darkMode, setDarkMode] = useState(DEFAULT_SETTINGS.darkMode);
  const [pushNotifications, setPushNotifications] = useState(DEFAULT_SETTINGS.pushNotifications);
  const [emailNotifications, setEmailNotifications] = useState(DEFAULT_SETTINGS.emailNotifications);
  const [language, setLanguage] = useState(DEFAULT_SETTINGS.language);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const settingsJson = await AsyncStorage.getItem('appSettings');
        if (settingsJson) {
          const settings: AppSettings = JSON.parse(settingsJson);
          setDarkMode(settings.darkMode);
          setPushNotifications(settings.pushNotifications);
          setEmailNotifications(settings.emailNotifications);
          setLanguage(settings.language);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to storage whenever they change
  useEffect(() => {
    const saveSettings = async () => {
      if (isLoading) return; // Don't save during initial load

      try {
        const settings: AppSettings = {
          darkMode,
          pushNotifications,
          emailNotifications,
          language,
        };
        await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };

    saveSettings();
  }, [darkMode, pushNotifications, emailNotifications, language, isLoading]);

  // Toggle functions
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const togglePushNotifications = () => setPushNotifications(!pushNotifications);
  const toggleEmailNotifications = () => setEmailNotifications(!emailNotifications);
  
  // Set language
  const setAppLanguage = (lang: string) => setLanguage(lang);

  // Reset to defaults
  const resetSettings = async () => {
    try {
      setDarkMode(DEFAULT_SETTINGS.darkMode);
      setPushNotifications(DEFAULT_SETTINGS.pushNotifications);
      setEmailNotifications(DEFAULT_SETTINGS.emailNotifications);
      setLanguage(DEFAULT_SETTINGS.language);
      await AsyncStorage.removeItem('appSettings');
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  };

  return {
    darkMode,
    pushNotifications,
    emailNotifications,
    language,
    isLoading,
    toggleDarkMode,
    togglePushNotifications,
    toggleEmailNotifications,
    setAppLanguage,
    resetSettings,
  };
}; 