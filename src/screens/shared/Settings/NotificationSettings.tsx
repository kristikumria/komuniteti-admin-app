import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, useTheme, Switch, Divider, Button, Card } from 'react-native-paper';
import { Bell, Volume2, Volume1, VolumeX, Clock, Send } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { SideMenu } from '../../../components/SideMenu';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { pushNotificationService } from '../../../services/pushNotificationService';
import { setPermissionsRequested, setPermissionsGranted } from '../../../store/slices/notificationsSlice';
import { AdministratorStackParamList } from '../../../navigation/types';

type NotificationSettingsNavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;

export const NotificationSettings = () => {
  const theme = useTheme();
  const navigation = useNavigation<NotificationSettingsNavigationProp>();
  const dispatch = useAppDispatch();
  
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const { permissionsGranted } = useAppSelector(state => state.notifications);
  const { user } = useAppSelector(state => state.auth);
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(permissionsGranted);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  
  // Settings for notification types
  const [notificationTypes, setNotificationTypes] = useState({
    payment: true,
    maintenance: true,
    resident: true,
    building: true,
    message: true,
    system: true,
  });
  
  const handleTogglePermissions = async () => {
    try {
      if (!notificationsEnabled) {
        // Request permissions
        const granted = await pushNotificationService.requestPermissions();
        
        // Update state
        setNotificationsEnabled(granted);
        dispatch(setPermissionsGranted(granted));
        
        if (granted && user?.id) {
          // Generate a mock token for demo
          const mockToken = `mock-token-${Date.now()}`;
          await pushNotificationService.registerDeviceToken(user.id, mockToken);
        }
      } else {
        // Revoke permissions (in a real app, you would guide the user to system settings)
        // For demo purposes, we'll just update the state
        setNotificationsEnabled(false);
        dispatch(setPermissionsGranted(false));
        
        // Unregister device token
        if (user?.id) {
          await pushNotificationService.unregisterDeviceToken(user.id);
        }
      }
    } catch (error) {
      console.error('Error toggling notification permissions:', error);
    }
  };
  
  const handleToggleNotificationType = (type: keyof typeof notificationTypes) => {
    setNotificationTypes(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };
  
  return (
    <>
      <Header 
        title="Notification Settings" 
        showBack={true}
        showMenu={true}
        onMenuPress={() => setMenuVisible(true)}
      />
      
      <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
          <Card.Content>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Bell size={22} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                  Push Notifications
                </Text>
              </View>
              
              <View style={styles.settingRow}>
                <Text style={{ color: isDarkMode ? '#ddd' : '#555' }}>
                  Enable push notifications
                </Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleTogglePermissions}
                  color={theme.colors.primary}
                />
              </View>
              
              <Text style={[styles.hint, { color: isDarkMode ? '#999' : '#777' }]}>
                {notificationsEnabled 
                  ? 'You will receive notifications about important updates.' 
                  : 'Turn on to receive notifications about important updates.'}
              </Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Volume2 size={22} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                  Notification Sound & Vibration
                </Text>
              </View>
              
              <View style={styles.settingRow}>
                <Text style={{ color: isDarkMode ? '#ddd' : '#555' }}>
                  Sound
                </Text>
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  disabled={!notificationsEnabled}
                  color={theme.colors.primary}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={{ color: isDarkMode ? '#ddd' : '#555' }}>
                  Vibration
                </Text>
                <Switch
                  value={vibrationEnabled}
                  onValueChange={setVibrationEnabled}
                  disabled={!notificationsEnabled}
                  color={theme.colors.primary}
                />
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Send size={22} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                  Notification Types
                </Text>
              </View>
              
              <Text style={[styles.hint, { color: isDarkMode ? '#999' : '#777' }]}>
                Choose which types of notifications you want to receive
              </Text>
              
              <View style={styles.settingRow}>
                <Text style={{ color: isDarkMode ? '#ddd' : '#555' }}>
                  Payment notifications
                </Text>
                <Switch
                  value={notificationTypes.payment}
                  onValueChange={() => handleToggleNotificationType('payment')}
                  disabled={!notificationsEnabled}
                  color={theme.colors.primary}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={{ color: isDarkMode ? '#ddd' : '#555' }}>
                  Maintenance notifications
                </Text>
                <Switch
                  value={notificationTypes.maintenance}
                  onValueChange={() => handleToggleNotificationType('maintenance')}
                  disabled={!notificationsEnabled}
                  color={theme.colors.primary}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={{ color: isDarkMode ? '#ddd' : '#555' }}>
                  Resident notifications
                </Text>
                <Switch
                  value={notificationTypes.resident}
                  onValueChange={() => handleToggleNotificationType('resident')}
                  disabled={!notificationsEnabled}
                  color={theme.colors.primary}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={{ color: isDarkMode ? '#ddd' : '#555' }}>
                  Building notifications
                </Text>
                <Switch
                  value={notificationTypes.building}
                  onValueChange={() => handleToggleNotificationType('building')}
                  disabled={!notificationsEnabled}
                  color={theme.colors.primary}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={{ color: isDarkMode ? '#ddd' : '#555' }}>
                  Message notifications
                </Text>
                <Switch
                  value={notificationTypes.message}
                  onValueChange={() => handleToggleNotificationType('message')}
                  disabled={!notificationsEnabled}
                  color={theme.colors.primary}
                />
              </View>
              
              <View style={styles.settingRow}>
                <Text style={{ color: isDarkMode ? '#ddd' : '#555' }}>
                  System notifications
                </Text>
                <Switch
                  value={notificationTypes.system}
                  onValueChange={() => handleToggleNotificationType('system')}
                  disabled={!notificationsEnabled}
                  color={theme.colors.primary}
                />
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={22} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                  Do Not Disturb
                </Text>
              </View>
              
              <View style={styles.settingRow}>
                <Text style={{ color: isDarkMode ? '#ddd' : '#555' }}>
                  Enable Do Not Disturb
                </Text>
                <Switch
                  value={false}
                  disabled={!notificationsEnabled}
                  color={theme.colors.primary}
                />
              </View>
              
              <Text style={[styles.hint, { color: isDarkMode ? '#999' : '#777' }]}>
                Coming soon: Schedule quiet hours to silence notifications during specific times.
              </Text>
            </View>
          </Card.Content>
        </Card>
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
  section: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
}); 