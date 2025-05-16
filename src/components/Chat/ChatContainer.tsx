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
  Animated as RNAnimated,
  RefreshControl,
  Vibration,
  Dimensions
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../store/hooks';
import { ChatMessage, ChatConversation } from '../../navigation/types';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useTheme, Surface } from 'react-native-paper';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown
} from 'react-native-reanimated';

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
  const scrollButtonOpacity = useRef(new RNAnimated.Value(0)).current;
  const typingStatus = useRef(typingUsers.length > 0).current;
  
  // Animated styles
  const typingIndicatorStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(typingUsers.length > 0 ? 35 : 0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      opacity: withTiming(typingUsers.length > 0 ? 1 : 0, {
        duration: 250,
        easing: Easing.ease,
      }),
    };
  }, [typingUsers.length]);
  
  // Handle scroll events to show/hide scroll to bottom button
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const showButton = offsetY > 200;
    
    if (showButton !== showScrollButton) {
      setShowScrollButton(showButton);
      RNAnimated.timing(scrollButtonOpacity, {
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
    
    // Staggered animations based on index and direction
    return (
      <Animated.View 
        entering={FadeIn.delay(50 * Math.min(index, 10)).duration(300)}
        key={item.id}
      >
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
      </Animated.View>
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
        typingIndicatorStyle
      ]}>
        <Surface 
          style={[
            styles.typingContent,
            { backgroundColor: theme.colors.surfaceVariant }
          ]}
          elevation={1}
        >
          <MaterialCommunityIcons 
            name="message-text-outline" 
            size={16} 
            color={theme.colors.primary} 
          />
          <Text style={[
            styles.typingText,
            { color: theme.colors.onSurfaceVariant }
          ]}>
            {typingText}
          </Text>
        </Surface>
      </Animated.View>
    );
  };
  
  // Default empty component
  const DefaultEmptyComponent = () => {
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
        <Text 
          style={[
            styles.emptyText,
            { color: theme.colors.onSurface }
          ]}
          accessibilityRole="header"
        >
          No messages yet
        </Text>
        <Text 
          style={[
            styles.emptySubText,
            { color: theme.colors.onSurfaceVariant }
          ]}
        >
          Send a message to start the conversation
        </Text>
      </Animated.View>
    );
  };
  
  // Loading component
  const LoadingFooter = () => {
    if (!loading || refreshing || messages.length === 0) return null;
    
    return (
      <Animated.View 
        style={styles.footerLoader}
        entering={FadeIn.duration(300)}
      >
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={[
          styles.footerText,
          { color: theme.colors.onSurfaceVariant }
        ]}>
          Loading more messages...
        </Text>
      </Animated.View>
    );
  };
  
  // Main loading screen
  if (loading && messages.length === 0) {
    return (
      <Surface style={[
        styles.container,
        { backgroundColor: theme.colors.background }
      ]}>
        {headerComponent}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[
            styles.loadingText,
            { color: theme.colors.onBackground }
          ]}>
            Loading conversation...
          </Text>
        </View>
      </Surface>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Surface style={[
        styles.container,
        { backgroundColor: theme.colors.background }
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
            { color: theme.colors.onBackground }
          ]}>
            {error}
          </Text>
        </View>
      </Surface>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background }
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
      <RNAnimated.View 
        style={[
          styles.scrollButton,
          {
            opacity: scrollButtonOpacity,
            shadowColor: theme.colors.shadow || '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4
          }
        ]}
        pointerEvents={showScrollButton ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={[
            styles.scrollButtonInner,
            {
              backgroundColor: isDarkMode 
                ? theme.colors.surfaceVariant 
                : theme.colors.surfaceVariant
            }
          ]}
          onPress={scrollToBottom}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Scroll to bottom"
        >
          <MaterialIcons name="keyboard-arrow-down" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </RNAnimated.View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    fontStyle: 'italic',
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
  }
}); 