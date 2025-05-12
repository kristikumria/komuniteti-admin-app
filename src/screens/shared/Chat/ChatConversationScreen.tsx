import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import { Appbar, useTheme, Badge, IconButton, MD3Colors, Portal, Dialog, Button, Menu } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MessageBubble } from '../../../components/Chat/MessageBubble';
import { MessageInput } from '../../../components/Chat/MessageInput';
import { ChatMessage, ChatConversation, ChatParticipant } from '../../../navigation/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDistanceToNow } from 'date-fns';
import NetInfo from '@react-native-community/netinfo';
import { useAppSelector } from '../../../store/hooks';
import { theme } from '../../../theme';
import { ChatContainer } from '../../../components/Chat/ChatContainer';
import socketService from '../../../services/socketService';

// Mock data for prototyping
const MOCK_CONVERSATIONS: Record<string, ChatConversation> = {
  '1': {
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
  '2': {
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
      content: 'The plumber will arrive tomorrow at 10 AM to fix the leak in apartment 302',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      readBy: ['104'],
      status: 'delivered',
    },
    unreadCount: 2,
    createdAt: '2023-02-20T11:30:00Z',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    isGroup: true,
    image: 'https://images.unsplash.com/photo-1554435493-93422e8d1a41?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1aWxkaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  '3': {
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
      content: 'Thank you for approving the budget for the lobby renovation',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      readBy: ['101'],
      status: 'read',
    },
    unreadCount: 0,
    createdAt: '2023-03-10T08:45:00Z',
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    isGroup: false,
  },
};

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: 'm101',
      conversationId: '1',
      senderId: '101',
      senderName: 'Arben Hoxha',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Good morning everyone. We need to discuss the maintenance schedule for Building A next month.',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      readBy: ['101', '102', 'manager'],
      status: 'read',
    },
    {
      id: 'm102',
      conversationId: '1',
      senderId: '102',
      senderName: 'Sara Mati',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'I agree. The elevator needs servicing and we need to schedule a time that minimizes disruption for residents.',
      timestamp: new Date(Date.now() - 6000000).toISOString(), // 1 hour 40 minutes ago
      readBy: ['101', '102', 'manager'],
      status: 'read',
    },
    {
      id: 'm103',
      conversationId: '1',
      senderId: 'manager',
      senderName: 'Elena Koci',
      senderRole: 'manager',
      content: 'Good point, Sara. Let\'s schedule the elevator maintenance for a weekday between 10am-2pm when most residents are at work. Arben, can you coordinate with the service provider?',
      timestamp: new Date(Date.now() - 5400000).toISOString(), // 1 hour 30 minutes ago
      readBy: ['101', '102', 'manager'],
      status: 'read',
    },
    {
      id: 'm104',
      conversationId: '1',
      senderId: '101',
      senderName: 'Arben Hoxha',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Yes, I\'ll contact them today and propose next Tuesday. I\'ll send a notification to residents once it\'s confirmed.',
      timestamp: new Date(Date.now() - 4800000).toISOString(), // 1 hour 20 minutes ago
      readBy: ['101', '102', 'manager'],
      status: 'read',
    },
    {
      id: 'm105',
      conversationId: '1',
      senderId: '102',
      senderName: 'Sara Mati',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'Also, we need to schedule the annual fire safety inspection. The last one was done 11 months ago.',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      readBy: ['101', '102', 'manager'],
      status: 'read',
    },
    {
      id: 'm106',
      conversationId: '1',
      senderId: 'manager',
      senderName: 'Elena Koci',
      senderRole: 'manager',
      content: 'Good reminder. Let\'s do that in the same week as the elevator maintenance. I\'ll allocate budget for both.',
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      readBy: ['101', 'manager'],
      status: 'delivered',
    },
  ],
  '2': [
    {
      id: 'm201',
      conversationId: '2',
      senderId: '103',
      senderName: 'Elton Zholi',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/men/55.jpg',
      content: 'I received a report about a water leak in apartment 302. The resident says it\'s coming from the ceiling.',
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      readBy: ['103', '104', 'manager'],
      status: 'read',
    },
    {
      id: 'm202',
      conversationId: '2',
      senderId: 'manager',
      senderName: 'Elena Koci',
      senderRole: 'manager',
      content: 'That sounds serious. Have you inspected it yet?',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      readBy: ['103', '104', 'manager'],
      status: 'read',
    },
    {
      id: 'm203',
      conversationId: '2',
      senderId: '103',
      senderName: 'Elton Zholi',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/men/55.jpg',
      content: 'Yes, I checked it yesterday. It seems to be coming from a bathroom pipe in the apartment above. I\'ve already contacted a plumber.',
      timestamp: new Date(Date.now() - 129600000).toISOString(), // 1.5 days ago
      readBy: ['103', '104', 'manager'],
      status: 'read',
    },
    {
      id: 'm204',
      conversationId: '2',
      senderId: '104',
      senderName: 'Drita Koka',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/women/33.jpg',
      content: 'I\'ve spoken with the resident in 402 (the apartment above). They\'ve agreed to provide access for the plumber tomorrow.',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      readBy: ['104', 'manager'],
      status: 'delivered',
    },
    {
      id: 'm205',
      conversationId: '2',
      senderId: '104',
      senderName: 'Drita Koka',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/women/33.jpg',
      content: 'The plumber will arrive tomorrow at 10 AM to fix the leak in apartment 302',
      timestamp: new Date(Date.now() - 72000000).toISOString(), // 20 hours ago
      readBy: ['104'],
      status: 'delivered',
    },
  ],
  '3': [
    {
      id: 'm301',
      conversationId: '3',
      senderId: '101',
      senderName: 'Arben Hoxha',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Hello Elena, I wanted to discuss the budget for the lobby renovation project in Building A.',
      timestamp: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
      readBy: ['101', 'manager'],
      status: 'read',
    },
    {
      id: 'm302',
      conversationId: '3',
      senderId: 'manager',
      senderName: 'Elena Koci',
      senderRole: 'manager',
      content: 'Hi Arben, of course. What\'s your proposal?',
      timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
      readBy: ['101', 'manager'],
      status: 'read',
    },
    {
      id: 'm303',
      conversationId: '3',
      senderId: '101',
      senderName: 'Arben Hoxha',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'I\'ve received quotes from three contractors. The best offer is 15,000€ for complete renovation including new flooring, paint, lighting, and furniture.',
      timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      readBy: ['101', 'manager'],
      status: 'read',
    },
    {
      id: 'm304',
      conversationId: '3',
      senderId: 'manager',
      senderName: 'Elena Koci',
      senderRole: 'manager',
      content: 'That sounds reasonable. Can you send me the detailed quotes and a timeline for the work?',
      timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      readBy: ['101', 'manager'],
      status: 'read',
    },
    {
      id: 'm305',
      conversationId: '3',
      senderId: '101',
      senderName: 'Arben Hoxha',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'I\'ve just emailed you all the documents. The contractor can start in two weeks and estimates completion within 10 working days.',
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      readBy: ['101', 'manager'],
      status: 'read',
    },
    {
      id: 'm306',
      conversationId: '3',
      senderId: 'manager',
      senderName: 'Elena Koci',
      senderRole: 'manager',
      content: 'I\'ve reviewed the documents and approved the budget. You can proceed with signing the contract.',
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      readBy: ['101', 'manager'],
      status: 'read',
    },
    {
      id: 'm307',
      conversationId: '3',
      senderId: '101',
      senderName: 'Arben Hoxha',
      senderRole: 'admin',
      senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Thank you for approving the budget for the lobby renovation',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      readBy: ['101', 'manager'],
      status: 'read',
    },
  ],
};

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

