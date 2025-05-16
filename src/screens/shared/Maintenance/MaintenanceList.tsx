import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { 
  Text, 
  useTheme, 
  ActivityIndicator, 
  Searchbar, 
  FAB, 
  Chip, 
  Badge, 
  Surface,
  Button
} from 'react-native-paper';
import { 
  Wrench, 
  Filter, 
  Plus, 
  ArrowUpDown, 
  AlertCircle, 
  Droplets, 
  Zap, 
  Wind, 
  Home, 
  Construction,
  Radar
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AdministratorStackParamList, BusinessManagerStackParamList } from '../../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  fetchAllRequests, 
  selectFilteredRequests, 
  selectRequestsLoading, 
  selectRequestsError,
  setSearchQuery,
  setStatusFilter, 
  setTypeFilter,
  selectFilters
} from '../../../store/slices/maintenanceSlice';
import { MaintenanceRequest, MaintenanceType, MaintenanceStatus, MaintenancePriority } from '../../../types/maintenanceTypes';
import { useContextData } from '../../../hooks/useContextData';
import { ContextScreenWrapper } from '../../../components/ContextScreenWrapper';
import { ElevationLevel } from '../../../theme/elevation';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

type BusinessManagerScreenProps = NativeStackScreenProps<BusinessManagerStackParamList, 'MaintenanceRequests'>;
type AdministratorScreenProps = NativeStackScreenProps<AdministratorStackParamList, 'MaintenanceRequests'>;
type Props = BusinessManagerScreenProps | AdministratorScreenProps;

const PriorityColors = {
  low: '#4CAF50',
  medium: '#FFC107',
  high: '#FF9800',
  urgent: '#F44336'
};

const getTypeIcon = (type: MaintenanceType, size = 20, color: string) => {
  switch (type) {
    case 'plumbing':
      return <Droplets size={size} color={color} />;
    case 'electrical':
      return <Zap size={size} color={color} />;
    case 'hvac':
      return <Wind size={size} color={color} />;
    case 'appliance':
      return <Home size={size} color={color} />;
    case 'structural':
      return <Construction size={size} color={color} />;
    case 'common_area':
      return <Radar size={size} color={color} />;
    case 'landscaping':
      return <Radar size={size} color={color} />;
    case 'security':
      return <AlertCircle size={size} color={color} />;
    default:
      return <Wrench size={size} color={color} />;
  }
};

const getStatusText = (status: MaintenanceStatus): string => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in-progress':
      return 'In Progress';
    case 'resolved':
      return 'Resolved';
    case 'cancelled':
      return 'Cancelled';
    default:
      return '';
  }
};

const getStatusColor = (status: MaintenanceStatus): string => {
  switch (status) {
    case 'open':
      return '#F44336'; // Red
    case 'in-progress':
      return '#FFC107'; // Amber
    case 'resolved':
      return '#4CAF50'; // Green
    case 'cancelled':
      return '#9E9E9E'; // Gray
    default:
      return '#000000';
  }
};

const getPriorityText = (priority: MaintenancePriority): string => {
  switch (priority) {
    case 'low':
      return 'Low';
    case 'medium':
      return 'Medium';
    case 'high':
      return 'High';
    case 'urgent':
      return 'Urgent';
    default:
      return '';
  }
};

