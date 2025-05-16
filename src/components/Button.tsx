import React from 'react';
import { StyleSheet, AccessibilityProps, Platform, View, Pressable } from 'react-native';
import { Button as PaperButton, Text, ActivityIndicator, useTheme } from 'react-native-paper';
import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import type { MD3Theme } from 'react-native-paper';

type ButtonMode = 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonWidth = 'auto' | 'full' | 'half';
type PaperButtonElevation = 0 | 1 | 2 | 3 | 4 | 5 | undefined;

interface ButtonProps extends AccessibilityProps {
  mode?: ButtonMode;
  size?: ButtonSize;
  width?: ButtonWidth;
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconSource;
  style?: any;
  labelStyle?: any;
  compact?: boolean;
  uppercase?: boolean;
  loadingText?: string;
  testID?: string;
  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * Enhanced Button component that follows MD3 design principles
 * with improved accessibility and visual feedback.
 */
export const Button: React.FC<ButtonProps> = ({
  mode = 'contained',
  size = 'medium',
  width = 'auto',
  onPress,
  children,
  disabled = false,
  loading = false,
  icon,
  style,
  labelStyle,
  compact = false,
  uppercase = false,
  loadingText,
  testID,
  // Accessibility props with defaults
  accessibilityLabel,
  accessibilityHint,
  ...accessibilityProps
}) => {
  const theme = useTheme();
  
  // Set appropriate elevation level based on mode
  const getElevation = (): PaperButtonElevation => {
    if (disabled) return 0;
    
    switch (mode) {
      case 'contained':
        return 2;
      case 'contained-tonal':
        return 1;
      case 'elevated':
        return 3;
      default:
        return 0;
    }
  };
  
  // Determine button height based on size
  const getButtonHeight = (): number => {
    if (compact) {
      return 36; // Compact height regardless of size
    }
    
    switch (size) {
      case 'small':
        return 36;
      case 'large':
        return 56; // Increased for better touch targets
      case 'medium':
      default:
        return 44;
    }
  };
  
  // If label is not provided, use children as label if it's a string
  const defaultAccessibilityLabel = 
    typeof children === 'string' ? children : undefined;
  
  // Generate default accessibility hint based on button state
  const getDefaultAccessibilityHint = (): string | undefined => {
    if (loading) return loadingText || 'Loading, please wait';
    if (disabled) return 'This action is currently unavailable';
    return undefined;
  };
  
  // Get styles based on props
  const buttonStyles = [
    styles(theme).button,
    mode === 'contained' && styles(theme).contained,
    mode === 'contained-tonal' && styles(theme).containedTonal,
    mode === 'outlined' && styles(theme).outlined,
    mode === 'text' && styles(theme).text,
    mode === 'elevated' && styles(theme).elevated,
    size === 'small' && styles(theme).small,
    size === 'medium' && styles(theme).medium,
    size === 'large' && styles(theme).large,
    width === 'full' && styles(theme).full,
    width === 'half' && styles(theme).half,
    width === 'auto' && styles(theme).auto,
    { height: getButtonHeight() },
    disabled && styles(theme).disabled,
    loading && styles(theme).loading,
    style,
  ];
  
  const labelStyles = [
    styles(theme).label,
    size === 'small' && styles(theme).smallLabel,
    size === 'medium' && styles(theme).mediumLabel,
    size === 'large' && styles(theme).largeLabel,
    mode === 'contained' && styles(theme).containedLabel,
    mode === 'contained-tonal' && styles(theme).containedTonalLabel,
    mode === 'outlined' && styles(theme).outlinedLabel,
    mode === 'text' && styles(theme).textLabel,
    mode === 'elevated' && styles(theme).elevatedLabel,
    disabled && styles(theme).disabledLabel,
    labelStyle,
  ];
  
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled || loading}
      loading={loading}
      icon={loading ? undefined : icon}
      compact={compact}
      uppercase={uppercase}
      elevation={getElevation()}
      style={buttonStyles}
      labelStyle={labelStyles}
      contentStyle={[
        styles(theme).content,
        compact && styles(theme).compact,
      ]}
      // Accessibility properties
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ 
        disabled: disabled || loading,
        busy: loading,
      }}
      accessibilityLabel={loading && loadingText 
        ? loadingText 
        : (accessibilityLabel || defaultAccessibilityLabel)}
      accessibilityHint={accessibilityHint || getDefaultAccessibilityHint()}
      importantForAccessibility="yes"
      testID={testID}
      {...accessibilityProps}
    >
      {loading && loadingText ? loadingText : children}
    </PaperButton>
  );
};

const styles = (theme: MD3Theme) => StyleSheet.create({
  button: {
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  compact: {
    paddingHorizontal: 12,
  },
  
  // Size styles
  small: {
    minHeight: 36,
  },
  medium: {
    minHeight: 44,
  },
  large: {
    minHeight: 56,
  },
  
  // Width styles
  auto: {
    alignSelf: 'flex-start',
  },
  full: {
    width: '100%',
    alignSelf: 'stretch',
  },
  half: {
    width: '48%',
    alignSelf: 'flex-start',
  },
  
  // Mode styles
  contained: {
    backgroundColor: theme.colors.primary,
  },
  containedTonal: {
    backgroundColor: theme.colors.primaryContainer,
  },
  outlined: {
    borderColor: theme.colors.outline,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  text: {
    backgroundColor: 'transparent',
  },
  elevated: {
    backgroundColor: theme.colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  
  // Label styles by mode
  containedLabel: {
    color: theme.colors.onPrimary,
  },
  containedTonalLabel: {
    color: theme.colors.onPrimaryContainer,
  },
  outlinedLabel: {
    color: theme.colors.primary,
  },
  textLabel: {
    color: theme.colors.primary,
  },
  elevatedLabel: {
    color: theme.colors.primary,
  },
  
  // Label styles by size
  smallLabel: {
    fontSize: 14,
  },
  mediumLabel: {
    fontSize: 16,
  },
  largeLabel: {
    fontSize: 18,
  },
  
  // Label style
  label: {
    fontWeight: '600',
    textTransform: 'none',
    letterSpacing: 0.15,
  },
  
  // State styles
  disabled: {
    opacity: 0.6,
    backgroundColor: theme.colors.surfaceDisabled,
  },
  disabledLabel: {
    color: theme.colors.onSurfaceDisabled,
  },
  loading: {
    opacity: 0.8,
  },
});