import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar, FAB, SegmentedButtons, Badge, Card, Button, Chip, Avatar, IconButton, Surface, Divider } from 'react-native-paper';
import { Home, Plus, Filter, Users, Building2, Briefcase, Archive, Car, Search, ArrowUpDown, ChevronRight } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ListItem } from '../../../components/ListItem';
import { FilterModal, FilterConfig } from '../../../components/FilterModal';
import { AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useContextData } from '../../../hooks/useContextData';
import { ContextScreenWrapper } from '../../../components/ContextScreenWrapper';

// Helper function to get status display text
const getStatusText = (status: 'occupied' | 'vacant' | 'maintenance'): string => {
  switch (status) {
    case 'occupied':
      return 'Occupied';
    case 'vacant':
      return 'Vacant';
    case 'maintenance':
      return 'Maintenance';
    default:
      return '';
  }
};

// Define a Unit type for the component
interface Unit {
  id: string;
  number: string;
  floor: number;
  buildingId: string;
  building: string;
  type: 'residential' | 'business' | 'storage' | 'parking';
  status: 'occupied' | 'vacant' | 'maintenance';
  area: number;
  // Residential-specific properties
  bedrooms?: number;
  bathrooms?: number;
  resident?: string;
  residentId?: string;
  residentCount?: number;
  // Business-specific properties
  businessName?: string;
  businessType?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  // Common properties
  rent?: number;
  leaseStart?: string;
  leaseEnd?: string;
  lastMaintenance?: string;
}

// Update Props type to accept additional props for tablet layout
type Props = NativeStackScreenProps<AdministratorStackParamList, 'Units'> & {
  customSelectHandler?: (unitId: string) => void;
  selectedUnitId?: string | null;
};

// Filter and sort configurations
const filterConfig: FilterConfig = {
  filterGroups: [
    {
      id: 'type',
      name: 'Unit Type',
      options: [
        { id: 'residential', label: 'Residential', value: false },
        { id: 'business', label: 'Business', value: false },
        { id: 'storage', label: 'Storage', value: false },
        { id: 'parking', label: 'Parking', value: false },
      ],
    },
    {
      id: 'status',
      name: 'Status',
      options: [
        { id: 'occupied', label: 'Occupied', value: false },
        { id: 'vacant', label: 'Vacant', value: false },
        { id: 'maintenance', label: 'Maintenance', value: false },
      ],
    },
  ],
  sortOptions: [
    { id: 'number', label: 'Unit Number' },
    { id: 'floor', label: 'Floor' },
    { id: 'area', label: 'Area' },
    { id: 'rent', label: 'Rent' },
    { id: 'residentCount', label: 'Resident Count' },
  ],
};

// Mock data for units with both residential and business units
const mockUnits: Unit[] = [
  // Residential Units
  {
    id: 'unit-1',
    number: '101',
    floor: 1,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    type: 'residential',
    status: 'occupied',
    area: 85,
    bedrooms: 2,
    bathrooms: 1,
    resident: 'John Doe',
    residentId: 'resident-1',
    residentCount: 3,
    rent: 850,
    lastMaintenance: '2023-08-15',
  },
  {
    id: 'unit-2',
    number: '102',
    floor: 1,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    type: 'residential',
    status: 'vacant',
    area: 65,
    bedrooms: 1,
    bathrooms: 1,
    residentCount: 0,
    rent: 650,
    lastMaintenance: '2023-09-20',
  },
  {
    id: 'unit-3',
    number: '201',
    floor: 2,
    buildingId: 'building-2',
    building: 'Park View Residence',
    type: 'residential',
    status: 'occupied',
    area: 110,
    bedrooms: 3,
    bathrooms: 2,
    resident: 'Jane Smith',
    residentId: 'resident-2',
    residentCount: 4,
    rent: 1100,
    lastMaintenance: '2023-07-10',
  },
  // Business Units
  {
    id: 'unit-4',
    number: 'B101',
    floor: 0,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    type: 'business',
    status: 'occupied',
    area: 150,
    businessName: 'Coffee Shop LLC',
    businessType: 'Food & Beverage',
    contactPerson: 'Maria Popescu',
    contactEmail: 'maria@coffeeshop.al',
    contactPhone: '+355 69 123 4567',
    rent: 2000,
    leaseStart: '2022-05-01',
    leaseEnd: '2025-05-01',
    lastMaintenance: '2023-06-30',
  },
  {
    id: 'unit-5',
    number: 'B102',
    floor: 0,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    type: 'business',
    status: 'occupied',
    area: 180,
    businessName: 'Pharmacy Plus',
    businessType: 'Healthcare',
    contactPerson: 'Arben Krasniqi',
    contactEmail: 'arben@pharmacyplus.al',
    contactPhone: '+355 69 987 6543',
    rent: 2200,
    leaseStart: '2021-11-01',
    leaseEnd: '2026-11-01',
    lastMaintenance: '2023-09-05',
  },
  // Other Units
  {
    id: 'unit-6',
    number: 'P12',
    floor: -1,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    type: 'parking',
    status: 'occupied',
    area: 15,
    resident: 'John Doe',
    residentId: 'resident-1',
    residentCount: 1,
    rent: 100,
    lastMaintenance: '2023-10-05',
  },
  {
    id: 'unit-7',
    number: 'S08',
    floor: -2,
    buildingId: 'building-2',
    building: 'Park View Residence',
    type: 'storage',
    status: 'vacant',
    area: 8,
    residentCount: 0,
    rent: 75,
    lastMaintenance: '2023-09-15',
  },
];