export const MaintenanceList: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { currentBuilding } = useContextData();
  
  const maintenanceRequests = useAppSelector(selectFilteredRequests);
  const isLoading = useAppSelector(selectRequestsLoading);
  const error = useAppSelector(selectRequestsError);
  const filters = useAppSelector(selectFilters);
  
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'priority'>('newest');
  
  // Load maintenance requests
  useEffect(() => {
    dispatch(fetchAllRequests());
  }, [dispatch]);
  
  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchAllRequests()).finally(() => setRefreshing(false));
  };

  // Handle status filter
  const handleStatusFilter = (status: MaintenanceStatus | 'all') => {
    dispatch(setStatusFilter(status));
  };

  // Handle type filter
  const handleTypeFilter = (type: MaintenanceType | 'all') => {
    dispatch(setTypeFilter(type));
  };

  // Apply sorting to the maintenance requests
  const sortedRequests = [...maintenanceRequests].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOption === 'priority') {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  // Navigate to maintenance detail screen
  const handleMaintenancePress = (maintenanceId: string) => {
    navigation.navigate('MaintenanceDetail', { requestId: maintenanceId });
  };

  // Navigate to create maintenance form
  const handleAddMaintenance = () => {
    const params = currentBuilding ? { buildingId: currentBuilding.id } : undefined;
    navigation.navigate('MaintenanceForm', params);
  };

  // Render maintenance item
  const renderMaintenanceItem = ({ item }: { item: MaintenanceRequest }) => {
    return (
      <TouchableOpacity 
        onPress={() => handleMaintenancePress(item.id)}
        style={styles.itemContainer}
      >
        <Surface style={styles.itemSurface} elevation={2}>
          <View style={styles.itemHeader}>
            <View style={styles.typeIconContainer}>
              {getTypeIcon(item.type, 22, theme.colors.primary)}
            </View>
            <View style={styles.titleContainer}>
              <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text variant="bodySmall" style={styles.location} numberOfLines={1}>
                {item.buildingName} • {item.location}
                {item.unitNumber && ` • Unit ${item.unitNumber}`}
              </Text>
            </View>
            {item.priority === 'urgent' && (
              <Badge style={[styles.priorityBadge, { backgroundColor: PriorityColors.urgent }]}>
                Urgent
              </Badge>
            )}
          </View>
          
          <View style={styles.itemBody}>
            <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          
          <View style={styles.itemFooter}>
            <Chip 
              style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
              textStyle={{ color: getStatusColor(item.status) }}
            >
              {getStatusText(item.status)}
            </Chip>
            
            <View style={styles.footerRight}>
              {item.priority !== 'urgent' && (
                <Chip 
                  style={[styles.priorityChip, { borderColor: PriorityColors[item.priority] }]}
                  textStyle={{ color: PriorityColors[item.priority] }}
                >
                  {getPriorityText(item.priority)}
                </Chip>
              )}
              
              <Text variant="bodySmall" style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    );
  };

  // Render loading state
  if (isLoading && !refreshing && maintenanceRequests.length === 0) {
    return (
      <ContextScreenWrapper title="Maintenance">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading maintenance requests...</Text>
        </View>
      </ContextScreenWrapper>
    );
  }

  // Render error state
  if (error && !isLoading && maintenanceRequests.length === 0) {
    return (
      <ContextScreenWrapper title="Maintenance">
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={onRefresh}>
            Retry
          </Button>
        </View>
      </ContextScreenWrapper>
    );
  }

  return (
    <ContextScreenWrapper title="Maintenance">
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search maintenance requests"
            onChangeText={(text) => dispatch(setSearchQuery(text))}
            value={filters.searchQuery}
            style={styles.searchBar}
          />
          
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => handleStatusFilter(filters.statusFilter === 'all' ? 'open' : 'all')}
            >
              <Filter size={22} color={theme.colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setSortOption(sortOption === 'newest' ? 'priority' : 'newest')}
            >
              <ArrowUpDown size={22} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {maintenanceRequests.length > 0 ? (
          <FlatList
            data={sortedRequests}
            renderItem={renderMaintenanceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
              />
            }
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                <View style={styles.headerContent}>
                  <Wrench size={24} color={theme.colors.primary} />
                  <Text variant="titleMedium" style={styles.headerTitle}>
                    Requests
                  </Text>
                </View>
                <Text variant="bodyMedium" style={styles.resultsText}>
                  {sortedRequests.length} {sortedRequests.length === 1 ? 'request' : 'requests'} found
                </Text>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Wrench size={48} color={theme.colors.outline} />
                <Text style={styles.emptyText}>No maintenance requests found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your filters or creating a new request</Text>
              </View>
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Wrench size={48} color={theme.colors.outline} />
            <Text style={styles.emptyText}>No maintenance requests found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters or creating a new request</Text>
          </View>
        )}
        
        <FAB
          icon={({ size, color }) => <Plus size={size} color={color} />}
          style={styles.fab}
          onPress={handleAddMaintenance}
          color={theme.colors.onPrimary}
        />
      </View>
    </ContextScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
    elevation: 1,
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginLeft: 8,
    elevation: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Add extra padding at the bottom for the FAB
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  resultsText: {
    marginTop: 4,
    opacity: 0.7,
  },
  itemContainer: {
    marginBottom: 16,
  },
  itemSurface: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: 'bold',
  },
  location: {
    opacity: 0.7,
  },
  priorityBadge: {
    marginLeft: 8,
  },
  itemBody: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  description: {
    opacity: 0.8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 12,
  },
  statusChip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityChip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    marginRight: 8,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: 'red',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySubtext: {
    marginTop: 8,
    opacity: 0.7,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6750A4',
  },
}); 