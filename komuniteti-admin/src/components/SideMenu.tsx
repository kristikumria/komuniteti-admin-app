import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { 
  BarChart3, 
  Building, 
  Users, 
  Wallet, 
  Wrench, 
  Bell, 
  MessageSquare, 
  HelpCircle, 
  Info,
  BarChart, 
  LogOut, 
  X,
  FileBarChart,
  Settings
} from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleDarkMode } from '../store/slices/settingsSlice';
import { logout } from '../store/slices/authSlice';

interface SideMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isVisible, onClose }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { user } = useAppSelector((state) => state.auth);
  const isBusinessManager = user?.role === 'business_manager';
  
  const navigateTo = (screenName: string) => {
    onClose();
    
    // Handle nested navigation for tab screens
    if (screenName === 'Notifications') {
      // @ts-ignore - Using 'as never' doesn't work well with nested navigation
      navigation.navigate('NotificationsTab', {
        screen: 'Notifications'
      });
    } else if (screenName === 'Messages') {
      // @ts-ignore - Using 'as never' doesn't work well with nested navigation
      navigation.navigate('NotificationsTab', {
        screen: 'Messages'
      });
    } else if (screenName === 'InfoPoints') {
      // @ts-ignore - Using 'as never' doesn't work well with nested navigation
      navigation.navigate('NotificationsTab', {
        screen: 'InfoPoints'
      });
    } else if (screenName === 'Polls') {
      // @ts-ignore - Using 'as never' doesn't work well with nested navigation
      navigation.navigate('NotificationsTab', {
        screen: 'Polls'
      });
    } else if (screenName === 'Organigram' && isBusinessManager) {
      // @ts-ignore - Using 'as never' doesn't work well with nested navigation
      navigation.navigate('NotificationsTab', {
        screen: 'Organigram'
      });
    } else if (screenName === 'Analytics' && isBusinessManager) {
      // @ts-ignore - Using 'as never' doesn't work well with nested navigation
      navigation.navigate('NotificationsTab', {
        screen: 'Analytics'
      });
    } else if (screenName === 'Settings') {
      // @ts-ignore - Using 'as never' doesn't work well with nested navigation
      navigation.navigate('NotificationsTab', {
        screen: 'Settings'
      });
    } else {
      // For direct navigation screens
      navigation.navigate(screenName as never);
    }
  };
  
  const handleLogout = () => {
    onClose();
    dispatch(logout());
  };
  
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };
  
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <View style={[
          styles.menuContainer,
          { 
            backgroundColor: isDarkMode ? '#121212' : '#FFFFFF',
            borderLeftColor: isDarkMode ? '#333' : '#e0e0e0'
          }
        ]}>
          <View style={[
            styles.headerSection,
            { backgroundColor: theme.colors.primary }
          ]}>
            <View style={styles.headerTop}>
              <Text variant="headlineSmall" style={styles.headerTitle}>Komuniteti</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={22} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.userRole}>
                  {isBusinessManager ? 'Business Manager' : 'Administrator'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.menuOptions}>
            <View style={styles.sectionHeader}>
              <Text style={[
                styles.sectionTitle,
                { color: isDarkMode ? '#999' : '#666' }
              ]}>
                NAVIGATION
              </Text>
              <TouchableOpacity onPress={handleToggleDarkMode}>
                <Text style={[
                  styles.themeToggleText,
                  { color: theme.colors.primary }
                ]}>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.menuItems}>
              <MenuItem
                icon={<BarChart3 size={20} color={isDarkMode ? '#fff' : '#333'} />}
                label="Dashboard"
                onPress={() => navigateTo(isBusinessManager ? 'Dashboard' : 'Dashboard')}
                isDarkMode={isDarkMode}
                theme={theme}
              />
              
              <MenuItem
                icon={isBusinessManager 
                  ? <Building size={20} color={isDarkMode ? '#fff' : '#333'} />
                  : <Users size={20} color={isDarkMode ? '#fff' : '#333'} />
                }
                label={isBusinessManager ? 'Buildings' : 'Residents'}
                onPress={() => navigateTo(isBusinessManager ? 'Buildings' : 'Residents')}
                isDarkMode={isDarkMode}
                theme={theme}
              />
              
              <MenuItem
                icon={<Bell size={20} color={isDarkMode ? '#fff' : '#333'} />}
                label="Notifications"
                onPress={() => navigateTo('Notifications')}
                isDarkMode={isDarkMode}
                theme={theme}
                badge={3}
              />
              
              <MenuItem
                icon={<MessageSquare size={20} color={isDarkMode ? '#fff' : '#333'} />}
                label="Messages"
                onPress={() => navigateTo('Messages')}
                isDarkMode={isDarkMode}
                theme={theme}
              />
              
              <Divider style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : '#e0e0e0' }]} />
              
              <Text style={[
                styles.sectionTitle,
                { 
                  color: isDarkMode ? '#999' : '#666',
                  marginTop: 16,
                  marginBottom: 8,
                  marginLeft: 12
                }
              ]}>
                TOOLS
              </Text>
              
              <MenuItem
                icon={<Info size={20} color={isDarkMode ? '#fff' : '#333'} />}
                label="InfoPoints"
                onPress={() => navigateTo('InfoPoints')}
                isDarkMode={isDarkMode}
                theme={theme}
              />
              
              <MenuItem
                icon={<BarChart size={20} color={isDarkMode ? '#fff' : '#333'} />}
                label="Polls & Surveys"
                onPress={() => navigateTo('Polls')}
                isDarkMode={isDarkMode}
                theme={theme}
              />
              
              {isBusinessManager && (
                <MenuItem
                  icon={<Users size={20} color={isDarkMode ? '#fff' : '#333'} />}
                  label="Organigram"
                  onPress={() => navigateTo('Organigram')}
                  isDarkMode={isDarkMode}
                  theme={theme}
                />
              )}
              
              {isBusinessManager && (
                <MenuItem
                  icon={<FileBarChart size={20} color={isDarkMode ? '#fff' : '#333'} />}
                  label="Analytics"
                  onPress={() => navigateTo('Analytics')}
                  isDarkMode={isDarkMode}
                  theme={theme}
                />
              )}
              
              <MenuItem
                icon={<Settings size={20} color={isDarkMode ? '#fff' : '#333'} />}
                label="Settings"
                onPress={() => navigateTo('Settings')}
                isDarkMode={isDarkMode}
                theme={theme}
              />
              
              <Divider style={[
                styles.divider, 
                { 
                  backgroundColor: isDarkMode ? '#333' : '#e0e0e0',
                  marginTop: 16,
                  marginBottom: 16
                }
              ]} />
              
              <MenuItem
                icon={<LogOut size={20} color="#e53935" />}
                label="Logout"
                onPress={handleLogout}
                isDarkMode={isDarkMode}
                theme={theme}
                isLogout
              />
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  isDarkMode: boolean;
  theme: any;
  badge?: number;
  isLogout?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onPress,
  isDarkMode,
  theme,
  badge,
  isLogout = false
}) => {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemIconLabel}>
          {icon}
          <Text style={[
            styles.menuItemLabel,
            { 
              color: isLogout 
                ? '#e53935' 
                : isDarkMode 
                  ? '#fff' 
                  : '#333'
            }
          ]}>
            {label}
          </Text>
        </View>
        
        {badge && (
          <View style={[styles.badge, { backgroundColor: '#e53935' }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: 280,
    height: '100%',
    borderLeftWidth: 1,
  },
  headerSection: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  userRole: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  menuOptions: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    borderRadius: 8,
    marginBottom: 4,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  menuItemIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 8,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  }
}); 