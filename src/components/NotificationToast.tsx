import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/hooks';
import { getNotificationIcon } from '../utils/notificationUtils';
import { Notification, AdministratorStackParamList } from '../navigation/types';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { AppTheme } from '../theme/theme';

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
  const { theme } = useThemedStyles();
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
        styles(theme).container,
        {
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
      <Surface elevation={2}>
        <View style={styles(theme).surfaceContent}>
          <TouchableOpacity style={styles(theme).content} onPress={handlePress}>
            <View style={styles(theme).iconContainer}>
              {getNotificationIcon(notification, 24, theme.colors.primary)}
            </View>
            
            <View style={styles(theme).textContainer}>
              <Text variant="labelLarge" style={styles(theme).title}>
                {notification.title}
              </Text>
              <Text 
                variant="bodySmall"
                style={styles(theme).message}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {notification.message}
              </Text>
            </View>
            
            <TouchableOpacity style={styles(theme).closeButton} onPress={handleDismiss}>
              <Text style={{ color: theme.colors.primary }}>×</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Surface>
    </Animated.View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    margin: theme.spacing.s,
    zIndex: 1000,
  },
  surface: {
    borderRadius: theme.roundness,
  },
  surfaceContent: {
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    padding: theme.spacing.m - 4, // 12px equivalent 
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    marginRight: theme.spacing.m - 4, // 12px equivalent
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 2,
    color: theme.colors.onSurface,
  },
  message: {
    color: theme.colors.onSurfaceVariant,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});