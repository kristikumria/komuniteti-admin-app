import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, Divider, Switch, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell, Moon, ChevronRight, LogOut, Shield, User, Globe } from 'lucide-react-native';

import { Header } from '../../../components/Header';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { toggleDarkMode } from '../../../store/slices/settingsSlice';
import { logout } from '../../../store/slices/authSlice';
import { AdministratorStackParamList } from '../../../navigation/types';

type SettingsScreenNavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;

export const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const dispatch = useAppDispatch();
  
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const { user } = useAppSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };
  
  const navigateToNotificationSettings = () => {
    navigation.navigate('NotificationSettings');
  };
  
  return (
    <>
      <Header 
        title="Settings" 
        showBack={true}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Card.Content>
            <View style={styles.userSection}>
              <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                <User size={32} color={theme.colors.primary} />
              </View>
              
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: isDarkMode ? '#fff' : '#333' }]}>
                  {user?.name || 'User'}
                </Text>
                <Text style={[styles.userEmail, { color: isDarkMode ? '#aaa' : '#666' }]}>
                  {user?.email || 'user@example.com'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={[styles.card, { marginTop: 16, backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Preferences</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <Moon size={20} color={theme.colors.primary} style={styles.settingIcon} />
                <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleDarkModeToggle}
                color={theme.colors.primary}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={navigateToNotificationSettings}
            >
              <View style={styles.settingLabel}>
                <Bell size={20} color={theme.colors.primary} style={styles.settingIcon} />
                <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Notification Settings</Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#aaa' : '#666'} />
            </TouchableOpacity>
          </Card.Content>
        </Card>
        
        <Card style={[styles.card, { marginTop: 16, backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>Account</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              // Future implementation
            >
              <View style={styles.settingLabel}>
                <Shield size={20} color={theme.colors.primary} style={styles.settingIcon} />
                <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Privacy & Security</Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#aaa' : '#666'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              // Future implementation
            >
              <View style={styles.settingLabel}>
                <Globe size={20} color={theme.colors.primary} style={styles.settingIcon} />
                <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>Language</Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#aaa' : '#666'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.settingItem, styles.logoutButton]}
              onPress={handleLogout}
            >
              <View style={styles.settingLabel}>
                <LogOut size={20} color="#e53935" style={styles.settingIcon} />
                <Text style={{ color: '#e53935' }}>Logout</Text>
              </View>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    opacity: 0.7,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
}); 