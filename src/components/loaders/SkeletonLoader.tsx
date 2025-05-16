import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { AppTheme } from '../../theme/theme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  cancelAnimation,
  Easing
} from 'react-native-reanimated';
import { useAccessibility } from '../AccessibilityProvider';

type SkeletonShape = 'rectangle' | 'circle' | 'rounded';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  shape?: SkeletonShape;
  radius?: number;
  style?: ViewStyle;
  shimmer?: boolean;
  backgroundColor?: string;
  highlightColor?: string;
}

/**
 * SkeletonLoader component for displaying placeholder content
 * while actual content is loading, following Material Design 3 guidelines
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 16,
  shape = 'rectangle',
  radius,
  style,
  shimmer = true,
  backgroundColor,
  highlightColor,
}) => {
  const { theme } = useThemedStyles();
  const { settings } = useAccessibility();
  
  // Disable animation for reduced motion settings
  const enableAnimation = shimmer && !settings.reduceMotion;
  
  // Animation value for shimmer effect
  const animatedValue = useSharedValue(0);
  
  // Set up animation
  useEffect(() => {
    if (enableAnimation) {
      animatedValue.value = 0;
      animatedValue.value = withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1, // Infinite repetitions
        false
      );
    }
    
    return () => {
      if (enableAnimation) {
        cancelAnimation(animatedValue);
      }
    };
  }, [enableAnimation, animatedValue]);
  
  // Animated styles for shimmer effect
  const animatedStyles = useAnimatedStyle(() => {
    // Convert width to number for calculations
    const widthValue = typeof width === 'string' ? 300 : width;
    
    return {
      transform: [
        {
          translateX: withTiming(
            animatedValue.value * widthValue * 2,
            { duration: 0 }
          ),
        },
      ],
    };
  });
  
  // Determine border radius based on shape
  const getBorderRadius = (): number => {
    if (radius !== undefined) return radius;
    
    switch (shape) {
      case 'circle':
        return height / 2;
      case 'rounded':
        return theme.shapes.corner.medium;
      case 'rectangle':
      default:
        return theme.shapes.corner.extraSmall;
    }
  };
  
  return (
    <View
      style={[
        styles(theme).container,
        {
          width,
          height,
          borderRadius: getBorderRadius(),
          backgroundColor: backgroundColor || theme.colors.surfaceVariant,
        },
        style,
      ]}
      accessibilityLabel="Loading content"
      accessibilityRole="none"
      accessibilityState={{ busy: true }}
      aria-hidden="true"
    >
      {enableAnimation && (
        <Animated.View
          style={[
            styles(theme).shimmer,
            {
              backgroundColor: highlightColor || theme.colors.surface,
            },
            animatedStyles,
          ]}
        />
      )}
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  shimmer: {
    width: '50%',
    height: '100%',
    opacity: 0.5,
    position: 'absolute',
    left: -100,
  },
}); 