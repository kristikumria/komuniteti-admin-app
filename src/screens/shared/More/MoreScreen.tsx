import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, useTheme, Divider, List, Avatar, Button, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { 
  Info,
  BarChart, 
  LogOut, 
  FileBarChart,
  Settings,
  Moon,
  Sun,
  Users,
  Bell,
  HelpCircle,
  Shield,
  Share2,
  Bookmark,
  FileText
} from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { toggleDarkMode } from '../../../store/slices/settingsSlice';
import { logout } from '../../../store/slices/authSlice';

import { Header } from '../../../components/Header';

export const MoreScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { user } = useAppSelector((state) => state.auth);
  const isBusinessManager = user?.role === 'business_manager';
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => dispatch(logout()),
          style: "destructive"
        }
      ]
    );
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const navigateTo = (screenName: string) => {
    // @ts-ignore
    navigation.navigate(screenName);
  };

  const navigateToSettings = () => {
    navigateTo('Settings');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <Header 
        title="More" 
        showBack={false}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff' }]}>
          <View style={styles.profileHeader}>
            <Avatar.Text 
              size={60} 
              label={user?.name?.charAt(0).toUpperCase() || 'U'} 
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: isDarkMode ? '#fff' : '#333' }]}>
                {user?.name || 'User'}
              </Text>
              <Text style={[styles.userRole, { color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666' }]}>
                {isBusinessManager ? 'Business Manager' : 'Administrator'}
              </Text>
              <Text style={[styles.userEmail, { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#999' }]}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>
          </View>
          <Button 
            mode="outlined" 
            onPress={navigateToSettings}
            style={[styles.editProfileButton, { borderColor: theme.colors.primary }]}
            labelStyle={{ color: theme.colors.primary }}
          >
            View Settings
          </Button>
        </View>

        {/* Community Tools */}
        <List.Section style={[styles.section, { backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff' }]}>
          <List.Subheader style={[styles.sectionHeader, { color: isDarkMode ? '#999' : '#666' }]}>
            COMMUNITY TOOLS
          </List.Subheader>
          
          <TouchableOpacity onPress={() => navigateTo('InfoPointsScreen')}>
            <List.Item
              title="Info Points"
              description="Building announcements and information"
              left={props => <Info {...props} size={24} color={theme.colors.primary} />}
              titleStyle={{ color: isDarkMode ? '#fff' : '#333' }}
              descriptionStyle={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#999' }}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </TouchableOpacity>
          
          <Divider style={{ backgroundColor: isDarkMode ? '#333' : '#eee' }} />
          
          <TouchableOpacity onPress={() => navigateTo('PollsScreen')}>
            <List.Item
              title="Polls & Surveys"
              description="Community feedback and voting"
              left={props => <BarChart {...props} size={24} color={theme.colors.primary} />}
              titleStyle={{ color: isDarkMode ? '#fff' : '#333' }}
              descriptionStyle={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#999' }}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </TouchableOpacity>
          
          <Divider style={{ backgroundColor: isDarkMode ? '#333' : '#eee' }} />
          
          <TouchableOpacity onPress={() => navigateTo('NotificationsScreen')}>
            <List.Item
              title="Notifications"
              description="Alerts and updates"
              left={props => <Bell {...props} size={24} color={theme.colors.primary} />}
              titleStyle={{ color: isDarkMode ? '#fff' : '#333' }}
              descriptionStyle={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#999' }}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </TouchableOpacity>
        </List.Section>

        {/* Business Manager Tools (conditionally rendered) */}
        {isBusinessManager && (
          <List.Section style={[styles.section, { backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff' }]}>
            <List.Subheader style={[styles.sectionHeader, { color: isDarkMode ? '#999' : '#666' }]}>
              MANAGEMENT TOOLS
            </List.Subheader>
            
            <TouchableOpacity onPress={() => navigateTo('Organigram')}>
              <List.Item
                title="Organigram"
                description="Management structure and roles"
                left={props => <Users {...props} size={24} color={theme.colors.primary} />}
                titleStyle={{ color: isDarkMode ? '#fff' : '#333' }}
                descriptionStyle={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#999' }}
                right={props => <List.Icon {...props} icon="chevron-right" />}
              />
            </TouchableOpacity>
            
            <Divider style={{ backgroundColor: isDarkMode ? '#333' : '#eee' }} />
            
            <TouchableOpacity onPress={() => navigateTo('Analytics')}>
              <List.Item
                title="Analytics & Reports"
                description="Performance metrics and insights"
                left={props => <FileBarChart {...props} size={24} color={theme.colors.primary} />}
                titleStyle={{ color: isDarkMode ? '#fff' : '#333' }}
                descriptionStyle={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#999' }}
                right={props => <List.Icon {...props} icon="chevron-right" />}
              />
            </TouchableOpacity>
            
            <Divider style={{ backgroundColor: isDarkMode ? '#333' : '#eee' }} />
            
            <TouchableOpacity onPress={() => navigateTo('ReportsStack')}>
              <List.Item
                title="Reports"
                description="View and manage reports"
                left={props => <FileText {...props} size={24} color={theme.colors.primary} />}
                titleStyle={{ color: isDarkMode ? '#fff' : '#333' }}
                descriptionStyle={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#999' }}
                right={props => <List.Icon {...props} icon="chevron-right" />}
              />
            </TouchableOpacity>
          </List.Section>
        )}

        {/* App Settings */}
        <List.Section style={[styles.section, { backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff' }]}>
          <List.Subheader style={[styles.sectionHeader, { color: isDarkMode ? '#999' : '#666' }]}>
            APP SETTINGS
          </List.Subheader>
          
          <TouchableOpacity onPress={handleToggleDarkMode}>
            <List.Item
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
              description="Change app appearance"
              left={props => 
                isDarkMode 
                  ? <Sun {...props} size={24} color={theme.colors.primary} /> 
                  : <Moon {...props} size={24} color={theme.colors.primary} />
              }
              titleStyle={{ color: isDarkMode ? '#fff' : '#333' }}
              descriptionStyle={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#999' }}
              right={props => <Switch value={isDarkMode} onValueChange={handleToggleDarkMode} color={theme.colors.primary} />}
            />
          </TouchableOpacity>
          
          <Divider style={{ backgroundColor: isDarkMode ? '#333' : '#eee' }} />
          
          <TouchableOpacity onPress={() => Alert.alert("Coming Soon", "This feature will be available in a future update.")}>
            <List.Item
              title="Privacy & Security"
              description="Manage your security settings"
              left={props => <Shield {...props} size={24} color={theme.colors.primary} />}
              titleStyle={{ color: isDarkMode ? '#fff' : '#333' }}
              descriptionStyle={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#999' }}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </TouchableOpacity>
          
          <Divider style={{ backgroundColor: isDarkMode ? '#333' : '#eee' }} />
          
          <TouchableOpacity onPress={() => Alert.alert("Coming Soon", "This feature will be available in a future update.")}>
            <List.Item
              title="Help & Support"
              description="Get assistance and report issues"
              left={props => <HelpCircle {...props} size={24} color={theme.colors.primary} />}
              titleStyle={{ color: isDarkMode ? '#fff' : '#333' }}
              descriptionStyle={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#999' }}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </TouchableOpacity>
          
          <Divider style={{ backgroundColor: isDarkMode ? '#333' : '#eee' }} />
          
          <TouchableOpacity onPress={() => Alert.alert("Coming Soon", "This feature will be available in a future update.")}>
            <List.Item
              title="Share App"
              description="Invite colleagues to Komuniteti"
              left={props => <Share2 {...props} size={24} color={theme.colors.primary} />}
              titleStyle={{ color: isDarkMode ? '#fff' : '#333' }}
              descriptionStyle={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : '#999' }}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </TouchableOpacity>
        </List.Section>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[
            styles.logoutButton, 
            { backgroundColor: isDarkMode ? 'rgba(229, 57, 53, 0.1)' : 'rgba(229, 57, 53, 0.05)' }
          ]} 
          onPress={handleLogout}
        >
          <LogOut size={20} color="#e53935" style={{ marginRight: 10 }} />
          <Text style={{ color: '#e53935', fontWeight: '500' }}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: isDarkMode ? '#666' : '#999' }]}>
            Komuniteti v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  editProfileButton: {
    borderRadius: 8,
  },
  section: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  versionText: {
    fontSize: 12,
  },
}); 