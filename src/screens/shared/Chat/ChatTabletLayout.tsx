import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ChatListScreen } from './index';
import { ChatConversationScreen } from './index';
import { NewConversationScreen } from './index';

interface ChatTabletLayoutProps {
  userRole?: 'administrator' | 'business-manager';
}

/**
 * A layout component specifically for tablet view of chat functionality
 * Shows a master-detail view with conversation list on left and selected conversation on right
 */
export const ChatTabletLayout: React.FC<ChatTabletLayoutProps> = ({
  userRole = 'administrator',
}) => {
  const route = useRoute<any>();
  
  // State
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isCreatingNewConversation, setIsCreatingNewConversation] = useState(false);
  
  // Handle route parameters
  useEffect(() => {
    if (route.params?.conversationId) {
      setSelectedConversationId(route.params.conversationId);
      setIsCreatingNewConversation(false);
    }
  }, [route.params]);
  
  // Handlers
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsCreatingNewConversation(false);
  };
  
  const handleCreateNewConversation = () => {
    setSelectedConversationId(null);
    setIsCreatingNewConversation(true);
  };
  
  const handleConversationCreated = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsCreatingNewConversation(false);
  };
  
  // Render master-detail view
  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <ChatListScreen 
          userRole={userRole}
          onSelectConversation={handleSelectConversation}
          onCreateNewConversation={handleCreateNewConversation}
          currentConversationId={selectedConversationId}
        />
      </View>
      
      <View style={styles.mainContent}>
        {selectedConversationId ? (
          <ChatConversationScreen 
            conversationId={selectedConversationId}
            userRole={userRole}
            onGoBack={() => setSelectedConversationId(null)}
          />
        ) : isCreatingNewConversation ? (
          <NewConversationScreen 
            onConversationCreated={handleConversationCreated}
            onCancel={() => setIsCreatingNewConversation(false)}
            userRole={userRole}
          />
        ) : (
          <View style={styles.emptyState} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 350,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.1)',
  },
  mainContent: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 