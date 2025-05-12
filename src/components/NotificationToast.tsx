import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/hooks';
import { getNotificationIcon } from '../utils/notificationUtils';
import { Notification, AdministratorStackParamList } from '../navigation/types';

interface NotificationToastProps {
  notification: Notification | null;
  onDismiss: () => void;
  duration?: number;
}

// Define the navigation prop type
type NotificationNavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;

/**
 * Component to display a toast notification
 */
export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  duration = 5000
}) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const navigation = useNavigation<NotificationNavigationProp>();
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (notification) {
      // Animate in
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Set timeout to dismiss
      const timeout = setTimeout(() => {
        handleDismiss();
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [notification]);
  
  const handleDismiss = () => {
    // Animate out
    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };
  
  const handlePress = () => {
    if (notification) {
      // Navigate to notification details
      navigation.navigate('NotificationDetails', { notificationId: notification.id });
      handleDismiss();
    }
  };
  
  if (!notification) return null;
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
          opacity: animation,
        },
      ]}
    >
      <TouchableOpacity style={styles.content} onPress={handlePress}>
        <View style={styles.iconContainer}>
          {getNotificationIcon(notification, 24, theme.colors.primary)}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#333' }]}>
            {notification.title}
          </Text>
          <Text 
            style={[styles.message, { color: isDarkMode ? '#ccc' : '#666' }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {notification.message}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
          <Text style={{ color: theme.colors.primary }}>×</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    margin: 8,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});