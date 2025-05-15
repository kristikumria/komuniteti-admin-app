import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Text, useTheme, Avatar } from 'react-native-paper';
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
  showBack?: boolean;
  showNotifications?: boolean;
  centerTitle?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  showContextSwitcher?: boolean;
  showAccountSwitcher?: boolean;
  onAccountSwitcherPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showNotifications = false,
  centerTitle = false,
  onBackPress,
  rightAction,
  showContextSwitcher = false,
  showAccountSwitcher = false,
  onAccountSwitcherPress,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { selectedAccount } = useAppSelector((state) => state.businessAccount);
  
  // Constants for header layout
  const headerHeight = Platform.OS === 'ios' ? 44 : 56;
  const paddingTop = insets.top;
  const isAndroid = Platform.OS === 'android';
  
  // Determine status bar style based on dark mode
  const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';
  
  // Handle back button press
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };
  
  return (
    <>
      <StatusBar 
        barStyle={statusBarStyle} 
        backgroundColor="transparent" 
        translucent 
      />
      <View
        style={[
          styles.container,
          {
            paddingTop: paddingTop,
            backgroundColor: theme.colors.surface,
            height: headerHeight + paddingTop,
            borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            {showBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronLeft 
                  size={24} 
                  color={theme.colors.primary} 
                />
              </TouchableOpacity>
            )}
            
            <View style={[
              showBack ? styles.titleContainerWithBack : styles.titleContainer,
              centerTitle && styles.centerTitle,
              (!showBack && !showNotifications && !rightAction) && styles.fullWidthTitle
            ]}>
              <Text 
                style={[
                  styles.title, 
                  { color: theme.colors.onSurface },
                  centerTitle && styles.centeredTitle,
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
              
              {subtitle && (
                <Text
                  style={[
                    styles.subtitle,
                    { color: theme.colors.onSurfaceVariant },
                    centerTitle && styles.centeredTitle,
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
              >
                <Avatar.Icon 
                  size={28} 
                  icon={(props) => <Briefcase {...props} />} 
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                  color={theme.colors.primary}
                />
                <View style={styles.accountSwitcherTextContainer}>
                  <Text style={styles.accountSwitcherLabel}>Business</Text>
                  <View style={styles.accountNameRow}>
                    <Text style={styles.accountSwitcherValue} numberOfLines={1}>{selectedAccount.name}</Text>
                    <ChevronDown size={14} color={theme.colors.primary} style={{ marginLeft: 4 }} />
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
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => navigation.navigate('NotificationsScreen' as never)}
              >
                <Bell size={22} color={theme.colors.primary} />
                <NotificationBadge />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    zIndex: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  titleContainerWithBack: {
    flex: 1,
    marginLeft: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionButton: {
    padding: 8,
  },
  // Account switcher styles
  accountSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 12,
    padding: 6,
    marginRight: 8,
  },
  accountSwitcherTextContainer: {
    marginLeft: 6,
    maxWidth: 120,
  },
  accountSwitcherLabel: {
    fontSize: 9,
    opacity: 0.6,
  },
  accountNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountSwitcherValue: {
    fontSize: 11,
    fontWeight: '600',
  },
  centerTitle: {
    alignItems: 'center',
  },
  fullWidthTitle: {
    alignItems: 'center',
  },
  centeredTitle: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  rightActionContainer: {
    marginRight: 12,
  },
  notificationButton: {
    padding: 4,
    position: 'relative',
  },
}); 