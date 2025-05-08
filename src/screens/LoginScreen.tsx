import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme, Button, TextInput, Checkbox, Divider, Switch } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginRequest, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { loginSchema } from '../utils/validationSchemas';
import * as LocalAuthentication from 'expo-local-authentication';
import { Building, Mail, Lock, Fingerprint, User } from 'lucide-react-native';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  
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
    <ScrollView 
      contentContainerStyle={[
        styles.scrollContainer,
        { backgroundColor: isDarkMode ? '#121212' : '#ffffff' }
      ]}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          {/* App logo */}
          <View style={[styles.logoCircle, { backgroundColor: theme.colors.primaryContainer }]}>
            <Building size={32} color={theme.colors.primary} />
          </View>
          <Text style={[styles.appName, { color: isDarkMode ? '#ffffff' : '#333333' }]}>Komuniteti</Text>
          <Text style={[styles.appSubtitle, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
            Property Management Platform
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          {/* Role selection */}
          <View style={styles.roleSelectionContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'business_manager' && { 
                  backgroundColor: theme.colors.primaryContainer,
                  borderColor: theme.colors.primary,
                  borderWidth: 1
                }
              ]}
              onPress={() => setSelectedRole('business_manager')}
            >
              <View style={styles.roleButtonContent}>
                <User 
                  size={18} 
                  color={selectedRole === 'business_manager' ? theme.colors.primary : isDarkMode ? '#cccccc' : '#666666'} 
                  style={{ marginRight: 8 }}
                />
                <Text style={[
                  styles.roleButtonText,
                  { color: selectedRole === 'business_manager' ? theme.colors.primary : isDarkMode ? '#cccccc' : '#666666' }
                ]}>
                  Business Manager
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'administrator' && { 
                  backgroundColor: theme.colors.primaryContainer,
                  borderColor: theme.colors.primary,
                  borderWidth: 1
                }
              ]}
              onPress={() => setSelectedRole('administrator')}
            >
              <View style={styles.roleButtonContent}>
                <Building 
                  size={18} 
                  color={selectedRole === 'administrator' ? theme.colors.primary : isDarkMode ? '#cccccc' : '#666666'}
                  style={{ marginRight: 8 }}
                />
                <Text style={[
                  styles.roleButtonText,
                  { color: selectedRole === 'administrator' ? theme.colors.primary : isDarkMode ? '#cccccc' : '#666666' }
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
                left={<TextInput.Icon icon={() => <Mail size={20} color={isDarkMode ? '#cccccc' : '#666666'} />} />}
                style={styles.textInput}
                outlineStyle={{ borderRadius: 8 }}
                contentStyle={{ paddingVertical: 12 }}
                theme={{ 
                  colors: { 
                    onSurfaceVariant: isDarkMode ? '#cccccc' : '#666666' 
                  } 
                }}
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
                left={<TextInput.Icon icon={() => <Lock size={20} color={isDarkMode ? '#cccccc' : '#666666'} />} />}
                right={<TextInput.Icon icon="eye" onPress={() => {}} />}
                style={styles.textInput}
                outlineStyle={{ borderRadius: 8 }}
                contentStyle={{ paddingVertical: 12 }}
                theme={{ 
                  colors: { 
                    onSurfaceVariant: isDarkMode ? '#cccccc' : '#666666' 
                  } 
                }}
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
              <Text style={[styles.checkboxLabel, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
                Remember me
              </Text>
            </View>
            
            {isBiometricsAvailable && (
              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={useBiometrics ? 'checked' : 'unchecked'}
                  onPress={() => setUseBiometrics(!useBiometrics)}
                  color={theme.colors.primary}
                />
                <Text style={[styles.checkboxLabel, { color: isDarkMode ? '#cccccc' : '#666666' }]}>
                  Use biometrics
                </Text>
              </View>
            )}
          </View>
          
          {/* Login as selected role button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={loading}
            style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
            contentStyle={{ height: 48 }}
            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
          >
            {`Login as ${selectedRole === 'business_manager' ? 'Business Manager' : 'Administrator'}`}
          </Button>
          
          {/* Biometric login button */}
          {isBiometricsAvailable && (
            <Button
              mode="outlined"
              onPress={handleBiometricAuth}
              disabled={loading}
              style={styles.biometricButton}
              contentStyle={{ height: 48 }}
              icon={() => <Fingerprint size={20} color={theme.colors.primary} />}
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
        </View>
        
        <Text style={[styles.footerText, { color: isDarkMode ? '#999999' : '#999999' }]}>
          © 2025 Komuniteti. All rights reserved.
        </Text>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 24,
  },
  roleSelectionContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  roleButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
  },
  roleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleButtonText: {
    fontWeight: '500',
  },
  textInput: {
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
    marginTop: -8,
    marginLeft: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 4,
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 12,
    borderRadius: 8,
  },
  biometricButton: {
    marginBottom: 24,
    borderRadius: 8,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
  },
}); 