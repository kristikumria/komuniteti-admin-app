import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Text, Button, TextInput, RadioButton, Surface } from 'react-native-paper';
import { authService } from '../services/authService';
import { UserRole } from '../store/slices/authSlice';
import { registerSchema } from '../utils/validationSchemas';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { AppTheme } from '../theme/theme';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export const RegisterScreen = ({ navigation }: any) => {
  const { theme, commonStyles } = useThemedStyles();
  const [loading, setLoading] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'administrator',
    },
    resolver: yupResolver(registerSchema),
  });
  
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = data;
      await authService.register(userData);
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please log in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again with different credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles(theme).scrollContainer}>
      <View style={styles(theme).container}>
        <TouchableOpacity 
          style={styles(theme).backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text variant="labelLarge" style={styles(theme).backButtonText}>← Back to Login</Text>
        </TouchableOpacity>
        
        <Surface style={styles(theme).headerContainer} elevation={0}>
          <Text variant="headlineMedium" style={styles(theme).title}>Create Account</Text>
          <Text variant="bodyLarge" style={styles(theme).subtitle}>
            Join Komuniteti to start managing your properties efficiently.
          </Text>
        </Surface>
        
        <Surface style={styles(theme).formContainer} elevation={1}>
          {/* Name Field */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Full Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.name}
                mode="outlined"
                left={<TextInput.Icon icon="account" />}
                style={styles(theme).textInput}
                outlineStyle={{ borderRadius: theme.shapes.corner.small }}
              />
            )}
          />
          {errors.name && (
            <Text variant="labelSmall" style={styles(theme).errorText}>
              {errors.name.message}
            </Text>
          )}
          
          {/* Email Field */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.email}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
                style={styles(theme).textInput}
                outlineStyle={{ borderRadius: theme.shapes.corner.small }}
              />
            )}
          />
          {errors.email && (
            <Text variant="labelSmall" style={styles(theme).errorText}>
              {errors.email.message}
            </Text>
          )}
          
          {/* Password Field */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.password}
                mode="outlined"
                secureTextEntry
                left={<TextInput.Icon icon="lock" />}
                style={styles(theme).textInput}
                outlineStyle={{ borderRadius: theme.shapes.corner.small }}
              />
            )}
          />
          {errors.password && (
            <Text variant="labelSmall" style={styles(theme).errorText}>
              {errors.password.message}
            </Text>
          )}
          
          {/* Confirm Password Field */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.confirmPassword}
                mode="outlined"
                secureTextEntry
                left={<TextInput.Icon icon="lock-check" />}
                style={styles(theme).textInput}
                outlineStyle={{ borderRadius: theme.shapes.corner.small }}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text variant="labelSmall" style={styles(theme).errorText}>
              {errors.confirmPassword.message}
            </Text>
          )}
          
          {/* Role Selection */}
          <Text variant="titleMedium" style={styles(theme).sectionTitle}>
            Select Your Role
          </Text>
          
          <Surface style={styles(theme).roleSelectionContainer} elevation={0}>
            <Controller
              control={control}
              name="role"
              render={({ field: { onChange, value } }) => (
                <RadioButton.Group onValueChange={onChange as (value: string) => void} value={value}>
                  <View style={styles(theme).roleOption}>
                    <RadioButton
                      value="administrator"
                      color={theme.colors.primary}
                    />
                    <Text variant="bodyMedium" style={styles(theme).roleText}>Administrator</Text>
                  </View>
                  <View style={styles(theme).roleOption}>
                    <RadioButton
                      value="business_manager"
                      color={theme.colors.primary}
                    />
                    <Text variant="bodyMedium" style={styles(theme).roleText}>Business Manager</Text>
                  </View>
                </RadioButton.Group>
              )}
            />
          </Surface>
          
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles(theme).submitButton}
            contentStyle={{ height: 48 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          >
            Create Account
          </Button>
        </Surface>
        
        <View style={styles(theme).loginPrompt}>
          <Text variant="bodyMedium" style={styles(theme).promptText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text variant="bodyMedium" style={styles(theme).promptLink}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.l,
  },
  backButton: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  backButtonText: {
    fontWeight: '500',
    color: theme.colors.primary,
  },
  headerContainer: {
    marginBottom: theme.spacing.l,
    padding: theme.spacing.m,
    borderRadius: theme.shapes.corner.medium,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
    color: theme.colors.onSurface,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    padding: theme.spacing.m,
    borderRadius: theme.shapes.corner.medium,
    backgroundColor: theme.colors.surfaceContainer,
    marginBottom: theme.spacing.m,
  },
  textInput: {
    marginBottom: theme.spacing.s,
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  errorText: {
    marginBottom: theme.spacing.s,
    marginTop: -theme.spacing.xs,
    marginLeft: theme.spacing.s,
    color: theme.colors.error,
  },
  sectionTitle: {
    fontWeight: '500',
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.s,
    color: theme.colors.onSurface,
  },
  roleSelectionContainer: {
    borderRadius: theme.shapes.corner.small,
    backgroundColor: theme.colors.surfaceContainerHigh,
    padding: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xs,
  },
  roleText: {
    marginLeft: theme.spacing.s,
    color: theme.colors.onSurface,
  },
  submitButton: {
    marginTop: theme.spacing.l,
    borderRadius: theme.shapes.corner.small,
    backgroundColor: theme.colors.primary,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.m,
    padding: theme.spacing.m,
  },
  promptText: {
    color: theme.colors.onSurfaceVariant,
  },
  promptLink: {
    fontWeight: '500',
    color: theme.colors.primary,
  },
});