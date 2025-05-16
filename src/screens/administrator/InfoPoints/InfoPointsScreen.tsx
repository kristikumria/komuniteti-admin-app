import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  useTheme,
  Text,
  Card,
  IconButton,
  Divider,
  FAB,
  Searchbar,
  SegmentedButtons,
  ActivityIndicator,
} from 'react-native-paper';
import { Edit, Trash2, FileText, Building, HelpCircle } from 'lucide-react-native';
import { getInfoPoints } from '../../../services/infoPointService';
import { InfoPoint } from '../../../types/infoPoint';
import { formatDate } from '../../../utils/dateUtils';

export const InfoPointsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [infoPoints, setInfoPoints] = useState<InfoPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedInfoPointId, setSelectedInfoPointId] = useState<string | null>(null);

  const fetchInfoPoints = async () => {
    try {
      setLoading(true);
      const data = await getInfoPoints();
      setInfoPoints(data);
    } catch (error) {
      console.error('Error fetching info points:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInfoPoints();
    setRefreshing(false);
  };

  const filteredInfoPoints = infoPoints
    .filter(infoPoint => {
      // Filter by category
      if (category !== 'all' && infoPoint.category !== category) return false;
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          infoPoint.title.toLowerCase().includes(query) ||
          infoPoint.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'guidelines':
        return <FileText size={20} color={theme.colors.secondary} />;
      case 'building':
        return <Building size={20} color={theme.colors.primary} />;
      case 'faq':
        return <HelpCircle size={20} color={theme.colors.tertiary} />;
      default:
        return <FileText size={20} color={theme.colors.secondary} />;
    }
  };

  const handleViewInfoPoint = (infoPointId: string) => {
    navigation.navigate('InfoPointDetails', { infoPointId });
  };

  const handleEditInfoPoint = (infoPointId: string) => {
    navigation.navigate('EditInfoPoint', { infoPointId });
  };

  const handleDeleteInfoPoint = (infoPointId: string) => {
    setSelectedInfoPointId(infoPointId);
    setDeleteDialogVisible(true);
  };

  const confirmDeleteInfoPoint = async () => {
    if (selectedInfoPointId) {
      // TODO: Implement delete info point API call
      setInfoPoints(infoPoints.filter(ip => ip.id !== selectedInfoPointId));
      setDeleteDialogVisible(false);
      setSelectedInfoPointId(null);
    }
  };

  const renderInfoPointCard = (infoPoint: InfoPoint) => {
    return (
      <Card
        key={infoPoint.id}
        style={styles.card}
        onPress={() => handleViewInfoPoint(infoPoint.id)}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              {getCategoryIcon(infoPoint.category)}
              <Text variant="titleMedium" style={styles.title}>
                {infoPoint.title}
              </Text>
            </View>
            <View style={styles.actions}>
              <IconButton
                icon={() => <Edit size={20} color={theme.colors.primary} />}
                onPress={() => handleEditInfoPoint(infoPoint.id)}
              />
              <IconButton
                icon={() => <Trash2 size={20} color={theme.colors.error} />}
                onPress={() => handleDeleteInfoPoint(infoPoint.id)}
              />
            </View>
          </View>
          
          <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
            {infoPoint.description}
          </Text>
          
          <Divider style={styles.divider} />
          
          <View style={styles.footer}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              Last updated: {formatDate(new Date(infoPoint.updatedAt))}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {infoPoint.visibility === 'all' ? 'Visible to all' : 'Restricted'}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.screenTitle}>
          Info Points
        </Text>
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={category}
          onValueChange={setCategory}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'guidelines', label: 'Guidelines' },
            { value: 'building', label: 'Building' },
            { value: 'faq', label: 'FAQ' },
          ]}
        />
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : filteredInfoPoints.length > 0 ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filteredInfoPoints.map(renderInfoPointCard)}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge">No info points found</Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Add building guidelines, FAQs, or reference content for residents.
          </Text>
        </View>
      )}
      
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('CreateInfoPoint')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  screenTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 8,
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  title: {
    fontWeight: '600',
    flex: 1,
  },
  description: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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