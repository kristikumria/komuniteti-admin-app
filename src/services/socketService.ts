import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store/store';
import { newMessageReceived, setConnectionState } from '../store/slices/chatSlice';
import { ChatMessage, ChatAttachment } from '../navigation/types';
import NetInfo from '@react-native-community/netinfo';
import logger from '../utils/logger';

// Define __DEV__ if not available in environment
declare const __DEV__: boolean;
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';

const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:3000';
const RECONNECTION_ATTEMPTS = 5;
const RECONNECTION_DELAY = 3000;

// More specific event handler type
type EventHandler<T = any> = (data: T) => void;

// Define socket event types for better typechecking
interface TypingEvent {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

interface ReadReceiptEvent {
  conversationId: string;
  messageId: string;
  userId: string;
  timestamp: string;
}

interface MessageStatusEvent {
  messageId: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  readBy?: string[];
}

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
      // Update connection state in Redux using action creator
      store.dispatch(setConnectionState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable
      }));

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
          store.dispatch(setConnectionState({
            isConnected: true,
            isInternetReachable: true
          }));
        }, 500);
        this.isConnecting = false;
        return true;
      }

      // Close existing socket if there is one
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }

      // Create new socket connection
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
        // Set a connection timeout
        const timeout = setTimeout(() => {
          logger.error('Socket connection timeout');
          this.isConnecting = false;
          resolve(false);
          this.attemptReconnect();
        }, 15000);

        // Handle successful connection
        this.socket?.once('connect', () => {
          clearTimeout(timeout);
          logger.log('Socket connected successfully');
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          // Dispatch connection state
          store.dispatch(setConnectionState({
            isConnected: true,
            isInternetReachable: true
          }));
          
          // Process any queued messages
          this.processMessageQueue();
          
          resolve(true);
        });

        // Handle connection error
        this.socket?.once('connect_error', (err) => {
          clearTimeout(timeout);
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
      store.dispatch(setConnectionState({
        isConnected: true,
        isInternetReachable: true
      }));
    });

    this.socket.on('disconnect', (reason) => {
      logger.log('Socket disconnected:', reason);
      // Dispatch connection state
      store.dispatch(setConnectionState({
        isConnected: false,
        isInternetReachable: true
      }));
      
      // If the server closed the connection, try to reconnect
      if (reason === 'io server disconnect') {
        this.attemptReconnect();
      }
    });

    this.socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });

    // Handle reconnect attempts
    this.socket.io.on('reconnect_attempt', (attempt) => {
      logger.log(`Socket reconnect attempt ${attempt}`);
    });

    this.socket.io.on('reconnect', () => {
      logger.log('Socket reconnected');
      store.dispatch(setConnectionState({
        isConnected: true,
        isInternetReachable: true
      }));
    });

    this.socket.io.on('reconnect_error', (error) => {
      logger.error('Socket reconnect error:', error);
    });

    this.socket.io.on('reconnect_failed', () => {
      logger.error('Socket reconnect failed');
      store.dispatch(setConnectionState({
        isConnected: false,
        isInternetReachable: false
      }));
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
      store.dispatch(setConnectionState({
        isConnected: false,
        isInternetReachable: false
      }));
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
      // Handle new chat messages with proper typing
      this.socket.on('new_message', (message: ChatMessage) => {
        logger.log('New message received:', message);
        try {
          store.dispatch(newMessageReceived(message));
        } catch (error) {
          logger.error('Error dispatching new message:', error);
        }
      });

      // Handle typing indicators with proper typing
      this.socket.on('typing', (data: TypingEvent) => {
        logger.log('Typing indicator:', data);
        this.emit('typing_indicator_update', data);
      });

      // Handle read receipts with proper typing
      this.socket.on('message_read', (data: ReadReceiptEvent) => {
        logger.log('Message read:', data);
        this.emit('read_receipt_update', data);
      });
      
      // Handle message status updates
      this.socket.on('message_status', (data: MessageStatusEvent) => {
        logger.log('Message status update:', data);
        store.dispatch({
          type: 'chat/updateMessageStatus',
          payload: {
            messageId: data.messageId,
            status: data.status
          }
        });
      });
    }
  }

  // Register event listener with type safety
  on<T>(event: string, callback: EventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)?.push(callback as EventHandler);
    
    // If socket is already connected, add listener directly
    if (this.socket?.connected) {
      this.socket.on(event, callback);
    }
    
    // Return a function to remove this specific listener
    return () => {
      const handlers = this.listeners.get(event);
      if (handlers) {
        const index = handlers.indexOf(callback as EventHandler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      }
      
      if (this.socket) {
        this.socket.off(event, callback);
      }
    };
  }

  // Emit event to server with improved error handling
  emit(event: string, data: any): boolean {
    if (this.socket?.connected) {
      try {
        this.socket.emit(event, data);
        return true;
      } catch (error) {
        logger.error(`Error emitting event ${event}:`, error);
        return false;
      }
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
      // If not connected, try reconnecting
      this.reconnect();
      return false;
    }
  }

  // Helper for mock events
  private mockEmitEvent(event: string, data: any) {
    // Find all handlers for this event
    const handlers = this.listeners.get(event) || [];
    // Call each handler with the data
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        logger.error(`Error in mock event handler for ${event}:`, error);
      }
    });
  }

  // Typing indicator with improved type safety
  sendTypingIndicator(conversationId: string, isTyping: boolean): boolean {
    return this.emit('typing', {
      conversationId,
      isTyping
    });
  }

  // Read receipt with improved type safety
  sendReadReceipt(conversationId: string, messageId: string): boolean {
    return this.emit('message_read', {
      conversationId,
      messageId
    });
  }

  // Load pending messages with better error handling
  async loadPendingMessages(): Promise<void> {
    try {
      const storedMessages = await AsyncStorage.getItem('pendingMessages');
      if (storedMessages) {
        this.messageQueue = JSON.parse(storedMessages);
        logger.log(`Loaded ${this.messageQueue.length} pending messages`);
      }
    } catch (error) {
      logger.error('Error loading pending messages:', error);
      this.messageQueue = [];
    }
  }

  // Save pending messages with better error handling
  async savePendingMessages(): Promise<void> {
    try {
      await AsyncStorage.setItem('pendingMessages', JSON.stringify(this.messageQueue));
    } catch (error) {
      logger.error('Error saving pending messages:', error);
    }
  }

  // Add message to queue with improved typing
  async addMessageToQueue(message: ChatMessage): Promise<void> {
    this.messageQueue.push(message);
    await this.savePendingMessages();
    logger.log(`Added message to queue (${this.messageQueue.length} total)`);
  }

  // Process the message queue with improved error handling and retry logic
  async processMessageQueue(): Promise<void> {
    // If already processing or queue is empty, return
    if (this.isProcessingQueue || this.messageQueue.length === 0) {
      return;
    }

    // If not connected, try reconnecting first
    if (!this.socket?.connected && !isDev) {
      await this.connect();
      if (!this.socket?.connected) {
        return; // Still not connected, exit
      }
    }

    this.isProcessingQueue = true;
    logger.log(`Processing message queue (${this.messageQueue.length} messages)`);

    try {
      // Process messages one by one, from oldest to newest
      while (this.messageQueue.length > 0) {
        const message = this.messageQueue[0];
        
        // Skip if no message ID
        if (!message?.id) {
          this.messageQueue.shift();
          continue;
        }
        
        // Try to send the message
        const success = await this.notifyNewMessage(message);
        
        if (success) {
          // Message sent successfully, remove from queue
          this.messageQueue.shift();
          logger.log(`Successfully sent queued message ${message.id}`);
        } else {
          // Failed to send, leave in queue for next attempt
          logger.warn(`Failed to send queued message ${message.id}, will retry later`);
          break; // Stop processing and try again later
        }
      }
      
      // Save the updated queue
      await this.savePendingMessages();
    } catch (error) {
      logger.error('Error processing message queue:', error);
    } finally {
      this.isProcessingQueue = false;
    }
  }
  
  // Enhanced notifyNewMessage to handle offline mode
  async notifyNewMessage(message: ChatMessage): Promise<boolean> {
    // If not connected, queue message and return
    if (!this.socket?.connected && !isDev) {
      await this.addMessageToQueue(message);
      return false;
    }
    
    return new Promise<boolean>((resolve) => {
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

  // Clean disconnect with improved cleanup
  disconnect(): void {
    if (this.networkSubscription) {
      this.networkSubscription();
      this.networkSubscription = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.close();
      this.socket = null;
    }
    
    // Reset all state
    this.listeners.clear();
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    this.isProcessingQueue = false;
    
    logger.log('Socket service disconnected and cleaned up');
  }

  // Check connection status
  isConnected(): boolean {
    return !!this.socket?.connected || (isDev && !process.env.SOCKET_URL);
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService; 