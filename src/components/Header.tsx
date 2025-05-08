import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Animated } from 'react-native';
import { Appbar, Text, useTheme, Surface } from 'react-native-paper';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NotificationBadge } from './NotificationBadge';

interface ActionProps {
  icon: React.ReactNode;
  onPress: () => void;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  action?: ActionProps;
  showNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  action,
  showNotifications = false
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const userId = useAppSelector(state => state.auth.user?.id || 'admin1');
  const insets = useSafeAreaInsets();
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  const handleNotificationPress = () => {
    try {
      // @ts-ignore
      navigation.navigate('NotificationsScreen');
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Notifications feature coming soon');
    }
  };
  
  // Shadow properties based on platform
  const shadowStyle = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.1 : 0.05,
      shadowRadius: 3,
    },
    android: {
      elevation: 3,
    }
  });
  
  const backgroundColor = isDarkMode ? '#121212' : '#ffffff';
  const titleColor = isDarkMode ? '#ffffff' : '#333333';
  const subtitleColor = isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
  
  return (
    <Surface 
      style={[
        styles.container, 
        shadowStyle,
        { 
          paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 16),
          backgroundColor,
          borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        }
      ]}
    >
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton} 
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <ChevronLeft 
                size={26} 
                color={theme.colors.primary} 
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.titleContainer}>
          <Text 
            numberOfLines={1} 
            style={[
              styles.title, 
              { color: titleColor }
            ]}
          >
            {title}
          </Text>
          
          {subtitle && (
            <Text 
              numberOfLines={1}
              style={[styles.subtitle, { color: subtitleColor }]}
            >
              {subtitle}
            </Text>
          )}
        </View>
        
        <View style={styles.rightSection}>
          {action && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              {action.icon}
            </TouchableOpacity>
          )}
          
          {showNotifications && (
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={handleNotificationPress}
              activeOpacity={0.7}
            >
              <NotificationBadge userId={userId} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    width: '100%',
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  notificationButton: {
    padding: 4,
    borderRadius: 20,
  },
}); 