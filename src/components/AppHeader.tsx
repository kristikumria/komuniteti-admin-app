import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Badge, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Bell, Settings } from 'lucide-react-native';
import { useAppSelector } from '../store/hooks';
import { ContextSwitcher } from './ContextSwitcher';

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  showContextSwitcher?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  showNotifications = true,
  showSettings = true,
  showContextSwitcher = true,
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { user } = useAppSelector(state => state.auth);
  const { unreadCount } = useAppSelector(state => state.notifications);
  
  // Determine title if not provided
  const headerTitle = title || (user?.role === 'business_manager' ? 'Business Manager' : 'Administrator');
  
  return (
    <Appbar.Header
      style={styles.header}
      theme={{ colors: { primary: theme.colors.surface } }}
    >
      {showBackButton && (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      )}
      
      {showContextSwitcher && user && (
        <ContextSwitcher />
      )}
      
      <Appbar.Content 
        title={headerTitle} 
        titleStyle={styles.title}
      />
      
      {showNotifications && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('NotificationsScreen' as never)}
        >
          <View>
            <Bell size={24} color={theme.colors.onSurface} />
            {unreadCount > 0 && (
              <Badge
                style={styles.badge}
                size={16}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </View>
        </TouchableOpacity>
      )}
      
      {showSettings && (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Settings' as never)}
        >
          <Settings size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 4,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  iconButton: {
    marginHorizontal: 8,
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
}); 