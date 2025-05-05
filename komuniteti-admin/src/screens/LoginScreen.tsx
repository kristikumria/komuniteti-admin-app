import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme, Button, TextInput, Checkbox, Divider, IconButton, Switch } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginRequest, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { loginSchema } from '../utils/validationSchemas';
import * as LocalAuthentication from 'expo-local-authentication';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  
  const [rememberMe, setRememberMe] = useState(false);
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'business_manager' | 'administrator'>('business_manager');
  
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(loginSchema),
  });
  
  // Check for biometrics availability
  useEffect(() => {
    const checkBiometrics = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setIsBiometricsAvailable(compatible && enrolled);
    };
    
    checkBiometrics();
  }, []);
  
  // Set default email based on selected role
  useEffect(() => {
    if (selectedRole === 'business_manager') {
      setValue('email', 'business@example.com');
    } else {
      setValue('email', 'property@example.com');
    }
    setValue('password', 'password123'); // For demo purposes
  }, [selectedRole, setValue]);
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      dispatch(loginRequest());
      const result = await authService.login(data);
      dispatch(loginSuccess(result));
    } catch (error: any) {
      dispatch(loginFailure(error.message || 'Login failed'));
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
    }
  };
  
  const handleBiometricAuth = async () => {
    try {
      dispatch(loginRequest());
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use password instead',
      });
      
      if (result.success) {
        // Use the default credentials based on selected role
        const email = selectedRole === 'business_manager' ? 'business@example.com' : 'property@example.com';
        const loginResult = await authService.login({ email, password: 'password123' });
        dispatch(loginSuccess(loginResult));
      } else {
        dispatch(loginFailure('Biometric authentication cancelled'));
      }
    } catch (error: any) {
      dispatch(loginFailure(error.message || 'Biometric authentication failed'));
      Alert.alert('Authentication Failed', 'Please try again or use email/password login instead.');
    }
  };
  
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };
  
  const handleRegister = () => {
    navigation.navigate('Register');
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          {/* App logo */}
          <View style={[styles.logo, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.logoText}>K</Text>
          </View>
          <Text style={[styles.appName, { color: theme.colors.onSurface }]}>Komuniteti</Text>
          <Text style={[styles.appSubtitle, { color: theme.colors.onSurfaceVariant }]}>Property Management Platform</Text>
        </View>
        
        <View style={styles.formContainer}>
          {/* Role selection */}
          <View style={styles.roleSelectionContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'business_manager' && { backgroundColor: theme.colors.primaryContainer }
              ]}
              onPress={() => setSelectedRole('business_manager')}
            >
              <View style={styles.roleButtonContent}>
                <Text style={[
                  styles.roleButtonText,
                  selectedRole === 'business_manager' && { color: theme.colors.primary }
                ]}>
                  Business Manager
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'administrator' && { backgroundColor: theme.colors.primaryContainer }
              ]}
              onPress={() => setSelectedRole('administrator')}
            >
              <View style={styles.roleButtonContent}>
                <Text style={[
                  styles.roleButtonText,
                  selectedRole === 'administrator' && { color: theme.colors.primary }
                ]}>
                  Administrator
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Email input */}
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
          
          {/* Password input */}
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
                right={<TextInput.Icon icon="eye" onPress={() => {}} />}
                style={styles.textInput}
              />
            )}
          />
          {errors.password && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.password.message}
            </Text>
          )}
          
          <View style={styles.optionsContainer}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => setRememberMe(!rememberMe)}
                color={theme.colors.primary}
              />
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </View>
            
            {isBiometricsAvailable && (
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={useBiometrics ? 'checked' : 'unchecked'}
                  onPress={() => setUseBiometrics(!useBiometrics)}
                  color={theme.colors.primary}
                />
                <Text style={styles.checkboxLabel}>Use biometrics</Text>
              </View>
            )}
          </View>
          
          {/* Login button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
          >
            Login
          </Button>
          
          {/* Biometric login button */}
          {isBiometricsAvailable && (
            <Button
              mode="outlined"
              onPress={handleBiometricAuth}
              disabled={loading}
              style={styles.biometricButton}
              icon={Platform.OS === 'ios' ? 'apple-face-id' : 'fingerprint'}
            >
              Login with Biometrics
            </Button>
          )}
          
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Display error message if any */}
          {error && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
          )}
        </View>
        
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            © 2025 Komuniteti. All rights reserved.
          </Text>
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
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
  },
  formContainer: {
    width: '100%',
  },
  roleSelectionContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  roleButtonContent: {
    alignItems: 'center',
  },
  roleButtonText: {
    fontWeight: '500',
    fontSize: 14,
  },
  textInput: {
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 12,
    paddingVertical: 6,
  },
  biometricButton: {
    marginBottom: 20,
    paddingVertical: 6,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginBottom: 10,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
  },
}); 