import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Text, Checkbox, Divider, Surface, useTheme, Button as PaperButton } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginRequest, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { loginSchema } from '../utils/validationSchemas';
import * as LocalAuthentication from 'expo-local-authentication';
import { Building, Mail, Lock, Fingerprint, User } from 'lucide-react-native';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { FormLayout } from '../components/FormLayout';
import { useAccessibility } from '../components/AccessibilityProvider';
import Haptics from 'expo-haptics';

interface LoginFormData {
  email: string;
  password: string;
}

type UserRole = 'business_manager' | 'administrator';

export const LoginScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const { settings } = useAccessibility();
  
  const [rememberMe, setRememberMe] = useState(false);
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('business_manager');
  
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
      // Trigger haptic feedback on submit
      if (!settings.reduceMotion) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      dispatch(loginRequest());
      const result = await authService.login(data);
      dispatch(loginSuccess(result));
    } catch (error: any) {
      // Error haptic feedback
      if (!settings.reduceMotion) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      
      dispatch(loginFailure(error.message || 'Login failed'));
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again.');
    }
  };
  
  const handleBiometricAuth = async () => {
    try {
      // Trigger haptic feedback before biometric prompt
      if (!settings.reduceMotion) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      dispatch(loginRequest());
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        fallbackLabel: 'Use password instead',
      });
      
      if (result.success) {
        // Success haptic feedback
        if (!settings.reduceMotion) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        // Use the default credentials based on selected role
        const email = selectedRole === 'business_manager' ? 'business@example.com' : 'property@example.com';
        const loginResult = await authService.login({ email, password: 'password123' });
        dispatch(loginSuccess(loginResult));
      } else {
        dispatch(loginFailure('Biometric authentication cancelled'));
      }
    } catch (error: any) {
      // Error haptic feedback
      if (!settings.reduceMotion) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      
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
  
  const handleRoleSelection = (role: UserRole) => {
    // Provide tactile feedback when role is changed
    if (!settings.reduceMotion) {
      Haptics.selectionAsync();
    }
    setSelectedRole(role);
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Surface style={[styles.logoCircle, { backgroundColor: theme.colors.primaryContainer }]} elevation={2}>
            <Building size={40} color={theme.colors.onPrimaryContainer} />
          </Surface>
          <Text variant="headlineMedium" style={[styles.appName, { color: theme.colors.onBackground }]}>
            Komuniteti
          </Text>
          <Text variant="titleSmall" style={[styles.appSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Property Management Platform
          </Text>
        </View>
        
        <Surface style={styles.formContainer} elevation={2}>
          <Text variant="titleLarge" style={[styles.welcomeText, { color: theme.colors.onSurface }]}>
            Welcome Back
          </Text>
          <Text variant="bodyMedium" style={[styles.subtitleText, { color: theme.colors.onSurfaceVariant }]}>
            Sign in to your account
          </Text>
          
          {/* Role selection */}
          <View 
            style={styles.roleSelectionContainer}
            accessibilityRole="radiogroup"
            accessibilityLabel="Select account type"
          >
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'business_manager' && [
                  styles.selectedRoleButton,
                  { backgroundColor: theme.colors.primaryContainer }
                ]
              ]}
              onPress={() => handleRoleSelection('business_manager')}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedRole === 'business_manager' }}
              accessibilityLabel="Business Manager"
              accessibilityHint="Select to login as Business Manager"
            >
              <View style={styles.roleButtonContent}>
                <User 
                  size={20} 
                  color={
                    selectedRole === 'business_manager'
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSurfaceVariant
                  }
                  style={styles.roleIcon}
                />
                <Text 
                  variant="labelLarge"
                  style={[
                    { 
                      color: selectedRole === 'business_manager'
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSurfaceVariant
                    }
                  ]}
                >
                  Business Manager
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleButton,
                selectedRole === 'administrator' && [
                  styles.selectedRoleButton,
                  { backgroundColor: theme.colors.primaryContainer }
                ]
              ]}
              onPress={() => handleRoleSelection('administrator')}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedRole === 'administrator' }}
              accessibilityLabel="Administrator"
              accessibilityHint="Select to login as Administrator"
            >
              <View style={styles.roleButtonContent}>
                <Building 
                  size={20} 
                  color={
                    selectedRole === 'administrator'
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSurfaceVariant
                  }
                  style={styles.roleIcon}
                />
                <Text 
                  variant="labelLarge"
                  style={[
                    { 
                      color: selectedRole === 'administrator'
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSurfaceVariant
                    }
                  ]}
                >
                  Administrator
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Form Fields */}
          <TextField
            control={control}
            name="email"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<Mail size={20} color={theme.colors.onSurfaceVariant} />}
            accessibilityHint="Enter your email address"
            required
            testID="email-input"
            style={styles.textField}
          />
          
          <TextField
            control={control}
            name="password"
            label="Password"
            secureTextEntry
            left={<Lock size={20} color={theme.colors.onSurfaceVariant} />}
            accessibilityHint="Enter your password"
            required
            testID="password-input"
            style={styles.textField}
          />
          
          {/* Remember me & Forgot Password */}
          <View style={styles.rememberForgotContainer}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => setRememberMe(!rememberMe)}
                color={theme.colors.primary}
                testID="remember-checkbox"
              />
              <TouchableOpacity 
                onPress={() => setRememberMe(!rememberMe)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
                accessibilityLabel="Remember me"
              >
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Remember me
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              onPress={handleForgotPassword}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
              accessibilityHint="Navigate to password recovery"
            >
              <Text 
                variant="bodyMedium" 
                style={{ color: theme.colors.primary, fontWeight: '600' }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Login button */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
            loading={loading}
            width="full"
            style={styles.loginButton}
            testID="login-button"
            accessibilityLabel="Login"
            accessibilityHint="Sign in to your account"
          >
            Sign In
          </Button>
          
          {/* Biometric authentication */}
          {isBiometricsAvailable && (
            <TouchableOpacity
              style={[
                styles.biometricButton,
                { borderColor: theme.colors.outline }
              ]}
              onPress={handleBiometricAuth}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Use biometric authentication"
              accessibilityHint="Sign in using fingerprint or face recognition"
            >
              <Fingerprint size={22} color={theme.colors.primary} style={{ marginRight: 10 }} />
              <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
                Use Biometric Authentication
              </Text>
            </TouchableOpacity>
          )}
          
          {/* Register link */}
          <View style={styles.registerContainer}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Don't have an account?
            </Text>
            <TouchableOpacity 
              onPress={handleRegister}
              accessibilityRole="button"
              accessibilityLabel="Create new account"
              accessibilityHint="Navigate to registration screen"
            >
              <Text 
                variant="bodyMedium" 
                style={{ color: theme.colors.primary, fontWeight: '600', marginLeft: 4 }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
    fontWeight: '600',
    textAlign: 'center',
  },
  appSubtitle: {
    textAlign: 'center',
    marginTop: 4,
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
  },
  welcomeText: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  roleSelectionContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedRoleButton: {
    borderColor: 'transparent',
  },
  roleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIcon: {
    marginRight: 8,
  },
  textField: {
    marginBottom: 16,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButton: {
    marginBottom: 16,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});