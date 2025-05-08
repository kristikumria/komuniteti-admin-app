import React, { useCallback, memo, useRef } from 'react';
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

// Create a separate non-memoized MenuItem component
const MenuItemComponent = ({
  icon,
  label,
  onPress,
  isDarkMode,
  theme,
  badge,
  isLogout = false
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  isDarkMode: boolean;
  theme: any;
  badge?: number;
  isLogout?: boolean;
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
  >
    <View style={styles.menuItemContent}>
      <View style={styles.menuItemIconLabel}>
        <View>{icon}</View>
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

// Memoize the MenuItem to prevent unnecessary re-renders
const MenuItem = memo(MenuItemComponent);

// Completely refactored SideMenu component
export const SideMenu = ({ isVisible, onClose }: SideMenuProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { user } = useAppSelector((state) => state.auth);
  const isBusinessManager = user?.role === 'business_manager';
  
  // Use a ref to track whether the menu is currently closing
  const isClosing = useRef(false);
  
  // Prevent direct navigation during render
  const navigateTo = useCallback((screenName: string) => {
    if (isClosing.current) return;
    
    isClosing.current = true;
    onClose();
    
    // Delay navigation to ensure menu is closed first
    setTimeout(() => {
      isClosing.current = false;
      
      // Handle nested navigation for tab screens
      if (screenName === 'Notifications') {
        // Navigate directly to notifications screen
        // @ts-ignore
        navigation.navigate('NotificationsScreen');
      } else if (screenName === 'Messages') {
        // Navigate to ChatTab
        navigation.navigate('ChatTab' as never);
      } else if (screenName === 'InfoPoints') {
        // Navigate to InfoPointsScreen directly
        // @ts-ignore
        navigation.navigate('InfoPointsScreen');
      } else if (screenName === 'Polls') {
        // Navigate to PollsScreen directly
        // @ts-ignore
        navigation.navigate('PollsScreen');
      } else if (screenName === 'Organigram' && isBusinessManager) {
        // Handle organigram navigation for business managers
        alert('Organigram feature is under development');
      } else if (screenName === 'Analytics' && isBusinessManager) {
        // Handle analytics navigation for business managers
        alert('Analytics feature is under development');
      } else if (screenName === 'Settings') {
        // Navigate to Settings in MoreTab
        // @ts-ignore
        navigation.navigate('MoreTab', {
          screen: 'Settings'
        });
      } else {
        // For direct navigation screens
        navigation.navigate(screenName as never);
      }
    }, 300);
  }, [navigation, onClose, isBusinessManager]);
  
  const handleLogout = useCallback(() => {
    if (isClosing.current) return;
    
    isClosing.current = true;
    onClose();
    
    // Delay logout to ensure menu is closed first
    setTimeout(() => {
      isClosing.current = false;
      dispatch(logout());
    }, 300);
  }, [dispatch, onClose]);
  
  const handleToggleDarkMode = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch]);
  
  // Create a safe wrapper for icons
  const wrapIcon = useCallback((icon: React.ReactNode) => {
    return <View>{icon}</View>;
  }, []);
  
  if (!isVisible) return null;
  
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
                icon={wrapIcon(<BarChart3 size={20} color={isDarkMode ? '#fff' : '#333'} />)}
                label="Dashboard"
                onPress={() => navigateTo('Dashboard')}
                isDarkMode={isDarkMode}
                theme={theme}
              />
              
              <MenuItem
                icon={wrapIcon(isBusinessManager 
                  ? <Building size={20} color={isDarkMode ? '#fff' : '#333'} />
                  : <Users size={20} color={isDarkMode ? '#fff' : '#333'} />
                )}
                label={isBusinessManager ? 'Buildings' : 'Residents'}
                onPress={() => navigateTo(isBusinessManager ? 'Buildings' : 'Residents')}
                isDarkMode={isDarkMode}
                theme={theme}
              />
              
              <MenuItem
                icon={wrapIcon(<Bell size={20} color={isDarkMode ? '#fff' : '#333'} />)}
                label="Notifications"
                onPress={() => navigateTo('Notifications')}
                isDarkMode={isDarkMode}
                theme={theme}
                badge={3}
              />
              
              <MenuItem
                icon={wrapIcon(<MessageSquare size={20} color={isDarkMode ? '#fff' : '#333'} />)}
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
                icon={wrapIcon(<Info size={20} color={isDarkMode ? '#fff' : '#333'} />)}
                label="InfoPoints"
                onPress={() => navigateTo('InfoPoints')}
                isDarkMode={isDarkMode}
                theme={theme}
              />
              
              <MenuItem
                icon={wrapIcon(<BarChart size={20} color={isDarkMode ? '#fff' : '#333'} />)}
                label="Polls & Surveys"
                onPress={() => navigateTo('Polls')}
                isDarkMode={isDarkMode}
                theme={theme}
              />
              
              {isBusinessManager && (
                <MenuItem
                  icon={wrapIcon(<Users size={20} color={isDarkMode ? '#fff' : '#333'} />)}
                  label="Organigram"
                  onPress={() => navigateTo('Organigram')}
                  isDarkMode={isDarkMode}
                  theme={theme}
                />
              )}
              
              {isBusinessManager && (
                <MenuItem
                  icon={wrapIcon(<FileBarChart size={20} color={isDarkMode ? '#fff' : '#333'} />)}
                  label="Analytics"
                  onPress={() => navigateTo('Analytics')}
                  isDarkMode={isDarkMode}
                  theme={theme}
                />
              )}
              
              <MenuItem
                icon={wrapIcon(<Settings size={20} color={isDarkMode ? '#fff' : '#333'} />)}
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
                icon={wrapIcon(<LogOut size={20} color="#e53935" />)}
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