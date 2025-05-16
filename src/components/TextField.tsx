import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { TextInput, Text, HelperText } from 'react-native-paper';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { AppTheme } from '../theme/theme';

interface TextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  helperText?: string;
  maxLength?: number;
  style?: any;
  dense?: boolean;
  required?: boolean;
  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

/**
 * A form field component that follows MD3 design principles
 * for text inputs and validation states.
 */
export const TextField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  left,
  right,
  helperText,
  maxLength,
  style,
  dense = false,
  required = false,
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  testID,
}: TextFieldProps<T>) => {
  const { theme } = useThemedStyles();

  // Generate an ID for associating the input with helper text for screen readers
  const inputId = `field-${name}`;
  
  // Generate accessibility hint including required status if not provided
  const defaultAccessibilityHint = required 
    ? `${label} field, required`
    : `${label} field`;

  return (
    <View 
      style={[styles(theme).container, style]}
      testID={`${testID || name}-container`}
    >
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error, isTouched } }) => (
          <>
            <TextInput
              label={required ? `${label} *` : label}
              value={value?.toString() || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              mode="outlined"
              multiline={multiline}
              numberOfLines={numberOfLines}
              disabled={disabled}
              error={!!error}
              left={left}
              right={right}
              maxLength={maxLength}
              dense={dense}
              style={[
                styles(theme).input,
                multiline && { minHeight: 24 * (numberOfLines || 3) },
              ]}
              contentStyle={styles(theme).contentStyle}
              outlineStyle={styles(theme).outlineStyle}
              outlineColor={isTouched ? theme.colors.outline : theme.colors.outlineVariant}
              activeOutlineColor={error ? theme.colors.error : theme.colors.primary}
              textColor={theme.colors.onSurface}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              theme={{
                ...theme,
                colors: {
                  ...theme.colors,
                  background: 'transparent',
                },
              }}
              // Accessibility properties
              accessible
              accessibilityLabel={accessibilityLabel || label}
              accessibilityHint={accessibilityHint || defaultAccessibilityHint}
              accessibilityState={{ 
                disabled, 
                selected: false,
                busy: false,
                checked: false,
                expanded: false,
              }}
              accessibilityRole="text"
              accessibilityElementsHidden={disabled}
              importantForAccessibility={disabled ? 'no-hide-descendants' : 'yes'}
              nativeID={inputId}
              testID={testID || `${name}-input`}
            />
            
            {/* Show helper text or error message */}
            {(!!error || helperText) && (
              <HelperText
                type={error ? "error" : "info"}
                visible={true}
                style={styles(theme).helperText}
                accessibilityLiveRegion="polite"
                accessibilityLabel={error ? `Error: ${error.message}` : helperText}
              >
                {error?.message || helperText}
              </HelperText>
            )}
          </>
        )}
      />
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.medium,
    width: '100%',
  },
  input: {
    backgroundColor: 'transparent',
    fontSize: theme.fonts.bodyLarge.fontSize,
    fontFamily: theme.fonts.bodyLarge.fontFamily,
    // Adjust for platform-specific styles
    ...Platform.select({
      ios: {
        paddingVertical: 4,
      },
      android: {
        paddingVertical: 2,
      },
    }),
  },
  contentStyle: {
    paddingVertical: theme.spacing.inputPadding / 2,
    paddingHorizontal: theme.spacing.inputPadding,
  },
  outlineStyle: {
    borderRadius: theme.shapes.components.input.cornerRadius,
    borderWidth: theme.shapes.components.input.borderWidth,
  },
  helperText: {
    marginTop: 4,
    marginBottom: 0,
    paddingHorizontal: theme.spacing.inputPadding / 2,
    fontSize: theme.fonts.bodySmall.fontSize,
    lineHeight: theme.fonts.bodySmall.lineHeight,
  },
});