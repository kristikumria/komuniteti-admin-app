import axios from 'axios';
import { 
  ChatMessage, 
  ChatConversation, 
  ChatAttachment, 
  ChatParticipant 
} from '../navigation/types';
import socketService from './socketService';
import { store } from '../store/store';
import { newMessageReceived, sendMessageSuccess } from '../store/slices/chatSlice';

// API config
const API_URL = process.env.API_URL || 'https://api.komuniteti.com';

// Mock data storage (shared across the app for consistency)
let MOCK_CONVERSATIONS: Record<string, ChatConversation> = {};
let MOCK_MESSAGES: Record<string, ChatMessage[]> = {};

// Initialize mock data
const initMockData = () => {
  // Mock participants
  const MOCK_PARTICIPANTS: Record<string, ChatParticipant> = {
    'admin1': {
      id: 'admin1',
      name: 'Arben Hoxha',
      role: 'admin',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      isOnline: true,
    },
    'admin2': {
      id: 'admin2',
      name: 'Sara Mati',
      role: 'admin',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      isOnline: false,
      lastSeen: '2023-05-15T14:30:00Z',
    },
    'admin3': {
      id: 'admin3',
      name: 'Elton Zholi',
      role: 'admin',
      image: 'https://randomuser.me/api/portraits/men/55.jpg',
      isOnline: false,
      lastSeen: '2023-05-15T10:15:00Z',
    },
    'admin4': {
      id: 'admin4',
      name: 'Drita Koka',
      role: 'admin',
      image: 'https://randomuser.me/api/portraits/women/33.jpg',
      isOnline: true,
    },
    'manager1': {
      id: 'manager1',
      name: 'Elena Koci',
      role: 'manager',
      image: 'https://randomuser.me/api/portraits/women/28.jpg',
      isOnline: true,
    },
    'resident1': {
      id: 'resident1',
      name: 'John Smith',
      role: 'resident',
      image: 'https://randomuser.me/api/portraits/men/41.jpg',
      lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      isOnline: false,
    },
    'resident2': {
      id: 'resident2',
      name: 'Maria Garcia',
      role: 'resident',
      image: 'https://randomuser.me/api/portraits/women/63.jpg',
      lastSeen: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isOnline: true,
    },
  };

  // Create conversations
  MOCK_CONVERSATIONS = {
    '1': {
      id: '1',
      title: 'Building A Administrators',
      participants: [MOCK_PARTICIPANTS.admin1, MOCK_PARTICIPANTS.admin2, MOCK_PARTICIPANTS.manager1],
      unreadCount: 0,
      createdAt: '2023-01-15T09:00:00Z',
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      isGroup: true,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1aWxkaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    },
    '2': {
      id: '2',
      title: 'Building B Team',
      participants: [MOCK_PARTICIPANTS.admin3, MOCK_PARTICIPANTS.admin4, MOCK_PARTICIPANTS.manager1],
      unreadCount: 0,
      createdAt: '2023-02-20T11:30:00Z',
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      isGroup: true,
      image: 'https://images.unsplash.com/photo-1554435493-93422e8d1a41?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGJ1aWxkaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    },
    '3': {
      id: '3',
      title: 'Elena Koci',
      participants: [MOCK_PARTICIPANTS.admin1, MOCK_PARTICIPANTS.manager1],
      unreadCount: 0,
      createdAt: '2023-03-10T08:45:00Z',
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      isGroup: false,
    },
    '4': {
      id: '4',
      title: 'Resident Support',
      participants: [MOCK_PARTICIPANTS.admin1, MOCK_PARTICIPANTS.resident1],
      unreadCount: 0,
      createdAt: '2023-04-05T10:15:00Z',
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
      isGroup: false,
    },
    '5': {
      id: '5',
      title: 'Community Chat',
      participants: [
        MOCK_PARTICIPANTS.admin1, 
        MOCK_PARTICIPANTS.admin2, 
        MOCK_PARTICIPANTS.manager1,
        MOCK_PARTICIPANTS.resident1,
        MOCK_PARTICIPANTS.resident2
      ],
      unreadCount: 0,
      createdAt: '2023-03-01T09:00:00Z',
      updatedAt: new Date(Date.now() - 43200000).toISOString(),
      isGroup: true,
      image: 'https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    }
  };

  // Generate messages for each conversation
  MOCK_MESSAGES = {
    '1': [
      {
        id: 'm101',
        conversationId: '1',
        senderId: 'admin1',
        senderName: 'Arben Hoxha',
        senderRole: 'admin',
        senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        content: 'Good morning everyone. We need to discuss the maintenance schedule for Building A next month.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        readBy: ['admin1', 'admin2', 'manager1'],
        status: 'read',
      },
      {
        id: 'm102',
        conversationId: '1',
        senderId: 'admin2',
        senderName: 'Sara Mati',
        senderRole: 'admin',
        senderImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        content: 'I agree. The elevator needs servicing and we need to schedule a time that minimizes disruption for residents.',
        timestamp: new Date(Date.now() - 6000000).toISOString(),
        readBy: ['admin1', 'admin2', 'manager1'],
        status: 'read',
      },
      {
        id: 'm103',
        conversationId: '1',
        senderId: 'manager1',
        senderName: 'Elena Koci',
        senderRole: 'manager',
        content: 'Good point, Sara. Let\'s schedule the elevator maintenance for a weekday between 10am-2pm when most residents are at work.',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        readBy: ['admin1', 'admin2', 'manager1'],
        status: 'read',
      }
    ],
    '2': [
      {
        id: 'm201',
        conversationId: '2',
        senderId: 'admin3',
        senderName: 'Elton Zholi',
        senderRole: 'admin',
        senderImage: 'https://randomuser.me/api/portraits/men/55.jpg',
        content: 'I received a report about a water leak in apartment 302. The resident says it\'s coming from the ceiling.',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        readBy: ['admin3', 'admin4', 'manager1'],
        status: 'read',
      },
      {
        id: 'm202',
        conversationId: '2',
        senderId: 'manager1',
        senderName: 'Elena Koci',
        senderRole: 'manager',
        content: 'That sounds serious. Have you inspected it yet?',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        readBy: ['admin3', 'admin4', 'manager1'],
        status: 'read',
      }
    ],
    '3': [
      {
        id: 'm301',
        conversationId: '3',
        senderId: 'admin1',
        senderName: 'Arben Hoxha',
        senderRole: 'admin',
        senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        content: 'Hello Elena, I wanted to discuss the budget for the lobby renovation project in Building A.',
        timestamp: new Date(Date.now() - 604800000).toISOString(),
        readBy: ['admin1', 'manager1'],
        status: 'read',
      },
      {
        id: 'm302',
        conversationId: '3',
        senderId: 'manager1',
        senderName: 'Elena Koci',
        senderRole: 'manager',
        content: 'Hi Arben, of course. What\'s your proposal?',
        timestamp: new Date(Date.now() - 518400000).toISOString(),
        readBy: ['admin1', 'manager1'],
        status: 'read',
      }
    ],
    '4': [
      {
        id: 'm401',
        conversationId: '4',
        senderId: 'resident1',
        senderName: 'John Smith',
        senderRole: 'resident',
        senderImage: 'https://randomuser.me/api/portraits/men/41.jpg',
        content: 'Hello, I have a question about the new recycling policy. Where should I place the bins?',
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        readBy: ['resident1', 'admin1'],
        status: 'read',
      },
      {
        id: 'm402',
        conversationId: '4',
        senderId: 'admin1',
        senderName: 'Arben Hoxha',
        senderRole: 'admin',
        senderImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        content: 'Hi John, the recycling bins should be placed in the designated area in the basement. I can show you if you\'d like.',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        readBy: ['resident1', 'admin1'],
        status: 'read',
      }
    ],
    '5': [
      {
        id: 'm501',
        conversationId: '5',
        senderId: 'manager1',
        senderName: 'Elena Koci',
        senderRole: 'manager',
        content: 'Hello everyone! We\'re organizing a community meeting next Friday at 6 PM. Please try to attend as we\'ll discuss important building updates.',
        timestamp: new Date(Date.now() - 432000000).toISOString(),
        readBy: ['manager1', 'admin1', 'admin2', 'resident1', 'resident2'],
        status: 'read',
      },
      {
        id: 'm502',
        conversationId: '5',
        senderId: 'resident2',
        senderName: 'Maria Garcia',
        senderRole: 'resident',
        senderImage: 'https://randomuser.me/api/portraits/women/63.jpg',
        content: 'Will there be an option to join remotely for those who can\'t attend in person?',
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        readBy: ['manager1', 'admin1', 'admin2', 'resident1', 'resident2'],
        status: 'read',
      }
    ]
  };

  // Set last message for each conversation
  Object.keys(MOCK_CONVERSATIONS).forEach(id => {
    const messages = MOCK_MESSAGES[id];
    if (messages && messages.length > 0) {
      MOCK_CONVERSATIONS[id] = {
        ...MOCK_CONVERSATIONS[id],
        lastMessage: messages[messages.length - 1]
      };
    }
  });
};

// Initialize mock data when the module is loaded
initMockData();

// Helper functions
const getCurrentUser = () => {
  const state = store.getState();
  return state.auth?.user || { id: 'unknown', name: 'Unknown User', role: 'admin' };
};

export const chatService = {
  // Get all conversations for a user
  getConversations: async (): Promise<ChatConversation[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Convert object to array and sort by updateAt
        const conversationsList = Object.values(MOCK_CONVERSATIONS).sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        resolve(conversationsList);
      }, 500);
    });
  },
  
  // Get a specific conversation by ID
  getConversationById: async (conversationId: string): Promise<ChatConversation> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const conversation = MOCK_CONVERSATIONS[conversationId];
        if (conversation) {
          resolve({...conversation});
        } else {
          reject(new Error(`Conversation with ID ${conversationId} not found`));
        }
      }, 300);
    });
  },
  
  // Get messages for a conversation
  getMessages: async (conversationId: string, page = 1, limit = 20): Promise<ChatMessage[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allMessages = [...(MOCK_MESSAGES[conversationId] || [])];
        // Sort messages by timestamp (newest first)
        allMessages.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        // Paginate results
        const startIdx = (page - 1) * limit;
        const endIdx = startIdx + limit;
        const paginatedMessages = allMessages.slice(startIdx, endIdx);
        
        resolve(paginatedMessages);
      }, 500);
    });
  },
  
  // Send a message
  sendMessage: async (messageData: {
    conversationId: string;
    content: string;
    replyToId?: string;
  }): Promise<ChatMessage> => {
    return new Promise((resolve) => {
      // Get current user from Redux store
      const currentUser = getCurrentUser();
      
      // Find conversation
      const conversation = MOCK_CONVERSATIONS[messageData.conversationId];
      if (!conversation) {
        throw new Error(`Conversation with ID ${messageData.conversationId} not found`);
      }
      
      // Create reply data if needed
      let replyTo: ChatMessage['replyTo'] = undefined;
      if (messageData.replyToId) {
        const messages = MOCK_MESSAGES[messageData.conversationId] || [];
        const repliedMessage = messages.find(m => m.id === messageData.replyToId);
        if (repliedMessage) {
          replyTo = {
            id: repliedMessage.id,
            senderId: repliedMessage.senderId,
            senderName: repliedMessage.senderName,
            content: repliedMessage.content
          };
        }
      }
      
      // Create new message
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: messageData.conversationId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: currentUser.role as any,
        content: messageData.content,
        timestamp: new Date().toISOString(),
        readBy: [currentUser.id],
        status: 'sent',
        replyTo
      };
      
      // Add to mock data
      if (!MOCK_MESSAGES[messageData.conversationId]) {
        MOCK_MESSAGES[messageData.conversationId] = [];
      }
      MOCK_MESSAGES[messageData.conversationId].push(newMessage);
      
      // Update conversation's last message and timestamp
      // Create a clone of the existing conversation and modify the clone
      MOCK_CONVERSATIONS[messageData.conversationId] = {
        ...MOCK_CONVERSATIONS[messageData.conversationId],
        lastMessage: newMessage,
        updatedAt: newMessage.timestamp
      };
      
      // Simulate socket delivery to other users
      setTimeout(() => {
        // Update message status to delivered
        newMessage.status = 'delivered';
        
        // Notify via socket
        socketService.notifyNewMessage(newMessage);
      }, 1000);
      
      resolve(newMessage);
    });
  },
  
  // Mark messages as read
  markMessagesAsRead: async (conversationId: string): Promise<void> => {
    return new Promise((resolve) => {
      const currentUser = getCurrentUser();
      
      setTimeout(() => {
        // Mark conversation as read
        const conversation = MOCK_CONVERSATIONS[conversationId];
        if (conversation) {
          // Create a clone of the conversation and update it
          MOCK_CONVERSATIONS[conversationId] = {
            ...conversation,
            unreadCount: 0
          };
        }
        
        // Mark all messages as read by current user
        const messages = MOCK_MESSAGES[conversationId] || [];
        MOCK_MESSAGES[conversationId] = messages.map(message => {
          if (!message.readBy.includes(currentUser.id)) {
            return {
              ...message,
              readBy: [...message.readBy, currentUser.id],
              status: message.senderId !== currentUser.id ? 'read' : message.status
            };
          }
          return message;
        });
        
        resolve();
      }, 300);
    });
  },
  
  // Create a new conversation
  createConversation: async (data: {
    title: string;
    participantIds: string[];
    isGroup: boolean;
  }): Promise<ChatConversation> => {
    return new Promise((resolve) => {
      const currentUser = getCurrentUser();
      
      setTimeout(() => {
        // Create a simple conversation with participants
        const conversationId = `conv-${Date.now()}`;
        const participants = data.participantIds.map(id => {
          // In a real app, this would be fetched from a users database
          return {
            id,
            name: `User ${id.substring(0, 4)}`,
            role: 'resident' as const,
            isOnline: false,
          };
        });
        
        // Add current user if not already in participants
        if (!participants.some(p => p.id === currentUser.id)) {
          participants.push({
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role as any,
            isOnline: true,
          });
        }
        
        // Create the conversation
        const newConversation: ChatConversation = {
          id: conversationId,
          title: data.title,
          participants,
          unreadCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isGroup: data.isGroup,
        };
        
        // Add to mock data
        MOCK_CONVERSATIONS[conversationId] = newConversation;
        MOCK_MESSAGES[conversationId] = [];
        
        resolve(newConversation);
      }, 500);
    });
  },
  
  // Delete a message
  deleteMessage: async (messageId: string, conversationId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const messages = MOCK_MESSAGES[conversationId];
        if (!messages) {
          reject(new Error('Conversation not found'));
          return;
        }
        
        const messageIndex = messages.findIndex(m => m.id === messageId);
        if (messageIndex === -1) {
          reject(new Error('Message not found'));
          return;
        }
        
        // Remove the message using immutable array methods
        MOCK_MESSAGES[conversationId] = [
          ...messages.slice(0, messageIndex),
          ...messages.slice(messageIndex + 1)
        ];
        
        // Update last message if needed
        if (MOCK_MESSAGES[conversationId].length > 0) {
          const sortedMessages = [...MOCK_MESSAGES[conversationId]].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          const lastMessage = sortedMessages[0];
          
          // Update conversation with new lastMessage
          MOCK_CONVERSATIONS[conversationId] = {
            ...MOCK_CONVERSATIONS[conversationId],
            lastMessage
          };
        } else {
          // No messages left, create a new object without lastMessage
          const { lastMessage, ...conversationWithoutLastMessage } = MOCK_CONVERSATIONS[conversationId];
          MOCK_CONVERSATIONS[conversationId] = conversationWithoutLastMessage;
        }
        
        resolve();
      }, 300);
    });
  },
  
  // Helper to reset mock data (for testing)
  resetMockData: () => {
    initMockData();
  },
  
  // Helper to add a message directly (for testing)
  _addMessage: (message: ChatMessage) => {
    if (!MOCK_MESSAGES[message.conversationId]) {
      MOCK_MESSAGES[message.conversationId] = [];
    }
    
    // Add message to messages array
    MOCK_MESSAGES[message.conversationId] = [
      ...MOCK_MESSAGES[message.conversationId],
      message
    ];
    
    // Update conversation with new message
    MOCK_CONVERSATIONS[message.conversationId] = {
      ...MOCK_CONVERSATIONS[message.conversationId],
      lastMessage: message,
      updatedAt: message.timestamp
    };
  }
};

export default chatService; 