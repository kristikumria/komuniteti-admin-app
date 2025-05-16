import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Text, IconButton, useTheme, Avatar, Surface } from 'react-native-paper';
import { ArrowLeft, Bell, Briefcase, ChevronDown, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { ContextSwitcher } from './ContextSwitcher';
import { BusinessAccount } from '../navigation/types';
import { setSelectedAccount } from '../store/slices/businessAccountSlice';
import { NotificationBadge } from './NotificationBadge';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  centerTitle?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  showContextSwitcher?: boolean;
  showAccountSwitcher?: boolean;
  onAccountSwitcherPress?: () => void;
  actionIcon?: string;
  actionLabel?: string;
  navigation?: any;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5; // Proper elevation type
}

/**
 * Enhanced Header component that follows Material Design 3 guidelines.
 * Provides the top app bar with navigation controls, title, and action buttons.
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  showNotifications = false,
  centerTitle = false,
  onBackPress,
  rightAction,
  showContextSwitcher = false,
  showAccountSwitcher = false,
  onAccountSwitcherPress,
  actionIcon,
  actionLabel,
  navigation,
  elevation = 1,
}) => {
  const theme = useTheme();
  const nav = useNavigation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { selectedAccount } = useAppSelector((state) => state.businessAccount);
  
  // Constants for header layout
  const headerHeight = Platform.OS === 'ios' ? 48 : 56;
  const paddingTop = insets.top;
  
  // Determine status bar style based on dark mode
  const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';
  
  // Handle back button press
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation) {
      navigation.goBack();
    } else {
      nav.goBack();
    }
  };
  
  return (
    <Surface
      style={[
        styles.container,
        {
          paddingTop: paddingTop,
          height: headerHeight + paddingTop,
          backgroundColor: theme.colors.surface,
          borderBottomColor: theme.colors.outlineVariant,
        }
      ]}
      elevation={elevation}
    >
      <StatusBar 
        barStyle={statusBarStyle} 
        backgroundColor="transparent" 
        translucent 
      />
      
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <IconButton
              icon={({ size, color }) => <ChevronLeft size={size} color={color} />}
              iconColor={theme.colors.onSurfaceVariant}
              size={24}
              onPress={handleBackPress}
              style={styles.backButton}
              accessibilityLabel="Back"
              accessibilityHint="Navigate to the previous screen"
            />
          )}
          
          <View style={[
            styles.titleContainer,
            showBackButton && styles.titleContainerWithBack,
            centerTitle && styles.centerTitle,
            (!showBackButton && !showNotifications && !rightAction) && styles.fullWidthTitle
          ]}>
            <Text 
              variant="titleMedium"
              style={[
                styles.title,
                { color: theme.colors.onSurface },
                centerTitle && styles.centeredText,
              ]}
              numberOfLines={1}
              accessibilityRole="header"
            >
              {title}
            </Text>
            
            {subtitle && (
              <Text
                variant="bodySmall"
                style={[
                  styles.subtitle,
                  { color: theme.colors.onSurfaceVariant },
                  centerTitle && styles.centeredText,
                ]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.rightSection}>
          {showContextSwitcher && <ContextSwitcher />}
          
          {showAccountSwitcher && selectedAccount && (
            <TouchableOpacity 
              style={styles.accountSwitcher}
              onPress={onAccountSwitcherPress}
              accessibilityRole="button"
              accessibilityLabel="Switch account"
              accessibilityHint="Open account switcher menu"
            >
              <Avatar.Icon 
                size={28} 
                icon={({ size }) => <Briefcase size={size-8} />}
                style={{ backgroundColor: theme.colors.primaryContainer }}
                color={theme.colors.onPrimaryContainer}
              />
              
              <View style={styles.accountSwitcherTextContainer}>
                <Text 
                  variant="labelSmall" 
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Business
                </Text>
                <View style={styles.accountNameRow}>
                  <Text 
                    variant="labelMedium" 
                    style={{ color: theme.colors.onSurface }}
                    numberOfLines={1}
                  >
                    {selectedAccount.name}
                  </Text>
                  <ChevronDown size={14} color={theme.colors.onSurfaceVariant} style={{ marginLeft: 4 }} />
                </View>
              </View>
            </TouchableOpacity>
          )}
          
          {rightAction && (
            <View style={styles.rightActionContainer}>
              {rightAction}
            </View>
          )}
          
          {showNotifications && (
            <View style={styles.notificationContainer}>
              <IconButton
                icon={({ size, color }) => <Bell size={size-2} color={color} />}
                iconColor={theme.colors.onSurfaceVariant}
                size={24}
                onPress={() => {
                  if (navigation) {
                    navigation.navigate('NotificationsScreen');
                  } else {
                    nav.navigate('NotificationsScreen' as never);
                  }
                }}
                style={styles.notificationButton}
                accessibilityLabel="Notifications"
                accessibilityHint="View your notifications"
              />
              <View style={styles.badgeContainer}>
                <NotificationBadge />
              </View>
            </View>
          )}
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    zIndex: 10,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    margin: 0,
    marginRight: 4,
  },
  titleContainer: {
    flex: 1,
  },
  titleContainerWithBack: {
    marginLeft: 4,
  },
  title: {
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 2,
  },
  centerTitle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthTitle: {
    alignItems: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
  accountSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    padding: 8,
    borderRadius: 8,
  },
  accountSwitcherTextContainer: {
    marginLeft: 8,
    maxWidth: 120,
  },
  accountNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
  },
  rightActionContainer: {
    marginLeft: 8,
  },
  notificationContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    margin: 0,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
}); 