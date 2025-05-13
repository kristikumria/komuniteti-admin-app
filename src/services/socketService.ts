import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store/store';
import { newMessageReceived } from '../store/slices/chatSlice';
import { ChatMessage, ChatAttachment } from '../navigation/types';
import NetInfo from '@react-native-community/netinfo';
import logger from '../utils/logger';

// Define __DEV__ if not available in environment
declare const __DEV__: boolean;
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:3000';
const RECONNECTION_ATTEMPTS = 5;
const RECONNECTION_DELAY = 3000;

type EventHandler = (...args: any[]) => void;

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, EventHandler[]> = new Map();
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private networkSubscription: any = null;
  private isConnecting = false;
  private messageQueue: ChatMessage[] = [];
  private isProcessingQueue = false;

  constructor() {
    // Setup network state listener
    this.setupNetworkListener();
  }

  private setupNetworkListener() {
    this.networkSubscription = NetInfo.addEventListener(state => {
      // Update connection state in Redux - directly dispatch the state
      store.dispatch({
        type: 'chat/setConnectionState',
        payload: {
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable
        }
      });

      // If we regained connection, try to connect socket
      if (state.isConnected && state.isInternetReachable) {
        this.reconnect();
      }
    });
  }

  async connect() {
    // Prevent multiple connection attempts
    if (this.isConnecting) return false;

    try {
      this.isConnecting = true;
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        this.isConnecting = false;
        throw new Error('No authentication token found');
      }

      // For development only - mock connection to prevent errors
      if (isDev && !process.env.SOCKET_URL) {
        logger.log('Using mock socket connection in development mode');
        // Fake success for development
        setTimeout(() => {
          // Update connection state
          store.dispatch({
            type: 'chat/setConnectionState',
            payload: {
              isConnected: true,
              isInternetReachable: true
            }
          });
        }, 500);
        this.isConnecting = false;
        return true;
      }

      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'], // Add polling as fallback
        reconnection: true,
        reconnectionAttempts: RECONNECTION_ATTEMPTS,
        reconnectionDelay: RECONNECTION_DELAY,
        timeout: 10000
      });

      this.setupSocketEventHandlers();
      this.setupMessageHandlers();

      // Set up all registered listeners
      this.listeners.forEach((handlers, event) => {
        handlers.forEach(handler => {
          this.socket?.on(event, handler);
        });
      });

      // Load pending messages when initializing
      await this.loadPendingMessages();

      return new Promise<boolean>((resolve) => {
        // Handle successful connection
        this.socket?.once('connect', () => {
          logger.log('Socket connected successfully');
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          // Dispatch connection state
          store.dispatch({
            type: 'chat/setConnectionState',
            payload: {
              isConnected: true,
              isInternetReachable: true
            }
          });
          
          // Process any queued messages
          this.processMessageQueue();
          
          resolve(true);
        });

        // Handle connection error
        this.socket?.once('connect_error', (err) => {
          logger.error('Socket connection error:', err);
          this.isConnecting = false;
          resolve(false);
          this.attemptReconnect();
        });
      });
    } catch (error) {
      logger.error('Socket connection error:', error);
      this.isConnecting = false;
      return false;
    }
  }

  private setupSocketEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      logger.log('Socket connected');
      this.reconnectAttempts = 0;
      // Dispatch connection state
      store.dispatch({
        type: 'chat/setConnectionState',
        payload: {
          isConnected: true,
          isInternetReachable: true
        }
      });
    });

    this.socket.on('disconnect', (reason) => {
      logger.log('Socket disconnected:', reason);
      // Dispatch connection state
      store.dispatch({
        type: 'chat/setConnectionState',
        payload: {
          isConnected: false,
          isInternetReachable: true
        }
      });
      
      // If the server closed the connection, try to reconnect
      if (reason === 'io server disconnect') {
        this.attemptReconnect();
      }
    });

    this.socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  }

  private attemptReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.reconnectAttempts < RECONNECTION_ATTEMPTS) {
      this.reconnectAttempts++;
      logger.log(`Attempting to reconnect (${this.reconnectAttempts}/${RECONNECTION_ATTEMPTS})...`);
      
      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, RECONNECTION_DELAY);
    } else {
      logger.error('Max reconnection attempts reached');
      // Dispatch connection state
      store.dispatch({
        type: 'chat/setConnectionState',
        payload: {
          isConnected: false,
          isInternetReachable: false
        }
      });
    }
  }

  reconnect() {
    if (this.socket?.connected) return;
    this.reconnectAttempts = 0;
    this.connect();
  }

  // Set up chat-related socket handlers
  private setupMessageHandlers() {
    if (this.socket) {
      // Handle new chat messages
      this.socket.on('new_message', (message: ChatMessage) => {
        logger.log('New message received:', message);
        store.dispatch(newMessageReceived(message));
      });

      // Handle typing indicators
      this.socket.on('typing', ({ conversationId, userId, userName, isTyping }: { 
        conversationId: string, 
        userId: string,
        userName: string,
        isTyping: boolean 
      }) => {
        logger.log('Typing indicator:', { conversationId, userId, isTyping });
        this.emit('typing_indicator_update', { conversationId, userId, userName, isTyping });
      });

      // Handle read receipts
      this.socket.on('message_read', ({ conversationId, messageId, userId }: {
        conversationId: string,
        messageId: string,
        userId: string
      }) => {
        logger.log('Message read:', { conversationId, messageId, userId });
        this.emit('read_receipt_update', { conversationId, messageId, userId });
      });
    }
  }

  // Register event listener
  on(event: string, callback: EventHandler): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)?.push(callback);
    
    // If socket is already connected, add the listener directly
    if (this.socket?.connected) {
      this.socket.on(event, callback);
    }
    
    // Return unsubscribe function
    return () => {
      const handlers = this.listeners.get(event) || [];
      const index = handlers.indexOf(callback);
      if (index !== -1) {
        handlers.splice(index, 1);
        if (this.socket) {
          this.socket.off(event, callback);
        }
      }
    };
  }

  // Emit event to server
  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
      return true;
    } else if (isDev && !process.env.SOCKET_URL) {
      // Mock emission for development
      logger.log('Mock socket emit:', event, data);
      
      // Handle special events for development
      if (event === 'typing') {
        // Simulate the other person typing back
        setTimeout(() => {
          this.mockEmitEvent('typing_indicator_update', {
            conversationId: data.conversationId,
            userId: 'mock-user-id',
            userName: 'Mock User',
            isTyping: true
          });
          
          // Stop typing after a few seconds
          setTimeout(() => {
            this.mockEmitEvent('typing_indicator_update', {
              conversationId: data.conversationId,
              userId: 'mock-user-id',
              userName: 'Mock User',
              isTyping: false
            });
          }, 3000);
        }, 1000);
      }
      
      return true;
    } else {
      logger.warn(`Failed to emit ${event}: Socket not connected`);
      return false;
    }
  }

  // Mock event emission for development
  private mockEmitEvent(event: string, data: any) {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach(handler => {
      handler(data);
    });
  }

  // Send typing indicator
  sendTypingIndicator(conversationId: string, isTyping: boolean) {
    return this.emit('typing', { 
      conversationId, 
      isTyping 
    });
  }
  
  // Send read receipt
  sendReadReceipt(conversationId: string, messageId: string) {
    if (this.socket?.connected) {
      this.socket.emit('message_read', { conversationId, messageId });
    } else if (isDev && !process.env.SOCKET_URL) {
      // Mock in development
      logger.log('Mock read receipt:', { conversationId, messageId });
    }
  }

  // Load pending messages from AsyncStorage
  async loadPendingMessages() {
    try {
      const pendingMessagesJson = await AsyncStorage.getItem('pendingMessages');
      
      if (pendingMessagesJson) {
        this.messageQueue = JSON.parse(pendingMessagesJson);
        logger.log(`Loaded ${this.messageQueue.length} pending messages from storage`);
      }
    } catch (error) {
      logger.error('Error loading pending messages from storage:', error);
    }
  }
  
  // Save pending messages to AsyncStorage
  async savePendingMessages() {
    try {
      await AsyncStorage.setItem('pendingMessages', JSON.stringify(this.messageQueue));
    } catch (error) {
      logger.error('Error saving pending messages to storage:', error);
    }
  }
  
  // Add message to queue for offline sending
  async addMessageToQueue(message: ChatMessage) {
    this.messageQueue.push(message);
    await this.savePendingMessages();
    logger.log(`Added message to queue. Queue size: ${this.messageQueue.length}`);
  }
  
  // Process message queue
  async processMessageQueue() {
    if (this.isProcessingQueue || this.messageQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    logger.log(`Processing message queue. ${this.messageQueue.length} messages pending.`);
    
    try {
      // Process messages in order
      const messagesToProcess = [...this.messageQueue];
      this.messageQueue = [];
      
      for (const message of messagesToProcess) {
        try {
          // Skip if we're offline
          if (!this.socket?.connected) {
            this.messageQueue.push(message);
            continue;
          }
          
          // Try to send message
          await this.notifyNewMessage(message);
          logger.log(`Successfully sent queued message: ${message.id}`);
          
          // Add short delay between messages
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
          logger.error(`Failed to send queued message: ${message.id}`, error);
          this.messageQueue.push(message); // Put back in queue for retry
        }
      }
      
      // Save any remaining messages
      await this.savePendingMessages();
    } catch (error) {
      logger.error('Error processing message queue:', error);
    } finally {
      this.isProcessingQueue = false;
    }
    
    logger.log(`Finished processing queue. ${this.messageQueue.length} messages remaining.`);
  }
  
  // Enhanced notifyNewMessage to handle offline mode
  async notifyNewMessage(message: ChatMessage): Promise<boolean> {
    // If not connected, queue message and return
    if (!this.socket?.connected) {
      await this.addMessageToQueue(message);
      return false;
    }
    
    return new Promise((resolve) => {
      // For development mock functionality
      if (isDev && !process.env.SOCKET_URL) {
        this.mockEmitEvent('message_sent', { 
          messageId: message.id, 
          status: 'sent',
          timestamp: new Date().toISOString()
        });
        
        // Simulate successful send
        setTimeout(() => {
          this.mockEmitEvent('message_delivered', { 
            messageId: message.id, 
            status: 'delivered',
            timestamp: new Date().toISOString()
          });
          
          // Simulate other participants reading the message 
          setTimeout(() => {
            this.mockEmitEvent('message_read', { 
              messageId: message.id, 
              status: 'read',
              timestamp: new Date().toISOString(),
              readBy: message.readBy 
            });
          }, 3000);
        }, 1500);
        
        resolve(true);
        return;
      }
      
      // For real server implementation
      this.socket?.emit('new_message', message, (response: any) => {
        if (response && response.success) {
          resolve(true);
        } else {
          logger.error('Failed to send message:', response?.error || 'Unknown error');
          resolve(false);
        }
      });
      
      // Set a timeout in case server doesn't respond
      setTimeout(() => {
        logger.warn('Message send timed out');
        resolve(false);
      }, 5000);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.networkSubscription) {
      this.networkSubscription();
      this.networkSubscription = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

const socketService = new SocketService();
export default socketService; 