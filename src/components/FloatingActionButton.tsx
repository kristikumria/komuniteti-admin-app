import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View,
  Platform,
  AccessibilityProps 
} from 'react-native';
import { 
  FAB, 
  useTheme,
  Portal
} from 'react-native-paper';
import { ElevationLevel } from '../theme/elevation';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  FadeIn,
  FadeOut
} from 'react-native-reanimated';

export interface FloatingActionButtonProps {
  icon: string;
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  visible?: boolean;
  color?: string;
  backgroundColor?: string;
  small?: boolean;
  extended?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  style?: any;
  position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft' | 'custom';
  customPosition?: { bottom?: number; right?: number; top?: number; left?: number };
  animated?: boolean;
  animationDelay?: number;
}

/**
 * A Material Design 3 Floating Action Button with enhanced styling and animations.
 * This wrapper adds proper elevation, animations, and theming to the standard FAB.
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  onPress,
  disabled = false,
  loading = false,
  visible = true,
  color,
  backgroundColor,
  small = false,
  extended = false,
  accessibilityLabel,
  testID,
  style,
  position = 'bottomRight',
  customPosition,
  animated = true,
  animationDelay = 0
}) => {
  const theme = useTheme();
  const scale = useSharedValue(animated ? 0.8 : 1);
  
  // Set default positions based on position prop
  let positionStyle;
  switch (position) {
    case 'bottomRight':
      positionStyle = { bottom: 16, right: 16 };
      break;
    case 'bottomLeft':
      positionStyle = { bottom: 16, left: 16 };
      break;
    case 'topRight':
      positionStyle = { top: 16, right: 16 };
      break;
    case 'topLeft':
      positionStyle = { top: 16, left: 16 };
      break;
    case 'custom':
      positionStyle = customPosition || { bottom: 16, right: 16 };
      break;
    default:
      positionStyle = { bottom: 16, right: 16 };
  }
  
  // Animation for FAB entrance
  useEffect(() => {
    if (visible && animated) {
      setTimeout(() => {
        scale.value = withSpring(1, {
          damping: 15,
          stiffness: 120,
        });
      }, animationDelay);
    }
  }, [visible, animated, scale, animationDelay]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  // Calculate proper elevation for MD3
  const getElevation = () => {
    if (Platform.OS === 'ios') {
      return {};
    }
    return { elevation: small ? 4 : 6 };
  };
  
  if (!visible) return null;
  
  return (
    <Animated.View 
      style={[
        styles.container,
        positionStyle,
        animatedStyle,
        style
      ]}
      entering={animated ? FadeIn.delay(animationDelay).duration(300) : undefined}
      exiting={FadeOut.duration(200)}
    >
      <FAB
        icon={icon}
        label={extended ? label : undefined}
        onPress={onPress}
        disabled={disabled}
        loading={loading}
        color={color || theme.colors.onPrimary}
        style={[
          styles.fab,
          {
            backgroundColor: backgroundColor || theme.colors.primary,
          },
          getElevation(),
        ]}
        size={small ? 'small' : 'medium'}
        customSize={small ? undefined : 56}
        mode={extended ? 'elevated' : 'elevated'}
        accessibilityLabel={accessibilityLabel || label}
        testID={testID}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  fab: {
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  }
});

export default FloatingActionButton; 