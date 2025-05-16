import React, { useState, useEffect, useRef, useCallback, useMemo, ForwardedRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  RefreshControl,
  StatusBar,
  Dimensions,
  AccessibilityInfo,
  Pressable,
  Vibration,
  Alert
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme, Badge, IconButton, Portal, Dialog, Button, Menu, ProgressBar, Avatar, Surface } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MessageCircle, MoreVertical, ChevronLeft, ArrowLeft, Info } from 'lucide-react-native';
import { MessageBubble } from '../../../components/Chat/MessageBubble';
import { MessageInput } from '../../../components/Chat/MessageInput';
import { ChatMessage, ChatConversation, ChatParticipant, ChatAttachment } from '../../../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDistanceToNow } from 'date-fns';
import NetInfo from '@react-native-community/netinfo';
import { useAppSelector } from '../../../store/hooks';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { ScreenContainer } from '../../../components/ScreenContainer';
import { Header } from '../../../components/Header';
import socketService from '../../../services/socketService';
import chatService from '../../../services/chatService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import * as FileSystem from 'expo-file-system';
import { useKeyboardNavigation } from '../../../hooks/useKeyboardNavigation';
import { useAccessibility } from '../../../components/AccessibilityProvider';
import { MOCK_CONVERSATIONS_MAP, MOCK_MESSAGES } from './mockData';
import { 
  MessageStatus, 
  ConnectionState, 
  MessageContextMenu, 
  UploadProgressInfo,
  MessageState,
  PendingMessage
} from './types';

// Mock data for prototyping
// DELETE THE MOCK_CONVERSATIONS and MOCK_MESSAGES objects that are already defined in mockData.ts

// Mock current user (Business Manager)
const CURRENT_USER = {
  id: 'manager',
  name: 'Elena Koci',
  role: 'manager',
};

// Configuration constants
const PAGINATION_LIMIT = 15; // Number of messages to load at once
const MESSAGE_LOAD_DELAY = 300; // Mock delay for message loading (ms)
const TYPING_TIMEOUT = 5000; // Time typing indicator displays (ms)
const HAPTIC_FEEDBACK_ENABLED = true; // Enable haptic feedback

// Export the props interface
export interface ChatConversationScreenProps {
  conversationId?: string;
  userRole?: 'administrator' | 'business-manager';
  onGoBack?: () => void;
}

interface AccessibilityFocusableMessageListProps {
  messages: ChatMessage[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onLoadMore: () => void;
  onScroll: (event: any) => void;
  flatListRef: React.RefObject<FlatList<ChatMessage>>;
  renderEmptyComponent: () => React.ReactNode;
  renderFooter: () => React.ReactNode;
  onMessageReply: (message: ChatMessage) => void;
  onMessageDelete: (messageId: string) => void;
  onLongPress: (message: ChatMessage, event: any) => void;
  uploadProgress: any;
  retryFailedMessage: (messageId: string) => void;
  userId: string;
  isDarkMode: boolean;
}

const AccessibilityFocusableMessageList: React.FC<AccessibilityFocusableMessageListProps> = ({
  messages,
  loading,
  refreshing,
  error,
  onRefresh,
  onLoadMore,
  onScroll,
  flatListRef,
  renderEmptyComponent,
  renderFooter,
  onMessageReply,
  onMessageDelete,
  onLongPress,
  uploadProgress,
  retryFailedMessage,
  userId,
  isDarkMode
}) => {
  const { settings } = useAccessibility();
  const { theme } = useThemedStyles();
  
  // Set up keyboard navigation if screen reader is enabled
  const {
    focusedIndex,
    setItemRef,
  } = useKeyboardNavigation(
    messages.length,
    0,
    (index) => {
      // When an item is selected via keyboard, reply to it
      if (messages[index]) {
        onMessageReply(messages[index]);
      }
    }
  );

  // Check if a message should show its date
  const shouldShowDate = (message: ChatMessage, index: number): boolean => {
    if (index === messages.length - 1) {
      return true; // Always show date for last message (first when inverted)
    }
    
    if (index < messages.length - 1) {
      const currentDate = new Date(message.timestamp).setHours(0, 0, 0, 0);
      const nextDate = new Date(messages[index + 1].timestamp).setHours(0, 0, 0, 0);
      
      return currentDate !== nextDate; // Show date if it's different from the next message
    }
    
    return false;
  };

  // Custom message renderer with accessibility enhancements
  const renderItem = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isFromCurrentUser = item.senderId === userId;
    const isPreviousMessageFromSameSender = 
      index < messages.length - 1 && 
      messages[index + 1].senderId === item.senderId;
    const isNextMessageFromSameSender = 
      index > 0 && 
      messages[index - 1].senderId === item.senderId;
    
    const uploadProgressInfo = uploadProgress && 
      uploadProgress.messageId === item.id ? 
      uploadProgress : null;
    
    return (
      <View accessible={false}>
        <MessageBubble
          message={item}
          isFromCurrentUser={isFromCurrentUser}
          showAvatar={!isFromCurrentUser && !isNextMessageFromSameSender}
          onReply={onMessageReply}
          onDelete={onMessageDelete}
          previousMessageSameSender={isPreviousMessageFromSameSender}
          nextMessageSameSender={isNextMessageFromSameSender}
          showDate={shouldShowDate(item, index)}
          isDarkMode={isDarkMode}
          isFocused={settings.screenReaderEnabled && focusedIndex === index}
          onFocus={() => {
            if (settings.screenReaderEnabled && flatListRef.current) {
              flatListRef.current.scrollToIndex({
                index,
                animated: !settings.reduceMotion,
                viewPosition: 0.5
              });
            }
          }}
          focusRef={(ref) => settings.screenReaderEnabled && setItemRef(index, ref)}
        />
        
        {uploadProgressInfo && uploadProgressInfo.isUploading && (
          <View style={styles.uploadProgressIndicator}>
            <ProgressBar 
              progress={uploadProgressInfo.progress / 100}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text style={styles.uploadProgressText}>
              {Math.round(uploadProgressInfo.progress)}%
            </Text>
          </View>
        )}
        
        {item.status === 'failed' && (
          <View style={styles.messageErrorContainer}>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => retryFailedMessage(item.id)}
              accessible={true}
              accessibilityLabel="Retry sending this message"
              accessibilityRole="button"
            >
              <MaterialIcons name="refresh" size={16} color="white" />
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef as React.RefObject<FlatList<ChatMessage>>}
      data={messages}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.messagesList}
      inverted={true}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      onScroll={onScroll}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
      // Make the list accessible
      accessibilityRole="list"
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    />
  );
};

