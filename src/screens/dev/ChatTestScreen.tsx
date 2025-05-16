import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Button, useTheme, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ChatTabletLayout } from '../shared/Chat/ChatTabletLayout';
import socketService from '../../services/socketService';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { initializeChat } from '../../store/actions/chatActions'; 
import { RootStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Test screen to verify chat functionality
 */
export const ChatTestScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get connection state from Redux
  const { isConnected, isInternetReachable } = useAppSelector(
    state => state.chat.connectionState
  );
  
  // Initialize chat when component mounts
  useEffect(() => {
    const setupChat = async () => {
      try {
        // @ts-ignore: Dispatch typing issue
        const success = await dispatch(initializeChat());
        if (!success) {
          setError('Failed to initialize chat');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setInitializing(false);
      }
    };
    
    setupChat();
    
    // Clean up on unmount
    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);
  
  if (initializing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar backgroundColor={theme.colors.background} barStyle={theme.dark ? 'light-content' : 'dark-content'} />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.statusText, { color: theme.colors.onBackground }]}>
            Initializing chat...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar backgroundColor={theme.colors.background} barStyle={theme.dark ? 'light-content' : 'dark-content'} />
        <View style={styles.centerContent}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.goBack()}
            style={{ marginTop: 20 }}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar backgroundColor={theme.colors.background} barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      
      {/* Connection status indicator */}
      {(!isConnected || !isInternetReachable) && (
        <View style={[
          styles.connectionBanner,
          { backgroundColor: theme.colors.errorContainer }
        ]}>
          <Text style={[styles.connectionText, { color: theme.colors.onErrorContainer }]}>
            {!isInternetReachable 
              ? 'No internet connection' 
              : 'Disconnected from chat service'}
          </Text>
        </View>
      )}
      
      {/* Chat tablet layout - handles both tablet and phone views */}
      <View style={styles.chatContainer}>
        <ChatTabletLayout />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  connectionBanner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
  },
  connectionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
}); 