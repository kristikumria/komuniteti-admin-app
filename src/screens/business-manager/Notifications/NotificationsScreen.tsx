import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  Card,
  Chip,
  Divider,
  IconButton,
  FAB,
  useTheme,
  SegmentedButtons,
  ActivityIndicator,
} from 'react-native-paper';
import { 
  Bell, 
  Send, 
  Clock, 
  Users, 
  Building,
  Edit, 
  Trash2 
} from 'lucide-react-native';
import { getNotifications } from '../../../services/notificationService';
import { Notification } from '../../../types/notification';
import { formatDate, formatTimeAgo } from '../../../utils/dateUtils';

export const NotificationsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === 'scheduled') return notification.status === 'scheduled';
      if (filter === 'sent') return notification.status === 'sent';
      if (filter === 'draft') return notification.status === 'draft';
      return true;
    })
    .sort((a, b) => {
      // Sort by scheduled date for scheduled notifications
      if (a.status === 'scheduled' && b.status === 'scheduled') {
        return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
      }
      // Sort by sent date for sent notifications
      if (a.status === 'sent' && b.status === 'sent') {
        return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
      }
      // Sort by created date for drafts
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleViewNotification = (notificationId: string) => {
    navigation.navigate('NotificationDetails', { notificationId });
  };

  const handleEditNotification = (notificationId: string) => {
    navigation.navigate('EditNotification', { notificationId });
  };

  const handleDeleteNotification = (notificationId: string) => {
    setSelectedNotificationId(notificationId);
    setDeleteDialogVisible(true);
  };

  const confirmDeleteNotification = async () => {
    if (selectedNotificationId) {
      // TODO: Implement delete notification API call
      setNotifications(notifications.filter(n => n.id !== selectedNotificationId));
      setDeleteDialogVisible(false);
      setSelectedNotificationId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock size={16} color={theme.colors.primary} />;
      case 'sent':
        return <Send size={16} color={theme.colors.success} />;
      case 'draft':
        return <Edit size={16} color={theme.colors.secondary} />;
      default:
        return <Bell size={16} color={theme.colors.primary} />;
    }
  };

  const getStatusText = (notification: Notification) => {
    if (notification.status === 'scheduled') {
      return `Scheduled for ${formatDate(new Date(notification.scheduledFor))}`;
    }
    if (notification.status === 'sent') {
      return `Sent ${formatTimeAgo(new Date(notification.sentAt))}`;
    }
    return 'Draft';
  };

  const getRecipientText = (notification: Notification) => {
    const { recipients } = notification;
    
    if (recipients.all) return 'All residents';
    if (recipients.buildings && recipients.buildings.length > 0) {
      return `${recipients.buildings.length} building${recipients.buildings.length > 1 ? 's' : ''}`;
    }
    if (recipients.units && recipients.units.length > 0) {
      return `${recipients.units.length} unit${recipients.units.length > 1 ? 's' : ''}`;
    }
    if (recipients.residents && recipients.residents.length > 0) {
      return `${recipients.residents.length} resident${recipients.residents.length > 1 ? 's' : ''}`;
    }
    return 'No recipients';
  };

  const getRecipientIcon = (notification: Notification) => {
    const { recipients } = notification;
    
    if (recipients.all) return <Users size={16} color={theme.colors.secondary} />;
    if (recipients.buildings && recipients.buildings.length > 0) {
      return <Building size={16} color={theme.colors.secondary} />;
    }
    return <Users size={16} color={theme.colors.secondary} />;
  };

  const renderNotificationCard = (notification: Notification) => {
    return (
      <Card
        key={notification.id}
        style={styles.card}
        onPress={() => handleViewNotification(notification.id)}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Bell size={20} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.title}>
                {notification.title}
              </Text>
            </View>
            <View style={styles.actions}>
              <IconButton
                icon={() => <Edit size={20} color={theme.colors.primary} />}
                onPress={() => handleEditNotification(notification.id)}
              />
              <IconButton
                icon={() => <Trash2 size={20} color={theme.colors.error} />}
                onPress={() => handleDeleteNotification(notification.id)}
              />
            </View>
          </View>
          
          <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
            {notification.body}
          </Text>
          
          <Divider style={styles.divider} />
          
          <View style={styles.footer}>
            <View style={styles.statusContainer}>
              {getStatusIcon(notification.status)}
              <Text variant="bodySmall" style={{ marginLeft: 4 }}>
                {getStatusText(notification)}
              </Text>
            </View>
            
            <View style={styles.recipientContainer}>
              {getRecipientIcon(notification)}
              <Text variant="bodySmall" style={{ marginLeft: 4 }}>
                {getRecipientText(notification)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.screenTitle}>
          Notifications
        </Text>
      </View>
      
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'scheduled', label: 'Scheduled' },
            { value: 'sent', label: 'Sent' },
            { value: 'draft', label: 'Draft' },
          ]}
        />
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : filteredNotifications.length > 0 ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredNotifications.map(renderNotificationCard)}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Bell size={48} color={theme.colors.primary} opacity={0.5} />
          <Text variant="titleLarge" style={styles.emptyTitle}>
            No notifications
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            {filter === 'all'
              ? 'Create a new notification to keep residents updated.'
              : `No ${filter} notifications found.`}
          </Text>
        </View>
      )}
      
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('CreateNotification')}
      />
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
    marginBottom: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: 300,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  title: {
    fontWeight: '600',
    flex: 1,
  },
  description: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
}); 