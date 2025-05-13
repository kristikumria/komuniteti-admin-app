import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar, FAB, SegmentedButtons } from 'react-native-paper';
import { Building2, Plus, Filter } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { ListItem } from '../../../components/ListItem';
import { FilterModal, FilterConfig } from '../../../components/FilterModal';
import { buildingService } from '../../../services/buildingService';
import { Building, BusinessManagerStackParamList } from '../../../navigation/types';
import { Building as BuildingType } from '../../../types/buildingTypes';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

// Define a proper navigation type for the buildings list
type BuildingsNavigationProp = NativeStackNavigationProp<
  BusinessManagerStackParamList,
  'Buildings'
>;

// Filter and sort configurations
const filterConfig: FilterConfig = {
  filterGroups: [
    {
      id: 'propertyType',
      name: 'Property Type',
      options: [
        { id: 'apartment', label: 'Apartment', value: false },
        { id: 'commercial', label: 'Commercial', value: false },
        { id: 'mixed', label: 'Mixed Use', value: false },
      ],
    },
    {
      id: 'occupancyRange',
      name: 'Occupancy Range',
      options: [
        { id: 'low', label: 'Low (<70%)', value: false },
        { id: 'medium', label: 'Medium (70-90%)', value: false },
        { id: 'high', label: 'High (>90%)', value: false },
      ],
    },
    {
      id: 'location',
      name: 'Location',
      options: [
        { id: 'downtown', label: 'Downtown', value: false },
        { id: 'suburbs', label: 'Suburbs', value: false },
        { id: 'industrial', label: 'Industrial Zone', value: false },
      ],
      multiSelect: true,
    },
  ],
  sortOptions: [
    { id: 'name', label: 'Name' },
    { id: 'units', label: 'Number of Units' },
    { id: 'residents', label: 'Number of Residents' },
    { id: 'occupancyRate', label: 'Occupancy Rate' },
  ],
};

