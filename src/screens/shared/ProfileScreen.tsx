import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme, Button, TextInput, Avatar, Divider, IconButton } from 'react-native-paper';
import * as yup from 'yup';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { authService } from '../../services/authService';

// Validation schema
const profileSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  phone: yup.string().nullable(),
});

interface ProfileFormData {
  name: string;
  email: string;
  phone: string | null;
}

export interface ProfileScreenProps {
  navigation: any;
  hideHeader?: boolean;
}

export const ProfileScreen = ({ navigation, hideHeader = false }: ProfileScreenProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const { control, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: null,
    },
    resolver: yupResolver(profileSchema) as any,
  });
  
  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      // Simulated API call for profile update
      // In a real app, you would call an actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      Alert.alert('Logout Error', 'Failed to logout. Please try again.');
    }
  };
  
  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {!hideHeader && (
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              iconColor={theme.colors.onSurface}
              size={24}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>My Profile</Text>
            <IconButton
              icon={isEditing ? 'close' : 'pencil'}
              iconColor={theme.colors.primary}
              size={24}
              onPress={() => isEditing ? handleCancel() : setIsEditing(true)}
            />
          </View>
        )}
        
        <View style={styles.profileContainer}>
          <Avatar.Text
            size={100}
            label={getInitials(user?.name || 'User')}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
            theme={{ colors: { primary: theme.colors.primary } }}
          />
          
          <Text style={[styles.userName, { color: theme.colors.onSurface }]}>
            {user?.name}
          </Text>
          <Text style={[styles.userRole, { color: theme.colors.primary }]}>
            {user?.role === 'business_manager' ? 'Business Manager' : 'Administrator'}
          </Text>
        </View>
        
        <Divider style={styles.divider} />
        
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
                disabled={!isEditing}
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
                disabled={!isEditing || true} // Email is typically not editable
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
          
          {/* Phone Field */}
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Phone Number"
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.phone}
                mode="outlined"
                disabled={!isEditing}
                keyboardType="phone-pad"
                left={<TextInput.Icon icon="phone" />}
                style={styles.textInput}
              />
            )}
          />
          {errors.phone && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.phone.message}
            </Text>
          )}
          
          {isEditing ? (
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={[styles.button, styles.cancelButton]}
                labelStyle={{ color: theme.colors.error }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit as any)}
                loading={loading}
                disabled={loading}
                style={[styles.button, styles.saveButton]}
              >
                Save Changes
              </Button>
            </View>
          ) : (
            <Button
              mode="contained"
              onPress={handleLogout}
              icon="logout"
              style={styles.logoutButton}
            >
              Logout
            </Button>
          )}
          
          {/* Additional security section */}
          {!isEditing && (
            <>
              <Divider style={[styles.divider, { marginTop: 32 }]} />
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Security
              </Text>
              
              <TouchableOpacity
                style={styles.securityOption}
                onPress={() => navigation.navigate('ChangePassword')}
              >
                <View style={styles.securityOptionContent}>
                  <IconButton icon="lock" size={24} />
                  <View style={styles.securityOptionText}>
                    <Text style={styles.securityOptionTitle}>Change Password</Text>
                    <Text style={[styles.securityOptionDescription, { color: theme.colors.onSurfaceVariant }]}>
                      Update your password regularly for better security
                    </Text>
                  </View>
                </View>
                <IconButton icon="chevron-right" size={24} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.securityOption}
                onPress={() => Alert.alert('Biometric Authentication', 'This feature is coming soon.')}
              >
                <View style={styles.securityOptionContent}>
                  <IconButton icon="fingerprint" size={24} />
                  <View style={styles.securityOptionText}>
                    <Text style={styles.securityOptionTitle}>Biometric Login</Text>
                    <Text style={[styles.securityOptionDescription, { color: theme.colors.onSurfaceVariant }]}>
                      Enable fingerprint or face recognition login
                    </Text>
                  </View>
                </View>
                <IconButton icon="chevron-right" size={24} />
              </TouchableOpacity>
            </>
          )}
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
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    margin: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  avatarLabel: {
    fontSize: 36,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  textInput: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  cancelButton: {
    borderColor: 'transparent',
  },
  saveButton: {
    
  },
  logoutButton: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  securityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  securityOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  securityOptionText: {
    flex: 1,
  },
  securityOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  securityOptionDescription: {
    fontSize: 14,
  },
});