const ChatConversationScreen: React.FC<ChatConversationScreenProps> = ({ 
  conversationId: propConversationId,
  userRole = 'administrator',
  onGoBack
}) => {
  const { theme, commonStyles } = useThemedStyles();
  const navigation = useNavigation();
  const route = useRoute<any>(); // Using any for route.params to fix type issue
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);
  const inputRef = useRef<any>(null); // Add missing inputRef
  const user = useAppSelector(state => state.auth.user);
  
  // Add isDarkMode property derived from theme
  const isDarkMode = theme.dark;
  
  // Check role-based permission
  const hasPermission = user?.role === 'administrator' || user?.role === 'business_manager';
  
  // Use conversationId from props or route params
  const conversationId = propConversationId || (route.params?.conversationId);
  
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  
  // Improved message state management
  const [messageState, setMessageState] = useState<MessageState>({
    messages: [],
    loading: true,
    refreshing: false,
    hasMore: true,
    page: 1,
    error: null
  });
  
  // UI state management
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    senderName: string;
    content: string;
    senderId?: string;
  } | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnected: true,
    isInternetReachable: true
  });
  const [contextMenu, setContextMenu] = useState<MessageContextMenu>({
    visible: false,
    messageId: null,
    x: 0,
    y: 0
  });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Add missing showDeleteConfirmation state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  // Animation values
  const scrollButtonOpacity = useRef(new Animated.Value(0)).current;
  const connectionBannerHeight = useRef(new Animated.Value(0)).current;
  const typingIndicatorHeight = useRef(new Animated.Value(0)).current;
  
  // Queue for messages when offline
  const [messageQueue, setMessageQueue] = useState<{text: string, replyTo?: any}[]>([]);
  
  // Add these new states with correct typing
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressInfo | null>(null);
  
  // Update the handleGoBack function
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigation.goBack();
    }
  };
  
  // Add a new function to handle pressing the info button
  const handleInfoPress = () => {
    // This would typically navigate to a conversation details screen
    // or open a modal with participant information
    Alert.alert(
      `${conversation?.title || 'Conversation'} Info`,
      `${conversation?.participants.length || 0} participants`
    );
  };
  
  // Replace the renderHeader function with proper Header usage
  const renderHeader = () => {
    if (!conversation) return (
      <Header
        title="Loading..."
        showBackButton={true}
        onBackPress={handleGoBack}
      />
    );
    
    // Determine online status for subtitle
    const onlineParticipants = conversation.participants.filter(p => p.isOnline).length;
    let subtitle = '';
    
    if (conversation.isGroup) {
      subtitle = onlineParticipants > 0 
        ? `${onlineParticipants} ${onlineParticipants === 1 ? 'person' : 'people'} online` 
        : `${conversation.participants.length} participants`;
    } else {
      const participant = conversation.participants[0];
      subtitle = participant?.isOnline ? 'Online' : participant?.lastSeen 
        ? `Last seen ${formatDistanceToNow(new Date(participant.lastSeen), { addSuffix: true })}`
        : 'Offline';
    }
    
    return (
      <Header
        title={conversation.title}
        subtitle={subtitle}
        showBackButton={true}
        onBackPress={handleGoBack}
        rightAction={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton
              icon={({ size, color }) => <Info size={size} color={color} />}
              iconColor={theme.colors.onSurfaceVariant}
              size={24}
              onPress={handleInfoPress}
            />
          </View>
        }
      />
    );
  };
  
  // Check if screen reader is enabled
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(
      screenReaderEnabled => {
        setScreenReaderEnabled(screenReaderEnabled);
      }
    );
    
    const listener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      screenReaderEnabled => {
        setScreenReaderEnabled(screenReaderEnabled);
      }
    );

    return () => {
      listener.remove();
    };
  }, []);
  
  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const newConnectionState = {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable
      };
      setConnectionState(newConnectionState);
      
      // If connection is restored, attempt to send queued messages
      if (state.isConnected && messageQueue.length > 0) {
        [...messageQueue].forEach(queuedMessage => {
          handleSendMessage(queuedMessage.text, queuedMessage.replyTo);
        });
        setMessageQueue([]);
      }
      
      // Animate connection banner
      Animated.timing(connectionBannerHeight, {
        toValue: state.isConnected ? 0 : 40,
        duration: 300,
        useNativeDriver: false
      }).start();
    });

    return () => {
      unsubscribe();
    };
  }, [messageQueue]);

  // Load conversation data
  useEffect(() => {
    // Initialize socket connection
    const initSocket = async () => {
      if (!socketService.isConnected()) {
        await socketService.connect();
      }
    };

    initSocket();
    loadConversation();
  }, [conversationId]);
  
  // Log conversation ID and ensure it's properly connected
  useEffect(() => {
    console.log('ChatConversationScreen: connecting to conversation', conversationId);
    if (!conversationId) {
      console.warn('ChatConversationScreen: No conversation ID provided');
    }
  }, [conversationId]);
  
  // Focus effect to mark messages as read when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (messageState.messages.length > 0) {
        markMessagesAsRead();
      }
      
      return () => {
        // Cleanup
      };
    }, [])
  );
  
  // Load initial conversation data
  const loadConversation = () => {
    setMessageState(prev => ({ ...prev, loading: true, error: null }));
    
    // Simulate API call with pagination
    setTimeout(() => {
      const foundConversation = MOCK_CONVERSATIONS_MAP[conversationId];
      if (foundConversation) {
        setConversation(foundConversation);
        
        // Get initial page of messages with pagination
        const allMessages = MOCK_MESSAGES[conversationId] || [];
        const paginatedMessages = allMessages.slice(0, PAGINATION_LIMIT);
        
        setMessageState({
          messages: paginatedMessages,
          loading: false,
          refreshing: false,
          hasMore: allMessages.length > PAGINATION_LIMIT,
          page: 1,
          error: null
        });
      } else {
        setMessageState(prev => ({
          ...prev,
          loading: false,
          error: 'Conversation not found'
        }));
      }
    }, MESSAGE_LOAD_DELAY);
  };
  
  // Load more messages (pagination)
  const loadMoreMessages = () => {
    if (!messageState.hasMore || messageState.loading) return;
    
    setMessageState(prev => ({ ...prev, loading: true }));
    
    setTimeout(() => {
      const allMessages = MOCK_MESSAGES[conversationId] || [];
      const nextPage = messageState.page + 1;
      const startIdx = (nextPage - 1) * PAGINATION_LIMIT;
      const endIdx = startIdx + PAGINATION_LIMIT;
      const newMessages = allMessages.slice(startIdx, endIdx);
      
      setMessageState(prev => ({
        messages: [...prev.messages, ...newMessages],
        loading: false,
        refreshing: false,
        hasMore: endIdx < allMessages.length,
        page: nextPage,
        error: null
      }));
    }, MESSAGE_LOAD_DELAY);
  };
  
  // Mark messages as read
  const markMessagesAsRead = () => {
    // In real app, would call API to mark messages as read
    setMessageState(prev => {
      // Check if there are any unread messages that need updating
      const hasUnreadMessages = prev.messages.some(
        msg => msg.senderId !== CURRENT_USER.id && msg.status !== 'read'
      );
      
      // Only update state if there are messages to mark as read
      if (!hasUnreadMessages) return prev;
      
      return {
        ...prev,
        messages: prev.messages.map(msg => 
          msg.senderId !== CURRENT_USER.id && msg.status !== 'read'
            ? { ...msg, status: 'read', readBy: [...(msg.readBy || []), CURRENT_USER.id] }
            : msg
        )
      };
    });
  };

  // Refresh messages
  const handleRefresh = () => {
    setMessageState(prev => ({ ...prev, refreshing: true }));
    loadConversation();
  };
  
  // Handle scroll events
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
    if (flatListRef.current && messageState.messages.length > 0) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      if (HAPTIC_FEEDBACK_ENABLED) {
        Vibration.vibrate(100);
      }
    }
  };
  
  // Enhanced handleSendMessage with improved typing
  const handleSendMessage = (text: string, attachment?: any) => {
    if (!text.trim() && !attachment) return;
    
    try {
      // Generate a new message ID
      const newMessageId = uuidv4();
      
      // Create the message with proper typing
      const newMessage: ChatMessage = {
        id: newMessageId,
        conversationId: conversationId || '',
        senderId: CURRENT_USER.id,
        senderName: CURRENT_USER.name,
        senderRole: CURRENT_USER.role,
        content: text,
        timestamp: new Date().toISOString(),
        readBy: [CURRENT_USER.id],
        status: 'sending',
        attachments: [],
        replyTo: replyingTo ? {
          id: replyingTo.id,
          senderId: replyingTo.senderId || '',
          senderName: replyingTo.senderName,
          content: replyingTo.content,
        } : undefined,
      };
      
      // Cancel reply mode
      if (replyingTo) {
        setReplyingTo(null);
      }
      
      // Add message to state immediately for better UX
      setMessageState(prev => ({
        ...prev,
        messages: [newMessage, ...prev.messages],
      }));
      
      // Handle attachments
      if (attachment) {
        setUploadProgress({
          messageId: newMessageId,
          progress: 0,
          isUploading: true,
        });
        
        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 5;
          if (progress >= 100) {
            clearInterval(progressInterval);
            setUploadProgress({
              messageId: newMessageId,
              progress: 100,
              isUploading: false,
            });
            
            // Update message status to delivered
            setTimeout(() => {
              setMessageState(prev => ({
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id === newMessageId ? { ...msg, status: 'delivered' } : msg
                ),
              }));
              
              // Later, update to read
              setTimeout(() => {
                setMessageState(prev => ({
                  ...prev,
                  messages: prev.messages.map(msg => 
                    msg.id === newMessageId ? { ...msg, status: 'read' } : msg
                  ),
                }));
              }, 2000);
            }, 500);
          } else {
            setUploadProgress({
              messageId: newMessageId,
              progress,
              isUploading: true,
            });
          }
        }, 200);
      } else {
        // For text-only messages, update status quickly
        setTimeout(() => {
          setMessageState(prev => ({
            ...prev,
            messages: prev.messages.map(msg => 
              msg.id === newMessageId ? { ...msg, status: 'delivered' } : msg
            ),
          }));
          
          setTimeout(() => {
            setMessageState(prev => ({
              ...prev,
              messages: prev.messages.map(msg => 
                msg.id === newMessageId ? { ...msg, status: 'read' } : msg
              ),
            }));
          }, 1000);
        }, 500);
      }
      
      // In offline mode, queue message
      if (!connectionState.isConnected) {
        const pendingMessage: PendingMessage = {
          ...JSON.parse(JSON.stringify(newMessage)) as ChatMessage, // Deep copy to ensure typing works
          localId: newMessageId,
          sentAt: Date.now()
        };
        setPendingMessages(prev => [...prev, pendingMessage]);
        savePendingMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Simulate typing indicator (in real app would use WebSockets)
  const simulateTypingIndicator = () => {
    // Simple mock to show typing indicator from a random participant
    if (conversation && conversation.participants.length > 0) {
      const randomParticipant = conversation.participants[
        Math.floor(Math.random() * conversation.participants.length)
      ];
      
      setTypingUsers([randomParticipant.name]);
      
      // Animate typing indicator
      Animated.timing(typingIndicatorHeight, {
        toValue: 35,
        duration: 300,
        useNativeDriver: false
      }).start();
      
      // Clear typing indicator after timeout
      setTimeout(() => {
        setTypingUsers([]);
        Animated.timing(typingIndicatorHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false
        }).start();
      }, TYPING_TIMEOUT);
    }
  };
  
  // Focus the input when replying to a message
  useEffect(() => {
    if (replyingTo && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current && inputRef.current.focus) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [replyingTo]);
  
  // Handle replying to a message
  const handleReply = (message: ChatMessage) => {
    setReplyingTo({
      id: message.id,
      senderName: message.senderName,
      content: message.content,
    });
    
    if (HAPTIC_FEEDBACK_ENABLED) {
      Vibration.vibrate(100);
    }
  };
  
  // Cancel reply
  const handleCancelReply = () => {
    setReplyingTo(null);
    
    if (HAPTIC_FEEDBACK_ENABLED) {
      Vibration.vibrate(100);
    }
  };
  
  // Long press on message to show context menu
  const handleLongPressMessage = (message: ChatMessage, event: any) => {
    // Get the touch position for context menu
    const { pageX, pageY } = event.nativeEvent;
    
    setContextMenu({
      visible: true,
      messageId: message.id,
      x: pageX,
      y: pageY
    });
    
    if (HAPTIC_FEEDBACK_ENABLED) {
      Vibration.vibrate(100);
    }
  };
  
  // Close context menu
  const handleCloseContextMenu = () => {
    setContextMenu({
      visible: false,
      messageId: null,
      x: 0,
      y: 0
    });
  };
  
  // Show delete confirmation dialog
  const handleShowDeleteConfirmation = (messageId: string) => {
    handleCloseContextMenu();
    setConfirmDelete(messageId);
  };
  
  // Handle delete message
  const handleDeleteMessage = (messageId: string) => {
    setMessageState(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => msg.id !== messageId)
    }));
    
    setConfirmDelete(null);
    
    if (HAPTIC_FEEDBACK_ENABLED) {
      Vibration.vibrate(100);
    }
  };
  
  // Handle attachment selection
  const handleAttachmentSelect = (attachment: {
    type: string;
    id?: string;
    url?: string;
    name?: string;
    size?: number;
    mimeType?: string;
    attachments?: Array<{
      id: string;
      type: 'image' | 'document' | 'location' | 'contact' | 'voice';
      url: string;
      name: string;
      size?: number;
      mimeType?: string;
    }>;
  }) => {
    // If no connection, store for later
    if (!connectionState.isConnected) {
      Alert.alert(
        'No Connection',
        'Your message will be sent when you reconnect.',
        [{ text: 'OK' }]
      );
    }
    
    // Generate a placeholder message ID
    const messageId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create empty content or appropriate text based on attachment type
    let content = '';
    if (attachment.type === 'document') {
      content = `📄 ${attachment.name || 'Document'}`;
    } else if (attachment.type === 'location') {
      content = '📍 Shared a location';
    } else if (attachment.type === 'multiple_images') {
      content = '📷 Shared multiple photos';
    }
    
    // Create temporary message
    const newMessage: ChatMessage = {
      id: messageId,
      conversationId: conversationId || '',
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      senderRole: CURRENT_USER.role as any,
      content: content,
      timestamp: new Date().toISOString(),
      readBy: [CURRENT_USER.id],
      status: 'sending',
      attachments: attachment.type === 'multiple_images' && attachment.attachments
        ? attachment.attachments
        : attachment.type !== 'multiple_images' && attachment.url
          ? [{
              id: attachment.id || `att-${Date.now()}`,
              type: attachment.type as 'image' | 'document' | 'location' | 'contact' | 'voice',
              url: attachment.url,
              name: attachment.name || 'Attachment',
              size: attachment.size,
              mimeType: attachment.mimeType
            }]
          : []
    };
    
    // If replying to a message, add that information
    if (replyingTo) {
      newMessage.replyTo = {
        id: replyingTo.id,
        senderId: replyingTo.senderId || '',
        senderName: replyingTo.senderName,
        content: replyingTo.content
      };
      setReplyingTo(null);
    }
    
    // Add message to UI immediately
    setMessageState(prev => ({
      ...prev,
      messages: [newMessage, ...prev.messages]
    }));
    
    scrollToBottom();
    
    // Handle file upload with progress
    if (attachment.type === 'multiple_images' && attachment.attachments) {
      handleMultipleImagesUpload(newMessage, attachment.attachments);
    } else if (attachment.url) {
      handleFileUpload(newMessage, attachment);
    }
  };

  // Get member status text
  const getMemberStatusText = useCallback(() => {
    if (!conversation) return '';
    
    if (conversation.isGroup) {
      return `${conversation.participants.length} members`;
    }
    
    const participant = conversation.participants[0];
    if (participant.isOnline) {
      return 'Online';
    }
    
    if (participant.lastSeen) {
      const formattedTime = formatDistanceToNow(new Date(participant.lastSeen), { 
        addSuffix: true,
        includeSeconds: true
      });
      return `Last seen ${formattedTime}`;
    }
    
    return '';
  }, [conversation]);

  // Add a useEffect to load pending messages from AsyncStorage
  useEffect(() => {
    if (conversation) {
      loadPendingMessages();
    }
  }, [conversation]);

  // Function to load pending messages
  const loadPendingMessages = async () => {
    try {
      if (!conversation) return;
      
      const key = `pendingMessages_${conversation.id}`;
      const pendingMessagesJson = await AsyncStorage.getItem(key);
      
      if (pendingMessagesJson) {
        const loadedPendingMessages = JSON.parse(pendingMessagesJson) as ChatMessage[];
        setPendingMessages(loadedPendingMessages);
        
        // Add pending messages to the messages state
        const updatedMessages = [...messageState.messages, ...loadedPendingMessages];
        setMessageState(prev => ({
          ...prev,
          messages: updatedMessages
        }));
      }
    } catch (error) {
      console.error('Error loading pending messages:', error);
    }
  };

  // Function to save pending messages
  const savePendingMessages = async () => {
    try {
      if (!conversation) return;
      
      const key = `pendingMessages_${conversation.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(pendingMessages));
    } catch (error) {
      console.error('Error saving pending messages:', error);
    }
  };

  // Add function to handle file uploads
  const handleFileUpload = async (message: ChatMessage, attachment: any) => {
    try {
      setIsUploading(true);
      setUploadProgress(null);
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.1;
        setUploadProgress({
          messageId: message.id,
          progress: Math.min(progress, 0.95),
          isUploading: true,
        });
        
        if (progress >= 1) {
          clearInterval(interval);
        }
      }, 300);
      
      // Upload file using chatService
      const uploadedAttachment = await chatService.uploadAttachment({
        uri: attachment.uri,
        type: attachment.mimeType || 'application/octet-stream',
        name: attachment.name,
        size: attachment.size,
        width: attachment.width,
        height: attachment.height
      });
      
      // Send message with attachment
      const updatedMessage = await chatService.sendMessageWithAttachment({
        conversationId: message.conversationId,
        content: message.content,
        attachment: uploadedAttachment,
        replyToId: message.replyTo?.id
      });
      
      // Update messages in state
      setMessageState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === message.id ? {
            ...updatedMessage,
            id: message.id // Keep the original ID for UI consistency
          } : msg
        )
      }));
      
      setUploadProgress({
        messageId: message.id,
        progress: 1,
        isUploading: false,
      });
      
      clearInterval(interval);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      setUploadProgress(null);
      
      // Mark message as failed
      const failedMessage = { 
        ...message, 
        status: 'failed' as 'sending' | 'sent' | 'delivered' | 'read' | 'failed' | undefined 
      };
      setMessageState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === message.id ? failedMessage : msg
        )
      }));
      
      // Add to pending messages
      const pendingMessage = { ...message, status: 'failed' };
      setPendingMessages([...pendingMessages, pendingMessage]);
      savePendingMessages();
      
      Alert.alert(
        'Upload Failed',
        'There was a problem uploading your file. It will be retried when you reconnect.',
        [{ text: 'OK' }]
      );
    }
  };

  // Add function to handle multiple image uploads
  const handleMultipleImagesUpload = async (message: ChatMessage, attachments: any[]) => {
    try {
      setIsUploading(true);
      setUploadProgress(null);
      
      // Simulate upload progress for multiple images
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.05;
        setUploadProgress({
          messageId: message.id,
          progress: Math.min(progress, 0.95),
          isUploading: true,
        });
        
        if (progress >= 1) {
          clearInterval(interval);
        }
      }, 200);
      
      // Upload all images
      const uploadPromises = attachments.map(attachment => 
        chatService.uploadAttachment({
          uri: attachment.uri,
          type: attachment.mimeType || 'image/jpeg',
          name: attachment.name,
          size: attachment.size,
          width: attachment.width,
          height: attachment.height
        })
      );
      
      const uploadedAttachments = await Promise.all(uploadPromises);
      
      // Send message with multiple attachments
      const updatedMessage = await chatService.sendMessageWithAttachment({
        conversationId: message.conversationId,
        content: message.content,
        attachment: {
          type: 'multiple_images',
          attachments: uploadedAttachments
        },
        replyToId: message.replyTo?.id
      });
      
      // Update messages in state
      setMessageState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === message.id ? {
            ...updatedMessage,
            id: message.id // Keep the original ID for UI consistency
          } : msg
        )
      }));
      
      setUploadProgress({
        messageId: message.id,
        progress: 1,
        isUploading: false,
      });
      
      clearInterval(interval);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      setIsUploading(false);
      setUploadProgress(null);
      
      // Mark message as failed
      const failedMessage = { 
        ...message, 
        status: 'failed' as 'sending' | 'sent' | 'delivered' | 'read' | 'failed' | undefined 
      };
      setMessageState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === message.id ? failedMessage : msg
        )
      }));
      
      // Add to pending messages
      const pendingMessage = { ...message, status: 'failed' };
      setPendingMessages([...pendingMessages, pendingMessage]);
      savePendingMessages();
      
      Alert.alert(
        'Upload Failed',
        'There was a problem uploading your images. They will be retried when you reconnect.',
        [{ text: 'OK' }]
      );
    }
  };

  // Add function to retry sending failed messages
  const retryFailedMessage = (messageId: string) => {
    // Find the message in pending messages
    const failedMessage = pendingMessages.find(msg => msg.id === messageId);
    
    if (!failedMessage) return;
    
    // Remove from pending messages
    const updatedPendingMessages = pendingMessages.filter(msg => msg.id !== messageId);
    setPendingMessages(updatedPendingMessages);
    savePendingMessages();
    
    // If there are attachments, handle as file upload
    if (failedMessage.attachments && failedMessage.attachments.length > 0) {
      const attachment = failedMessage.attachments[0];
      handleFileUpload(failedMessage, attachment);
      return;
    }
    
    // Mark as sending and retry
    setMessageState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, status: 'sending' } : msg
      )
    }));
    
    // Send through socket
    socketService.notifyNewMessage({
      ...failedMessage,
      status: 'sending'
    });
  };

  // Add function to handle message attachments in the render
  const renderAttachments = (message: ChatMessage) => {
    if (!message.attachments || message.attachments.length === 0) return null;
    
    return (
      <View style={styles.attachmentsContainer}>
        {message.attachments.map((attachment, index) => {
          // Handle image attachments
          if (attachment.type === 'image') {
            return (
              <TouchableOpacity 
                key={`${message.id}_attachment_${index}`}
                onPress={() => {
                  // In a real app, this would open the image in a full-screen viewer
                  Alert.alert('Image Viewer', 'This would open a full-screen image viewer');
                }}
                style={styles.imageAttachment}
              >
                <Image 
                  source={{ uri: attachment.url }} 
                  style={styles.attachmentImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            );
          }
          
          // Handle document attachments
          if (attachment.type === 'document') {
            return (
              <TouchableOpacity
                key={`${message.id}_attachment_${index}`}
                onPress={() => {
                  // In a real app, this would open or download the document
                  Alert.alert('Document Viewer', 'This would open or download the document');
                }}
                style={styles.documentAttachment}
              >
                <View style={styles.documentIcon}>
                  <MaterialIcons name="description" size={24} color="#2196F3" />
                </View>
                <View style={styles.documentInfo}>
                  <Text numberOfLines={1} style={styles.documentName}>{attachment.name}</Text>
                  <Text style={styles.documentSize}>
                    {attachment.size ? `${Math.round(attachment.size / 1024)} KB` : 'Unknown size'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }
          
          // Handle location attachments
          if (attachment.type === 'location') {
            return (
              <TouchableOpacity
                key={`${message.id}_attachment_${index}`}
                onPress={() => {
                  // In a real app, this would open the map
                  Alert.alert('Location Viewer', 'This would open a map view');
                }}
                style={styles.locationAttachment}
              >
                <View style={styles.locationPreview}>
                  <MaterialIcons name="location-on" size={32} color="#E53935" />
                </View>
                <Text style={styles.locationText}>{attachment.name || 'Shared Location'}</Text>
              </TouchableOpacity>
            );
          }
          
          return null;
        })}
      </View>
    );
  };

  // Add renderUploadProgress function
  const renderUploadProgress = () => {
    if (!isUploading || !uploadProgress) return null;
    
    return (
      <View style={styles.uploadProgressContainer}>
        <View style={styles.uploadProgressBar}>
          <View 
            style={[
              styles.uploadProgressFill, 
              { width: `${uploadProgress.progress * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.uploadProgressText}>
          Uploading... {Math.round(uploadProgress.progress * 100)}%
        </Text>
      </View>
    );
  };

  // Add renderConnectionBanner function
  const renderConnectionBanner = () => {
    if (!connectionState.isInternetReachable) {
      return (
        <Animated.View style={[styles.connectionBanner, { backgroundColor: theme.colors.error }]}>
          <MaterialIcons name="wifi-off" size={18} color="white" />
          <Text style={styles.connectionText}>You are offline</Text>
        </Animated.View>
      );
    }
    
    return null;
  };
  
  // Add renderEmptyComponent function
  const renderEmptyComponent = () => {
    return (
      <View style={[
        styles.emptyContainer,
        { backgroundColor: theme.colors.background }
      ]}>
        <MaterialIcons 
          name="forum" 
          size={80} 
          color={theme.colors.onSurfaceVariant} 
        />
        <Text 
          style={[
            styles.emptyText,
            { color: theme.colors.onSurfaceVariant }
          ]}
        >
          No messages yet
        </Text>
        <Text 
          style={[
            styles.emptySubText,
            { color: theme.colors.onSurfaceVariant }
          ]}
        >
          Start the conversation by sending a message below.
        </Text>
      </View>
    );
  };
  
  // Add renderFooter function
  const renderFooter = () => {
    if (messageState.loading && messageState.messages.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text 
            style={[
              styles.footerText,
              { color: theme.colors.onSurfaceVariant }
            ]}
          >
            Loading more messages...
          </Text>
        </View>
      );
    }
    return null;
  };
  
  // Add renderContextMenu function
  const renderContextMenu = () => {
    if (!contextMenu.visible) return null;
    
    return (
      <Portal>
        <Pressable 
          style={StyleSheet.absoluteFill} 
          onPress={handleCloseContextMenu}
        >
          <View 
            style={[
              styles.contextMenu,
              {
                top: contextMenu.y - 100,
                left: contextMenu.x - 160,
                backgroundColor: theme.colors.surfaceVariant,
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.contextMenuItem}
              onPress={() => {
                const message = messageState.messages.find(m => m.id === contextMenu.messageId);
                if (message) {
                  handleReply(message);
                }
                handleCloseContextMenu();
              }}
            >
              <MaterialIcons 
                name="reply" 
                size={22} 
                color={theme.colors.primary} 
              />
              <Text 
                style={[
                  styles.contextMenuText,
                  { color: theme.colors.onSurfaceVariant }
                ]}
              >
                Reply
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contextMenuItem}
              onPress={() => {
                if (contextMenu.messageId) {
                  handleShowDeleteConfirmation(contextMenu.messageId);
                }
              }}
            >
              <MaterialIcons 
                name="delete" 
                size={22} 
                color={theme.colors.error} 
              />
              <Text 
                style={[
                  styles.contextMenuText,
                  { color: theme.colors.onSurfaceVariant }
                ]}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Portal>
    );
  };
  
  // Add renderDeleteConfirmation function
  const renderDeleteConfirmation = () => {
    return (
      <Portal>
        <Dialog
          visible={!!confirmDelete}
          onDismiss={() => setConfirmDelete(null)}
          style={styles.dialog}
        >
          <Dialog.Title>Delete message?</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this message? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDelete(null)}>Cancel</Button>
            <Button 
              onPress={() => {
                if (confirmDelete) {
                  handleDeleteMessage(confirmDelete);
                }
              }} 
              textColor={theme.colors.error}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  // Add renderLoadingState function
  const renderLoadingState = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
          Loading messages...
        </Text>
      </View>
    );
  };

  if (messageState.loading && messageState.messages.length === 0) {
    return (
      <View style={[
        styles.loadingContainer,
        { backgroundColor: theme.colors.background }
      ]}>
        <StatusBar 
          barStyle={theme.dark ? "light-content" : "dark-content"}
          backgroundColor={theme.dark ? '#121212' : '#FFFFFF'}
        />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text 
          style={[
            styles.loadingText,
            { color: theme.colors.onSurfaceVariant }
          ]}
        >
          Loading conversation...
        </Text>
      </View>
    );
  }

  if (messageState.error) {
    return (
      <View style={[
        styles.errorContainer,
        { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
      ]}>
        <StatusBar 
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.primary}
        />
        <MaterialIcons 
          name="error-outline" 
          size={80} 
          color={theme.colors.error} 
        />
        <Text 
          style={[
            styles.errorText,
            { color: isDarkMode ? '#ffffff' : '#212121' }
          ]}
        >
          {messageState.error}
        </Text>
        <TouchableOpacity
          style={[
            styles.goBackButton, 
            { backgroundColor: theme.colors.primary }
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If user doesn't have permission, show permission denied view
  if (!hasPermission) {
    return (
      <ScreenContainer>
        <View style={[styles.centeredContent, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 16 }}>
            You don't have permission to access this feature
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.surface}
        translucent={false}
      />
      
      {renderHeader()}
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {messageState.loading && messageState.messages.length === 0 ? (
          renderLoadingState()
        ) : messageState.error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={48} color={theme.colors.error} />
            <Text style={[styles.errorText, { color: theme.colors.onSurface }]}>{messageState.error}</Text>
            <Button mode="contained" onPress={loadConversation}>
              Retry
            </Button>
          </View>
        ) : (
          <>
            {!connectionState.isConnected && (
              <View style={[styles.connectionBanner, { backgroundColor: theme.colors.error }]}>
                <MaterialIcons name="wifi-off" size={18} color="white" />
                <Text style={styles.connectionText}>You are offline</Text>
              </View>
            )}
            
            <AccessibilityFocusableMessageList
              messages={messageState.messages}
              loading={messageState.loading}
              refreshing={messageState.refreshing}
              error={messageState.error}
              onRefresh={handleRefresh}
              onLoadMore={loadMoreMessages}
              onScroll={handleScroll}
              flatListRef={flatListRef as React.RefObject<FlatList<ChatMessage>>}
              renderEmptyComponent={renderEmptyComponent}
              renderFooter={renderFooter}
              onMessageReply={handleReply}
              onMessageDelete={handleDeleteMessage}
              onLongPress={handleLongPressMessage}
              uploadProgress={uploadProgress}
              retryFailedMessage={retryFailedMessage}
              userId={CURRENT_USER.id}
              isDarkMode={isDarkMode}
            />
            
            {contextMenu.visible && renderContextMenu()}
            {confirmDelete && renderDeleteConfirmation()}
            
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
              {replyingTo && (
                <View style={[styles.replyContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <View style={styles.replyContent}>
                    <Text style={[styles.replyLabel, { color: theme.colors.primary }]}>
                      Reply to {replyingTo.senderName}
                    </Text>
                    <Text style={[styles.replyText, { color: theme.colors.onSurface }]} numberOfLines={1}>
                      {replyingTo.content}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    onPress={handleCancelReply}
                    style={styles.replyClose}
                  >
                    <MaterialIcons name="close" size={20} color={theme.colors.onSurfaceVariant} />
                  </TouchableOpacity>
                </View>
              )}
              
              <MessageInput
                onSendMessage={handleSendMessage}
                onAttachmentSelect={handleAttachmentSelect}
                replyingTo={replyingTo}
                onCancelReply={handleCancelReply}
                placeholder={connectionState.isInternetReachable ? "Type a message..." : "You are offline"}
                isDarkMode={theme.dark}
              />
            </View>
            
            {uploadProgress && uploadProgress.isUploading && (
              <View style={[styles.uploadProgressContainer, { backgroundColor: theme.colors.surface }]}>
                <ProgressBar 
                  progress={uploadProgress.progress / 100}
                  color={theme.colors.primary}
                  style={styles.progressBar}
                />
                <Text style={[styles.uploadProgressText, { color: theme.colors.onSurface }]}>
                  Uploading... {Math.round(uploadProgress.progress)}%
                </Text>
              </View>
            )}
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
    margin: 16,
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
  header: {
    elevation: 4,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    zIndex: 10,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  messagesListEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  avatarWithStatus: {
    position: 'relative',
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9e9e9e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextStyle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  defaultGroupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
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
  startChatButton: {
    marginTop: 24,
    paddingHorizontal: 24,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  goBackButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectionBanner: {
    backgroundColor: '#EF5350',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  connectionText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  scrollButton: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
  },
  contextMenu: {
    position: 'absolute',
    width: 180,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  contextMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  contextMenuText: {
    marginLeft: 12,
    fontSize: 15,
  },
  dialog: {
    borderRadius: 12,
  },
  attachmentsContainer: {
    marginVertical: 4,
  },
  imageAttachment: {
    borderRadius: 8,
    marginVertical: 4,
    overflow: 'hidden',
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  documentAttachment: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    alignItems: 'center',
  },
  documentIcon: {
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  documentSize: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  locationAttachment: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    alignItems: 'center',
  },
  locationPreview: {
    width: '100%',
    height: 150,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  uploadProgressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  uploadProgressBar: {
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  uploadProgressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
  uploadProgressText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  uploadProgressIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  messageErrorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  retryText: {
    marginLeft: 8,
    fontSize: 14,
  },
  progressBar: {
    height: 4,
    width: 200,
  },
  inputContainer: {
    padding: 16,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  replyText: {
    fontSize: 14,
  },
  replyClose: {
    padding: 8,
  },
});

export default ChatConversationScreen; 