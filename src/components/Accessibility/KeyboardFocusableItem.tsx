import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { Text } from 'react-native-paper';
import { useAccessibility } from '../AccessibilityProvider';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { AppTheme } from '../../theme/theme';

interface KeyboardFocusableItemProps {
  index: number;
  focused: boolean;
  onFocus?: () => void; 
  onPress?: () => void;
  setRef?: (index: number, ref: any) => void;
  label: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  testID?: string;
  children?: React.ReactNode;
}

export const KeyboardFocusableItem: React.FC<KeyboardFocusableItemProps> = ({
  index,
  focused,
  onFocus,
  onPress,
  setRef,
  label,
  accessibilityLabel,
  accessibilityHint,
  containerStyle,
  contentStyle,
  labelStyle,
  disabled = false,
  testID,
  children,
}) => {
  const { settings } = useAccessibility();
  const { theme } = useThemedStyles();
  const styles = createStyles(theme);
  const itemRef = useRef<any>(null);
  const focusAnim = useRef(new Animated.Value(0)).current;
  
  // Pass the ref up to the parent component
  useEffect(() => {
    if (setRef) {
      setRef(index, itemRef.current);
    }
  }, [index, setRef]);
  
  // Animate focus ring when focused changes
  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: focused ? 1 : 0,
      duration: settings.reduceMotion ? 0 : 200,
      useNativeDriver: false,
    }).start();
    
    if (focused && onFocus) {
      onFocus();
    }
  }, [focused, focusAnim, onFocus, settings.reduceMotion]);
  
  // Dynamically calculate focus ring styles
  const focusRingStyle = {
    opacity: focusAnim,
    transform: [
      {
        scale: focusAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  };
  
  return (
    <View style={[styles.container, containerStyle]} testID={testID}>
      <Animated.View
        style={[
          styles.focusRing,
          focusRingStyle,
          disabled && styles.disabled,
        ]}
      />
      <TouchableOpacity
        ref={itemRef}
        style={[styles.content, contentStyle, disabled && styles.disabledContent]}
        onPress={disabled ? undefined : onPress}
        activeOpacity={disabled ? 1 : 0.7}
        accessible={true}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{
          disabled,
          selected: focused,
        }}
      >
        {children ? (
          children
        ) : (
          <Text style={[styles.label, labelStyle, disabled && styles.disabledText]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 4,
    borderRadius: 8,
  },
  focusRing: {
    position: 'absolute',
    top: -4,
    right: -4,
    bottom: -4,
    left: -4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
  },
  label: {
    color: theme.colors.onSurface,
    fontSize: 16,
  },
  disabled: {
    borderColor: theme.colors.outlineVariant,
  },
  disabledContent: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  disabledText: {
    color: theme.colors.outline,
  },
}); 