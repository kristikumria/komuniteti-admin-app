import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface TextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

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
}: TextFieldProps<T>) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
          <>
            <TextInput
              label={label}
              value={value}
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
              style={styles.input}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            {error && (
              <Text style={styles.errorText}>{error.message}</Text>
            )}
          </>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#DC3545',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});