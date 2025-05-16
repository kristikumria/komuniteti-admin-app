import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  useTheme,
  Text,
  Button,
  Card,
  Chip,
  Divider,
  FAB,
  SegmentedButtons,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import { Calendar, Clock, Users, Edit, Trash2 } from 'lucide-react-native';
import { AdministratorStackParamList } from '../../../navigation/types';
import { getPollsList } from '../../../services/pollService';
import { Poll } from '../../../navigation/types';
import { formatDate } from '../../../utils/dateUtils';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { HeaderBar } from '../../../components/HeaderBar';
import { EmptyState } from '../../../components/EmptyState';
import { ConfirmationDialog } from '../../../components/ConfirmationDialog';

export const PollsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState<string | null>(null);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const data = await getPollsList();
      setPolls(data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPolls();
    setRefreshing(false);
  };

  const filteredPolls = polls.filter(poll => {
    if (filter === 'active') return poll.status === 'active';
    if (filter === 'expired') return poll.status === 'expired';
    if (filter === 'draft') return poll.status === 'draft';
    return true;
  });

  const handleViewPoll = (pollId: string) => {
    navigation.navigate('PollDetails', { pollId });
  };

  const handleEditPoll = (pollId: string) => {
    navigation.navigate('EditPoll', { pollId });
  };

  const handleDeletePoll = (pollId: string) => {
    setSelectedPollId(pollId);
    setDeleteDialogVisible(true);
  };

  const confirmDeletePoll = async () => {
    if (selectedPollId) {
      // TODO: Implement delete poll API call
      setPolls(polls.filter(poll => poll.id !== selectedPollId));
      setDeleteDialogVisible(false);
      setSelectedPollId(null);
    }
  };

  const renderPollCard = (poll: Poll) => {
    const isActive = poll.status === 'active';
    const isExpired = poll.status === 'expired';
    const isDraft = poll.status === 'draft';

    return (
      <Card
        key={poll.id}
        style={styles.card}
        onPress={() => handleViewPoll(poll.id)}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.title}>
              {poll.title}
            </Text>
            <View style={styles.actions}>
              <IconButton
                icon={() => <Edit size={20} color={theme.colors.primary} />}
                onPress={() => handleEditPoll(poll.id)}
              />
              <IconButton
                icon={() => <Trash2 size={20} color={theme.colors.error} />}
                onPress={() => handleDeletePoll(poll.id)}
              />
            </View>
          </View>
          <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
            {poll.description}
          </Text>

          <Divider style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Calendar size={16} color={theme.colors.secondary} />
              <Text variant="bodySmall">
                Created: {formatDate(new Date(poll.createdAt))}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={16} color={theme.colors.secondary} />
              <Text variant="bodySmall">
                Expires: {formatDate(new Date(poll.expiresAt))}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Users size={16} color={theme.colors.secondary} />
              <Text variant="bodySmall">
                {poll.responseCount} responses
              </Text>
            </View>
            <View>
              {isActive && (
                <Chip
                  mode="outlined"
                  textStyle={{ color: theme.colors.primary }}
                  style={{ borderColor: theme.colors.primary }}
                >
                  Active
                </Chip>
              )}
              {isExpired && (
                <Chip
                  mode="outlined"
                  textStyle={{ color: theme.colors.error }}
                  style={{ borderColor: theme.colors.error }}
                >
                  Expired
                </Chip>
              )}
              {isDraft && (
                <Chip
                  mode="outlined"
                  textStyle={{ color: theme.colors.secondary }}
                  style={{ borderColor: theme.colors.secondary }}
                >
                  Draft
                </Chip>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScreenWrapper>
      <HeaderBar title="Polls & Surveys" />
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <SegmentedButtons
            value={filter}
            onValueChange={setFilter}
            buttons={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'expired', label: 'Expired' },
              { value: 'draft', label: 'Draft' },
            ]}
          />
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : filteredPolls.length > 0 ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {filteredPolls.map(renderPollCard)}
          </ScrollView>
        ) : (
          <EmptyState
            icon="poll"
            title="No polls found"
            description={`You haven't created any polls yet.`}
            actionLabel="Create Poll"
            onAction={() => navigation.navigate('CreatePoll')}
          />
        )}

        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('CreatePoll')}
        />

        <ConfirmationDialog
          visible={deleteDialogVisible}
          title="Delete Poll"
          content="Are you sure you want to delete this poll? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={confirmDeletePoll}
          onCancel={() => setDeleteDialogVisible(false)}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontWeight: '600',
  },
  description: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actions: {
    flexDirection: 'row',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
}); 