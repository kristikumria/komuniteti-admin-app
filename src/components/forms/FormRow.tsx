import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import type { AppTheme } from '../../theme/theme';

interface FormRowProps {
  children: React.ReactNode;
  label?: string;
  required?: boolean;
  horizontal?: boolean;
  spaceBetween?: boolean;
  style?: any;
  labelStyle?: any;
  testID?: string;
  accessibilityLabel?: string;
}

/**
 * FormRow component for consistent layout in forms
 * Can be used in horizontal or vertical orientations
 */
export const FormRow: React.FC<FormRowProps> = ({
  children,
  label,
  required = false,
  horizontal = false,
  spaceBetween = false,
  style,
  labelStyle,
  testID,
  accessibilityLabel,
}) => {
  const { theme } = useThemedStyles();
  
  return (
    <View 
      style={[
        styles(theme).container,
        horizontal && styles(theme).horizontalContainer,
        spaceBetween && styles(theme).spaceBetween,
        style,
      ]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      {label && (
        <Text 
          variant="bodyMedium" 
          style={[styles(theme).label, labelStyle]}
          accessibilityRole="text"
        >
          {label}{required && <Text style={styles(theme).requiredMark}>*</Text>}
        </Text>
      )}
      <View style={horizontal ? styles(theme).horizontalContent : styles(theme).content}>
        {children}
      </View>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
    width: '100%',
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  label: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  requiredMark: {
    color: theme.colors.error,
    marginLeft: theme.spacing.xxs,
  },
  content: {
    width: '100%',
  },
  horizontalContent: {
    flex: 1,
  },
}); 