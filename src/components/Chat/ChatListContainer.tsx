import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated as RNAnimated,
  Platform
} from 'react-native';
import { Searchbar, Badge, FAB, useTheme, Divider, Surface } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../store/hooks';
import { ChatConversation } from '../../navigation/types';
import { format, isToday, isYesterday } from 'date-fns';
import Animated, { 
  FadeIn, 
  FadeOut,
  SlideInRight,
  useAnimatedStyle, 
  withTiming, 
  Easing
} from 'react-native-reanimated';

interface ChatListContainerProps {
  conversations: ChatConversation[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onPressConversation: (conversationId: string) => void;
  onPressNewChat?: () => void;
  headerComponent?: React.ReactNode;
  isAdmin?: boolean;
  unreadCount?: number;
}

export const ChatListContainer: React.FC<ChatListContainerProps> = ({
  conversations,
  loading,
  refreshing,
  onRefresh,
  onPressConversation,
  onPressNewChat,
  headerComponent,
  isAdmin = false,
  unreadCount = 0
}) => {
  const isDarkMode = useAppSelector(state => state.settings?.darkMode) ?? false;
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<ChatConversation[]>([]);
  
  // Animation for search bar
  const searchBarHeight = useRef(new RNAnimated.Value(0)).current;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  
  // Animated style for search bar
  const searchBarAnimStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isSearchVisible ? 56 : 0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      opacity: withTiming(isSearchVisible ? 1 : 0, {
        duration: 250,
        easing: Easing.ease,
      }),
      overflow: 'hidden',
    };
  }, [isSearchVisible]);
  
  // Filter conversations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
      return;
    }
    
    const filtered = conversations.filter(conversation => {
      const title = conversation.title.toLowerCase();
      const query = searchQuery.toLowerCase();
      
      // Check if conversation title matches
      if (title.includes(query)) return true;
      
      // Check if any participant matches
      return conversation.participants.some(p => 
        p.name.toLowerCase().includes(query)
      );
    });
    
    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);
  
  // Toggle search bar visibility
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };
  
  // Format timestamp for conversation list
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      
      if (isToday(date)) {
        return format(date, 'h:mm a');
      } else if (isYesterday(date)) {
        return 'Yesterday';
      } else {
        return format(date, 'MM/dd/yyyy');
      }
    } catch (e) {
      return '';
    }
  };
  
  // Truncate message text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Render conversation item
  const renderConversationItem = ({ item, index }: { item: ChatConversation; index: number }) => {
    const isGroup = item.isGroup;
    let avatarSource: { uri: string } | null = null;
    let name = item.title;
    
    // Get avatar image
    if (isGroup) {
      avatarSource = item.image ? { uri: item.image } : null;
    } else if (item.participants.length > 0) {
      const participant = item.participants[0];
      avatarSource = participant.image ? { uri: participant.image } : null;
      name = participant.name;
    }
    
    // Get status indicator
    const hasUnread = item.unreadCount > 0;
    const isOnline = !isGroup && item.participants.length > 0 && item.participants[0].isOnline;
    
    return (
      <Animated.View
        entering={FadeIn.delay(50 * Math.min(index, 10)).duration(300)}
        exiting={FadeOut.duration(200)}
      >
        <Surface
          style={[
            styles.conversationItem,
            { backgroundColor: theme.colors.surface }
          ]}
          elevation={hasUnread ? 2 : 1}
        >
          <TouchableOpacity
            style={styles.conversationTouchable}
            onPress={() => onPressConversation(item.id)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Conversation with ${item.title}`}
            accessibilityHint="Double tap to open conversation"
          >
            <View style={styles.avatarContainer}>
              {avatarSource ? (
                <Image source={avatarSource} style={styles.avatar} />
              ) : (
                <View style={[
                  styles.defaultAvatar,
                  isGroup ? styles.groupAvatar : null,
                  { backgroundColor: getAvatarColor(name) }
                ]}>
                  {isGroup ? (
                    <MaterialIcons name="group" size={24} color="white" />
                  ) : (
                    <Text style={styles.avatarText}>
                      {name.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </View>
              )}
              {isOnline && <View style={[
                styles.onlineIndicator,
                { borderColor: theme.colors.surface }
              ]} />}
            </View>
            
            <View style={styles.conversationInfo}>
              <View style={styles.conversationHeader}>
                <Text 
                  style={[
                    styles.conversationTitle,
                    { color: theme.colors.onSurface },
                    hasUnread && [styles.unreadTitle, { color: theme.colors.onSurface }]
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text 
                  style={[
                    styles.timeText,
                    { color: theme.colors.onSurfaceVariant },
                    hasUnread && [styles.unreadTime, { color: theme.colors.primary }]
                  ]}
                >
                  {item.lastMessage && formatTime(item.lastMessage.timestamp)}
                </Text>
              </View>
              
              <View style={styles.messageContainer}>
                <Text 
                  style={[
                    styles.messageText,
                    { color: theme.colors.onSurfaceVariant },
                    hasUnread && [styles.unreadMessage, { color: theme.colors.onSurface }]
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessage && truncateText(item.lastMessage.content, 45)}
                </Text>
                
                {hasUnread && (
                  <Badge 
                    size={22}
                    style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}
                  >
                    {item.unreadCount}
                  </Badge>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Surface>
      </Animated.View>
    );
  };
  
  // Get a consistent color based on name for avatars
  const getAvatarColor = (name: string) => {
    const colors = [
      '#E57373', '#F06292', '#BA68C8', '#9575CD', 
      '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1',
      '#4DB6AC', '#81C784', '#AED581', '#DCE775'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Render empty state when there are no conversations
  const renderEmptyComponent = () => {
    if (loading) return null;
    
    return (
      <Animated.View 
        style={styles.emptyContainer}
        entering={FadeIn.duration(400)}
      >
        <MaterialIcons 
          name="chat-bubble-outline" 
          size={80}
          color={theme.colors.primary}
        />
        <Text style={[
          styles.emptyText,
          { color: theme.colors.onBackground }
        ]}>
          No conversations yet
        </Text>
        <Text style={[
          styles.emptySubText,
          { color: theme.colors.onSurfaceVariant }
        ]}>
          {isAdmin 
            ? "You'll see conversations with property managers here"
            : "You'll see conversations with administrators here"
          }
        </Text>
      </Animated.View>
    );
  };
  
  return (
    <Surface style={[
      styles.container,
      { backgroundColor: theme.colors.background }
    ]}>
      {headerComponent}
      
      <Animated.View style={searchBarAnimStyle}>
        <Searchbar
          placeholder="Search conversations..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[
            styles.searchBar,
            { backgroundColor: theme.colors.surfaceVariant }
          ]}
          iconColor={theme.colors.onSurfaceVariant}
          inputStyle={{ color: theme.colors.onSurface }}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />
      </Animated.View>
      
      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ItemSeparatorComponent={() => (
          <Divider style={{ 
            backgroundColor: theme.colors.surfaceVariant,
            marginHorizontal: 16
          }} />
        )}
        ListEmptyComponent={renderEmptyComponent}
      />
      
      {/* Search and New Chat FABs */}
      <FAB
        style={[
          styles.searchFab,
          { backgroundColor: theme.colors.surfaceVariant }
        ]}
        icon="magnify"
        color={theme.colors.primary}
        onPress={toggleSearch}
        small
        accessibilityLabel="Search conversations"
      />
      
      {onPressNewChat && (
        <FAB
          style={[
            styles.fab,
            { backgroundColor: theme.colors.primary }
          ]}
          icon="plus"
          color={theme.colors.onPrimary}
          onPress={onPressNewChat}
          accessibilityLabel="Start new conversation"
        />
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 8,
    elevation: 2,
  },
  list: {
    flexGrow: 1,
  },
  conversationItem: {
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    overflow: 'hidden'
  },
  conversationTouchable: {
    flexDirection: 'row',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupAvatar: {
    backgroundColor: '#1363DF',
  },
  avatarText: {
    fontSize: 20,
    color: 'white',
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
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    marginLeft: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    flex: 1,
  },
  unreadBadge: {
    marginLeft: 8,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  unreadTime: {
    fontWeight: '500',
  },
  unreadMessage: {
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  searchFab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    elevation: 2,
  },
});

export default ChatListContainer; 