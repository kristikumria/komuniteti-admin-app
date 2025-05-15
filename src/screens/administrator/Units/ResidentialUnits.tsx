import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar, FAB, Badge, Card, Surface, Chip, IconButton } from 'react-native-paper';
import { Home, Users, Building2, Search, ChevronRight, BedDouble, Bath, DoorOpen } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useContextData } from '../../../hooks/useContextData';
import { ContextScreenWrapper } from '../../../components/ContextScreenWrapper';

// Define a Residential Unit type 
interface ResidentialUnit {
  id: string;
  number: string;
  floor: number;
  buildingId: string;
  building: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  area: number;
  bedrooms: number;
  bathrooms: number;
  resident?: string;
  residentId?: string;
  residentCount?: number;
  rent?: number;
  lastMaintenance?: string;
}

type Props = NativeStackScreenProps<AdministratorStackParamList, 'ResidentialUnits'>;

// Mock data for residential units
const mockResidentialUnits: ResidentialUnit[] = [
  {
    id: 'unit-1',
    number: '101',
    floor: 1,
    buildingId: 'building-1',
    building: 'Riviera Towers',
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
  {
    id: 'unit-7',
    number: '301',
    floor: 3,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    status: 'maintenance',
    area: 95,
    bedrooms: 2,
    bathrooms: 2,
    residentCount: 0,
    rent: 950,
    lastMaintenance: '2023-11-01',
  },
  {
    id: 'unit-8',
    number: '302',
    floor: 3,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    status: 'occupied',
    area: 120,
    bedrooms: 3,
    bathrooms: 2,
    resident: 'Mike Johnson',
    residentId: 'resident-3',
    residentCount: 2,
    rent: 1200,
    lastMaintenance: '2023-10-15',
  },
  {
    id: 'unit-9',
    number: '202',
    floor: 2,
    buildingId: 'building-2',
    building: 'Park View Residence',
    status: 'occupied',
    area: 75,
    bedrooms: 2,
    bathrooms: 1,
    resident: 'Sarah Williams',
    residentId: 'resident-4',
    residentCount: 1,
    rent: 800,
    lastMaintenance: '2023-09-05',
  },
];

export const ResidentialUnits = ({ navigation }: Props) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  const { currentBuilding } = useContextData();
  
  const [units, setUnits] = useState<ResidentialUnit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<ResidentialUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stats for current building
  const [unitStats, setUnitStats] = useState({
    totalResidentialUnits: 0,
    occupiedResidentialUnits: 0,
    vacantResidentialUnits: 0,
    maintenanceResidentialUnits: 0,
    totalResidents: 0,
    occupancyRate: 0
  });
  
  // Load units for the current building
  useEffect(() => {
    setLoading(true);
    
    // Filter units based on current building context
    if (currentBuilding) {
      console.log('Filtering residential units for building:', currentBuilding.name, currentBuilding.id);
      
      try {
        const buildingUnits = mockResidentialUnits.filter(unit => 
          unit.buildingId === currentBuilding.id
        );
        
        console.log(`Found ${buildingUnits.length} residential units for ${currentBuilding.name}`);
        setUnits(buildingUnits);
        setFilteredUnits(buildingUnits);
        
        // Calculate stats
        const totalResidentialUnits = buildingUnits.length;
        const occupiedResidentialUnits = buildingUnits.filter(unit => unit.status === 'occupied').length;
        const vacantResidentialUnits = buildingUnits.filter(unit => unit.status === 'vacant').length;
        const maintenanceResidentialUnits = buildingUnits.filter(unit => unit.status === 'maintenance').length;
        const totalResidents = buildingUnits.reduce((sum, unit) => sum + (unit.residentCount || 0), 0);
        const occupancyRate = totalResidentialUnits > 0 ? Math.round((occupiedResidentialUnits / totalResidentialUnits) * 100) : 0;
        
        setUnitStats({
          totalResidentialUnits,
          occupiedResidentialUnits,
          vacantResidentialUnits,
          maintenanceResidentialUnits,
          totalResidents,
          occupancyRate
        });
      } catch (error) {
        console.error('Error filtering residential units:', error);
        // Fallback to showing all units
        setUnits(mockResidentialUnits);
        setFilteredUnits(mockResidentialUnits);
      }
    } else {
      console.log('No current building selected, showing all residential units');
      // If no building is selected, show all units (for demo)
      setUnits(mockResidentialUnits);
      setFilteredUnits(mockResidentialUnits);
    }
    
    // Simulate API loading
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, [currentBuilding]);
  
  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = units.filter(
        (unit) =>
          unit.number.toLowerCase().includes(lowercasedQuery) ||
          (unit.resident && unit.resident.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredUnits(filtered);
    } else {
      setFilteredUnits(units);
    }
  }, [units, searchQuery]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    // In a real app, this would fetch from an API
    setTimeout(() => {
      if (currentBuilding) {
        const buildingUnits = mockResidentialUnits.filter(unit => 
          unit.buildingId === currentBuilding.id
        );
        setUnits(buildingUnits);
        setFilteredUnits(buildingUnits);
      } else {
        setUnits(mockResidentialUnits);
        setFilteredUnits(mockResidentialUnits);
      }
      setRefreshing(false);
    }, 1000);
  };
  
  const handleUnitPress = (unitId: string) => {
    navigation.navigate('UnitDetails', { unitId });
  };
  
  const handleViewResidents = (unitId: string) => {
    const unit = units.find(u => u.id === unitId);
    if (unit && unit.residentId) {
      navigation.navigate('ResidentDetails', { residentId: unit.residentId });
    }
  };
  
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAddUnit = () => {
    navigation.navigate('AddUnit');
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
  
  const getStatusText = (status: string): string => {
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
  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.statsContainer}>
        <Surface style={styles.statCard} elevation={2}>
          <Text style={styles.statValue}>{unitStats.totalResidentialUnits}</Text>
          <Text style={styles.statLabel}>Total Units</Text>
        </Surface>
        
        <Surface style={styles.statCard} elevation={2}>
          <Text style={styles.statValue}>{unitStats.occupancyRate}%</Text>
          <Text style={styles.statLabel}>Occupancy</Text>
        </Surface>
        
        <Surface style={styles.statCard} elevation={2}>
          <Text style={styles.statValue}>{unitStats.totalResidents}</Text>
          <Text style={styles.statLabel}>Residents</Text>
        </Surface>
        
        <Surface style={styles.statCard} elevation={2}>
          <Text style={styles.statValue}>{unitStats.vacantResidentialUnits}</Text>
          <Text style={styles.statLabel}>Vacant</Text>
        </Surface>
      </View>
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search residential units..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          icon={() => <Search size={20} color={theme.colors.onSurfaceVariant} />}
          clearIcon={() => <IconButton icon="close-circle" size={16} />}
        />
      </View>
    </View>
  );
  
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Home size={64} color={theme.colors.onSurfaceDisabled} />
      <Text style={styles.emptyTitle}>No residential units found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 'Try a different search term' : 'Add residential units to your building'}
      </Text>
    </View>
  );
  
  const renderUnitItem = ({ item }: { item: ResidentialUnit }) => (
    <Surface style={styles.unitCard} elevation={1}>
      <TouchableOpacity
        style={styles.unitCardContent}
        onPress={() => handleUnitPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.unitHeader}>
          <View style={styles.unitTitleContainer}>
            <View style={styles.unitTypeIconContainer}>
              <Home size={20} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.unitTitle}>Unit {item.number}</Text>
              <Text style={styles.unitSubtitle}>Floor {item.floor}</Text>
            </View>
          </View>
          <View style={styles.statusContainer}>
            <Badge
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) }
              ]}
            >
              {getStatusText(item.status)}
            </Badge>
          </View>
        </View>
        
        <View style={styles.unitMetadata}>
          <View style={styles.metadataRow}>
            <View style={styles.metadataItem}>
              <DoorOpen size={16} color={theme.colors.primary} style={styles.metadataIcon} />
              <Text style={styles.metadataLabel}>Area</Text>
              <Text style={styles.metadataValue}>{item.area}m²</Text>
            </View>
            
            <View style={styles.metadataItem}>
              <BedDouble size={16} color={theme.colors.primary} style={styles.metadataIcon} />
              <Text style={styles.metadataLabel}>Bedrooms</Text>
              <Text style={styles.metadataValue}>{item.bedrooms}</Text>
            </View>
            
            <View style={styles.metadataItem}>
              <Bath size={16} color={theme.colors.primary} style={styles.metadataIcon} />
              <Text style={styles.metadataLabel}>Bathrooms</Text>
              <Text style={styles.metadataValue}>{item.bathrooms}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.unitFooter}>
          <View style={styles.residentsContainer}>
            {item.resident ? (
              <Chip 
                icon={Users} 
                onPress={() => handleViewResidents(item.id)}
                style={styles.residentsChip}
              >
                {item.residentCount} {item.residentCount === 1 ? 'Resident' : 'Residents'}
              </Chip>
            ) : (
              <Text style={styles.noResidentsText}>No residents</Text>
            )}
          </View>
          
          <IconButton
            icon={() => <ChevronRight size={20} />}
            size={20}
            onPress={() => handleUnitPress(item.id)}
            style={styles.detailsButton}
          />
        </View>
      </TouchableOpacity>
    </Surface>
  );
  
  return (
    <ContextScreenWrapper
      title="Residential Units"
      refreshing={refreshing}
      onRefresh={handleRefresh}
      disableScrollView={true}
      forceShowContextSwitcher={false}
    >
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading residential units...</Text>
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
    flexWrap: 'wrap',
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
  searchContainer: {
    marginBottom: 12,
  },
  searchBar: {
    borderRadius: 8,
    elevation: 0,
    backgroundColor: 'rgba(0,0,0,0.05)',
    height: 46,
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
    marginBottom: 16,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metadataItem: {
    alignItems: 'center',
    flex: 1,
  },
  metadataIcon: {
    marginBottom: 4,
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
  unitFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  residentsContainer: {
    flex: 1,
  },
  residentsChip: {
    alignSelf: 'flex-start',
  },
  noResidentsText: {
    fontSize: 14,
    opacity: 0.5,
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
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
