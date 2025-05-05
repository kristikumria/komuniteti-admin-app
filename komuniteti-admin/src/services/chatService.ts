import axios from 'axios';
import { 
  ChatMessage, 
  ChatConversation, 
  ChatAttachment, 
  ChatParticipant 
} from '../navigation/types';
import socketService from './socketService';

// API config (to be replaced with actual API endpoint)
const API_URL = process.env.API_URL || 'https://api.komuniteti.com';

// Mock data for development until API is ready
const MOCK_PARTICIPANTS: ChatParticipant[] = [
  {
    id: 'user1',
    name: 'John Smith',
    role: 'resident',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
    lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    isOnline: false,
  },
  {
    id: 'user2',
    name: 'Maria Garcia',
    role: 'resident',
    image: 'https://randomuser.me/api/portraits/women/63.jpg',
    lastSeen: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    isOnline: true,
  },
  {
    id: 'user3',
    name: 'David Kim',
    role: 'resident',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    isOnline: false,
  },
  {
    id: 'admin1',
    name: 'Sarah Johnson',
    role: 'admin',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    isOnline: true,
  },
  {
    id: 'manager1',
    name: 'Robert Chen',
    role: 'manager',
    image: 'https://randomuser.me/api/portraits/men/33.jpg',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isOnline: false,
  },
];

// Generate mock messages for a conversation
const generateMockMessages = (conversationId: string, count: number = 15): ChatMessage[] => {
  const messages: ChatMessage[] = [];
  const startTime = Date.now() - 1000 * 60 * 60 * 24 * 3; // 3 days ago
  
  for (let i = 0; i < count; i++) {
    const isFromCurrentUser = Math.random() > 0.5;
    const timestamp = new Date(startTime + (i * 1000 * 60 * 60 * 2)).toISOString(); // Every 2 hours
    const attachment = i % 7 === 0 ? [{
      id: `attach${i}`,
      type: 'image' as const,
      url: `https://picsum.photos/500/300?random=${i}`,
      name: `image${i}.jpg`,
      size: 12345,
      thumbnailUrl: `https://picsum.photos/100/100?random=${i}`,
      mimeType: 'image/jpeg',
    }] : undefined;
    
    messages.push({
      id: `msg${conversationId}-${i}`,
      conversationId,
      senderId: isFromCurrentUser ? 'admin1' : (i % 2 === 0 ? 'user1' : 'user2'),
      senderName: isFromCurrentUser ? 'Sarah Johnson' : (i % 2 === 0 ? 'John Smith' : 'Maria Garcia'),
      senderRole: isFromCurrentUser ? 'admin' : 'resident',
      senderImage: isFromCurrentUser ? 'https://randomuser.me/api/portraits/women/44.jpg' : 
                   (i % 2 === 0 ? 'https://randomuser.me/api/portraits/men/41.jpg' : 'https://randomuser.me/api/portraits/women/63.jpg'),
      content: getRandomMessage(i),
      timestamp,
      readBy: isFromCurrentUser ? ['admin1', 'user1', 'user2'] : ['admin1'],
      attachments: attachment,
      status: 'read',
    });
  }
  
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Helper to generate random message content
const getRandomMessage = (index: number): string => {
  const messages = [
    "Hi there! I wanted to ask about the maintenance schedule.",
    "Good morning! When will the plumber be available?",
    "Just checking in on the status of my request.",
    "Thanks for your help yesterday.",
    "Could you please let me know when the electrician is coming?",
    "Is there any update on the building renovation?",
    "I'd like to schedule a meeting to discuss the community event.",
    "The elevator is out of service again. Any ETA on the repair?",
    "I've attached the photo of the leaking pipe in my bathroom.",
    "Please let me know if you need any additional information.",
    "The heating system isn't working properly in my unit.",
    "When will the gardener come to trim the trees?",
    "I've noticed some issues with the parking area lighting.",
    "Could you provide information about the upcoming residents' meeting?",
    "I need to report a noise complaint from the unit above me.",
  ];
  return messages[index % messages.length];
};

// Generate mock conversations
const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv1',
    title: 'Apartment 101 - Maintenance',
    participants: [MOCK_PARTICIPANTS[0], MOCK_PARTICIPANTS[3]],
    unreadCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isGroup: false,
  },
  {
    id: 'conv2',
    title: 'Apartment 205 - Rent Question',
    participants: [MOCK_PARTICIPANTS[1], MOCK_PARTICIPANTS[3]],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isGroup: false,
  },
  {
    id: 'conv3',
    title: 'Building A - Community Discussion',
    participants: [MOCK_PARTICIPANTS[0], MOCK_PARTICIPANTS[1], MOCK_PARTICIPANTS[2], MOCK_PARTICIPANTS[3], MOCK_PARTICIPANTS[4]],
    unreadCount: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(), // 21 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    isGroup: true,
    image: 'https://picsum.photos/200/200?random=building',
  },
  {
    id: 'conv4',
    title: 'Apartment 310 - General Inquiries',
    participants: [MOCK_PARTICIPANTS[2], MOCK_PARTICIPANTS[3]],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    isGroup: false,
  },
];