export const UnitsList = ({ navigation, customSelectHandler, selectedUnitId }: Props) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  const { currentBuilding, refreshContextData } = useContextData();
  
  const [units, setUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
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
  
  // Stats for current building
  const [unitStats, setUnitStats] = useState({
    totalUnits: 0,
    residentialUnits: 0,
    businessUnits: 0,
    storageUnits: 0,
    parkingUnits: 0,
    occupiedUnits: 0,
    vacantUnits: 0,
    maintenanceUnits: 0,
    occupancyRate: 0
  });
  
  // Load units for the current building
  useEffect(() => {
    setLoading(true);
    
    // Filter units based on current building context
    if (currentBuilding) {
      console.log('Filtering units for building:', currentBuilding.name);
      
      try {
        const buildingUnits = mockUnits.filter(unit => 
          unit.buildingId === currentBuilding.id
        );
        
        setUnits(buildingUnits);
        
        // Apply any active filters
        filterUnits(buildingUnits);
        
        // Calculate stats
        const totalUnits = buildingUnits.length;
        const residentialUnits = buildingUnits.filter(unit => unit.type === 'residential').length;
        const businessUnits = buildingUnits.filter(unit => unit.type === 'business').length;
        const storageUnits = buildingUnits.filter(unit => unit.type === 'storage').length;
        const parkingUnits = buildingUnits.filter(unit => unit.type === 'parking').length;
        const occupiedUnits = buildingUnits.filter(unit => unit.status === 'occupied').length;
        const vacantUnits = buildingUnits.filter(unit => unit.status === 'vacant').length;
        const maintenanceUnits = buildingUnits.filter(unit => unit.status === 'maintenance').length;
        const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
        
        setUnitStats({
          totalUnits,
          residentialUnits,
          businessUnits,
          storageUnits,
          parkingUnits,
          occupiedUnits,
          vacantUnits,
          maintenanceUnits,
          occupancyRate
        });
      } catch (error) {
        console.error('Error filtering units:', error);
        // Fallback to showing all units
        setUnits(mockUnits);
        filterUnits(mockUnits);
      }
    } else {
      // If no building is selected, show all units (for demo)
      setUnits(mockUnits);
      filterUnits(mockUnits);
    }
    
    // Simulate API loading
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, [currentBuilding]);
  
  const filterUnits = useCallback((unitsToFilter = units) => {
    let filtered = [...unitsToFilter];
    
    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (unit) =>
          unit.number.toLowerCase().includes(lowercasedQuery) ||
          (unit.resident && unit.resident.toLowerCase().includes(lowercasedQuery)) ||
          (unit.businessName && unit.businessName.toLowerCase().includes(lowercasedQuery))
      );
    }
    
    // Apply segment filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((unit) => unit.type === selectedFilter);
    }
    
    // Apply advanced filters
    if (Object.keys(activeFilters).length > 0) {
      filtered = filtered.filter((unit) => {
        return Object.entries(activeFilters).every(([groupId, selectedOptions]) => {
          if (selectedOptions.length === 0) return true;
          
          switch (groupId) {
            case 'type':
              return selectedOptions.includes(unit.type);
            case 'status':
              return selectedOptions.includes(unit.status);
            default:
              return true;
          }
        });
      });
    }
    
    // Apply sorting
    if (activeSort.field) {
      filtered.sort((a, b) => {
        const aValue = a[activeSort.field as keyof Unit];
        const bValue = b[activeSort.field as keyof Unit];
        
        if (aValue === undefined) return activeSort.direction === 'asc' ? -1 : 1;
        if (bValue === undefined) return activeSort.direction === 'asc' ? 1 : -1;
        
        if (aValue < bValue) return activeSort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return activeSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    setFilteredUnits(filtered);
  }, [searchQuery, selectedFilter, activeFilters, activeSort, units]);
  
  useEffect(() => {
    filterUnits();
  }, [searchQuery, selectedFilter, activeFilters, activeSort, filterUnits]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    // In a real app, this would fetch from an API
    setTimeout(() => {
      refreshContextData();
      if (currentBuilding) {
        const buildingUnits = mockUnits.filter(unit => 
          unit.buildingId === currentBuilding.id
        );
        setUnits(buildingUnits);
        filterUnits(buildingUnits);
      } else {
        setUnits(mockUnits);
        filterUnits(mockUnits);
      }
      setRefreshing(false);
    }, 1000);
  };
  
  const handleUnitPress = (unitId: string) => {
    // Use custom handler if provided (for tablet layout)
    if (customSelectHandler) {
      customSelectHandler(unitId);
    } else {
      // Default navigation behavior
      navigation.navigate('UnitDetails', { unitId });
    }
  };
  
  const handleViewResidents = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    if (unit && unit.type === 'residential' && unit.residentId) {
      navigation.navigate('ResidentDetails', { residentId: unit.residentId });
    }
  };
  
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAddUnit = () => {
    navigation.navigate('AddUnit');
  };
  
  const handleViewResidentialUnits = () => {
    navigation.navigate('ResidentialUnits');
  };
  
  const handleViewBusinessUnits = () => {
    navigation.navigate('BusinessUnits');
  };
  
  const handleBuildingUnits = () => {
    if (currentBuilding) {
      navigation.navigate('BuildingUnits', { buildingId: currentBuilding.id });
    }
  };
  
  const handleOpenFilterModal = () => {
    setFilterModalVisible(true);
  };
  
  const handleApplyFilters = (filters: Record<string, string[]>, sort: { field: string; direction: 'asc' | 'desc' }) => {
    setActiveFilters(filters);
    setActiveSort(sort);
    setFilterModalVisible(false);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return STATUS_COLORS.success;
      case 'vacant':
        return STATUS_COLORS.info;
      case 'maintenance':
        return STATUS_COLORS.warning;
      default:
        return STATUS_COLORS.default;
    }
  };
  
  const getUnitTypeIcon = (type: string) => {
    switch (type) {
      case 'residential':
        return <Home size={20} color={theme.colors.primary} />;
      case 'business':
        return <Briefcase size={20} color={theme.colors.primary} />;
      case 'storage':
        return <Archive size={20} color={theme.colors.primary} />;
      case 'parking':
        return <Car size={20} color={theme.colors.primary} />;
      default:
        return <Building2 size={20} color={theme.colors.primary} />;
    }
  };
  
  const renderUnitItem = ({ item }: { item: Unit }) => {
    const renderMetadata = () => {
      if (item.type === 'residential') {
        return (
          <View style={styles.unitMetadata}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Area</Text>
              <Text style={styles.metadataValue}>{item.area}m²</Text>
            </View>
            <View style={styles.metadataDivider} />
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Bedrooms</Text>
              <Text style={styles.metadataValue}>{item.bedrooms}</Text>
            </View>
            <View style={styles.metadataDivider} />
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Residents</Text>
              <Text style={styles.metadataValue}>{item.residentCount || 0}</Text>
            </View>
          </View>
        );
      } else if (item.type === 'business') {
        return (
          <View style={styles.unitMetadata}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Area</Text>
              <Text style={styles.metadataValue}>{item.area}m²</Text>
            </View>
            <View style={styles.metadataDivider} />
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Business</Text>
              <Text style={styles.metadataValue} numberOfLines={1}>{item.businessName || 'Vacant'}</Text>
            </View>
          </View>
        );
      } else {
        return (
          <View style={styles.unitMetadata}>
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Area</Text>
              <Text style={styles.metadataValue}>{item.area}m²</Text>
            </View>
            <View style={styles.metadataDivider} />
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Floor</Text>
              <Text style={styles.metadataValue}>{item.floor}</Text>
            </View>
          </View>
        );
      }
    };
    
    return (
      <ListItem
        title={`Unit ${item.number}`}
        subtitle={`${item.building}, Floor ${item.floor}`}
        leftIcon={getUnitTypeIcon(item.type)}
        rightSubtitle={renderMetadata()}
        rightTitle={
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(item.status) }
              ]}
            />
            <Text style={{ color: getStatusColor(item.status), fontWeight: '500' }}>
              {getStatusText(item.status)}
            </Text>
          </View>
        }
        onPress={() => handleUnitPress(item.id)}
        showChevron={!customSelectHandler} // Hide chevron on tablet
        selected={selectedUnitId === item.id} // Highlight if selected
      />
    );
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.statsContainer}>
        <Surface style={styles.statCard} elevation={2}>
          <Text style={styles.statValue}>{unitStats.totalUnits}</Text>
          <Text style={styles.statLabel}>Total Units</Text>
        </Surface>
        
        <Surface style={styles.statCard} elevation={2}>
          <Text style={styles.statValue}>{unitStats.occupancyRate}%</Text>
          <Text style={styles.statLabel}>Occupancy</Text>
        </Surface>
        
        <Surface style={styles.statCard} elevation={2}>
          <Text style={styles.statValue}>{unitStats.occupiedUnits}</Text>
          <Text style={styles.statLabel}>Occupied</Text>
        </Surface>
        
        <Surface style={styles.statCard} elevation={2}>
          <Text style={styles.statValue}>{unitStats.vacantUnits}</Text>
          <Text style={styles.statLabel}>Vacant</Text>
        </Surface>
      </View>
      
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search units..."
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
            icon={() => <Search size={20} color={theme.colors.onSurfaceVariant} />}
            clearIcon={() => <IconButton icon="close-circle" size={16} />}
          />
        </View>
        
        <View style={styles.filterButtonsRow}>
          <SegmentedButtons
            value={selectedFilter}
            onValueChange={setSelectedFilter}
            style={styles.segmentedButtons}
            buttons={[
              { value: 'all', label: 'All', icon: Building2 },
              { value: 'residential', label: 'Residential', icon: Home },
              { value: 'business', label: 'Business', icon: Briefcase },
            ]}
          />
          
          <Button 
            mode="outlined" 
            icon={() => <Filter size={18} color={theme.colors.primary} />}
            onPress={handleOpenFilterModal}
            style={styles.filterButton}
            contentStyle={styles.filterButtonContent}
          >
            Filter
          </Button>
        </View>
        
        <View style={styles.activeFiltersContainer}>
          {Object.entries(activeFilters).map(([groupId, selectedOptions]) => 
            selectedOptions.map(option => (
              <Chip 
                key={`${groupId}-${option}`}
                style={styles.filterChip}
                onClose={() => {
                  const newFilters = { ...activeFilters };
                  newFilters[groupId] = newFilters[groupId].filter(o => o !== option);
                  setActiveFilters(newFilters);
                }}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Chip>
            ))
          )}
          {activeSort.field && (
            <Chip 
              style={styles.filterChip}
              icon={() => <ArrowUpDown size={16} color={theme.colors.primary} />}
              onClose={() => setActiveSort({ field: '', direction: 'asc' })}
            >
              Sort: {activeSort.field} ({activeSort.direction === 'asc' ? '↑' : '↓'})
            </Chip>
          )}
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Building2 size={64} color={theme.colors.onSurfaceDisabled} />
      <Text style={styles.emptyTitle}>No units found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 'Try a different search term' : 'Add units to your building'}
      </Text>
      <Button 
        mode="contained" 
        icon="plus"
        onPress={handleAddUnit}
        style={styles.emptyButton}
      >
        Add New Unit
      </Button>
    </View>
  );
  
  return (
    <ContextScreenWrapper
      title="Units"
      refreshing={refreshing}
      onRefresh={handleRefresh}
      disableScrollView={true}
      forceShowContextSwitcher={false}
    >
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading units...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredUnits}
            renderItem={renderUnitItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={handleRefresh}
                colors={[theme.colors.primary]}
              />
            }
          />
        )}
        
        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddUnit}
          label="Add Unit"
        />

        <FilterModal
          visible={filterModalVisible}
          onDismiss={() => setFilterModalVisible(false)}
          config={filterConfig}
          onApplyFilters={handleApplyFilters}
          initialFilters={activeFilters}
          initialSort={activeSort}
        />
      </View>
    </ContextScreenWrapper>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: cardWidth,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  filterContainer: {
    marginBottom: 8,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchBar: {
    borderRadius: 8,
    elevation: 0,
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 46,
  },
  filterButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  segmentedButtons: {
    flex: 1,
    marginRight: 8,
  },
  filterButton: {
    borderRadius: 4,
  },
  filterButtonContent: {
    height: 36,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  unitCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  unitCardContent: {
    padding: 16,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  unitTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitTypeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  unitSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  unitMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  metadataItem: {
    flex: 1,
    alignItems: 'center',
  },
  metadataLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  metadataDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  unitFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeChip: {
    height: 28,
  },
  detailsButton: {
    margin: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 