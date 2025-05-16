import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Text, Button, TextInput, Surface } from 'react-native-paper';
import { authService } from '../services/authService';
import { forgotPasswordSchema } from '../utils/validationSchemas';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { AppTheme } from '../theme/theme';

interface ForgotPasswordFormData {
  email: string;
}

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const { theme, commonStyles } = useThemedStyles();
  const [loading, setLoading] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(forgotPasswordSchema),
  });
  
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
      Alert.alert(
        'Reset Email Sent',
        'Please check your email for instructions to reset your password.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to process your request. Please try again.');
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
          <Text variant="headlineMedium" style={styles(theme).title}>Forgot Password</Text>
          <Text variant="bodyLarge" style={styles(theme).subtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </Surface>
        
        <Surface style={styles(theme).formContainer} elevation={1}>
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
          
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles(theme).submitButton}
            contentStyle={{ height: 48 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          >
            Send Reset Instructions
          </Button>
          
          <View style={styles(theme).infoContainer}>
            <Text variant="bodyMedium" style={styles(theme).infoText}>
              After submitting, check your email inbox for a link to reset your password. 
              If you don't receive an email within a few minutes, please check your spam folder.
            </Text>
          </View>
        </Surface>
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
    marginBottom: theme.spacing.xl,
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
  },
  textInput: {
    marginBottom: theme.spacing.s,
    backgroundColor: theme.colors.surfaceContainerHighest,
  },
  errorText: {
    marginBottom: theme.spacing.m,
    marginTop: -theme.spacing.xs,
    marginLeft: theme.spacing.s,
    color: theme.colors.error,
  },
  submitButton: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.m,
    borderRadius: theme.shapes.corner.small,
    backgroundColor: theme.colors.primary,
  },
  infoContainer: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.infoContainer,
    borderRadius: theme.shapes.corner.small,
    borderLeftWidth: theme.shapes.border.thick,
    borderLeftColor: theme.colors.info,
  },
  infoText: {
    color: theme.colors.onInfoContainer,
  },
});