// Add mock messages to each conversation
MOCK_CONVERSATIONS.forEach(conv => {
  const messages = generateMockMessages(conv.id);
  conv.lastMessage = messages[messages.length - 1];
});

export const chatService = {
  // Get all conversations for a user
  getConversations: async (userId: string): Promise<ChatConversation[]> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/users/${userId}/conversations`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          // Filter conversations where user is a participant
          const userConversations = MOCK_CONVERSATIONS.filter(
            conv => conv.participants.some(p => p.id === userId)
          );
          resolve(userConversations);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },
  
  // Get a specific conversation by ID
  getConversationById: async (conversationId: string): Promise<ChatConversation> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/conversations/${conversationId}`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
          if (conversation) {
            resolve(conversation);
          } else {
            reject(new Error(`Conversation with ID ${conversationId} not found`));
          }
        }, 500);
      });
    } catch (error) {
      console.error(`Error fetching conversation ${conversationId}:`, error);
      throw error;
    }
  },
  
  // Get messages for a conversation
  getMessages: async (conversationId: string): Promise<ChatMessage[]> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const messages = generateMockMessages(conversationId);
          resolve(messages);
        }, 500);
      });
    } catch (error) {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error);
      throw error;
    }
  },
  
  // Send a message to a conversation
  sendMessage: async (message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>): Promise<ChatMessage> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.post(`${API_URL}/messages`, message);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const newMessage: ChatMessage = {
            ...message,
            id: `msg-${Date.now()}`,
            timestamp: new Date().toISOString(),
            status: 'sent',
          };
          
          // In a real implementation, we would emit the message via socket
          socketService.emit('new_message', newMessage);
          
          // Update the conversation's last message and unread count
          const conversation = MOCK_CONVERSATIONS.find(c => c.id === message.conversationId);
          if (conversation) {
            conversation.lastMessage = newMessage;
            conversation.updatedAt = newMessage.timestamp;
          }
          
          resolve(newMessage);
        }, 300);
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  // Mark messages as read
  markMessagesAsRead: async (conversationId: string, userId: string): Promise<void> => {
    try {
      // Uncomment when API is ready
      // await axios.post(`${API_URL}/conversations/${conversationId}/read`, { userId });
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          // Update conversation unread count
          const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
          if (conversation) {
            conversation.unreadCount = 0;
          }
          
          resolve();
        }, 300);
      });
    } catch (error) {
      console.error(`Error marking messages as read for conversation ${conversationId}:`, error);
      throw error;
    }
  },
  
  // Create a new conversation
  createConversation: async (conversationData: Omit<ChatConversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChatConversation> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.post(`${API_URL}/conversations`, conversationData);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const now = new Date().toISOString();
          const newConversation: ChatConversation = {
            ...conversationData,
            id: `conv-${Date.now()}`,
            createdAt: now,
            updatedAt: now,
          };
          
          // In a real implementation, we would add the conversation to the database
          MOCK_CONVERSATIONS.push(newConversation);
          
          resolve(newConversation);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },
  
  // Upload attachment for a message
  uploadAttachment: async (file: File): Promise<ChatAttachment> => {
    try {
      // Uncomment when API is ready
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await axios.post(`${API_URL}/attachments`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const randomId = Math.floor(Math.random() * 1000);
          const attachment: ChatAttachment = {
            id: `attach-${Date.now()}`,
            type: file.type.startsWith('image/') ? 'image' : 'document',
            url: `https://picsum.photos/500/300?random=${randomId}`,
            name: file.name,
            size: file.size,
            mimeType: file.type,
            thumbnailUrl: file.type.startsWith('image/') ? `https://picsum.photos/100/100?random=${randomId}` : undefined,
          };
          
          resolve(attachment);
        }, 1000); // Simulate upload time
      });
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  },
  
  // Get participants for conversation creation
  getParticipantsForSelection: async (): Promise<ChatParticipant[]> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/users/available-for-chat`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_PARTICIPANTS);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching participants:', error);
      throw error;
    }
  },
}; 