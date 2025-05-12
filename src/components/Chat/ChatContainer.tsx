import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Vibration,
  Dimensions
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../store/hooks';
import { ChatMessage, ChatConversation } from '../../navigation/types';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useTheme } from 'react-native-paper';

interface ChatContainerProps {
  messages: ChatMessage[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onSendMessage: (text: string, replyToId?: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onTypingStatusChange?: (isTyping: boolean) => void;
  typingUsers?: string[];
  headerComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  userId: string;
  sending?: boolean;
  conversation?: ChatConversation | null;
  onLoadMore?: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  loading,
  refreshing,
  error,
  onRefresh,
  onSendMessage,
  onDeleteMessage,
  onTypingStatusChange,
  typingUsers = [],
  headerComponent,
  emptyComponent,
  userId,
  sending = false,
  conversation,
  onLoadMore
}) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings?.darkMode) ?? false;
  const flatListRef = useRef<FlatList>(null);
  const windowDimensions = Dimensions.get('window');
  
  // UI state
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    senderName: string;
    content: string;
  } | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Animation values
  const scrollButtonOpacity = useRef(new Animated.Value(0)).current;
  const typingIndicatorHeight = useRef(new Animated.Value(0)).current;
  
  // Handle scroll events to show/hide scroll to bottom button
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const showButton = offsetY > 200;
    
    if (showButton !== showScrollButton) {
      setShowScrollButton(showButton);
      Animated.timing(scrollButtonOpacity, {
        toValue: showButton ? 1 : 0,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  };
  
  // Scroll to bottom
  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      Vibration.vibrate(10);
    }
  };
  
  // Handle typing indicator animation
  useEffect(() => {
    Animated.timing(typingIndicatorHeight, {
      toValue: typingUsers.length > 0 ? 35 : 0,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [typingUsers, typingIndicatorHeight]);
  
  // Handle replying to a message
  const handleReply = (message: ChatMessage) => {
    setReplyingTo({
      id: message.id,
      senderName: message.senderName,
      content: message.content,
    });
    
    Vibration.vibrate(10);
  };
  
  // Cancel reply
  const handleCancelReply = () => {
    setReplyingTo(null);
  };
  
  // Get message grouping for styling
  const getMessageGrouping = (index: number) => {
    if (messages.length === 0) return { previousSameSender: false, nextSameSender: false };
    
    const currentMessage = messages[index];
    const previousMessage = index < messages.length - 1 ? messages[index + 1] : null;
    const nextMessage = index > 0 ? messages[index - 1] : null;
    
    const previousSameSender = !!previousMessage && previousMessage.senderId === currentMessage.senderId;
    const nextSameSender = !!nextMessage && nextMessage.senderId === currentMessage.senderId;
    
    return { previousSameSender, nextSameSender };
  };
  
  // Send message wrapper
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    onSendMessage(text, replyingTo?.id);
    setReplyingTo(null);
    
    // Scroll to bottom after sending
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };
  
  // Render a message
  const renderMessageItem = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isFromCurrentUser = item.senderId === userId;
    const showAvatar = !isFromCurrentUser && (!index || messages[index - 1]?.senderId !== item.senderId);
    const { previousSameSender, nextSameSender } = getMessageGrouping(index);
    
    // Determine if we should show date header
    const showDate = index === messages.length - 1 || 
      new Date(messages[index].timestamp).toDateString() !== 
      new Date(messages[index + 1]?.timestamp).toDateString();
    
    return (
      <MessageBubble
        message={item}
        isFromCurrentUser={isFromCurrentUser}
        showAvatar={showAvatar}
        onReply={handleReply}
        onDelete={onDeleteMessage}
        showDate={showDate}
        isDarkMode={isDarkMode}
        previousMessageSameSender={previousSameSender}
        nextMessageSameSender={nextSameSender}
      />
    );
  };
  
  // Render typing indicator
  const renderTypingIndicator = () => {
    if (typingUsers.length === 0) return null;
    
    const typingText = typingUsers.length === 1
      ? `${typingUsers[0]} is typing...`
      : `${typingUsers.length} people are typing...`;
      
    return (
      <Animated.View style={[
        styles.typingContainer,
        { height: typingIndicatorHeight }
      ]}>
        <View style={styles.typingContent}>
          <MaterialCommunityIcons 
            name="message-text-outline" 
            size={16} 
            color={theme.colors.primary} 
          />
          <Text style={styles.typingText}>{typingText}</Text>
        </View>
      </Animated.View>
    );
  };
  
  // Default empty component
  const DefaultEmptyComponent = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons
          name="chat-bubble-outline"
          size={80}
          color={theme.colors.primary}
        />
        <Text 
          style={[
            styles.emptyText,
            { color: isDarkMode ? '#ffffff' : '#212121' }
          ]}
        >
          No messages yet
        </Text>
        <Text 
          style={[
            styles.emptySubText,
            { color: isDarkMode ? '#cccccc' : '#757575' }
          ]}
        >
          Send a message to start the conversation
        </Text>
      </View>
    );
  };
  
  // Loading component
  const LoadingFooter = () => {
    if (!loading || refreshing || messages.length === 0) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={styles.footerText}>
          Loading more messages...
        </Text>
      </View>
    );
  };
  
  // Main loading screen
  if (loading && messages.length === 0) {
    return (
      <View style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
      ]}>
        {headerComponent}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[
            styles.loadingText,
            { color: isDarkMode ? '#ffffff' : '#212121' }
          ]}>
            Loading conversation...
          </Text>
        </View>
      </View>
    );
  }
  
  // Error state
  if (error) {
    return (
      <View style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
      ]}>
        {headerComponent}
        <View style={styles.errorContainer}>
          <MaterialIcons 
            name="error-outline" 
            size={80} 
            color={theme.colors.error} 
          />
          <Text style={[
            styles.errorText,
            { color: isDarkMode ? '#ffffff' : '#212121' }
          ]}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {headerComponent}
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={[
          styles.messagesList,
          messages.length === 0 && styles.messagesListEmpty
        ]}
        inverted={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={() => (
          <>
            {emptyComponent || <DefaultEmptyComponent />}
          </>
        )}
        ListFooterComponent={<LoadingFooter />}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            progressViewOffset={20}
          />
        }
        removeClippedSubviews={Platform.OS === 'android'}
      />
      
      {renderTypingIndicator()}
      
      <MessageInput
        onSendMessage={handleSendMessage}
        sending={sending}
        replyingTo={replyingTo}
        onCancelReply={handleCancelReply}
        isDarkMode={isDarkMode}
        onTypingStatusChange={onTypingStatusChange}
        placeholder="Type a message..."
      />
      
      {/* Scroll to bottom button */}
      <Animated.View 
        style={[
          styles.scrollButton,
          { 
            opacity: scrollButtonOpacity,
            backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'
          }
        ]}
        pointerEvents={showScrollButton ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={styles.scrollButtonInner}
          onPress={scrollToBottom}
          activeOpacity={0.7}
        >
          <MaterialIcons name="keyboard-arrow-down" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  messagesListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    marginHorizontal: 32,
  },
  typingContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  typingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  scrollButton: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  scrollButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  footerLoader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#757575',
  }
}); 