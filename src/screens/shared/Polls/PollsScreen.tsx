import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Chip, ActivityIndicator, useTheme, FAB } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPollsRequest, fetchPollsSuccess, fetchPollsFailure } from '../../../store/slices/pollsSlice';
import { pollService } from '../../../services/pollService';
import { format } from 'date-fns';
import { Poll } from '../../../navigation/types';
import { Header } from '../../../components/Header';

// This is a shared component, so it could be used with multiple stack types
type Props = {
  navigation: any;
  route: any;
};

export const PollsScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { polls, loading, error } = useAppSelector(state => state.polls);
  const { user } = useAppSelector(state => state.auth);
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  
  useEffect(() => {
    const loadPolls = async () => {
      dispatch(fetchPollsRequest());
      try {
        const data = await pollService.getPolls();
        dispatch(fetchPollsSuccess(data));
      } catch (err) {
        dispatch(fetchPollsFailure(err instanceof Error ? err.message : 'Failed to load polls'));
      }
    };
    
    loadPolls();
  }, [dispatch]);
  
  const handlePollPress = (pollId: string) => {
    navigation.navigate('PollDetails', { pollId });
  };
  
  const handleCreatePoll = () => {
    navigation.navigate('CreatePoll');
  };
  
  const renderPollItem = ({ item }: { item: Poll }) => {
    const isActive = item.status === 'active';
    const expiryDate = new Date(item.expiresAt);
    const isExpired = expiryDate < new Date();
    
    const statusColor = isActive ? theme.colors.primary : (isExpired ? theme.colors.error : theme.colors.secondary);
    const statusText = isActive ? 'Active' : (isExpired ? 'Expired' : 'Closed');
    
    return (
      <Card style={styles.card} onPress={() => handlePollPress(item.id)}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge" style={styles.cardTitle}>{item.title}</Text>
            <Chip style={{ backgroundColor: statusColor }} textStyle={{ color: 'white' }}>
              {statusText}
            </Chip>
          </View>
          
          <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.pollMeta}>
            <Text variant="bodySmall" style={styles.metaText}>
              {`Created: ${format(new Date(item.createdAt), 'MMM d, yyyy')}`}
            </Text>
            
            {isActive && (
              <Text variant="bodySmall" style={styles.metaText}>
                {`Ends: ${format(expiryDate, 'MMM d, yyyy')}`}
              </Text>
            )}
            
            <Text variant="bodySmall" style={styles.metaText}>
              {`Responses: ${item.responseCount}`}
            </Text>
          </View>
          
          <View style={styles.cardActions}>
            <Button 
              mode="contained" 
              onPress={() => handlePollPress(item.id)}
              style={styles.actionButton}
            >
              View Results
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  if (loading && polls.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <Header 
          title="Polls & Surveys" 
          showBack={true}
        />
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  if (error && polls.length === 0) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <Header 
          title="Polls & Surveys" 
          showBack={true}
        />
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }
  
  const isBusinessManager = user?.role === 'business_manager';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <Header 
        title="Polls & Surveys" 
        showBack={true}
      />
      
      {polls.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No polls available at the moment.</Text>
          {isBusinessManager && (
            <Button 
              mode="contained" 
              onPress={handleCreatePoll}
              style={{ marginTop: 16 }}
            >
              Create Your First Poll
            </Button>
          )}
        </View>
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={renderPollItem}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {isBusinessManager && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleCreatePoll}
          color="#fff"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra space for FAB
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    marginBottom: 12,
  },
  pollMeta: {
    marginVertical: 8,
  },
  metaText: {
    marginBottom: 4,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1363DF',
  },
  errorText: {
    color: 'red',
  },
});