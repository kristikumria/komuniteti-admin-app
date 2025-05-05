import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatConversation, ChatMessage } from '../../navigation/types';

interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  activeConversationMessages: ChatMessage[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  activeConversationMessages: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
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
      const conversation = state.conversations.find(c => c.id === action.payload);
      if (conversation) {
        state.unreadCount -= conversation.unreadCount;
        conversation.unreadCount = 0;
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
      state.activeConversationMessages.push(action.payload);
      
      // Update the conversation's last message
      const conversationIndex = state.conversations.findIndex(
        c => c.id === action.payload.conversationId
      );
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = action.payload;
        state.conversations[conversationIndex].updatedAt = action.payload.timestamp;
        
        // Move this conversation to the top of the list
        const conversation = state.conversations[conversationIndex];
        state.conversations.splice(conversationIndex, 1);
        state.conversations.unshift(conversation);
      }
    },
    sendMessageFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    // New message received
    newMessageReceived: (state, action: PayloadAction<ChatMessage>) => {
      const { conversationId } = action.payload;
      
      // If we're in the conversation already, add it to active messages
      if (state.activeConversationId === conversationId) {
        state.activeConversationMessages.push(action.payload);
      } else {
        // Otherwise increment unread count
        state.unreadCount += 1;
        
        const conversationIndex = state.conversations.findIndex(
          c => c.id === conversationId
        );
        
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].unreadCount += 1;
          state.conversations[conversationIndex].lastMessage = action.payload;
          state.conversations[conversationIndex].updatedAt = action.payload.timestamp;
          
          // Move this conversation to the top of the list
          const conversation = state.conversations[conversationIndex];
          state.conversations.splice(conversationIndex, 1);
          state.conversations.unshift(conversation);
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
} = chatSlice.actions;

export default chatSlice.reducer; 