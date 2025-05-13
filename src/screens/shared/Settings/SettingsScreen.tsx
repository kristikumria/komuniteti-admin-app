import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, Divider, Switch, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell, Moon, ChevronRight, LogOut, Shield, User, Globe } from 'lucide-react-native';

import { Header } from '../../../components/Header';
import { ScreenContainer } from '../../../components/ScreenContainer';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { toggleDarkMode } from '../../../store/slices/settingsSlice';
import { logout } from '../../../store/slices/authSlice';
import { AdministratorStackParamList } from '../../../navigation/types';
import type { AppTheme } from '../../../theme/theme';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { AccountSwitcher, AccountSwitcherButton } from '../../../components/AccountSwitcher';

interface Account {
  id: string;
  name: string;
  role: string;
  email?: string;
  icon?: string;
}

type SettingsScreenNavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;

export const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  
  const { user } = useAppSelector(state => state.auth);
  const isBusinessManager = user?.role === 'business_manager';
  
  const [accountSwitchModalVisible, setAccountSwitchModalVisible] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(user?.id || '');
  
  // Load mock accounts based on user role
  useEffect(() => {
    if (isBusinessManager) {
      // Mock business accounts for Business Manager
      setAccounts([
        { id: '1', name: 'MainBusiness LLC', role: 'business_manager', email: 'main@business.com' },
        { id: '2', name: 'SecondaryBusiness Inc', role: 'business_manager', email: 'secondary@business.com' },
        { id: '3', name: 'ThirdBusiness Co', role: 'business_manager', email: 'third@business.com' }
      ]);
    } else {
      // Mock buildings for Administrator
      setAccounts([
        { id: '1', name: 'Residential Building A', role: 'building', icon: '🏢' },
        { id: '2', name: 'Residential Building B', role: 'building', icon: '🏘️' },
        { id: '3', name: 'Commercial Building C', role: 'building', icon: '🏪' }
      ]);
    }
  }, [isBusinessManager]);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };
  
  const navigateToNotificationSettings = () => {
    navigation.navigate('NotificationSettings');
  };
  
  const handleOpenAccountSwitcher = () => {
    setAccountSwitchModalVisible(true);
  };
  
  const handleSwitchAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    setAccountSwitchModalVisible(false);
    
    // In a real implementation, this would dispatch an action to switch accounts
    // For demo purposes, we'll just show an alert
    const selectedAccount = accounts.find(acc => acc.id === accountId);
    alert(`Switched to ${selectedAccount?.name}`);
  };
  
  return (
    <>
      <Header 
        title="Settings" 
        showBack={true}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={[commonStyles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.userSection}>
              <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                <User size={32} color={theme.colors.primary} />
              </View>
              
              <View style={styles.userInfo}>
                <Text variant="titleMedium" style={styles.userName}>
                  {user?.name || 'User'}
                </Text>
                <Text variant="bodySmall" style={styles.userEmail}>
                  {user?.email || 'user@example.com'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        {/* Account Switching Card */}
        <Card style={[commonStyles.card, commonStyles.mt16, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleSmall" style={styles.sectionTitle}>Account Switching</Text>
            <AccountSwitcherButton 
              onPress={handleOpenAccountSwitcher}
              isBusinessManager={isBusinessManager}
            />
          </Card.Content>
        </Card>
        
        <Card style={[commonStyles.card, commonStyles.mt16, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleSmall" style={styles.sectionTitle}>Preferences</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLabel}>
                <Moon size={20} color={theme.colors.primary} style={styles.settingIcon} />
                <Text variant="bodyMedium">Dark Mode</Text>
              </View>
              <Switch
                value={theme.dark}
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
                <Text variant="bodyMedium">Notification Settings</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.outline} />
            </TouchableOpacity>
          </Card.Content>
        </Card>
        
        <Card style={[commonStyles.card, commonStyles.mt16, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleSmall" style={styles.sectionTitle}>Account</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              // Future implementation
            >
              <View style={styles.settingLabel}>
                <Shield size={20} color={theme.colors.primary} style={styles.settingIcon} />
                <Text variant="bodyMedium">Privacy & Security</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.outline} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              // Future implementation
            >
              <View style={styles.settingLabel}>
                <Globe size={20} color={theme.colors.primary} style={styles.settingIcon} />
                <Text variant="bodyMedium">Language</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.outline} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.settingItem, styles.logoutButton]}
              onPress={handleLogout}
            >
              <View style={styles.settingLabel}>
                <LogOut size={20} color={theme.colors.error} style={styles.settingIcon} />
                <Text style={{ color: theme.colors.error }}>Logout</Text>
              </View>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </ScrollView>
      
      {/* Account Switching Modal */}
      <AccountSwitcher
        visible={accountSwitchModalVisible}
        onDismiss={() => setAccountSwitchModalVisible(false)}
        onAccountSwitch={handleSwitchAccount}
        currentAccountId={selectedAccountId}
        accounts={accounts}
        isBusinessManager={isBusinessManager}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    fontWeight: 'bold',
  },
  userEmail: {
    opacity: 0.7,
  },
  sectionTitle: {
    marginBottom: 16,
    opacity: 0.8,
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