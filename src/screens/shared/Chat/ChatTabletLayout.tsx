import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MasterDetailView } from '../../../components/MasterDetailView';
import { ChatListScreen, ChatConversationScreen } from './index';
import { AdministratorStackParamList } from '../../../navigation/types';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { Header } from '../../../components/Header';

type NavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;
type ChatRouteProps = RouteProp<AdministratorStackParamList, 'Chat'>;
type ChatConversationRouteProps = RouteProp<AdministratorStackParamList, 'ChatConversation'>;

/**
 * Responsive layout for Chat that shows a master-detail view on tablets
 * and a standard stack navigation on phones
 */
export const ChatTabletLayout = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ChatRouteProps | ChatConversationRouteProps>();
  const { isTablet, breakpoint } = useBreakpoint();
  const { commonStyles } = useThemedStyles();
  
  // Get the conversation ID from the route params if we're on the conversation screen
  const conversationId = 'params' in route && route.params?.conversationId;
  
  // State to track the selected conversation
  const [selectedConversationId, setSelectedConversationId] = useState<string | undefined>(
    typeof conversationId === 'string' ? conversationId : undefined
  );
  
  // Update selectedConversationId when navigation changes
  useEffect(() => {
    if (typeof conversationId === 'string') {
      setSelectedConversationId(conversationId);
    }
  }, [conversationId]);
  
  // Custom navigation for the chat list that updates the selected conversation
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    
    // Only navigate on non-tablet devices
    if (!isTablet) {
      navigation.navigate('ChatConversation', { conversationId });
    }
  };
  
  // Handle back navigation from conversation on tablets
  const handleGoBack = () => {
    if (isTablet) {
      setSelectedConversationId(undefined);
    } else {
      navigation.goBack();
    }
  };
  
  // Wrap the ChatListScreen component with custom navigation
  const ChatListWrapper = () => (
    <View style={{ flex: 1 }}>
      <ChatListScreen 
        navigateToConversation={handleConversationSelect}
        navigateToNewConversation={() => navigation.navigate('NewConversation')}
      />
    </View>
  );
  
  // Conditionally render ChatConversationScreen only if we have a selected conversation
  const ChatConversationWrapper = () => (
    selectedConversationId ? (
      <View style={{ flex: 1 }}>
        <ChatConversationScreen 
          conversationId={selectedConversationId}
          onGoBack={handleGoBack}
        />
      </View>
    ) : (
      <View style={[commonStyles.centeredContainer, { padding: 20 }]}>
        <Header 
          title="Messages"
          subtitle="Select a conversation from the list"
          centerTitle={true}
          showBack={!isTablet}
        />
      </View>
    )
  );
  
  // Return different layouts based on device size
  if (isTablet) {
    // Use different ratios for portrait vs landscape on tablets
    const { width, height } = Dimensions.get('window');
    const isLandscape = width > height;
    const ratio = isLandscape ? 0.35 : 0.4; // Master takes less width in landscape
    
    return (
      <MasterDetailView
        masterContent={<ChatListWrapper />}
        detailContent={<ChatConversationWrapper />}
        ratio={ratio}
      />
    );
  }
  
  // On phones, just render the list
  return <ChatListWrapper />;
}; 