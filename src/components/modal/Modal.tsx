import React, { ReactNode, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Modal as RNModal,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
  ViewStyle,
} from 'react-native';
import { Surface, Text, Button, IconButton, useTheme } from 'react-native-paper';
import { X } from 'lucide-react-native';
import { ElevationLevel } from '../../theme';
import type { AppTheme } from '../../theme/theme';

interface ModalProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  children: ReactNode;
  contentStyle?: ViewStyle;
  dismissable?: boolean;
  dismissableBackButton?: boolean;
  footer?: ReactNode;
  actions?: Array<{
    label: string;
    onPress: () => void;
    mode?: 'text' | 'outlined' | 'contained';
    color?: string;
  }>;
  width?: number | "auto" | `${number}%`;
  hideCloseButton?: boolean;
}

/**
 * A modal component that follows Material Design 3 guidelines.
 * Provides a container for content that requires user attention or interaction.
 * 
 * @example
 * <Modal
 *   visible={visible}
 *   onDismiss={() => setVisible(false)}
 *   title="Delete Item"
 *   actions={[
 *     { label: 'Cancel', onPress: () => setVisible(false), mode: 'text' },
 *     { label: 'Delete', onPress: handleDelete, mode: 'contained', color: theme.colors.error }
 *   ]}
 * >
 *   <Text>Are you sure you want to delete this item?</Text>
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  onDismiss,
  title,
  children,
  contentStyle,
  dismissable = true,
  dismissableBackButton = true,
  footer,
  actions,
  width = "85%",
  hideCloseButton = false,
}) => {
  const theme = useTheme() as AppTheme;
  const { height } = Dimensions.get('window');
  
  // Animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  
  // Handle back button press
  useEffect(() => {
    if (visible && dismissableBackButton) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          onDismiss();
          return true;
        }
      );
      
      return () => backHandler.remove();
    }
    return undefined;
  }, [visible, dismissableBackButton, onDismiss]);
  
  // Handle animations
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, scale]);
  
  return (
    <RNModal
      transparent
      visible={visible}
      onRequestClose={dismissableBackButton ? onDismiss : undefined}
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles(theme).modalContainer}>
        <TouchableOpacity
          style={styles(theme).backdrop}
          activeOpacity={1}
          onPress={dismissable ? onDismiss : undefined}
        />
        
        <Animated.View
          style={[
            styles(theme).modalContentContainer,
            {
              opacity,
              transform: [{ scale }],
              width: typeof width === 'number' ? width : width,
              maxHeight: height * 0.8,
            },
          ]}
        >
          <Surface
            elevation={ElevationLevel.Level3}
            style={[styles(theme).modalContent, contentStyle]}
          >
            {/* Header */}
            {title && (
              <View style={styles(theme).header}>
                <Text variant="titleLarge" style={styles(theme).title}>
                  {title}
                </Text>
                
                {!hideCloseButton && dismissable && (
                  <IconButton
                    icon={() => <X size={20} color={theme.colors.onSurfaceVariant} />}
                    size={20}
                    onPress={onDismiss}
                    style={styles(theme).closeButton}
                  />
                )}
              </View>
            )}
            
            {/* Content */}
            <View style={styles(theme).bodyContent}>{children}</View>
            
            {/* Footer with actions */}
            {(footer || actions) && (
              <View style={styles(theme).footer}>
                {footer || (
                  <View style={styles(theme).actions}>
                    {actions?.map((action, index) => (
                      <Button
                        key={`${action.label}-${index}`}
                        mode={action.mode || 'text'}
                        onPress={() => {
                          action.onPress();
                        }}
                        textColor={action.color || theme.colors.primary}
                        style={[
                          styles(theme).actionButton,
                          index === actions.length - 1 && styles(theme).lastAction,
                        ]}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </View>
                )}
              </View>
            )}
          </Surface>
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentContainer: {
    borderRadius: theme.roundness,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.xs,
  },
  title: {
    color: theme.colors.onSurface,
    flex: 1,
  },
  closeButton: {
    margin: 0,
  },
  bodyContent: {
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
  },
  footer: {
    padding: theme.spacing.m,
    paddingTop: 0,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.s,
  },
  actionButton: {
    marginLeft: theme.spacing.xs,
  },
  lastAction: {
    marginRight: 0,
  },
}); 