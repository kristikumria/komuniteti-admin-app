import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text, HelperText, useTheme } from 'react-native-paper';
import type { AppTheme } from '../../theme/theme';

interface FormFieldProps {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  children: ReactNode;
  style?: ViewStyle;
  disabled?: boolean;
}

/**
 * A standardized form field component that provides a consistent layout
 * for form elements with label, helper text, and error handling.
 * Follows Material Design 3 guidelines.
 * 
 * @example
 * <FormField
 *   label="Email Address"
 *   error={errors.email}
 *   helper="We'll never share your email"
 *   required
 * >
 *   <TextInput
 *     value={email}
 *     onChangeText={setEmail}
 *     keyboardType="email-address"
 *   />
 * </FormField>
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helper,
  required = false,
  children,
  style,
  disabled = false,
}) => {
  const theme = useTheme() as AppTheme;
  const hasError = !!error;
  
  return (
    <View style={[styles(theme).container, style]}>
      {label && (
        <Text 
          variant="bodyMedium"
          style={[
            styles(theme).label,
            disabled && styles(theme).disabled,
            hasError && styles(theme).errorText,
          ]}
        >
          {label}{required && <Text style={styles(theme).required}> *</Text>}
        </Text>
      )}
      
      <View style={styles(theme).fieldContainer}>
        {children}
      </View>
      
      {(helper || error) && (
        <HelperText
          type={hasError ? 'error' : 'info'}
          visible={!!(helper || error)}
          style={[
            styles(theme).helperText,
            disabled && styles(theme).disabled,
          ]}
        >
          {hasError ? error : helper}
        </HelperText>
      )}
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.error,
  },
  fieldContainer: {
    marginBottom: theme.spacing.xs,
  },
  helperText: {
    marginVertical: 0,
    paddingVertical: 0,
  },
  errorText: {
    color: theme.colors.error,
  },
  disabled: {
    color: theme.colors.onSurfaceDisabled,
  },
}); 