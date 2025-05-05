import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, useTheme, ActivityIndicator, Divider, Button } from 'react-native-paper';
import { Bell, Trash2, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { SideMenu } from '../../../components/SideMenu';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../../store/slices/notificationsSlice';
import { Notification, AdministratorStackParamList } from '../../../navigation/types';
import { formatDateTime } from '../../../utils/formatters';
import { getNotificationIcon, getRelativeTimeText } from '../../../utils/notificationUtils';

// Define the navigation prop type
type NotificationsScreenNavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;

export const NotificationsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NotificationsScreenNavigationProp>();
  const dispatch = useAppDispatch();
  
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const { notifications, loading, unreadCount } = useAppSelector(state => state.notifications);
  const userId = useAppSelector(state => state.auth.user?.id || 'admin1'); // Fallback to mock ID
  
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread'>('all');
  
  useEffect(() => {
    fetchNotificationsList();
  }, []);
  
  const fetchNotificationsList = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchNotifications(userId));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotificationsList();
  };
  
  const handleNotificationPress = async (notification: Notification) => {
    // If notification is not read, mark it as read
    if (!notification.read) {
      await dispatch(markAsRead(notification.id));
    }
    
    // Navigate to notification details screen
    navigation.navigate('NotificationDetails', { notificationId: notification.id });
  };
  
  const handleMarkAllAsRead = async () => {
    await dispatch(markAllAsRead(userId));
  };
  
  const handleDeleteNotification = async (notificationId: string) => {
    await dispatch(deleteNotification(notificationId));
  };
  
  const filteredNotifications = selectedFilter === 'all' 
    ? notifications 
    : notifications.filter(notification => !notification.read);
  
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View>
      <TouchableOpacity
        style={[
          styles.notificationItem,
          { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' },
          !item.read && styles.unreadNotification,
          !item.read && { backgroundColor: isDarkMode ? '#1e1e1e' : theme.colors.primary + '08' },
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.notificationIconContainer}>
          {getNotificationIcon(item, 20, item.read ? (isDarkMode ? '#777' : '#999') : theme.colors.primary)}
        </View>
        
        <View style={styles.notificationContent}>
          <Text 
            style={[
              styles.notificationTitle, 
              { color: isDarkMode ? '#fff' : '#333' },
              !item.read && styles.boldText,
            ]}
          >
            {item.title}
          </Text>
          
          <Text style={[styles.notificationMessage, { color: isDarkMode ? '#aaa' : '#666' }]}>
            {item.message}
          </Text>
          
          <Text style={[styles.notificationTime, { color: isDarkMode ? '#777' : '#999' }]}>
            {getRelativeTimeText(item.timestamp)}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          {!item.read && (
            <TouchableOpacity
              style={styles.markReadButton}
              onPress={() => dispatch(markAsRead(item.id))}
            >
              <Check size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteNotification(item.id)}
          >
            <Trash2 size={18} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      
      <Divider style={{ marginLeft: 68 }} />
    </View>
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Bell size={50} color={isDarkMode ? '#555' : '#ccc'} />
      <Text style={[styles.emptyText, { color: isDarkMode ? '#aaa' : '#888' }]}>
        No notifications found
      </Text>
      {selectedFilter === 'unread' ? (
        <Text style={[styles.emptySubText, { color: isDarkMode ? '#888' : '#aaa' }]}>
          All caught up! You have no unread notifications.
        </Text>
      ) : (
        <Text style={[styles.emptySubText, { color: isDarkMode ? '#888' : '#aaa' }]}>
          Notifications will appear here when you receive them.
        </Text>
      )}
    </View>
  );
  
  if (loading && !refreshing) {
    return (
      <>
        <Header 
          title="Notifications" 
          showBack={false}
          showMenu={true}
          onMenuPress={() => setMenuVisible(true)}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading notifications...
          </Text>
        </View>
        <SideMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </>
    );
  }
  
  return (
    <>
      <Header 
        title="Notifications" 
        showBack={false}
        showMenu={true}
        onMenuPress={() => setMenuVisible(true)}
      />
      
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <View style={styles.filterContainer}>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'all' && styles.activeFilterButton,
                selectedFilter === 'all' && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === 'all' && styles.activeFilterButtonText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'unread' && styles.activeFilterButton,
                selectedFilter === 'unread' && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setSelectedFilter('unread')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === 'unread' && styles.activeFilterButtonText,
                ]}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </Text>
            </TouchableOpacity>
          </View>
          
          {unreadCount > 0 && (
            <Button 
              mode="text" 
              onPress={handleMarkAllAsRead}
              textColor={theme.colors.primary}
              style={styles.markAllReadButton}
            >
              Mark all as read
            </Button>
          )}
        </View>
        
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={
            filteredNotifications.length === 0
              ? { flex: 1, justifyContent: 'center' }
              : { paddingBottom: 80 }
          }
        />
      </View>
      
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  activeFilterButton: {
    backgroundColor: 'blue',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  markAllReadButton: {
    marginLeft: 'auto',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  unreadNotification: {
    backgroundColor: 'rgba(33, 150, 243, 0.05)',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markReadButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
}); 