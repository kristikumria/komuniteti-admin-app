import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, RefreshControl, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { Text, Searchbar, SegmentedButtons, Badge, Divider, Chip, IconButton } from 'react-native-paper';
import { Home, Plus, Filter, Users, Building2, Briefcase, Archive, Car, Search, ArrowUpDown, ChevronRight } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// Import enhanced components
import { Button } from '../../../components/Button';
import { ContextScreenWrapper } from '../../../components/ContextScreenWrapper';
import { FilterModal, FilterConfig } from '../../../components/FilterModal';
import { Card } from '../../../components/cards/Card';
import { CardList } from '../../../components/cards/CardList';
import { CardSkeleton } from '../../../components/loaders/CardSkeleton';
import { FloatingActionButton } from '../../../components/FloatingActionButton';
import { useAccessibility } from '../../../components/AccessibilityProvider';

// Import types and utilities
import { AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useContextData } from '../../../hooks/useContextData';

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
    rent: 100,
    lastMaintenance: '2023-05-15',
  },
  {
    id: 'unit-7',
    number: 'S05',
    floor: -1,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    type: 'storage',
    status: 'vacant',
    area: 8,
    rent: 75,
    lastMaintenance: '2023-08-01',
  },
];

export const UnitsListEnhanced = ({ navigation, customSelectHandler, selectedUnitId }: Props) => {
  const { theme } = useThemedStyles();
  const insets = useSafeAreaInsets();
  const { settings } = useAccessibility();
  const isTablet = Dimensions.get('window').width >= 768;
  const { contextBuildingId, selectedBuildingName } = useContextData();
  
  const [units, setUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeSort, setActiveSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'number', direction: 'asc' });
  const [filterCount, setFilterCount] = useState(0);
  const [view, setView] = useState<'all' | 'residential' | 'business'>('all');
  
  // Fetch and prepare data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Filter by building if in building context
        const filteredData = contextBuildingId
          ? mockUnits.filter(unit => unit.buildingId === contextBuildingId)
          : mockUnits;
        
        setUnits(filteredData);
        setFilteredUnits(filteredData);
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [contextBuildingId]);
  
  // Handle filtering and sorting
  useEffect(() => {
    let result = [...units];
    
    // Apply view filter (residential, business, all)
    if (view === 'residential') {
      result = result.filter(unit => unit.type === 'residential');
    } else if (view === 'business') {
      result = result.filter(unit => unit.type === 'business');
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(unit => 
        unit.number.toLowerCase().includes(query) ||
        unit.building.toLowerCase().includes(query) ||
        (unit.businessName && unit.businessName.toLowerCase().includes(query)) ||
        (unit.resident && unit.resident.toLowerCase().includes(query))
      );
    }
    
    // Apply advanced filters
    let filterCounter = 0;
    
    Object.entries(activeFilters).forEach(([filterKey, values]) => {
      if (values.length > 0) {
        result = result.filter(unit => values.includes(unit[filterKey as keyof Unit] as string));
        filterCounter += values.length;
      }
    });
    
    // Apply sorting
    if (activeSort.field) {
      result.sort((a, b) => {
        const valueA = a[activeSort.field as keyof Unit];
        const valueB = b[activeSort.field as keyof Unit];
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return activeSort.direction === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else if (typeof valueA === 'number' && typeof valueB === 'number') {
          return activeSort.direction === 'asc'
            ? valueA - valueB
            : valueB - valueA;
        }
        
        return 0;
      });
    }
    
    setFilterCount(filterCounter);
    setFilteredUnits(result);
  }, [units, searchQuery, activeFilters, activeSort, view]);
  
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter by building if in building context
      const filteredData = contextBuildingId
        ? mockUnits.filter(unit => unit.buildingId === contextBuildingId)
        : mockUnits;
      
      setUnits(filteredData);
    } catch (error) {
      console.error('Error refreshing units:', error);
    } finally {
      setRefreshing(false);
    }
  }, [contextBuildingId]);
  
  const handleUnitPress = (unitId: string) => {
    // Provide haptic feedback
    if (!settings.reduceMotion) {
      Haptics.selectionAsync();
    }
    
    if (customSelectHandler) {
      customSelectHandler(unitId);
    } else {
      navigation.navigate('UnitDetails', { unitId });
    }
  };
  
  const handleViewResidents = (unitId: string) => {
    // Provide haptic feedback
    if (!settings.reduceMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    navigation.navigate('UnitResidents', { unitId });
  };
  
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAddUnit = () => {
    // Provide haptic feedback
    if (!settings.reduceMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    navigation.navigate('AddUnit');
  };
  
  const handleOpenFilterModal = () => {
    // Provide haptic feedback
    if (!settings.reduceMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
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
        return theme.colors.success;
      case 'vacant':
        return theme.colors.info;
      case 'maintenance':
        return theme.colors.warning;
      default:
        return theme.colors.outline;
    }
  };
  
  const getUnitTypeIcon = (type: string) => {
    switch (type) {
      case 'residential':
        return <Home size={20} color={theme.colors.primary} />;
      case 'business':
        return <Briefcase size={20} color={theme.colors.secondary} />;
      case 'storage':
        return <Archive size={20} color={theme.colors.tertiary} />;
      case 'parking':
        return <Car size={20} color={theme.colors.tertiary} />;
      default:
        return <Home size={20} color={theme.colors.primary} />;
    }
  };
  
  const renderHeader = () => (
    <View style={styles(theme).header}>
      <View style={styles(theme).searchContainer}>
        <Searchbar
          placeholder="Search units..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          icon={() => <Search size={20} color={theme.colors.onSurfaceVariant} />}
          style={styles(theme).searchbar}
          inputStyle={styles(theme).searchInput}
          elevation={1}
          mode="bar"
          theme={{ colors: { elevation: { level1: theme.colors.surfaceContainerLow } } }}
        />
      </View>
      
      <View style={styles(theme).filtersContainer}>
        <SegmentedButtons
          value={view}
          onValueChange={(value) => setView(value as 'all' | 'residential' | 'business')}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'residential', label: 'Residential' },
            { value: 'business', label: 'Business' },
          ]}
          style={styles(theme).segmentedButtons}
          theme={{ 
            colors: { 
              secondaryContainer: theme.colors.primaryContainer,
              onSecondaryContainer: theme.colors.onPrimaryContainer 
            } 
          }}
          density="small"
        />
        
        <Button
          mode="outlined"
          icon={() => <Filter size={18} color={theme.colors.primary} />}
          onPress={handleOpenFilterModal}
          style={styles(theme).filterButton}
          compact
          accessibilityLabel="Filter units"
          accessibilityHint="Open filter options"
        >
          Filters
          {filterCount > 0 && (
            <Badge
              style={[styles(theme).filterBadge, { backgroundColor: theme.colors.primary }]}
              size={18}
            >
              {filterCount}
            </Badge>
          )}
        </Button>
      </View>
      
      {contextBuildingId && (
        <View style={styles(theme).buildingInfo}>
          <Building2 size={18} color={theme.colors.primary} />
          <Text variant="titleSmall" style={styles(theme).buildingName}>
            {selectedBuildingName || 'Building'}
          </Text>
        </View>
      )}
      
      <Divider style={styles(theme).divider} />
    </View>
  );
  
  const renderUnitItem = (item: Unit, index: number) => {
    const isResidential = item.type === 'residential';
    const isBusiness = item.type === 'business';
    
    const unitTitle = `${item.number} ${isResidential ? '• ' + (item.bedrooms || 0) + 'BR' : ''}`;
    const unitSubtitle = isResidential 
      ? `${item.building} • ${item.area}m²`
      : isBusiness 
        ? item.businessName || 'Business Unit' 
        : `${item.building} • ${item.area}m²`;
        
    const statusChip = (
      <Chip
        mode="outlined"
        textStyle={{ color: getStatusColor(item.status) }}
        style={[styles(theme).statusChip, { borderColor: getStatusColor(item.status) }]}
        compact
      >
        {getStatusText(item.status)}
      </Chip>
    );
    
    const rightAction = item.residentCount && item.residentCount > 0 ? (
      <IconButton
        icon={() => <Users size={20} color={theme.colors.primary} />}
        mode="outlined"
        size={20}
        onPress={() => handleViewResidents(item.id)}
        accessibilityLabel={`View residents of unit ${item.number}`}
      />
    ) : undefined;
    
    return (
      <Card
        title={unitTitle}
        subtitle={unitSubtitle}
        leftIcon={getUnitTypeIcon(item.type)}
        rightAction={rightAction}
        onPress={() => handleUnitPress(item.id)}
        style={selectedUnitId === item.id ? styles(theme).selectedCard : undefined}
        accessibilityLabel={`Unit ${item.number}, ${getStatusText(item.status)}`}
        accessibilityHint="Double tap to view unit details"
        testID={`unit-item-${item.id}`}
      >
        <View style={styles(theme).unitDetails}>
          <View>
            {isResidential && (
              <Text variant="bodyMedium" style={styles(theme).unitInfo}>
                {item.bedrooms} BR • {item.bathrooms} BA • {item.area}m²
              </Text>
            )}
            
            <Text variant="bodyMedium" style={styles(theme).unitInfo}>
              {isResidential 
                ? item.resident || 'No residents' 
                : isBusiness 
                  ? item.contactPerson || 'No contact' 
                  : 'Unit ' + item.number}
            </Text>
            
            {item.rent && (
              <Text variant="bodyMedium" style={styles(theme).unitRent}>
                {item.rent}€ / month
              </Text>
            )}
          </View>
          
          <View style={styles(theme).unitMeta}>
            {statusChip}
            
            <View style={styles(theme).floorInfo}>
              <Text variant="bodySmall" style={styles(theme).floor}>
                Floor {item.floor === 0 ? 'G' : item.floor}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };
  
  return (
    <ContextScreenWrapper>
      <SafeAreaView style={styles(theme).container}>
        {renderHeader()}
        
        <CardList
          data={filteredUnits}
          renderItem={renderUnitItem}
          loading={loading}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          emptyStateTitle="No Units Found"
          emptyStateMessage="There are no units matching your criteria. Try adjusting your filters."
          emptyStateIcon={<Building2 size={48} color={theme.colors.primary} />}
          showSeparators={false}
          testID="units-list"
          keyExtractor={(item) => item.id}
        />
        
        <FloatingActionButton
          icon={Plus}
          onPress={handleAddUnit}
          style={[
            styles(theme).fab,
            { bottom: insets.bottom + 16 }
          ]}
          accessibilityLabel="Add new unit"
          testID="add-unit-button"
        />
        
        <FilterModal
          visible={filterModalVisible}
          onDismiss={() => setFilterModalVisible(false)}
          onApply={handleApplyFilters}
          filterConfig={filterConfig}
          initialFilters={activeFilters}
          initialSort={activeSort}
        />
      </SafeAreaView>
    </ContextScreenWrapper>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchContainer: {
    marginBottom: theme.spacing.s,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.shapes.corner.medium,
  },
  searchInput: {
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
    flexWrap: 'wrap',
  },
  segmentedButtons: {
    flex: 1,
    marginRight: theme.spacing.s,
  },
  filterButton: {
    borderColor: theme.colors.outline,
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  buildingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
  },
  buildingName: {
    marginLeft: theme.spacing.s,
    color: theme.colors.onSurface,
  },
  divider: {
    marginVertical: theme.spacing.xs,
  },
  unitDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  unitInfo: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xxs,
  },
  unitRent: {
    fontWeight: '500',
    color: theme.colors.primary,
  },
  unitMeta: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: theme.spacing.xs,
  },
  floorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floor: {
    color: theme.colors.onSurfaceVariant,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.m,
    backgroundColor: theme.colors.primary,
  },
  selectedCard: {
    backgroundColor: theme.colors.primaryContainer,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
}); 