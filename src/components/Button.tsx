import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton, useTheme } from 'react-native-paper';

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
}) => {
  const theme = useTheme();
  
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        mode === 'contained' && { backgroundColor: theme.colors.primary },
        style,
      ]}
      labelStyle={[styles.label, labelStyle]}
      contentStyle={styles.content}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    paddingVertical: 8,
    marginVertical: 10,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'none',
  },
  content: {
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 