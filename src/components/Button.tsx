import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton, useTheme } from 'react-native-paper';
import type { AppTheme } from '../theme/theme';

type ButtonMode = 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';

interface ButtonProps {
  mode?: ButtonMode;
  onPress: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: any;
  labelStyle?: any;
  fullWidth?: boolean;
  compact?: boolean;
  uppercase?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  mode = 'contained',
  onPress,
  children,
  disabled = false,
  loading = false,
  icon,
  style,
  labelStyle,
  fullWidth = false,
  compact = false,
  uppercase = false,
}) => {
  const theme = useTheme<AppTheme>();
  
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      compact={compact}
      uppercase={uppercase}
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        mode === 'contained' && { backgroundColor: theme.colors.primary },
        mode === 'contained-tonal' && { backgroundColor: theme.colors.primaryContainer },
        mode === 'outlined' && { 
          borderColor: theme.colors.outline,
          borderWidth: 1,
        },
        disabled && { 
          backgroundColor: mode === 'contained' ? theme.colors.surfaceDisabled : 'transparent',
          borderColor: mode === 'outlined' ? theme.colors.surfaceDisabled : 'transparent',
        },
        style,
      ]}
      labelStyle={[
        styles.label,
        mode === 'text' && { color: theme.colors.primary },
        mode === 'outlined' && { color: theme.colors.primary },
        mode === 'contained' && { color: theme.colors.onPrimary },
        mode === 'contained-tonal' && { color: theme.colors.onPrimaryContainer },
        disabled && { color: theme.colors.onSurfaceDisabled },
        labelStyle,
      ]}
      contentStyle={[
        styles.content,
        compact && styles.compact,
      ]}
      theme={theme}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginVertical: 8,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    textTransform: 'none',
  },
  content: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: {
    height: 36,
  },
});