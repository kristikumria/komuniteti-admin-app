import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Dimensions, 
  BackHandler,
  Platform 
} from 'react-native';
import { 
  Portal, 
  Dialog, 
  Button, 
  Text, 
  Surface, 
  useTheme 
} from 'react-native-paper';
import { useAppSelector } from '../store/hooks';
import { ElevationLevel } from '../theme/elevation';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
  runOnJS
} from 'react-native-reanimated';

export interface DialogContainerProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  content?: React.ReactNode;
  contentText?: string;
  actions?: React.ReactNode;
  dismissable?: boolean;
  dismissLabel?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  icon?: React.ReactNode;
  loading?: boolean;
  testID?: string;
  maxWidth?: number;
  fullWidth?: boolean;
  alignTop?: boolean;
  children?: React.ReactNode;
}

/**
 * A Material Design 3 dialog component with animations and theming.
 * This is a wrapper around React Native Paper's Dialog that adds customizations.
 */
export const DialogContainer: React.FC<DialogContainerProps> = ({
  visible,
  onDismiss,
  title,
  content,
  contentText,
  actions,
  dismissable = true,
  dismissLabel = 'Cancel',
  confirmLabel = 'OK',
  onConfirm,
  icon,
  loading = false,
  testID,
  maxWidth = 560,
  fullWidth = false,
  alignTop = false,
  children
}) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings?.darkMode) ?? false;
  const { width: windowWidth } = Dimensions.get('window');
  const actualWidth = fullWidth ? windowWidth - 48 : Math.min(maxWidth, windowWidth - 48);
  
  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (visible && dismissable) {
          onDismiss();
          return true;
        }
        return false;
      }
    );
    
    return () => backHandler.remove();
  }, [visible, dismissable, onDismiss]);
  
  // Render standard action buttons if no custom actions provided
  const renderDefaultActions = () => {
    if (actions) return actions;
    
    return (
      <Dialog.Actions>
        {dismissable && (
          <Button 
            onPress={onDismiss} 
            textColor={theme.colors.primary}
            disabled={loading}
            accessibilityLabel={dismissLabel}
            accessibilityRole="button"
          >
            {dismissLabel}
          </Button>
        )}
        
        {onConfirm && (
          <Button 
            onPress={onConfirm}
            mode="contained"
            loading={loading}
            disabled={loading}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            accessibilityLabel={confirmLabel}
            accessibilityRole="button"
          >
            {confirmLabel}
          </Button>
        )}
      </Dialog.Actions>
    );
  };
  
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={dismissable ? onDismiss : undefined}
        style={[
          styles.dialog,
          {
            backgroundColor: theme.colors.surface,
            width: actualWidth,
            marginTop: alignTop ? 80 : undefined
          }
        ]}
        dismissable={dismissable}
        testID={testID}
      >
        <Animated.View
          entering={SlideInUp.duration(300).easing(Easing.bezier(0.25, 0.1, 0.25, 1))}
          exiting={SlideOutDown.duration(200)}
        >
          {icon && (
            <View style={styles.iconContainer}>
              {icon}
            </View>
          )}
          
          {title && (
            <Dialog.Title 
              style={[
                styles.title,
                { color: theme.colors.onSurface }
              ]}
            >
              {title}
            </Dialog.Title>
          )}
          
          <Dialog.Content>
            {contentText && (
              <Text 
                style={[
                  styles.contentText,
                  { color: theme.colors.onSurfaceVariant }
                ]}
                accessibilityRole="text"
              >
                {contentText}
              </Text>
            )}
            
            {content}
            {children}
          </Dialog.Content>
          
          {renderDefaultActions()}
        </Animated.View>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 28,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'medium',
    marginVertical: 8,
  },
  contentText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
  },
});

export default DialogContainer; 