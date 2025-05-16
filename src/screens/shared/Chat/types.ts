import { ChatMessage, ChatConversation, ChatParticipant, ChatAttachment } from '../../../navigation/types';

// Extended message status type for strict typing
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

// Interface for connection state
export interface ConnectionState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
}

// Interface for message context menu 
export interface MessageContextMenu {
  visible: boolean;
  messageId: string | null;
  x: number;
  y: number;
}

// Extended attachment interfaces for better type safety
export interface ImageAttachment extends ChatAttachment {
  uri?: string;
  width?: number;
  height?: number;
  thumbnailUri?: string;
}

export interface DocumentAttachment extends ChatAttachment {
  uri?: string;
  extension?: string;
  icon?: string;
}

export interface LocationAttachment extends ChatAttachment {
  latitude?: number;
  longitude?: number;
  address?: string;
}

// Interface for upload progress
export interface UploadProgressInfo {
  messageId: string;
  progress: number;
  isUploading: boolean;
}

// Interface for pending messages to handle offline scenarios
export interface PendingMessage extends ChatMessage {
  localId?: string;
  sentAt?: number;
}

// Message state interface for better state management
export interface MessageState {
  messages: ChatMessage[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  page: number;
  error: string | null;
}

// Props for the Message List component
export interface MessageListProps {
  messages: ChatMessage[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onLoadMore: () => void;
  onScroll: (event: any) => void;
  flatListRef: React.RefObject<any>;
  renderEmptyComponent: () => React.ReactNode;
  renderFooter: () => React.ReactNode;
  onMessageReply: (message: ChatMessage) => void;
  onMessageDelete: (messageId: string) => void;
  onLongPress: (message: ChatMessage, event: any) => void;
  uploadProgress: UploadProgressInfo | null;
  retryFailedMessage: (messageId: string) => void;
  userId: string;
  isDarkMode: boolean;
}

// Props for the MessageInput component
export interface MessageInputProps {
  onSendMessage: (text: string, attachment?: any) => void;
  onAttachmentSelect?: (attachment: any) => void;
  replyingTo?: {
    id: string;
    senderName: string;
    content: string;
    senderId?: string;
  } | null;
  onCancelReply?: () => void;
  sending?: boolean;
  placeholder?: string;
  isDarkMode?: boolean;
  onTypingStatusChange?: (isTyping: boolean) => void;
}

// Props for the screens
export interface ChatScreenProps {
  userRole?: 'administrator' | 'business-manager';
  onSelectConversation?: (conversationId: string) => void;
  onCreateNewConversation?: () => void;
  currentConversationId?: string | null;
}

export interface ChatConversationScreenProps {
  conversationId?: string;
  userRole?: 'administrator' | 'business-manager';
  onGoBack?: () => void;
}

export interface NewConversationScreenProps {
  onConversationCreated?: (conversationId: string) => void;
  onCancel?: () => void;
  userRole?: 'administrator' | 'business-manager';
}

export interface ChatTabletLayoutProps {
  userRole?: 'administrator' | 'business-manager';
} 