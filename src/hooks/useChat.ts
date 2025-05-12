import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import chatService from '../services/chatService';
import socketService from '../services/socketService';
import {
  fetchConversationsRequest,
  fetchConversationsSuccess,
  fetchConversationsFailure,
  fetchMessagesRequest,
  fetchMessagesSuccess,
  fetchMessagesFailure,
  sendMessageRequest,
  sendMessageSuccess,
  sendMessageFailure,
  setActiveConversation,
} from '../store/slices/chatSlice';

/**
 * Custom hook for chat functionality
 * This provides a unified API for all chat-related operations
 */
export const useChat = () => {
  const dispatch = useDispatch();
  const {
    conversations,
    activeConversationId,
    activeConversationMessages,
    loading,
    error,
    unreadCount,
  } = useSelector((state: RootState) => state.chat);
  
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Initialize chat
  const initialize = useCallback(async () => {
    try {
      // Connect to socket
      await socketService.connect();
      
      // Load initial conversations
      await loadConversations();
      
      return true;
    } catch (error) {
      console.error('Error initializing chat:', error);
      return false;
    }
  }, []);
  
  // Load all conversations
  const loadConversations = useCallback(async () => {
    try {
      dispatch(fetchConversationsRequest());
      const conversations = await chatService.getConversations();
      dispatch(fetchConversationsSuccess(conversations));
      return conversations;
    } catch (error) {
      console.error('Error loading conversations:', error);
      dispatch(fetchConversationsFailure(error instanceof Error ? error.message : 'Failed to load conversations'));
      return [];
    }
  }, [dispatch]);
  
  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      dispatch(fetchMessagesRequest());
      
      // Set as active conversation
      dispatch(setActiveConversation(conversationId));
      
      // Mark messages as read
      await chatService.markMessagesAsRead(conversationId);
      
      // Get messages
      const messages = await chatService.getMessages(conversationId);
      dispatch(fetchMessagesSuccess(messages));
      return messages;
    } catch (error) {
      console.error('Error loading messages:', error);
      dispatch(fetchMessagesFailure(error instanceof Error ? error.message : 'Failed to load messages'));
      return [];
    }
  }, [dispatch]);
  
  // Send a message
  const sendMessage = useCallback(async (conversationId: string, content: string, replyToId?: string) => {
    if (!content.trim()) return null;
    
    try {
      dispatch(sendMessageRequest());
      
      // Send message via service
      const sentMessage = await chatService.sendMessage({
        conversationId,
        content,
        replyToId
      });
      
      // Update Redux state
      dispatch(sendMessageSuccess(sentMessage));
      
      return sentMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch(sendMessageFailure(error instanceof Error ? error.message : 'Failed to send message'));
      return null;
    }
  }, [dispatch]);
  
  // Delete a message
  const deleteMessage = useCallback(async (messageId: string, conversationId: string) => {
    try {
      await chatService.deleteMessage(messageId, conversationId);
      
      // Reload messages to update the UI
      await loadMessages(conversationId);
      
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }, [dispatch, loadMessages]);
  
  // Create a new conversation
  const createConversation = useCallback(async (
    title: string,
    participantIds: string[],
    isGroup: boolean
  ) => {
    try {
      const newConversation = await chatService.createConversation({
        title,
        participantIds,
        isGroup
      });
      
      // Reload conversations to include the new one
      await loadConversations();
      
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }, [dispatch, loadConversations]);
  
  // Get the active conversation
  const activeConversation = useCallback(() => {
    if (!activeConversationId) return null;
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);
  
  return {
    // State
    conversations,
    activeConversationId,
    activeConversationMessages,
    loading,
    error,
    unreadCount,
    activeConversation: activeConversation(),
    
    // Actions
    initialize,
    loadConversations,
    loadMessages,
    sendMessage,
    deleteMessage,
    createConversation
  };
}; 