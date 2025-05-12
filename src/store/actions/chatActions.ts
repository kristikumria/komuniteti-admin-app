import { Dispatch } from '@reduxjs/toolkit';
import { ChatMessage, ChatConversation } from '../../navigation/types';
import chatService from '../../services/chatService';
import socketService from '../../services/socketService';
import logger from '../../utils/logger';
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
  addToOfflineQueue,
  removeFromOfflineQueue,
  updateMessageStatus as updateMessageStatusAction,
  setConnectionState,
  deleteMessage as deleteMessageAction
} from '../slices/chatSlice';
import { RootState } from '../store';

// Load all conversations
export const loadConversations = () => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchConversationsRequest());
    const conversations = await chatService.getConversations();
    dispatch(fetchConversationsSuccess(conversations));
    return conversations;
  } catch (error) {
    logger.error('Error loading conversations:', error);
    dispatch(fetchConversationsFailure(error instanceof Error ? error.message : 'Failed to load conversations'));
    return [];
  }
};

// Load messages for a conversation
export const loadMessages = (conversationId: string, page = 1, limit = 30) => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchMessagesRequest());
    
    // Load messages from service
    const messages = await chatService.getMessages(conversationId, page, limit);
    
    // Update Redux state
    dispatch(fetchMessagesSuccess(messages));
    
    // Mark messages as read
    await chatService.markMessagesAsRead(conversationId);
    
    return messages;
  } catch (error) {
    logger.error('Error loading messages:', error);
    dispatch(fetchMessagesFailure(error instanceof Error ? error.message : 'Failed to load messages'));
    return [];
  }
};

// Send a new message
export const sendMessage = (conversationId: string, content: string, replyToId?: string) => 
  async (dispatch: any, getState: () => RootState) => {
    try {
      dispatch(sendMessageRequest());
      
      // Check if we're online
      const { connectionState } = getState().chat;
      if (!connectionState.isConnected) {
        // Queue message for when we're back online
        dispatch(addToOfflineQueue({ conversationId, content, replyToId }));
        throw new Error("No network connection. Message queued for later.");
      }
      
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
      logger.error('Error sending message:', error);
      
      // If it's just offline, we don't want to show an error since we're queuing
      if (error instanceof Error && error.message.includes("queued")) {
        return null; // Signal that message is queued
      }
      
      dispatch(sendMessageFailure(error instanceof Error ? error.message : 'Failed to send message'));
      throw error;
    }
};

// Delete a message
export const deleteMessage = (messageId: string, conversationId: string) => async (dispatch: any) => {
  try {
    // Call API to delete
    await chatService.deleteMessage(messageId, conversationId);
    
    // Update local state
    dispatch(deleteMessageAction(messageId));
    
    return true;
  } catch (error) {
    logger.error('Error deleting message:', error);
    return false;
  }
};

// Process offline message queue
export const processOfflineQueue = () => async (dispatch: any, getState: () => RootState) => {
  const { offlineMessageQueue, connectionState } = getState().chat;
  
  if (!connectionState.isConnected || offlineMessageQueue.length === 0) {
    return;
  }
  
  // Process each queued message
  for (let i = 0; i < offlineMessageQueue.length; i++) {
    const queuedMessage = offlineMessageQueue[i];
    
    try {
      // Send the message
      const sentMessage = await chatService.sendMessage({
        conversationId: queuedMessage.conversationId,
        content: queuedMessage.content,
        replyToId: queuedMessage.replyToId
      });
      
      // Update Redux state
      dispatch(sendMessageSuccess(sentMessage));
      
      // Remove from queue
      dispatch(removeFromOfflineQueue(i));
      
      // Adjust counter since we removed an item
      i--;
    } catch (error) {
      logger.error('Error sending queued message:', error);
      // Continue with next message
    }
  }
};

// Initialize socket connection
export const initializeChat = () => async (dispatch: any, getState: () => RootState) => {
  try {
    // Connect to socket
    const connected = await socketService.connect();
    
    // Set connection state based on result
    dispatch(setConnectionState({
      isConnected: connected,
      isInternetReachable: connected
    }));
    
    if (connected) {
      logger.log('Chat socket connected successfully');
      
      // Load initial conversations
      dispatch(loadConversations());
      
      // Process any offline queued messages
      dispatch(processOfflineQueue());
    } else {
      logger.error('Failed to connect to chat socket');
    }
    
    return connected;
  } catch (error) {
    logger.error('Error initializing chat:', error);
    return false;
  }
};

// Update message status
export const updateMessageStatus = (messageId: string, status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed') => 
  (dispatch: any) => {
    dispatch(updateMessageStatusAction({ messageId, status }));
};

// Create a new conversation
export const createConversation = (
  title: string,
  participantIds: string[],
  isGroup: boolean
) => async (dispatch: Dispatch) => {
  try {
    const newConversation = await chatService.createConversation({
      title,
      participantIds,
      isGroup
    });
    
    // Reload conversations to include the new one
    dispatch(loadConversations());
    
    return newConversation;
  } catch (error) {
    logger.error('Error creating conversation:', error);
    throw error;
  }
}; 