import { User } from '../navigation/types';
import { ChatConversation, ChatMessage } from '../navigation/types';
import { AuthState } from '../store/slices/authSlice';

declare module '../store/store' {
  export interface RootState {
    auth: AuthState;
    chat: {
      conversations: ChatConversation[];
      activeConversationId: string | null;
      activeConversationMessages: ChatMessage[];
      loading: boolean;
      error: string | null;
      unreadCount: number;
    };
    settings: any;
    payments: any;
    notifications: any;
  }

  export type AppDispatch = any;
} 