export const BuildingsList = () => {
  const theme = useTheme();
  const navigation = useNavigation<BuildingsNavigationProp>();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
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
    fetchBuildings();
  }, []);
  
  useEffect(() => {
    filterBuildings();
  }, [buildings, searchQuery, selectedFilter, activeFilters, activeSort]);
  
  const fetchBuildings = async () => {
    try {
      const data = await buildingService.getBuildings();
      // Convert API buildings to UI buildings
      const mappedBuildings: Building[] = data.map((building: BuildingType) => ({
        id: building.id,
        name: building.name,
        address: building.address,
        units: building.units,
        residents: Math.floor(Math.random() * 100) + 50, // Mock data for demo
        issues: Math.floor(Math.random() * 5), // Mock data for demo
        occupancyRate: Math.floor(Math.random() * 30) + 70, // Mock data for demo
        maintenanceCost: `$${Math.floor(Math.random() * 5000) + 1000}`, // Mock data for demo
        yearBuilt: building.buildYear,
        propertyType: 'Residential', // Default value
        amenities: ['Parking', 'Security', 'Elevator'], // Default values
        image: building.image || 'https://picsum.photos/200/300',
      }));
      
      setBuildings(mappedBuildings);
      setFilteredBuildings(mappedBuildings);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const filterBuildings = () => {
    let result = [...buildings];
    
    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (building) =>
          building.name.toLowerCase().includes(lowercasedQuery) ||
          building.address.toLowerCase().includes(lowercasedQuery) ||
          building.propertyType.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    // Apply segment filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'high_occupancy') {
        result = result.filter((building) => building.occupancyRate >= 90);
      } else if (selectedFilter === 'low_occupancy') {
        result = result.filter((building) => building.occupancyRate < 80);
      } else if (selectedFilter === 'issues') {
        result = result.filter((building) => building.issues > 0);
      }
    }
    
    // Apply advanced filters
    if (Object.keys(activeFilters).length > 0) {
      Object.entries(activeFilters).forEach(([groupId, selectedOptions]) => {
        if (selectedOptions.length > 0) {
          if (groupId === 'propertyType') {
            result = result.filter(building => 
              selectedOptions.includes(building.propertyType.toLowerCase())
            );
          } else if (groupId === 'occupancyRange') {
            result = result.filter(building => {
              const occupancy = building.occupancyRate;
              return (
                (selectedOptions.includes('low') && occupancy < 70) ||
                (selectedOptions.includes('medium') && occupancy >= 70 && occupancy <= 90) ||
                (selectedOptions.includes('high') && occupancy > 90)
              );
            });
          } else if (groupId === 'location') {
            const locationMap: Record<string, string> = {
              'downtown': 'Downtown',
              'suburbs': 'Suburbs',
              'industrial': 'Industrial Zone'
            };
            
            result = result.filter(building => 
              selectedOptions.some(option => building.address.includes(locationMap[option]))
            );
          }
        }
      });
    }
    
    // Apply sorting
    if (activeSort.field) {
      result.sort((a, b) => {
        const field = activeSort.field as keyof Building;
        const direction = activeSort.direction === 'asc' ? 1 : -1;
        
        if (typeof a[field] === 'string' && typeof b[field] === 'string') {
          return (a[field] as string).localeCompare(b[field] as string) * direction;
        } else if (typeof a[field] === 'number' && typeof b[field] === 'number') {
          return ((a[field] as number) - (b[field] as number)) * direction;
        }
        
        return 0;
      });
    }
    
    setFilteredBuildings(result);
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchBuildings();
  };
  
  const handleBuildingPress = (buildingId: string) => {
    navigation.navigate('BuildingDetails', { buildingId });
  };
  
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAddBuilding = () => {
    navigation.navigate('AddBuilding');
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
      <Building2 size={50} color={isDarkMode ? '#555' : '#ccc'} />
      <Text 
        style={[
          styles.emptyText,
          { color: isDarkMode ? '#aaa' : '#888' }
        ]}
      >
        No buildings found
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
          onPress={handleAddBuilding}
        >
          <Plus size={16} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.emptyButtonText}>Add Building</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  const renderBuildingItem = ({ item }: { item: Building }) => (
    <ListItem
      title={item.name}
      subtitle={item.address}
      description={`${item.units} units • ${item.residents} residents • ${item.occupancyRate}% occupied`}
      avatar={{
        uri: item.image,
      }}
      onPress={() => handleBuildingPress(item.id)}
      badge={{
        text: item.issues > 0 ? `${item.issues} issues` : 'No issues',
        color: item.issues > 0 ? STATUS_COLORS.error : STATUS_COLORS.success,
      }}
      rightContent={
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditBuilding', { buildingId: item.id })}
        >
          <Text style={{ color: theme.colors.primary }}>Edit</Text>
        </TouchableOpacity>
      }
    />
  );
  
  if (loading && !refreshing) {
    return (
      <>
        <Header 
          title="Buildings" 
          showBack={false}
          showNotifications={false}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading buildings...
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
        title="Buildings" 
        showBack={false}
        showNotifications={false}
      />
      
      <View 
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
        ]}
      >
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search buildings..."
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
              value: 'high_occupancy',
              label: 'High Occupancy',
            },
            {
              value: 'low_occupancy',
              label: 'Low Occupancy',
            },
            {
              value: 'issues',
              label: 'With Issues',
            },
          ]}
        />
        
        <FlatList
          data={filteredBuildings}
          renderItem={renderBuildingItem}
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
            filteredBuildings.length === 0
              ? { flex: 1, justifyContent: 'center' }
              : { paddingBottom: 80 }
          }
        />
      </View>
      
      <FAB
        icon={props => <Plus {...props} />}
        style={[commonStyles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddBuilding}
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
  editButton: {
    padding: 8,
  },
}); 