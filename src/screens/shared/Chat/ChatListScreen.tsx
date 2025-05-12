import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Text,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Searchbar, FAB, Divider, Badge, useTheme, Appbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChatConversation } from '../../../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useAppSelector } from '../../../store/hooks';

// Mock data for prototyping
const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: '1',
    title: 'Building A Administrators',
    participants: [
      {
        id: '101',
        name: 'Arben Hoxha',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        isOnline: true,
      },
      {
        id: '102',
        name: 'Sara Mati',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        isOnline: false,
        lastSeen: '2023-05-15T14:30:00Z',
      },
    ],
    lastMessage: {
      id: 'm1',
      conversationId: '1',
      senderId: '101',
      senderName: 'Arben Hoxha',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'We need to discuss the maintenance schedule for next month',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      readBy: ['101', '102'],
      status: 'read',
    },
    unreadCount: 0,
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    isGroup: true,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1aWxkaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  // Add a Community Chat conversation
  {
    id: '6',
    title: 'Community Chat',
    participants: [
      {
        id: '101',
        name: 'Arben Hoxha',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        isOnline: true,
      },
      {
        id: '102',
        name: 'Sara Mati',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        isOnline: false,
      },
      {
        id: '108',
        name: 'Liri Berisha',
        role: 'resident',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'm6',
      conversationId: '6',
      senderId: '108',
      senderName: 'Liri Berisha',
      senderRole: 'resident',
      senderImage: 'https://randomuser.me/api/portraits/women/68.jpg',
      content: 'Will there be an option to join remotely for the community meeting?',
      timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      readBy: ['101', '102'],
      status: 'read',
    },
    unreadCount: 0,
    createdAt: '2023-03-05T15:45:00Z',
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
    isGroup: true,
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbW11bml0eXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '2',
    title: 'Building B Team',
    participants: [
      {
        id: '103',
        name: 'Elton Zholi',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/men/55.jpg',
        isOnline: false,
        lastSeen: '2023-05-15T10:15:00Z',
      },
      {
        id: '104',
        name: 'Drita Koka',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/women/33.jpg',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'm2',
      conversationId: '2',
      senderId: '104',
      senderName: 'Drita Koka',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/women/33.jpg',
      content: 'That sounds serious. Have you inspected it yourself?',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      readBy: ['104'],
      status: 'delivered',
    },
    unreadCount: 0,
    createdAt: '2023-02-20T11:30:00Z',
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    isGroup: true,
    image: 'https://images.unsplash.com/photo-1554435493-93422e8d1a41?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1aWxkaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '3',
    title: 'Arben Hoxha',
    participants: [
      {
        id: '101',
        name: 'Arben Hoxha',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'm3',
      conversationId: '3',
      senderId: '101',
      senderName: 'Arben Hoxha',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Hi Arben, of course. What\'s your proposal?',
      timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
      readBy: ['101'],
      status: 'read',
    },
    unreadCount: 0,
    createdAt: '2023-03-10T08:45:00Z',
    updatedAt: new Date(Date.now() - 518400000).toISOString(),
    isGroup: false,
  },
  {
    id: '4',
    title: 'Maintenance Team',
    participants: [
      {
        id: '105',
        name: 'Gezim Basha',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/men/65.jpg',
        isOnline: false,
        lastSeen: '2023-05-14T18:20:00Z',
      },
      {
        id: '106',
        name: 'Teuta Leka',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/women/22.jpg',
        isOnline: true,
      },
      {
        id: '107',
        name: 'Dritan Mema',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/men/41.jpg',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'm4',
      conversationId: '4',
      senderId: '107',
      senderName: 'Dritan Mema',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/men/41.jpg',
      content: 'We need to order new light fixtures for the hallways in Building C',
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      readBy: ['105', '106', '107'],
      status: 'read',
    },
    unreadCount: 0,
    createdAt: '2023-01-05T10:15:00Z',
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    isGroup: true,
  },
  {
    id: '5',
    title: 'Arben Hoxha',
    participants: [
      {
        id: '103',
        name: 'Arben Hoxha',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        isOnline: true,
      },
    ],
    lastMessage: {
      id: 'm5',
      conversationId: '5',
      senderId: '103',
      senderName: 'Arben Hoxha',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Hi John, the recycling bins should be placed by the entrance.',
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      readBy: ['103'],
      status: 'read',
    },
    unreadCount: 0,
    createdAt: '2023-02-08T14:30:00Z',
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    isGroup: false,
  },
];

// Define the props interface to make the component generic
export interface ChatListScreenProps {
  navigateToConversation?: (conversationId: string) => void;
  navigateToNewConversation?: () => void;
  userRole?: 'administrator' | 'business-manager';
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({
  navigateToConversation,
  navigateToNewConversation,
  userRole = 'administrator',
}) => {
  // State
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [filteredConversations, setFilteredConversations] = useState(MOCK_CONVERSATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  // Hooks
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const isDarkMode = useAppSelector(state => state.settings?.darkMode) || false;
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id || '';
  const navigation = useNavigation<any>();
  
  // Navigation handlers
  const handleNavigateToConversation = useCallback((conversationId: string) => {
    if (navigateToConversation) {
      navigateToConversation(conversationId);
    } else {
      navigation.navigate('ChatConversation', { conversationId });
    }
  }, [navigateToConversation, navigation]);
  
  const handleNavigateToNewConversation = useCallback(() => {
    if (navigateToNewConversation) {
      navigateToNewConversation();
    } else {
      navigation.navigate('NewConversation');
    }
  }, [navigateToNewConversation, navigation]);
  
  // Filter conversations when search query changes
  useEffect(() => {
    filterConversations();
  }, [searchQuery, conversations]);
  
  // Load conversations when screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchConversations();
    }
  }, [isFocused]);
  
  const filterConversations = () => {
    if (searchQuery.trim() === '') {
      setFilteredConversations(conversations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = conversations.filter(
        conversation => 
          conversation.title.toLowerCase().includes(query) ||
          conversation.participants.some(p => p.name.toLowerCase().includes(query)) ||
          (conversation.lastMessage?.content.toLowerCase().includes(query) || false)
      );
      setFilteredConversations(filtered);
    }
  };

  const fetchConversations = useCallback(() => {
    setLoading(true);
    // In a real app, we would fetch from API based on userRole
    // For now, using mock data
    setTimeout(() => {
      setConversations(MOCK_CONVERSATIONS);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConversations();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [fetchConversations]);

  const toggleSearch = useCallback(() => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  }, [showSearch]);

  const formatMessageTime = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return diffInHours === 1 ? `about 1 hour ago` : `about ${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const renderHeader = () => {
    if (showSearch) {
      return (
        <Appbar.Header style={[styles.appbarWithSearch, isDarkMode && styles.appbarDark]} statusBarHeight={insets.top}>
          <Appbar.Action icon="arrow-left" onPress={toggleSearch} color={isDarkMode ? '#FFFFFF' : theme.colors.onSurface} />
          <Searchbar
            placeholder="Search conversations..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.headerSearchBar, isDarkMode && styles.searchBarDark]}
            iconColor={theme.colors.primary}
            autoFocus
          />
        </Appbar.Header>
      );
    }

    return (
      <Appbar.Header 
        style={[styles.appbar, isDarkMode && styles.appbarDark]} 
        statusBarHeight={insets.top}
      >
        <Appbar.Content 
          title="Messages" 
          titleStyle={[styles.headerTitle, isDarkMode && styles.headerTitleDark]} 
        />
        <Appbar.Action 
          icon="magnify" 
          onPress={toggleSearch} 
          color={isDarkMode ? '#FFFFFF' : theme.colors.onSurface} 
        />
        <Appbar.Action 
          icon="dots-vertical" 
          onPress={() => {}} 
          color={isDarkMode ? '#FFFFFF' : theme.colors.onSurface} 
        />
      </Appbar.Header>
    );
  };

  const renderConversationItem = useCallback(({ item }: { item: ChatConversation }) => {
    // Determine if this is a direct message with another user
    const isDirectMessage = !item.isGroup;
    
    // For direct messages, we want to show the other participant's details
    const otherParticipant = isDirectMessage 
      ? item.participants.find(p => p.id !== userId) 
      : null;
    
    // Display name is either the conversation title or the other participant's name
    const displayName = isDirectMessage && otherParticipant 
      ? otherParticipant.name 
      : item.title;
    
    // Profile image is either the conversation image, other participant image, or default
    const displayImage = item.image || (isDirectMessage && otherParticipant?.image);
    
    // Online status for direct messages only
    const isOnline = isDirectMessage && otherParticipant?.isOnline;
    
    return (
      <TouchableOpacity
        style={[
          styles.conversationItem, 
          isDarkMode && styles.conversationItemDark
        ]}
        onPress={() => handleNavigateToConversation(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          {displayImage ? (
            <Image source={{ uri: displayImage }} style={styles.avatar} />
          ) : (
            <View style={[
              styles.defaultAvatar, 
              { backgroundColor: item.isGroup ? theme.colors.primary : theme.colors.secondary }
            ]}>
              {item.isGroup ? (
                <MaterialIcons name="group" size={24} color="white" />
              ) : (
                <Text style={styles.avatarText}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              )}
            </View>
          )}
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.conversationDetails}>
          <View style={styles.conversationHeader}>
            <Text 
              style={[
                styles.conversationTitle, 
                isDarkMode && styles.textDark
              ]} 
              numberOfLines={1}
            >
              {displayName}
            </Text>
            <Text 
              style={[
                styles.timeText, 
                isDarkMode && styles.timeTextDark
              ]}
            >
              {item.lastMessage && formatMessageTime(item.lastMessage.timestamp)}
            </Text>
          </View>

          <View style={styles.conversationFooter}>
            {item.lastMessage && (
              <Text
                style={[
                  styles.lastMessageText,
                  isDarkMode && styles.lastMessageTextDark,
                  item.unreadCount > 0 && styles.unreadMessage,
                  item.unreadCount > 0 && isDarkMode && styles.unreadMessageDark,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.isGroup && `${item.lastMessage.senderName}: `}
                {item.lastMessage.content}
              </Text>
            )}

            {item.unreadCount > 0 && (
              <Badge
                size={22}
                style={[styles.badge, { backgroundColor: theme.colors.primary }]}
              >
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Badge>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [handleNavigateToConversation, theme.colors.primary, theme.colors.secondary, isDarkMode, userId]);

  const renderEmptyList = useCallback(() => (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="chat-bubble-outline"
        size={80}
        color={isDarkMode ? '#555' : theme.colors.primary}
      />
      <Text style={[styles.emptyText, isDarkMode && styles.textDark]}>
        No conversations found
      </Text>
      <Text style={[styles.emptySubText, isDarkMode && styles.textLightDark]}>
        {searchQuery
          ? "Try a different search term"
          : "Start a new conversation by tapping the button below"}
      </Text>
    </View>
  ), [searchQuery, theme.colors.primary, isDarkMode]);

  return (
    <View style={[
      styles.container, 
      isDarkMode && styles.containerDark
    ]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={isDarkMode ? '#121212' : '#FFFFFF'} 
      />
      
      {renderHeader()}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversationItem}
          ItemSeparatorComponent={() => 
            <Divider style={isDarkMode ? styles.dividerDark : undefined} />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={isDarkMode ? '#FFFFFF' : theme.colors.primary}
              progressBackgroundColor={isDarkMode ? '#242424' : '#FFFFFF'}
            />
          }
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={[
            styles.listContent,
            filteredConversations.length === 0 && styles.emptyListContent,
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={handleNavigateToNewConversation}
        color="#ffffff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  appbar: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  appbarDark: {
    backgroundColor: '#121212',
    borderBottomColor: '#333',
    borderBottomWidth: 0.5,
  },
  appbarWithSearch: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    paddingHorizontal: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  headerSearchBar: {
    flex: 1,
    elevation: 0,
    backgroundColor: '#F5F5F5',
    height: 40,
    marginRight: 8,
    borderRadius: 8,
  },
  searchBarDark: {
    backgroundColor: '#242424',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyListContent: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  conversationItemDark: {
    backgroundColor: '#121212',
  },
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  defaultAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4caf50',
    borderWidth: 2,
    borderColor: '#ffffff',
    bottom: 0,
    right: 0,
  },
  conversationDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#757575',
  },
  timeTextDark: {
    color: '#a0a0a0',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessageText: {
    fontSize: 14,
    color: '#757575',
    flex: 1,
    marginRight: 8,
  },
  lastMessageTextDark: {
    color: '#a0a0a0',
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#212121',
  },
  unreadMessageDark: {
    color: '#e0e0e0',
  },
  textDark: {
    color: '#f0f0f0',
  },
  textLightDark: {
    color: '#a0a0a0',
  },
  badge: {
    marginLeft: 'auto',
  },
  dividerDark: {
    backgroundColor: '#333',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 16,
    bottom: 16,
    elevation: 4,
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
    color: '#212121',
  },
  emptySubText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ChatListScreen; 