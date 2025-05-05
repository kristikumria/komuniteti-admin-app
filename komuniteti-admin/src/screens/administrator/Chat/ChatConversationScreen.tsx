import * as React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Text,
  StatusBar as RNStatusBar
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdministratorStackParamList, ChatMessage, ChatConversation, User } from '../../../navigation/types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { chatService } from '../../../services/chatService';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { theme } from '../../../theme';
import { StatusBar } from 'expo-status-bar';
import MessageInput from '../../../components/Chat/MessageInput';
import MessageBubble from '../../../components/Chat/MessageBubble';
import { 
  fetchMessagesRequest, 
  fetchMessagesSuccess, 
  fetchMessagesFailure, 
  sendMessageRequest, 
  sendMessageSuccess, 
  sendMessageFailure,
  setActiveConversation
} from '../../../store/slices/chatSlice';

const { useEffect, useState, useRef } = React;

type ChatConversationRouteProp = RouteProp<AdministratorStackParamList, 'ChatConversation'>;
type ChatConversationNavigationProp = NativeStackNavigationProp<AdministratorStackParamList, 'ChatConversation'>;

const ChatConversationScreen = () => {
  const route = useRoute<ChatConversationRouteProp>();
  const navigation = useNavigation<ChatConversationNavigationProp>();
  const { conversationId } = route.params;
  const dispatch = useDispatch();
  
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id || '';
  const userName = user?.name || 'Admin User';
  
  const { activeConversationMessages: messages, loading } = useSelector((state: RootState) => state.chat);
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [sending, setSending] = useState<boolean>(false);
  
  const flatListRef = useRef<FlatList<ChatMessage | { isDateSeparator: true; date: string }>>(null);

  // Fetch conversation details and messages
  useEffect(() => {
    const fetchConversationData = async () => {
      try {
        // Fetch conversation details
        const conversationData = await chatService.getConversationById(conversationId);
        setConversation(conversationData);
        
        // Fetch messages
        dispatch(fetchMessagesRequest());
        try {
          const messagesData = await chatService.getMessages(conversationId);
          dispatch(fetchMessagesSuccess(messagesData));
        } catch (error) {
          dispatch(fetchMessagesFailure(error instanceof Error ? error.message : 'Failed to fetch messages'));
        }
        
        // Mark messages as read and set active conversation
        await chatService.markMessagesAsRead(conversationId, userId);
        dispatch(setActiveConversation(conversationId));
      } catch (error) {
        console.error('Failed to fetch conversation data:', error);
      }
    };
    
    if (userId) {
      fetchConversationData();
    }
    
    // Set up navigation header title
    navigation.setOptions({
      title: 'Loading...',
      headerTitleStyle: styles.headerTitle,
    });
  }, [conversationId, userId, dispatch]);
  
  // Update navigation header when conversation data is loaded
  useEffect(() => {
    if (conversation) {
      const otherParticipant = !conversation.isGroup 
        ? conversation.participants.find(p => p.id !== userId) 
        : null;
        
      const title = conversation.isGroup 
        ? conversation.title 
        : otherParticipant?.name || 'Chat';
      
      navigation.setOptions({
        title,
        headerRight: () => (
          <TouchableOpacity style={styles.headerButton} onPress={showConversationInfo}>
            <MaterialIcons name="info-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        ),
      });
    }
  }, [conversation]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 200);
    }
  }, [messages, loading]);
  
  const showConversationInfo = () => {
    // Implementation for conversation info modal or screen
    alert('Conversation info coming soon!');
  };
  
  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || sending || !userId) return;
    
    try {
      setSending(true);
      dispatch(sendMessageRequest());
      
      const newMessage = {
        conversationId,
        senderId: userId,
        senderName: userName,
        senderRole: 'admin' as const,
        content: messageText.trim(),
        readBy: [userId],
      };
      
      const sentMessage = await chatService.sendMessage(newMessage);
      dispatch(sendMessageSuccess(sentMessage));
      
      // Scroll to the bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      dispatch(sendMessageFailure(error instanceof Error ? error.message : 'Failed to send message'));
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };
  
  const handleAttach = () => {
    // Implementation for attachment picker
    alert('Attachment functionality coming soon!');
  };
  
  const handleImagePress = (imageUrl: string) => {
    // Implementation for image viewer
    alert('Image viewer coming soon!');
  };
  
  const renderDay = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dayText;
    if (messageDate.toDateString() === today.toDateString()) {
      dayText = 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      dayText = 'Yesterday';
    } else {
      dayText = format(messageDate, 'MMMM d, yyyy');
    }
    
    return (
      <View style={styles.dayContainer}>
        <View style={styles.dayLine} />
        <Text style={styles.dayText}>{dayText}</Text>
        <View style={styles.dayLine} />
      </View>
    );
  };
  
  const renderMessageList = () => {
    // Group messages by day for date separators
    const messagesByDay: { [key: string]: ChatMessage[] } = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!messagesByDay[date]) {
        messagesByDay[date] = [];
      }
      messagesByDay[date].push(message);
    });
    
    // Flatten the grouped messages with day separators
    const flattenedMessages: (ChatMessage | { isDateSeparator: true, date: string })[] = [];
    Object.entries(messagesByDay).forEach(([date, msgs]) => {
      flattenedMessages.push({ isDateSeparator: true, date });
      msgs.forEach(msg => flattenedMessages.push(msg));
    });
    
    return (
      <FlatList
        ref={flatListRef as React.RefObject<FlatList<ChatMessage | { isDateSeparator: true; date: string }>>}
        data={flattenedMessages}
        keyExtractor={(item, index) => 'message_' + ('id' in item ? item.id : index)}
        renderItem={({ item }) => {
          if ('isDateSeparator' in item) {
            return renderDay(item.date);
          }
          
          const isOwnMessage = item.senderId === userId;
          return (
            <MessageBubble
              message={item}
              isOwnMessage={isOwnMessage}
              showSender={!isOwnMessage && conversation?.isGroup}
              onPressImage={handleImagePress}
            />
          );
        }}
        contentContainerStyle={styles.messageList}
        inverted={false}
      />
    );
  };
  
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          {renderMessageList()}
          
          <MessageInput
            onSend={handleSendMessage}
            isSending={sending}
            onAttach={handleAttach}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dayLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.lightGrey,
  },
  dayText: {
    fontSize: 12,
    color: theme.colors.grey,
    marginHorizontal: 8,
  },
});

export default ChatConversationScreen; 