import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme, Button, TextInput, RadioButton } from 'react-native-paper';
import { authService } from '../services/authService';
import { UserRole } from '../store/slices/authSlice';
import { registerSchema } from '../utils/validationSchemas';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export const RegisterScreen = ({ navigation }: any) => {
  const theme = useTheme();
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>← Back to Login</Text>
        </TouchableOpacity>
        
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Join Komuniteti to start managing your properties efficiently.
          </Text>
        </View>
        
        <View style={styles.formContainer}>
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
                style={styles.textInput}
              />
            )}
          />
          {errors.name && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
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
                style={styles.textInput}
              />
            )}
          />
          {errors.email && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
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
                style={styles.textInput}
              />
            )}
          />
          {errors.password && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
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
                style={styles.textInput}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.confirmPassword.message}
            </Text>
          )}
          
          {/* Role Selection */}
          <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
            Select Your Role
          </Text>
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group onValueChange={onChange as (value: string) => void} value={value}>
                <View style={styles.roleOption}>
                  <RadioButton
                    value="administrator"
                    color={theme.colors.primary}
                  />
                  <Text style={styles.roleText}>Administrator</Text>
                </View>
                <View style={styles.roleOption}>
                  <RadioButton
                    value="business_manager"
                    color={theme.colors.primary}
                  />
                  <Text style={styles.roleText}>Business Manager</Text>
                </View>
              </RadioButton.Group>
            )}
          />
          
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          >
            Create Account
          </Button>
          
          <View style={styles.loginPrompt}>
            <Text style={styles.promptText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.promptLink, { color: theme.colors.primary }]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  backButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  textInput: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  roleText: {
    fontSize: 16,
    marginLeft: 8,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 6,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  promptText: {
    fontSize: 14,
    color: '#666',
  },
  promptLink: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 