import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatConversation, ChatMessage } from '../../navigation/types';

export interface ConnectionState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
}

export interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  activeConversationMessages: ChatMessage[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
  connectionState: ConnectionState;
  offlineMessageQueue: {
    conversationId: string;
    content: string;
    replyToId?: string;
    timestamp: string;
  }[];
}

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  activeConversationMessages: [],
  loading: false,
  error: null,
  unreadCount: 0,
  connectionState: {
    isConnected: true,
    isInternetReachable: true
  },
  offlineMessageQueue: []
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Connection state
    setConnectionState: (state, action: PayloadAction<ConnectionState>) => {
      state.connectionState = action.payload;
      
      // If we just came back online and have queued messages, they should be processed
      // This will be handled by middleware or thunk actions
    },
    
    // Offline message queue
    addToOfflineQueue: (state, action: PayloadAction<{
      conversationId: string;
      content: string;
      replyToId?: string;
    }>) => {
      state.offlineMessageQueue.push({
        ...action.payload,
        timestamp: new Date().toISOString()
      });
    },
    
    removeFromOfflineQueue: (state, action: PayloadAction<number>) => {
      state.offlineMessageQueue.splice(action.payload, 1);
    },
    
    clearOfflineQueue: (state) => {
      state.offlineMessageQueue = [];
    },
    
    // Conversations actions
    fetchConversationsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchConversationsSuccess: (state, action: PayloadAction<ChatConversation[]>) => {
      state.conversations = action.payload;
      state.loading = false;
      
      // Calculate total unread count
      state.unreadCount = action.payload.reduce(
        (total, conversation) => total + conversation.unreadCount, 
        0
      );
    },
    fetchConversationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Active conversation actions
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
      
      // Reset unread count for this conversation
      const conversationIndex = state.conversations.findIndex(c => c.id === action.payload);
      
      if (conversationIndex !== -1) {
        const conversation = state.conversations[conversationIndex];
        state.unreadCount -= conversation.unreadCount;
        
        // Create a new conversations array with the updated conversation
        const updatedConversations = [...state.conversations];
        updatedConversations[conversationIndex] = {
          ...conversation,
          unreadCount: 0
        };
        
        state.conversations = updatedConversations;
      }
    },
    
    // Messages actions
    fetchMessagesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMessagesSuccess: (state, action: PayloadAction<ChatMessage[]>) => {
      state.activeConversationMessages = action.payload;
      state.loading = false;
    },
    fetchMessagesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Send message actions
    sendMessageRequest: (state) => {
      // We might want to add an optimistic update here
    },
    sendMessageSuccess: (state, action: PayloadAction<ChatMessage>) => {
      // Create a new array with the new message
      state.activeConversationMessages = [...state.activeConversationMessages, action.payload];
      
      // Update the conversation's last message
      const conversationIndex = state.conversations.findIndex(
        c => c.id === action.payload.conversationId
      );
      
      if (conversationIndex !== -1) {
        // Create a new copy of conversations array
        const updatedConversations = [...state.conversations];
        
        // Clone the conversation we need to update
        const updatedConversation = {
          ...updatedConversations[conversationIndex],
          lastMessage: action.payload,
          updatedAt: action.payload.timestamp
        };
        
        // Remove the old conversation
        updatedConversations.splice(conversationIndex, 1);
        
        // Add the updated conversation at the beginning
        updatedConversations.unshift(updatedConversation);
        
        // Update the state with the new array
        state.conversations = updatedConversations;
      }
    },
    sendMessageFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    // Message status update
    updateMessageStatus: (state, action: PayloadAction<{
      messageId: string;
      status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
    }>) => {
      const { messageId, status } = action.payload;
      
      // Update in active messages if present
      state.activeConversationMessages = state.activeConversationMessages.map(message => {
        if (message.id === messageId) {
          return { ...message, status };
        }
        return message;
      });
      
      // Also update in conversation last message if it's this message
      state.conversations = state.conversations.map(conversation => {
        if (conversation.lastMessage && conversation.lastMessage.id === messageId) {
          return {
            ...conversation,
            lastMessage: {
              ...conversation.lastMessage,
              status
            }
          };
        }
        return conversation;
      });
    },
    
    // New message received
    newMessageReceived: (state, action: PayloadAction<ChatMessage>) => {
      const { conversationId } = action.payload;
      
      // If we're in the conversation already, add it to active messages
      if (state.activeConversationId === conversationId) {
        // Create a new array with the new message - don't push to existing array
        state.activeConversationMessages = [...state.activeConversationMessages, action.payload];
      } else {
        // Otherwise increment unread count
        state.unreadCount += 1;
        
        const conversationIndex = state.conversations.findIndex(
          c => c.id === conversationId
        );
        
        if (conversationIndex !== -1) {
          // Create a new copy of conversations array
          const updatedConversations = [...state.conversations];
          
          // Clone the conversation we need to update to avoid direct mutation
          const updatedConversation = {
            ...updatedConversations[conversationIndex],
            unreadCount: updatedConversations[conversationIndex].unreadCount + 1,
            lastMessage: action.payload,
            updatedAt: action.payload.timestamp
          };
          
          // Remove the old conversation
          updatedConversations.splice(conversationIndex, 1);
          
          // Add the updated conversation at the beginning
          updatedConversations.unshift(updatedConversation);
          
          // Update the state with the new array
          state.conversations = updatedConversations;
        }
      }
    },
    
    // Delete message
    deleteMessage: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;
      
      // Remove from active messages
      state.activeConversationMessages = state.activeConversationMessages.filter(
        message => message.id !== messageId
      );
      
      // Update last message in conversation if needed
      if (state.activeConversationId) {
        const conversationIndex = state.conversations.findIndex(
          c => c.id === state.activeConversationId
        );
        
        if (conversationIndex !== -1) {
          const conversation = state.conversations[conversationIndex];
          
          if (conversation.lastMessage && conversation.lastMessage.id === messageId) {
            // Find the new last message (the most recent one after deletion)
            const newLastMessage = state.activeConversationMessages
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            
            if (newLastMessage) {
              // Create updated conversation
              const updatedConversation = {
                ...conversation,
                lastMessage: newLastMessage
              };
              
              // Update conversations array
              const updatedConversations = [...state.conversations];
              updatedConversations[conversationIndex] = updatedConversation;
              state.conversations = updatedConversations;
            }
          }
        }
      }
    },
    
    // Reset state when logging out
    resetChat: () => initialState,
  },
});

export const {
  fetchConversationsRequest,
  fetchConversationsSuccess,
  fetchConversationsFailure,
  setActiveConversation,
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  sendMessageRequest,
  sendMessageSuccess,
  sendMessageFailure,
  newMessageReceived,
  resetChat,
  setConnectionState,
  addToOfflineQueue,
  removeFromOfflineQueue,
  clearOfflineQueue,
  updateMessageStatus,
  deleteMessage,
} = chatSlice.actions;

export default chatSlice.reducer; 