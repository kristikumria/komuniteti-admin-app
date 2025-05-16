import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StatusBar,
  Platform,
  Text,
} from 'react-native';
import { Searchbar, FAB, Surface, useTheme, IconButton, Avatar, Button, Divider } from 'react-native-paper';
import { 
  Search, 
  Plus, 
  MessageSquare,
  Settings,
  ChevronRight,
  Info,
  MoreVertical,
  Bell
} from 'lucide-react-native';
import { useNavigation, useIsFocused, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../../../store/hooks';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { ChatConversation } from '../../../navigation/types';
import { ConversationListItem } from '../../../components/Chat/ConversationListItem';
import { Header } from '../../../components/Header';
import ChatConversationScreen from './ChatConversationScreen';
import NewConversationScreen from './NewConversationScreen';
import { MOCK_CONVERSATIONS } from './mockData';
import { ElevationLevel } from '../../../theme';

// Define the props interface to make the component generic
export interface ChatScreenProps {
  userRole?: 'administrator' | 'business-manager';
  // Add tablet layout props
  onSelectConversation?: (conversationId: string) => void;
  onCreateNewConversation?: () => void;
  currentConversationId?: string | null;
}

/**
 * Modern responsive Chat screen that automatically adapts to different screen sizes
 * Provides a master-detail view on tablets and a stacked view on mobile devices
 */
const ChatScreen: React.FC<ChatScreenProps> = ({
  userRole = 'administrator',
  onSelectConversation,
  onCreateNewConversation,
  currentConversationId,
}) => {
  const { theme, commonStyles } = useThemedStyles();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const user = useAppSelector(state => state.auth.user);
  
  // Check screen dimensions for responsive layouts
  const { width, height } = Dimensions.get('window');
  const isTablet = width >= 768;
  
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isCreatingNewConversation, setIsCreatingNewConversation] = useState(false);
  
  // Check role-based permission
  const hasPermission = user?.role === 'administrator' || user?.role === 'business_manager';
  
  // If user doesn't have permission, show permission denied view
  if (!hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Header title="Messages" />
        <View style={[styles.centeredContainer, { padding: 16 }]}>
          <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 16 }}>
            You don't have permission to access this feature
          </Text>
        </View>
      </View>
    );
  }
  
  // Handle route parameters and props
  useEffect(() => {
    // Use currentConversationId prop if provided (for tablet layout)
    if (currentConversationId !== undefined && currentConversationId !== selectedConversationId) {
      setSelectedConversationId(currentConversationId);
      setIsCreatingNewConversation(false);
    } 
    // Otherwise use route params
    else if (route.params?.conversationId) {
      setSelectedConversationId(route.params.conversationId);
      setIsCreatingNewConversation(false);
    }
  }, [route.params, currentConversationId]);
  
  // Load conversations
  useEffect(() => {
    if (isFocused) {
      loadConversations();
    }
  }, [isFocused]);

  const loadConversations = async () => {
    try {
      // In a real app, this would be an API call
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load mock data
      setConversations(MOCK_CONVERSATIONS);
      setFilteredConversations(MOCK_CONVERSATIONS);
    } catch (error) {
      console.error('Error loading conversations', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const filterConversations = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = conversations.filter(
      conversation =>
        conversation.title.toLowerCase().includes(query) ||
        (conversation.lastMessage &&
          conversation.lastMessage.content.toLowerCase().includes(query)) ||
        conversation.participants.some(participant =>
          participant.name.toLowerCase().includes(query)
        )
    );

    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  // Update filtered conversations when search query changes
  useEffect(() => {
    filterConversations();
  }, [searchQuery, conversations, filterConversations]);

  // Navigation handlers
  const handleGoToConversation = (conversationId: string) => {
    if (onSelectConversation) {
      // Use the callback for tablet layout
      onSelectConversation(conversationId);
    } else if (isTablet) {
      setSelectedConversationId(conversationId);
      setIsCreatingNewConversation(false);
    } else {
      // @ts-ignore
      navigation.navigate('ChatConversation', { conversationId });
    }
  };

  const handleCreateNewConversation = () => {
    if (onCreateNewConversation) {
      // Use the callback for tablet layout
      onCreateNewConversation();
    } else if (isTablet) {
      setSelectedConversationId(null);
      setIsCreatingNewConversation(true);
    } else {
      // @ts-ignore
      navigation.navigate('NewConversation');
    }
  };
  
  const handleBackToList = () => {
    setSelectedConversationId(null);
    setIsCreatingNewConversation(false);
  };

  // Search functionality
  const toggleSearch = useCallback(() => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  }, [showSearch]);

  // Render the empty state
  const renderEmptyState = () => {
    if (loading) return null;
    
    return (
      <View style={[styles.centeredContainer]}>
        <Surface style={[styles.emptyStateContent, { backgroundColor: theme.colors.surfaceVariant }]}>
          <MessageSquare size={64} color={theme.colors.onSurfaceVariant} opacity={0.5} />
          <Text
            style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
          >
            {searchQuery
              ? 'No conversations found matching your search'
              : 'No conversations yet'}
          </Text>
          <Text
            style={[styles.emptySubText, { color: theme.colors.onSurfaceVariant }]}
          >
            {searchQuery
              ? 'Try a different search term'
              : 'Start a new conversation by tapping the + button'}
          </Text>
          
          {!searchQuery && (
            <Button 
              mode="contained" 
              onPress={handleCreateNewConversation}
              style={styles.startChatButton}
              icon={({size, color}) => <Plus size={size} color={color} />}
            >
              Start a new chat
            </Button>
          )}
        </Surface>
      </View>
    );
  };
  
  // Render the tablet empty state (when no conversation is selected)
  const renderTabletEmptyState = () => {
    return (
      <View style={[styles.centeredContainer, {backgroundColor: theme.colors.background}]}>
        <Surface 
          elevation={ElevationLevel.Level2} 
          style={[styles.emptyStateContent, { backgroundColor: theme.colors.surfaceVariant }]}
        >
          <View style={styles.emptyStateIcon}>
            <Surface 
              elevation={ElevationLevel.Level1} 
              style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}
            >
              <MessageSquare size={40} color={theme.colors.primary} />
            </Surface>
          </View>
          
          <Text 
            style={[styles.emptyStateText, { color: theme.colors.onSurfaceVariant }]}
          >
            Select a conversation
          </Text>
          <Text 
            style={[styles.emptyStateSubText, { color: theme.colors.onSurfaceVariant }]}
          >
            Choose a conversation from the list or start a new one
          </Text>
        </Surface>
      </View>
    );
  };
  
  // Render the conversation list
  const renderConversationList = () => {
    return (
      <View style={styles.container}>
        {showSearch ? (
          <Header
            title="Search Conversations"
            showBackButton={true}
            onBackPress={toggleSearch}
            rightAction={
              <Searchbar
                placeholder="Search conversations..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={[styles.headerSearchBar, { backgroundColor: theme.colors.surfaceVariant }]}
                iconColor={theme.colors.onSurfaceVariant}
                inputStyle={{ color: theme.colors.onSurface }}
                placeholderTextColor={theme.colors.onSurfaceVariant}
                autoFocus
              />
            }
          />
        ) : (
          <Header
            title="Messages"
            subtitle={`${conversations.length} conversations`}
            showBackButton={false}
            rightAction={
              <IconButton
                icon={({size, color}) => <Search size={size} color={color} />}
                iconColor={theme.colors.onSurfaceVariant}
                size={24}
                onPress={toggleSearch}
              />
            }
          />
        )}
        
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ConversationListItem
                conversation={item}
                onPress={handleGoToConversation}
                isSelected={isTablet && selectedConversationId === item.id}
              />
            )}
            contentContainerStyle={[
              filteredConversations.length === 0 && styles.emptyList,
              { paddingBottom: 80 } // Space for FAB
            ]}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            ItemSeparatorComponent={() => (
              <Divider style={[styles.divider, { backgroundColor: theme.colors.surfaceVariant }]} />
            )}
          />
        )}
        
        <FAB
          icon={({size, color}) => <Plus size={size} color={color} />}
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreateNewConversation}
          color={theme.colors.onPrimary}
        />
      </View>
    );
  };
  
  // Mobile view (stacked)
  if (!isTablet) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar 
          barStyle={theme.dark ? "light-content" : "dark-content"} 
          backgroundColor={theme.colors.surface} 
          translucent={false}
        />
        {renderConversationList()}
      </View>
    );
  }
  
  // Tablet view (side-by-side)
  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle={theme.dark ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.surface}
        translucent={false}
      />
      
      <View style={[styles.splitContainer, { backgroundColor: theme.colors.background }]}>
        {/* Left sidebar - conversation list */}
        <Surface 
          style={styles.sidebarContainer} 
          elevation={ElevationLevel.Level1}
        >
          {renderConversationList()}
        </Surface>
        
        {/* Right content - conversation or new conversation */}
        <Surface 
          style={styles.contentContainer}
          elevation={ElevationLevel.Level0}
        >
          {selectedConversationId ? (
            <ChatConversationScreen
              conversationId={selectedConversationId}
              userRole={userRole}
              onGoBack={handleBackToList}
            />
          ) : isCreatingNewConversation ? (
            <NewConversationScreen
              onConversationCreated={handleGoToConversation}
              onCancel={handleBackToList}
            />
          ) : (
            renderTabletEmptyState()
          )}
        </Surface>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: '35%',
    maxWidth: 400,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.08)',
  },
  contentContainer: {
    flex: 1,
  },
  headerSearchBar: {
    flex: 1,
    height: 40,
    marginRight: 8,
    borderRadius: 8,
    elevation: 0,
    borderColor: 'rgba(0,0,0,0.12)',
    borderWidth: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyList: {
    flexGrow: 1,
  },
  loader: {
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 16,
  },
  startChatButton: {
    marginTop: 24,
    borderRadius: 8,
  },
  emptyStateContent: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIcon: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  divider: {
    height: 1,
  },
});

export default ChatScreen; 