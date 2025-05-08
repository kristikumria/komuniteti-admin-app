import * as React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  RefreshControl,
  StatusBar as RNStatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdministratorStackParamList, ChatConversation, User } from '../../../navigation/types';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { chatService } from '../../../services/chatService';
import { formatDistanceToNow } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../../theme';
import { StatusBar } from 'expo-status-bar';
import { Header } from '../../../components/Header';
import { useAppSelector } from '../../../store/hooks';

const { useEffect, useState } = React;

type ChatListScreenProps = NativeStackNavigationProp<AdministratorStackParamList, 'Chat'>;

const ChatListScreen = () => {
  const navigation = useNavigation<ChatListScreenProps>();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id || '';
  
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchConversations = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await chatService.getConversations(userId);
      // Sort conversations by updatedAt (most recent first)
      data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const navigateToConversation = (conversationId: string) => {
    navigation.navigate('ChatConversation', { conversationId });
  };

  const navigateToNewChat = () => {
    // This will be implemented later
    // navigation.navigate('NewChat');
    alert('New chat functionality coming soon!');
  };

  const renderConversation = ({ item }: { item: ChatConversation }) => {
    // Determine the other participant for 1:1 chats or use the group title
    const otherParticipant = !item.isGroup 
      ? item.participants.find(p => p.id !== userId) 
      : null;
    
    const displayName = item.isGroup 
      ? item.title 
      : otherParticipant?.name || 'Unknown User';
    
    const displayImage = item.isGroup 
      ? item.image 
      : otherParticipant?.image;
    
    const lastMessageTime = item.lastMessage 
      ? formatDistanceToNow(new Date(item.lastMessage.timestamp), { addSuffix: true }) 
      : '';

    return (
      <TouchableOpacity 
        style={styles.conversationItem} 
        onPress={() => navigateToConversation(item.id)}
      >
        <View style={styles.avatarContainer}>
          {displayImage ? (
            <Image source={{ uri: displayImage }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {otherParticipant?.isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.timeText}>{lastMessageTime}</Text>
          </View>
          
          <View style={styles.messagePreviewContainer}>
            <Text style={styles.messagePreview} numberOfLines={1}>
              {item.lastMessage?.content || 'No messages yet'}
            </Text>
            
            {(item.unreadCount > 0) && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Messages" 
        showBack={false}
      />
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={renderConversation}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialIcons name="chat-bubble-outline" size={64} color={theme.colors.grey} />
                <Text style={styles.emptyText}>No conversations yet</Text>
                <Text style={styles.emptySubtext}>
                  Start a new conversation by tapping the plus button
                </Text>
              </View>
            }
          />
          
          <TouchableOpacity
            style={styles.fabButton}
            onPress={navigateToNewChat}
          >
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    backgroundColor: theme.colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.grey,
    marginLeft: 8,
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messagePreview: {
    fontSize: 14,
    color: theme.colors.darkGrey,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: theme.colors.darkGrey,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.grey,
    textAlign: 'center',
    marginTop: 8,
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ChatListScreen; 