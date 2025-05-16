/**
 * Chat Module
 * 
 * A modern messaging system for the Komuniteti platform with a consistent design
 * and seamless user experience across all screens.
 * 
 * Key features:
 * - Responsive design optimized for both mobile and tablet layouts
 * - Real-time message delivery with offline support
 * - Multimedia attachments and rich media sharing
 * - Consistent UI following Material Design 3 principles
 */

// Direct imports of the implementation files
import ChatScreen from './ChatScreen';
import ChatConversationScreen from './ChatConversationScreen';
import NewConversationScreen from './NewConversationScreen';
import { ChatTabletLayout } from './ChatTabletLayout';

// Export all the components
export {
  ChatScreen,
  ChatConversationScreen,
  NewConversationScreen,
  ChatTabletLayout,
  
  // For backward compatibility
  ChatScreen as ChatListScreen
};

// Export types
export * from './types'; 