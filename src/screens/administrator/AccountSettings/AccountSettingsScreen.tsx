import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { 
  Text, 
  Card, 
  Avatar, 
  Button, 
  Divider, 
  useTheme,
  TextInput,
  List,
  Portal,
  Dialog,
  Switch as PaperSwitch,
} from 'react-native-paper';
import { 
  User, 
  Lock, 
  ChevronRight, 
  Shield, 
  LogOut,
  FileText,
  Bell,
  Building,
  Mail,
  Smartphone,
  Edit
} from 'lucide-react-native';
import { useAuth } from '../../../hooks/useAuth';
import { useAppSettings } from '../../../hooks/useAppSettings';

export const AccountSettingsScreen = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode, pushNotifications, togglePushNotifications } = useAppSettings();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [changePasswordDialogVisible, setChangePasswordDialogVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogout = () => {
    setLogoutDialogVisible(true);
  };

  const confirmLogout = () => {
    logout();
    setLogoutDialogVisible(false);
  };

  const handleChangePassword = () => {
    setChangePasswordDialogVisible(true);
  };

  const validatePasswordForm = () => {
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return false;
    }
    if (!newPassword) {
      setPasswordError('New password is required');
      return false;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    return true;
  };

  const submitPasswordChange = () => {
    if (validatePasswordForm()) {
      // TODO: Implement password change API call
      setChangePasswordDialogVisible(false);
      resetPasswordForm();
    }
  };

  const resetPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.screenTitle}>
          Account Settings
        </Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Image
                source={{ uri: user?.avatarUrl || 'https://ui-avatars.com/api/?name=User' }}
                size={80}
              />
              <View style={styles.profileInfo}>
                <Text variant="titleLarge">{user?.name || 'User Name'}</Text>
                <Text variant="bodyMedium">{user?.email || 'user@example.com'}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                  Building Administrator
                </Text>
              </View>
            </View>
            <Button 
              mode="outlined" 
              style={styles.editProfileButton}
              icon={() => <Edit size={16} color={theme.colors.primary} />}
              onPress={() => {/* TODO: Navigate to edit profile */}}
            >
              Edit Profile
            </Button>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>Account</Text>
        <Card style={styles.card}>
          <List.Item
            title="Personal Information"
            description="Update your name, email, and phone number"
            left={props => <User {...props} size={24} color={theme.colors.primary} />}
            right={props => <ChevronRight {...props} size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={() => {/* TODO: Navigate to personal info */}}
          />
          <Divider />
          <List.Item
            title="Password & Security"
            description="Update your password and security settings"
            left={props => <Lock {...props} size={24} color={theme.colors.primary} />}
            right={props => <ChevronRight {...props} size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={handleChangePassword}
          />
          <Divider />
          <List.Item
            title="Two-Factor Authentication"
            description="Enable additional security for your account"
            left={props => <Shield {...props} size={24} color={theme.colors.primary} />}
            right={props => <ChevronRight {...props} size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={() => {/* TODO: Navigate to 2FA settings */}}
          />
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>Building Access</Text>
        <Card style={styles.card}>
          <List.Item
            title="Assigned Buildings"
            description="View buildings you manage"
            left={props => <Building {...props} size={24} color={theme.colors.primary} />}
            right={props => <ChevronRight {...props} size={24} color={theme.colors.onSurfaceVariant} />}
            onPress={() => {/* TODO: Navigate to assigned buildings */}}
          />
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>Preferences</Text>
        <Card style={styles.card}>
          <List.Item
            title="Dark Mode"
            description="Enable dark mode for the app"
            left={props => <User {...props} size={24} color={theme.colors.primary} />}
            right={() => (
              <PaperSwitch
                value={darkMode}
                onValueChange={toggleDarkMode}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Push Notifications"
            description="Receive push notifications for important updates"
            left={props => <Bell {...props} size={24} color={theme.colors.primary} />}
            right={() => (
              <PaperSwitch
                value={pushNotifications}
                onValueChange={togglePushNotifications}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Email Notifications"
            description="Receive email notifications for important updates"
            left={props => <Mail {...props} size={24} color={theme.colors.primary} />}
            right={() => (
              <PaperSwitch
                value={true}
                onValueChange={() => {/* TODO: Implement email notification toggle */}}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="SMS Notifications"
            description="Receive SMS notifications for important updates"
            left={props => <Smartphone {...props} size={24} color={theme.colors.primary} />}
            right={() => (
              <PaperSwitch
                value={false}
                onValueChange={() => {/* TODO: Implement SMS notification toggle */}}
                color={theme.colors.primary}
              />
            )}
          />
        </Card>

        <Card style={[styles.card, styles.logoutCard]}>
          <List.Item
            title="Logout"
            titleStyle={{ color: theme.colors.error }}
            left={props => <LogOut {...props} size={24} color={theme.colors.error} />}
            onPress={handleLogout}
          />
        </Card>

        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Komuniteti Admin App v1.0.0
          </Text>
          <Text variant="bodySmall" style={styles.footerText}>
            © 2023 Komuniteti.al
          </Text>
        </View>
      </ScrollView>

      {/* Logout Dialog */}
      <Portal>
        <Dialog visible={logoutDialogVisible} onDismiss={() => setLogoutDialogVisible(false)}>
          <Dialog.Title>Logout</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Are you sure you want to logout?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>Cancel</Button>
            <Button onPress={confirmLogout}>Logout</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Change Password Dialog */}
      <Portal>
        <Dialog visible={changePasswordDialogVisible} onDismiss={() => {
          setChangePasswordDialogVisible(false);
          resetPasswordForm();
        }}>
          <Dialog.Title>Change Password</Dialog.Title>
          <Dialog.Content>
            {passwordError ? (
              <Text variant="bodySmall" style={{ color: theme.colors.error, marginBottom: 8 }}>
                {passwordError}
              </Text>
            ) : null}
            <TextInput
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              style={styles.passwordInput}
            />
            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={styles.passwordInput}
            />
            <TextInput
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.passwordInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setChangePasswordDialogVisible(false);
              resetPasswordForm();
            }}>
              Cancel
            </Button>
            <Button onPress={submitPasswordChange}>Change</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  editProfileButton: {
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  card: {
    marginBottom: 24,
  },
  logoutCard: {
    marginTop: 8,
  },
  passwordInput: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    opacity: 0.6,
    marginBottom: 4,
  },
}); 