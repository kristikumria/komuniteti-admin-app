import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store/store';
import { newMessageReceived } from '../store/slices/chatSlice';
import { ChatMessage } from '../navigation/types';

const SOCKET_URL = 'wss://api.komuniteti.com'; // Replace with your actual socket URL

type EventHandler = (...args: any[]) => void;

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, EventHandler[]> = new Map();

  async connect() {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      this.socket = io(SOCKET_URL, {
        auth: {
          token,
        },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Socket connected');
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      // Set up chat message handling
      this.setupMessageHandlers();

      // Set up all registered listeners
      this.listeners.forEach((handlers, event) => {
        handlers.forEach((handler) => {
          this.socket?.on(event, handler);
        });
      });

      return true;
    } catch (error) {
      console.error('Socket connection error:', error);
      return false;
    }
  }

  // Set up chat-related socket handlers
  private setupMessageHandlers() {
    if (this.socket) {
      // Handle new chat messages
      this.socket.on('new_message', (message: ChatMessage) => {
        console.log('New message received:', message);
        store.dispatch(newMessageReceived(message));
      });

      // Handle typing indicators
      this.socket.on('typing', ({ conversationId, userId, isTyping }: { 
        conversationId: string, 
        userId: string, 
        isTyping: boolean 
      }) => {
        console.log('Typing indicator:', { conversationId, userId, isTyping });
        // We'll handle this in the future with a Redux action
      });

      // Handle read receipts
      this.socket.on('message_read', ({ conversationId, messageId, userId }: {
        conversationId: string,
        messageId: string,
        userId: string
      }) => {
        console.log('Message read:', { conversationId, messageId, userId });
        // We'll handle this in the future with a Redux action
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)?.push(handler);
    
    if (this.socket) {
      this.socket.on(event, handler);
    }

    return () => this.off(event, handler);
  }

  off(event: string, handler: EventHandler) {
    const handlers = this.listeners.get(event);
    
    if (handlers) {
      const index = handlers.indexOf(handler);
      
      if (index !== -1) {
        handlers.splice(index, 1);
      }
      
      if (handlers.length === 0) {
        this.listeners.delete(event);
      }
    }
    
    if (this.socket) {
      this.socket.off(event, handler);
    }
  }

  emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event');
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService; 