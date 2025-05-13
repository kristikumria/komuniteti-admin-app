import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Appbar, Text, useTheme, Surface } from 'react-native-paper';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AppTheme } from '../theme/theme';

import { NotificationBadge } from './NotificationBadge';
import { AccountSwitcherHeader } from './AccountSwitcherHeader';

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
  showAccountSwitcher?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  action,
  showNotifications = false,
  showAccountSwitcher = false
}) => {
  const theme = useTheme<AppTheme>();
  const navigation = useNavigation();
  const isDarkMode = theme.dark;
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
  
  const handleAccountSwitch = (accountId: string) => {
    // In a real app, this would dispatch an action to switch accounts
    console.log('Switching to account:', accountId);
    // For demo purposes, show an alert
    const selectedAccount = accountId;
    alert(`Switched to account ${selectedAccount}`);
  };
  
  return (
    <Surface 
      style={[
        styles.container, 
        { 
          paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 16),
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.outlineVariant,
        }
      ]}
      elevation={1}
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
          {showAccountSwitcher ? (
            <AccountSwitcherHeader onAccountSwitch={handleAccountSwitch} />
          ) : (
            <>
              <Text 
                variant="titleMedium"
                numberOfLines={1} 
                style={styles.title}
              >
                {title}
              </Text>
              
              {subtitle && (
                <Text 
                  variant="bodySmall"
                  numberOfLines={1}
                  style={styles.subtitle}
                >
                  {subtitle}
                </Text>
              )}
            </>
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    textAlign: 'center',
    opacity: 0.7,
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