import { store } from './store';
import { loginSuccess } from './slices/authSlice';
import { fetchConversationsSuccess } from './slices/chatSlice';
import { ChatConversation, User } from '../navigation/types';

// Mock user data
const mockUser: User = {
  id: 'admin1',
  name: 'Admin User',
  email: 'admin@komuniteti.com',
  role: 'administrator'
};

// Mock conversations
const mockConversations: ChatConversation[] = [
  {
    id: 'conv1',
    title: 'Jane Smith',
    participants: [
      {
        id: 'user-1',
        name: 'Jane Smith',
        role: 'resident',
        image: 'https://randomuser.me/api/portraits/women/12.jpg',
        isOnline: true
      },
      {
        id: 'admin1',
        name: 'Admin User',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        isOnline: true
      }
    ],
    lastMessage: {
      id: 'msg-1',
      conversationId: 'conv1',
      senderId: 'user-1',
      senderName: 'Jane Smith',
      senderRole: 'resident',
      content: 'When will the water be back on?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      readBy: []
    },
    unreadCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isGroup: false
  },
  {
    id: 'conv2',
    title: 'Building A Group',
    participants: [
      {
        id: 'user-2',
        name: 'John Doe',
        role: 'resident',
        image: 'https://randomuser.me/api/portraits/men/22.jpg',
        isOnline: false
      },
      {
        id: 'user-3',
        name: 'Alice Brown',
        role: 'resident',
        image: 'https://randomuser.me/api/portraits/women/32.jpg',
        isOnline: true
      },
      {
        id: 'admin1',
        name: 'Admin User',
        role: 'admin',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        isOnline: true
      }
    ],
    lastMessage: {
      id: 'msg-2',
      conversationId: 'conv2',
      senderId: 'admin1',
      senderName: 'Admin User',
      senderRole: 'admin',
      content: 'The maintenance is scheduled for tomorrow',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      readBy: ['user-2']
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isGroup: true,
    image: 'https://via.placeholder.com/150/92c952'
  }
];

// Initialize store with mock data
export const initializeMockStore = () => {
  // Set mock user
  store.dispatch(loginSuccess({
    user: mockUser,
    token: 'mock-token-123'
  }));
  
  // Set mock conversations
  store.dispatch(fetchConversationsSuccess(mockConversations));
};

// Export for use in App.tsx or wherever needed
export default initializeMockStore; 