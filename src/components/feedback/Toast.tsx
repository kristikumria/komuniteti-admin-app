import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated, View, TouchableOpacity, ViewStyle } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react-native';
import { ElevationLevel } from '../../theme';
import type { AppTheme } from '../../theme/theme';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
  style?: ViewStyle;
  visible: boolean;
}

/**
 * A toast notification component that displays temporary feedback messages.
 * Follows Material Design 3 guidelines with support for different types and actions.
 * 
 * @example
 * <Toast
 *   message="Document saved successfully"
 *   type="success"
 *   visible={showToast}
 *   onDismiss={() => setShowToast(false)}
 *   action={{ label: 'UNDO', onPress: handleUndo }}
 * />
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 4000,
  onDismiss,
  action,
  style,
  visible,
}) => {
  const theme = useTheme() as AppTheme;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const [isVisible, setIsVisible] = useState(false);
  
  // Handle toast animation
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Auto dismiss after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else if (isVisible) {
      handleDismiss();
    }
  }, [visible]);
  
  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      if (onDismiss) {
        onDismiss();
      }
    });
  };
  
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.primary,
          iconColor: theme.colors.primary,
        };
      case 'error':
        return {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.error,
          iconColor: theme.colors.error,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: '#FFC107', // Amber
          iconColor: '#FFC107',
        };
      case 'info':
      default:
        return {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.primary,
          iconColor: theme.colors.primary,
        };
    }
  };
  
  const getIcon = () => {
    const toastStyles = getToastStyles();
    const iconSize = 20;
    
    switch (type) {
      case 'success':
        return <CheckCircle size={iconSize} color={toastStyles.iconColor} />;
      case 'error':
        return <XCircle size={iconSize} color={toastStyles.iconColor} />;
      case 'warning':
        return <AlertCircle size={iconSize} color={toastStyles.iconColor} />;
      case 'info':
      default:
        return <Info size={iconSize} color={toastStyles.iconColor} />;
    }
  };
  
  if (!isVisible && !visible) {
    return null;
  }
  
  const toastStyles = getToastStyles();
  
  return (
    <Animated.View
      style={[
        styles(theme).container,
        {
          opacity,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <Surface
        elevation={ElevationLevel.Level2}
        style={[
          styles(theme).toast,
          {
            backgroundColor: toastStyles.backgroundColor,
            borderLeftColor: toastStyles.borderColor,
          },
        ]}
      >
        <View style={styles(theme).contentContainer}>
          <View style={styles(theme).iconContainer}>{getIcon()}</View>
          <Text style={styles(theme).message} numberOfLines={2}>
            {message}
          </Text>
        </View>
        
        <View style={styles(theme).actionsContainer}>
          {action && (
            <TouchableOpacity 
              onPress={() => {
                action.onPress();
                handleDismiss();
              }}
              style={styles(theme).actionButton}
            >
              <Text style={styles(theme).actionText}>{action.label}</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={handleDismiss} style={styles(theme).closeButton}>
            <X size={18} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </Surface>
    </Animated.View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: theme.spacing.l,
    left: theme.spacing.m,
    right: theme.spacing.m,
    zIndex: 1000,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.roundness,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderLeftWidth: 4,
    width: '100%',
    maxWidth: 600,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: theme.spacing.s,
  },
  message: {
    flex: 1,
    color: theme.colors.onSurface,
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  actionText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 13,
    textTransform: 'uppercase',
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
}); 