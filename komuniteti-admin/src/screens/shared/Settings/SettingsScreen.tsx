import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, Divider, Switch, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell, Moon, ChevronRight, LogOut, Shield, User, Globe } from 'lucide-react-native';

import { Header } from '../../../components/Header';
import { SideMenu } from '../../../components/SideMenu';
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
  
  const [menuVisible, setMenuVisible] = useState(false);
  
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
        showBack={false}
        showMenu={true}
        onMenuPress={() => setMenuVisible(true)}
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
        
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ddd' : '#333' }]}>
              App Settings
            </Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Moon size={20} color={isDarkMode ? '#ddd' : '#555'} />
                <Text style={[styles.settingLabel, { color: isDarkMode ? '#ddd' : '#333' }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleDarkModeToggle}
                color={theme.colors.primary}
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={navigateToNotificationSettings}
            >
              <View style={styles.settingLabelContainer}>
                <Bell size={20} color={isDarkMode ? '#ddd' : '#555'} />
                <Text style={[styles.settingLabel, { color: isDarkMode ? '#ddd' : '#333' }]}>
                  Notification Settings
                </Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#ddd' : '#555'} />
            </TouchableOpacity>
            
            <Divider style={styles.divider} />
            
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Globe size={20} color={isDarkMode ? '#ddd' : '#555'} />
                <Text style={[styles.settingLabel, { color: isDarkMode ? '#ddd' : '#333' }]}>
                  Language
                </Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>English</Text>
                <ChevronRight size={20} color={isDarkMode ? '#ddd' : '#555'} />
              </View>
            </TouchableOpacity>
            
            <Divider style={styles.divider} />
            
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Shield size={20} color={isDarkMode ? '#ddd' : '#555'} />
                <Text style={[styles.settingLabel, { color: isDarkMode ? '#ddd' : '#333' }]}>
                  Privacy & Security
                </Text>
              </View>
              <ChevronRight size={20} color={isDarkMode ? '#ddd' : '#555'} />
            </TouchableOpacity>
          </Card.Content>
        </Card>
        
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Card.Content>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={20} color={theme.colors.error} />
              <Text style={[styles.logoutText, { color: theme.colors.error }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
        
        <Text style={[styles.versionText, { color: isDarkMode ? '#777' : '#999' }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
      
      <SideMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 12,
  },
}); 