// Interface for improved message handling
interface MessageState {
  messages: ChatMessage[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  page: number;
  error: string | null;
}

// Interface for connection status
interface ConnectionState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
}

// Interface for message context menu 
interface MessageContextMenu {
  visible: boolean;
  messageId: string | null;
  x: number;
  y: number;
}

// Export the props interface
export interface ChatConversationScreenProps {
  conversationId?: string;
  userRole?: 'administrator' | 'business-manager';
  onGoBack?: () => void;
}

const ChatConversationScreen: React.FC<ChatConversationScreenProps> = ({ 
  conversationId: propConversationId,
  userRole = 'administrator',
  onGoBack
}) => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isDarkMode = useAppSelector(state => state.settings?.darkMode) ?? false;
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<any>(null);
  const insets = useSafeAreaInsets();
  const windowDimensions = Dimensions.get('window');
  
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
  
  // Animation values
  const scrollButtonOpacity = useRef(new Animated.Value(0)).current;
  const connectionBannerHeight = useRef(new Animated.Value(0)).current;
  const typingIndicatorHeight = useRef(new Animated.Value(0)).current;
  
  // Queue for messages when offline
  const [messageQueue, setMessageQueue] = useState<{text: string, replyTo?: any}[]>([]);
  
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
      const foundConversation = MOCK_CONVERSATIONS[conversationId];
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
  
  // Handle sending a message
  const handleSendMessage = (text: string, replyToOverride?: any) => {
    if (!text.trim() || !conversation) return;
    
    // If offline, add to queue
    if (!connectionState.isConnected) {
      setMessageQueue(prev => [...prev, { 
        text, 
        replyTo: replyToOverride || replyingTo 
      }]);
      
      // Show feedback to user
      if (HAPTIC_FEEDBACK_ENABLED) {
        Vibration.vibrate(100);
      }
      
      // Clear reply if present
      if (replyingTo) {
        setReplyingTo(null);
      }
      
      return;
    }
    
    setSending(true);
    
    if (HAPTIC_FEEDBACK_ENABLED) {
      Vibration.vibrate(100);
    }
    
    // Trigger typing indicator when sending a message
    simulateTypingIndicator();
    
    // Get reply data
    const replyData = replyToOverride || replyingTo;
    
    // Create new message
    const newMessage: ChatMessage = {
      id: `new-${Date.now()}`,
      conversationId,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      senderRole: CURRENT_USER.role,
      content: text,
      timestamp: new Date().toISOString(),
      readBy: [CURRENT_USER.id],
      status: 'sending',
      replyTo: replyData ? {
        id: replyData.id,
        senderId: '',
        senderName: replyData.senderName,
        content: replyData.content,
      } : undefined,
    };
    
    // Add message to state immediately for UI responsiveness
    setMessageState(prev => ({
      ...prev,
      messages: [newMessage, ...prev.messages]
    }));
    
    // Clear reply state if present
    if (replyingTo) {
      setReplyingTo(null);
    }
    
    // Simulate API call delay and update message status
    setTimeout(() => {
      setSending(false);
      setMessageState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' } 
            : msg
        )
      }));
      
      // Simulate delivered status after another delay
      setTimeout(() => {
        setMessageState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === newMessage.id 
              ? { ...msg, status: 'delivered' } 
              : msg
          )
        }));
        
        // After delivery, simulate read receipt after some time
        setTimeout(() => {
          // Simulate other participants reading the message
          if (conversation.participants.length > 0) {
            setMessageState(prev => ({
              ...prev,
              messages: prev.messages.map(msg => 
                msg.id === newMessage.id 
                  ? { 
                      ...msg, 
                      status: 'read',
                      readBy: [
                        ...msg.readBy,
                        ...conversation.participants.map(p => p.id).filter(id => id !== CURRENT_USER.id)
                      ]
                    } 
                  : msg
              )
            }));
          }
        }, 3000);
      }, 1000);
    }, 1500);
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
  const handleAttachmentSelect = (type: 'photo' | 'document' | 'location') => {
    // In a real app, this would open the camera, file picker, etc.
    console.log(`Selected attachment type: ${type}`);
    
    // Simulate attachment process
    if (HAPTIC_FEEDBACK_ENABLED) {
      Vibration.vibrate(100);
    }
    
    // Mock sending an attachment message after brief delay
    if (connectionState.isConnected) {
      setTimeout(() => {
        let content = '';
        switch (type) {
          case 'photo':
            content = '📷 Photo attachment';
            break;
          case 'document':
            content = '📄 Document attachment';
            break;
          case 'location':
            content = '📍 Location shared';
            break;
        }
        
        handleSendMessage(content);
      }, 1000);
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

  // Render a message item
  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isFromCurrentUser = item.senderId === CURRENT_USER.id;
    
    return (
      <Pressable
        onLongPress={(e) => handleLongPressMessage(item, e)}
        accessible={true}
        accessibilityLabel={`Message from ${item.senderName}: ${item.content}`}
        accessibilityHint={isFromCurrentUser ? "Double tap to edit, long press for more options" : "Double tap to reply, long press for more options"}
        accessibilityRole="text"
      >
        <MessageBubble
          message={item}
          isFromCurrentUser={isFromCurrentUser}
          showAvatar={!isFromCurrentUser}
          onReply={handleReply}
          onDelete={(id) => handleShowDeleteConfirmation(id)}
        />
      </Pressable>
    );
  };

  // Handle back navigation
  const handleGoBack = useCallback(() => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigation.goBack();
    }
  }, [onGoBack, navigation]);
  
  // Render the chat header
  const renderHeader = () => {
    if (!conversation) return null;
    
    const displayParticipants = getMemberStatusText();
    
    return (
      <Appbar.Header style={[
        styles.header, 
        { backgroundColor: isDarkMode ? '#121212' : '#ffffff' },
        { elevation: 4 }
      ]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack} 
            accessibilityLabel="Go back"
          >
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color={isDarkMode ? '#ffffff' : '#000000'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerContent}
            onPress={() => {
              // Navigate to conversation details
              if (conversation.isGroup) {
                // For group conversations, navigate to group details
                Alert.alert('Info', 'Group details coming soon');
              } else {
                // For one-on-one chats, navigate to profile
                Alert.alert('Info', 'User profile coming soon');
              }
            }}
            accessible={true}
            accessibilityLabel={`${conversation.title} chat. ${displayParticipants}`}
            accessibilityRole="button"
            accessibilityHint="Double tap to view conversation details"
          >
            <View style={styles.avatarContainer}>
              {conversation.isGroup ? (
                conversation.image ? (
                  <Image 
                    source={{ uri: conversation.image }} 
                    style={styles.avatar}
                    accessibilityIgnoresInvertColors={true}
                  />
                ) : (
                  <View style={styles.defaultGroupAvatar}>
                    <MaterialIcons name="group" size={24} color="white" />
                  </View>
                )
              ) : (
                <View style={styles.avatarWithStatus}>
                  {conversation.participants[0].image ? (
                    <Image
                      source={{ uri: conversation.participants[0].image }}
                      style={styles.avatar}
                      accessibilityIgnoresInvertColors={true}
                    />
                  ) : (
                    <View style={styles.defaultAvatar}>
                      <Text style={styles.avatarTextStyle}>
                        {conversation.participants[0].name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  {conversation.participants[0].isOnline && (
                    <View style={styles.onlineIndicator} />
                  )}
                </View>
              )}
            </View>
            
            <View style={styles.headerTextContainer}>
              <Text 
                style={styles.headerTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {conversation.title}
              </Text>
              <Text 
                style={styles.headerSubtitle}
                numberOfLines={1}
              >
                {displayParticipants}
              </Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={() => {
                // Implement search
                Alert.alert('Info', 'Search coming soon');
              }}
              accessibilityLabel="Search in conversation" 
            >
              <MaterialIcons name="search" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity 
                  style={styles.headerButton} 
                  onPress={() => setMenuVisible(true)}
                  accessibilityLabel="More options" 
                >
                  <MaterialIcons name="more-vert" size={24} color="#ffffff" />
                </TouchableOpacity>
              }
            >
              <Menu.Item 
                onPress={() => {
                  setMenuVisible(false);
                  // Mute notifications
                  Alert.alert('Info', 'Notifications muted');
                }} 
                title="Mute notifications" 
                leadingIcon="bell-off-outline"
              />
              <Menu.Item 
                onPress={() => {
                  setMenuVisible(false);
                  // Clear chat
                  Alert.alert(
                    'Clear chat',
                    'Are you sure you want to clear all messages?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Clear',
                        style: 'destructive',
                        onPress: () => {
                          Alert.alert('Success', 'Chat cleared');
                        },
                      },
                    ]
                  );
                }} 
                title="Clear chat" 
                leadingIcon="delete-outline"
              />
              {conversation.isGroup && (
                <Menu.Item 
                  onPress={() => {
                    setMenuVisible(false);
                    // Leave group
                    Alert.alert(
                      'Leave group',
                      'Are you sure you want to leave this group?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                        {
                          text: 'Leave',
                          style: 'destructive',
                          onPress: () => {
                            navigation.goBack();
                            Alert.alert('Success', 'You left the group');
                          },
                        },
                      ]
                    );
                  }} 
                  title="Leave group" 
                  leadingIcon="exit-to-app"
                />
              )}
            </Menu>
          </View>
        </View>
      </Appbar.Header>
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

  // Render connection status banner
  const renderConnectionBanner = () => {
    return (
      <Animated.View style={[
        styles.connectionBanner,
        { height: connectionBannerHeight }
      ]}>
        <MaterialIcons name="wifi-off" size={16} color="#fff" />
        <Text style={styles.connectionText}>
          You're offline. Messages will be sent when you're back online.
        </Text>
      </Animated.View>
    );
  };
  
  // List empty component
  const renderEmptyComponent = () => {
    if (messageState.loading) return null;
    
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
        <Button
          mode="contained"
          onPress={() => inputRef.current?.focus()}
          style={styles.startChatButton}
        >
          Start Chat
        </Button>
      </View>
    );
  };
  
  // List footer component for pagination loading
  const renderFooter = () => {
    if (!messageState.loading || messageState.refreshing) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={[
          styles.footerText,
          { color: isDarkMode ? '#cccccc' : '#757575' }
        ]}>
          Loading more messages...
        </Text>
      </View>
    );
  };

  // Render delete confirmation dialog
  const renderDeleteConfirmation = () => {
    return (
      <Portal>
        <Dialog
          visible={confirmDelete !== null}
          onDismiss={() => setConfirmDelete(null)}
          style={styles.dialog}
        >
          <Dialog.Title>Delete Message</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this message? This action cannot be undone.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmDelete(null)}>Cancel</Button>
            <Button 
              onPress={() => confirmDelete && handleDeleteMessage(confirmDelete)}
              textColor={theme.colors.error}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  // Render context menu
  const renderContextMenu = () => {
    if (!contextMenu.visible) return null;
    
    const selectedMessage = messageState.messages.find(
      msg => msg.id === contextMenu.messageId
    );
    
    if (!selectedMessage) return null;
    
    const isUserMessage = selectedMessage.senderId === CURRENT_USER.id;
    
    // Calculate position based on screen dimensions to ensure menu stays on screen
    const menuX = Math.min(
      contextMenu.x, 
      windowDimensions.width - 200
    );
    
    const menuY = Math.min(
      contextMenu.y, 
      windowDimensions.height - 200
    );
    
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
                left: menuX,
                top: menuY,
                backgroundColor: isDarkMode ? '#333333' : '#ffffff'
              }
            ]}
          >
            <TouchableOpacity
              style={styles.contextMenuItem}
              onPress={() => {
                handleCloseContextMenu();
                handleReply(selectedMessage);
              }}
            >
              <MaterialIcons 
                name="reply" 
                size={20} 
                color={theme.colors.primary} 
              />
              <Text style={[
                styles.contextMenuText,
                { color: isDarkMode ? '#ffffff' : '#000000' }
              ]}>
                Reply
              </Text>
            </TouchableOpacity>
            
            {isUserMessage && (
              <TouchableOpacity
                style={styles.contextMenuItem}
                onPress={() => {
                  handleShowDeleteConfirmation(selectedMessage.id);
                }}
              >
                <MaterialIcons 
                  name="delete" 
                  size={20} 
                  color={theme.colors.error} 
                />
                <Text style={[
                  styles.contextMenuText,
                  { color: theme.colors.error }
                ]}>
                  Delete
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.contextMenuItem}
              onPress={() => {
                handleCloseContextMenu();
                // Copy text to clipboard would be implemented here
              }}
            >
              <MaterialIcons 
                name="content-copy" 
                size={20} 
                color={theme.colors.secondary} 
              />
              <Text style={[
                styles.contextMenuText,
                { color: isDarkMode ? '#ffffff' : '#000000' }
              ]}>
                Copy Text
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Portal>
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

  if (messageState.loading && messageState.messages.length === 0) {
    return (
      <View style={[
        styles.loadingContainer,
        { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
      ]}>
        <StatusBar 
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={theme.colors.primary}
        />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text 
          style={[
            styles.loadingText,
            { color: isDarkMode ? '#ffffff' : '#000000' }
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

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.primary}
      />
      
      <ChatContainer
        messages={messageState.messages}
        loading={messageState.loading}
        refreshing={messageState.refreshing}
        error={messageState.error}
        onRefresh={handleRefresh}
        onSendMessage={handleSendMessage}
        onDeleteMessage={handleDeleteMessage}
        onTypingStatusChange={simulateTypingIndicator}
        typingUsers={typingUsers}
        headerComponent={renderHeader()}
        userId={CURRENT_USER.id}
        sending={sending}
        conversation={conversation}
        onLoadMore={loadMoreMessages}
      />
      
      {renderContextMenu()}
      {renderDeleteConfirmation()}
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
});

export default ChatConversationScreen; 