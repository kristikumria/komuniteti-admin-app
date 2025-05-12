import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar, FAB, SegmentedButtons } from 'react-native-paper';
import { Users, Plus, Filter } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { ListItem } from '../../../components/ListItem';
import { FilterModal, FilterConfig } from '../../../components/FilterModal';
import { residentService } from '../../../services/residentService';
import { Resident, AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';
import { commonStyles } from '../../../styles/commonStyles';

type Props = NativeStackScreenProps<AdministratorStackParamList, 'Residents'>;

// Filter and sort configurations
const filterConfig: FilterConfig = {
  filterGroups: [
    {
      id: 'status',
      name: 'Resident Status',
      options: [
        { id: 'owner', label: 'Owners', value: false },
        { id: 'tenant', label: 'Tenants', value: false },
      ],
    },
    {
      id: 'payment',
      name: 'Payment Status',
      options: [
        { id: 'current', label: 'Current', value: false },
        { id: 'overdue', label: 'Overdue', value: false },
      ],
    },
    {
      id: 'building',
      name: 'Building',
      options: [
        { id: 'riviera', label: 'Riviera Towers', value: false },
        { id: 'parkview', label: 'Park View Residence', value: false },
        { id: 'central', label: 'Central Plaza', value: false },
      ],
      multiSelect: true,
    },
  ],
  sortOptions: [
    { id: 'name', label: 'Name' },
    { id: 'moveInDate', label: 'Move-in Date' },
    { id: 'unit', label: 'Unit Number' },
    { id: 'familyMembers', label: 'Family Size' },
  ],
};

export const ResidentsList = ({ navigation }: Props) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Advanced filter state
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeSort, setActiveSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: '',
    direction: 'asc'
  });
  
  useEffect(() => {
    fetchResidents();
  }, []);
  
  useEffect(() => {
    filterResidents();
  }, [residents, searchQuery, selectedFilter, activeFilters, activeSort]);
  
  const fetchResidents = async () => {
    try {
      const data = await residentService.getResidents();
      setResidents(data);
      setFilteredResidents(data);
    } catch (error) {
      console.error('Error fetching residents:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const filterResidents = () => {
    let result = [...residents];
    
    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (resident) =>
          resident.name.toLowerCase().includes(lowercasedQuery) ||
          resident.email.toLowerCase().includes(lowercasedQuery) ||
          resident.unit.toLowerCase().includes(lowercasedQuery) ||
          resident.phone.includes(lowercasedQuery)
      );
    }
    
    // Apply segment filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'owners') {
        result = result.filter((resident) => resident.status === 'owner');
      } else if (selectedFilter === 'tenants') {
        result = result.filter((resident) => resident.status === 'tenant');
      } else if (selectedFilter === 'overdue') {
        result = result.filter((resident) => resident.paymentStatus === 'overdue');
      }
    }
    
    // Apply advanced filters
    if (Object.keys(activeFilters).length > 0) {
      Object.entries(activeFilters).forEach(([groupId, selectedOptions]) => {
        if (selectedOptions.length > 0) {
          if (groupId === 'status') {
            result = result.filter(resident => 
              selectedOptions.includes(resident.status)
            );
          } else if (groupId === 'payment') {
            result = result.filter(resident => 
              selectedOptions.includes(resident.paymentStatus)
            );
          } else if (groupId === 'building') {
            const buildingMap: Record<string, string> = {
              'riviera': 'Riviera Towers',
              'parkview': 'Park View Residence',
              'central': 'Central Plaza'
            };
            
            result = result.filter(resident => 
              selectedOptions.some(option => resident.building === buildingMap[option])
            );
          }
        }
      });
    }
    
    // Apply sorting
    if (activeSort.field) {
      result.sort((a, b) => {
        const field = activeSort.field as keyof Resident;
        const direction = activeSort.direction === 'asc' ? 1 : -1;
        
        if (typeof a[field] === 'string' && typeof b[field] === 'string') {
          return (a[field] as string).localeCompare(b[field] as string) * direction;
        } else if (typeof a[field] === 'number' && typeof b[field] === 'number') {
          return ((a[field] as number) - (b[field] as number)) * direction;
        } else if (field === 'moveInDate') {
          return (new Date(a.moveInDate).getTime() - new Date(b.moveInDate).getTime()) * direction;
        }
        
        return 0;
      });
    }
    
    setFilteredResidents(result);
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchResidents();
  };
  
  const handleResidentPress = (residentId: string) => {
    navigation.navigate('ResidentDetails', { residentId });
  };
  
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAddResident = () => {
    navigation.navigate('AddResident');
  };
  
  const handleOpenFilterModal = () => {
    setFilterModalVisible(true);
  };
  
  const handleApplyFilters = (
    filters: Record<string, string[]>,
    sort: { field: string; direction: 'asc' | 'desc' }
  ) => {
    setActiveFilters(filters);
    setActiveSort(sort);
  };
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Users size={50} color={isDarkMode ? '#555' : '#ccc'} />
      <Text 
        style={[
          styles.emptyText,
          { color: isDarkMode ? '#aaa' : '#888' }
        ]}
      >
        No residents found
      </Text>
      {searchQuery || Object.values(activeFilters).some(arr => arr.length > 0) ? (
        <Text 
          style={[
            styles.emptySubText,
            { color: isDarkMode ? '#888' : '#aaa' }
          ]}
        >
          Try adjusting your search or filters
        </Text>
      ) : (
        <TouchableOpacity 
          style={[
            styles.emptyButton,
            { backgroundColor: theme.colors.primary }
          ]}
          onPress={handleAddResident}
        >
          <Plus size={16} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.emptyButtonText}>Add Resident</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  const renderResidentItem = ({ item }: { item: Resident }) => (
    <ListItem
      title={item.name}
      subtitle={`${item.unit} • ${item.status === 'owner' ? 'Owner' : 'Tenant'}`}
      description={`${item.familyMembers} family members • Moved in: ${new Date(item.moveInDate).toLocaleDateString()}`}
      avatar={{
        uri: item.image,
      }}
      onPress={() => handleResidentPress(item.id)}
      badge={{
        text: item.paymentStatus === 'current' ? 'Current' : 'Overdue',
        color: item.paymentStatus === 'current' ? STATUS_COLORS.success : STATUS_COLORS.error,
      }}
    />
  );
  
  if (loading && !refreshing) {
    return (
      <>
        <Header 
          title="Residents" 
          showBack={false}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading residents...
          </Text>
        </View>
      </>
    );
  }
  
  // Count active filters for badge
  const activeFilterCount = Object.values(activeFilters)
    .reduce((count, options) => count + options.length, 0) + (activeSort.field ? 1 : 0);
  
  return (
    <>
      <Header 
        title="Residents" 
        showBack={false}
      />
      
      <View 
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
        ]}
      >
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search residents..."
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={[
              styles.searchBar,
              { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
            ]}
            iconColor={isDarkMode ? '#aaa' : '#666'}
            inputStyle={{ color: isDarkMode ? '#fff' : '#333' }}
            placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
          />
          
          <TouchableOpacity 
            style={[
              styles.filterButton,
              { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
            ]}
            onPress={handleOpenFilterModal}
          >
            <Filter size={20} color={theme.colors.primary} />
            {activeFilterCount > 0 && (
              <View style={[
                styles.filterBadge, 
                { backgroundColor: theme.colors.primary }
              ]}>
                <Text style={styles.filterBadgeText}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <SegmentedButtons
          value={selectedFilter}
          onValueChange={setSelectedFilter}
          style={styles.segmentedButtons}
          buttons={[
            {
              value: 'all',
              label: 'All',
            },
            {
              value: 'owners',
              label: 'Owners',
            },
            {
              value: 'tenants',
              label: 'Tenants',
            },
            {
              value: 'overdue',
              label: 'Overdue',
            },
          ]}
        />
        
        <FlatList
          data={filteredResidents}
          renderItem={renderResidentItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={
            filteredResidents.length === 0
              ? { flex: 1, justifyContent: 'center' }
              : { paddingBottom: 80 }
          }
        />
      </View>
      
      <FAB
        icon={props => <Plus {...props} />}
        style={[commonStyles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddResident}
        color="white"
      />
      
      <FilterModal
        isVisible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        config={filterConfig}
        onApplyFilters={handleApplyFilters}
        activeFilters={activeFilters}
        activeSort={activeSort}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flex: 1,
    borderRadius: 8,
    elevation: 2,
  },
  filterButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 