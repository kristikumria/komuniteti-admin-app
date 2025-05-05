import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, ActivityIndicator, Button, Card, Divider } from 'react-native-paper';
import { Bell, ChevronLeft, Calendar, ArrowRight, Trash2 } from 'lucide-react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { SideMenu } from '../../../components/SideMenu';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { fetchNotificationById, markAsRead, deleteNotification } from '../../../store/slices/notificationsSlice';
import { Notification, AdministratorStackParamList } from '../../../navigation/types';
import { formatDateTime } from '../../../utils/formatters';
import { getNotificationIcon as getIconForNotification, getRelativeTimeText } from '../../../utils/notificationUtils';

type NotificationDetailsScreenRouteProp = RouteProp<AdministratorStackParamList, 'NotificationDetails'>;
type NotificationDetailsScreenNavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;

export const NotificationDetails = () => {
  const route = useRoute<NotificationDetailsScreenRouteProp>();
  const navigation = useNavigation<NotificationDetailsScreenNavigationProp>();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  const { notificationId } = route.params;
  
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const { currentNotification, loading } = useAppSelector(state => state.notifications);
  
  useEffect(() => {
    dispatch(fetchNotificationById(notificationId));
    
    // Mark as read when viewed
    if (currentNotification && !currentNotification.read) {
      dispatch(markAsRead(notificationId));
    }
  }, [notificationId, dispatch]);
  
  const handleDelete = async () => {
    await dispatch(deleteNotification(notificationId));
    // Navigate back after deletion
    navigation.goBack();
  };
  
  const handleNavigateToTarget = () => {
    if (!currentNotification || !currentNotification.targetId) return;
    
    // Navigate based on notification type
    if (currentNotification.type === 'payment') {
      // @ts-ignore
      navigation.navigate('PaymentDetails', { paymentId: currentNotification.targetId });
    } else if (currentNotification.type === 'maintenance') {
      // @ts-ignore
      navigation.navigate('IssueDetails', { issueId: currentNotification.targetId });
    } else if (currentNotification.type === 'resident') {
      // @ts-ignore
      navigation.navigate('ResidentDetails', { residentId: currentNotification.targetId });
    } else if (currentNotification.type === 'building') {
      // @ts-ignore
      navigation.navigate('BuildingDetails', { buildingId: currentNotification.targetId });
    } else if (currentNotification.type === 'message') {
      // @ts-ignore
      navigation.navigate('ChatConversation', { conversationId: currentNotification.targetId });
    }
  };
  
  const getNotificationIcon = (): React.ReactNode => {
    return currentNotification ? 
      getIconForNotification(currentNotification, 36, theme.colors.primary) : 
      <Bell size={36} color={theme.colors.primary} />;
  };
  
  const getNotificationType = () => {
    if (!currentNotification) return 'Unknown';
    
    switch(currentNotification.type) {
      case 'payment': return 'Payment';
      case 'maintenance': return 'Maintenance';
      case 'resident': return 'Resident';
      case 'building': return 'Building';
      case 'message': return 'Message';
      case 'system': return 'System';
      default: return 'Other';
    }
  };
  
  if (loading || !currentNotification) {
    return (
      <>
        <Header 
          title="Notification Details" 
          showBack={true}
          showMenu={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading notification...
          </Text>
        </View>
      </>
    );
  }
  
  return (
    <>
      <Header 
        title="Notification Details" 
        showBack={true}
        showMenu={true}
      />
      
      <ScrollView 
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
        ]}
      >
        <Card 
          style={[
            styles.card,
            { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
          ]}
        >
          <Card.Content>
            <View style={styles.header}>
              <View style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.primary + '20' }
              ]}>
                {getNotificationIcon()}
              </View>
              
              <View style={styles.titleContainer}>
                <Text style={[
                  styles.title,
                  { color: isDarkMode ? '#fff' : '#333' }
                ]}>
                  {currentNotification.title}
                </Text>
                
                <View style={styles.metaContainer}>
                  <Text style={[
                    styles.type,
                    { color: theme.colors.primary }
                  ]}>
                    {getNotificationType()}
                  </Text>
                  
                  <Text style={[
                    styles.datetime,
                    { color: isDarkMode ? '#888' : '#666' }
                  ]}>
                    {getRelativeTimeText(currentNotification.timestamp)}
                    {' • '}
                    {formatDateTime(currentNotification.timestamp)}
                  </Text>
                </View>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <Text style={[
              styles.message,
              { color: isDarkMode ? '#ddd' : '#444' }
            ]}>
              {currentNotification.message}
            </Text>
            
            {currentNotification.targetId && (
              <Button 
                mode="contained"
                icon={({ size, color }) => <ArrowRight size={size} color={color} />}
                onPress={handleNavigateToTarget}
                style={styles.viewDetailsButton}
              >
                View Details
              </Button>
            )}
            
            <Button 
              mode="outlined"
              textColor={theme.colors.error}
              icon={({ size, color }) => <Trash2 size={size} color={color} />}
              onPress={handleDelete}
              style={styles.deleteButton}
            >
              Delete Notification
            </Button>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  datetime: {
    fontSize: 12,
  },
  divider: {
    marginVertical: 16,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  viewDetailsButton: {
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: 'rgba(255, 0, 0, 0.2)',
  },
}); 