import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { ArrowLeft, Menu, X, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';

import { NotificationBadge } from './NotificationBadge';

interface ActionProps {
  icon: React.ReactNode;
  onPress: () => void;
}

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  action?: ActionProps;
  onMenuPress?: () => void;
  showNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  showMenu = false,
  action,
  onMenuPress,
  showNotifications = true
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const userId = useAppSelector(state => state.auth.user?.id || 'admin1');
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  return (
    <Appbar.Header
      style={[
        styles.header,
        { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' },
      ]}
    >
      {showBack && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <ChevronLeft size={24} color={isDarkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
      )}
      
      {showMenu && (
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Menu size={24} color={isDarkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
      )}
      
      <Appbar.Content 
        title={title} 
        color={isDarkMode ? '#fff' : '#333'}
        style={styles.title} 
      />
      
      {showNotifications && (
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('NotificationsTab' as never)}
        >
          <NotificationBadge userId={userId} />
        </TouchableOpacity>
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  backButton: {
    marginLeft: 8,
  },
  menuButton: {
    marginLeft: 8,
  },
  notificationButton: {
    marginRight: 8,
  },
}); 