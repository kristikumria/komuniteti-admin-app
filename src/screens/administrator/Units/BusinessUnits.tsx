import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar, FAB, Badge, Divider, Card, Chip, Surface, IconButton } from 'react-native-paper';
import { Briefcase, Building2, Phone, Mail, Search, ChevronRight, DoorOpen, CreditCard, Store } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useContextData } from '../../../hooks/useContextData';
import { ContextScreenWrapper } from '../../../components/ContextScreenWrapper';

// Define a BusinessUnit type
interface BusinessUnit {
  id: string;
  number: string;
  floor: number;
  buildingId: string;
  building: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  area: number;
  businessName?: string;
  businessType?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  rent?: number;
  leaseStart?: string;
  leaseEnd?: string;
  lastMaintenance?: string;
}

type Props = NativeStackScreenProps<AdministratorStackParamList, 'BusinessUnits'>;

// Mock data for business units
const mockBusinessUnits: BusinessUnit[] = [
  {
    id: 'bunit-1',
    number: 'B101',
    floor: 0,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    status: 'occupied',
    area: 120,
    businessName: 'Coffee Shop LLC',
    businessType: 'Food & Beverage',
    contactPerson: 'Maria Popescu',
    contactEmail: 'maria@coffeeshop.al',
    contactPhone: '+355 69 123 4567',
    rent: 1800,
    leaseStart: '2022-05-01',
    leaseEnd: '2025-05-01',
    lastMaintenance: '2023-07-12',
  },
  {
    id: 'bunit-2',
    number: 'B102',
    floor: 0,
    buildingId: 'building-1',
    building: 'Riviera Towers',
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
  {
    id: 'bunit-3',
    number: 'B201',
    floor: 1,
    buildingId: 'building-2',
    building: 'Park View Residence',
    status: 'occupied',
    area: 150,
    businessName: 'Tech Solutions',
    businessType: 'IT Services',
    contactPerson: 'Luka Novak',
    contactEmail: 'luka@techsolutions.al',
    contactPhone: '+355 68 222 3333',
    rent: 1900,
    leaseStart: '2023-01-15',
    leaseEnd: '2028-01-15',
    lastMaintenance: '2023-08-20',
  },
  {
    id: 'bunit-4',
    number: 'B103',
    floor: 0,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    status: 'vacant',
    area: 95,
    rent: 1500,
    lastMaintenance: '2023-10-10',
  },
  {
    id: 'bunit-5',
    number: 'B301',
    floor: 2,
    buildingId: 'building-3',
    building: 'Central Plaza',
    status: 'occupied',
    area: 250,
    businessName: 'Legal Partners',
    businessType: 'Law Firm',
    contactPerson: 'Elena Dimitrova',
    contactEmail: 'elena@legalpartners.al',
    contactPhone: '+355 69 444 5555',
    rent: 3500,
    leaseStart: '2022-08-01',
    leaseEnd: '2027-08-01',
    lastMaintenance: '2023-06-18',
  },
  {
    id: 'bunit-6',
    number: 'B202',
    floor: 1,
    buildingId: 'building-2',
    building: 'Park View Residence',
    status: 'maintenance',
    area: 120,
    rent: 1750,
    lastMaintenance: '2023-11-02',
  },
];

export const BusinessUnits = ({ navigation }: Props) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  const { currentBuilding } = useContextData();
  
  const [units, setUnits] = useState<BusinessUnit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stats for current building
  const [unitStats, setUnitStats] = useState({
    totalBusinessUnits: 0,
    occupiedBusinessUnits: 0,
    vacantBusinessUnits: 0,
    maintenanceBusinessUnits: 0,
    occupancyRate: 0
  });
  
  // Load units for the current building
  useEffect(() => {
    setLoading(true);
    
    // Filter units based on current building context
    if (currentBuilding) {
      console.log('Filtering business units for building:', currentBuilding.name, currentBuilding.id);
      
      try {
        const buildingUnits = mockBusinessUnits.filter(unit => 
          unit.buildingId === currentBuilding.id
        );
        
        console.log(`Found ${buildingUnits.length} business units for ${currentBuilding.name}`);
        setUnits(buildingUnits);
        setFilteredUnits(buildingUnits);
        
        // Calculate stats
        const totalBusinessUnits = buildingUnits.length;
        const occupiedBusinessUnits = buildingUnits.filter(unit => unit.status === 'occupied').length;
        const vacantBusinessUnits = buildingUnits.filter(unit => unit.status === 'vacant').length;
        const maintenanceBusinessUnits = buildingUnits.filter(unit => unit.status === 'maintenance').length;
        const occupancyRate = totalBusinessUnits > 0 ? Math.round((occupiedBusinessUnits / totalBusinessUnits) * 100) : 0;
        
        setUnitStats({
          totalBusinessUnits,
          occupiedBusinessUnits,
          vacantBusinessUnits,
          maintenanceBusinessUnits,
          occupancyRate
        });
      } catch (error) {
        console.error('Error filtering business units:', error);
        // Fallback to showing all units
        setUnits(mockBusinessUnits);
        setFilteredUnits(mockBusinessUnits);
      }
    } else {
      console.log('No current building selected, showing all business units');
      // If no building is selected, show all units (for demo)
      setUnits(mockBusinessUnits);
      setFilteredUnits(mockBusinessUnits);
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
          (unit.businessName && unit.businessName.toLowerCase().includes(lowercasedQuery)) ||
          (unit.businessType && unit.businessType.toLowerCase().includes(lowercasedQuery)) ||
          (unit.contactPerson && unit.contactPerson.toLowerCase().includes(lowercasedQuery))
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
        const buildingUnits = mockBusinessUnits.filter(unit => 
          unit.buildingId === currentBuilding.id || unit.building === currentBuilding.name
        );
        setUnits(buildingUnits);
        setFilteredUnits(buildingUnits);
      } else {
        setUnits(mockBusinessUnits);
        setFilteredUnits(mockBusinessUnits);
      }
      setRefreshing(false);
    }, 1000);
  };
  
  const handleUnitPress = (unitId: string) => {
    navigation.navigate('UnitDetails', { unitId });
  };
  
  const handleContact = (email?: string, phone?: string) => {
    // Implement contact functionality
    console.log('Contact business:', email, phone);
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
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString('en-US', options);
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
          <Text style={styles.statValue}>{unitStats.totalBusinessUnits}</Text>
          <Text style={styles.statLabel}>Total Units</Text>
        </Surface>
        
        <Surface style={styles.statCard} elevation={2}>
          <Text style={styles.statValue}>{unitStats.occupancyRate}%</Text>
          <Text style={styles.statLabel}>Occupancy</Text>
        </Surface>
        
        <Surface style={styles.statCard} elevation={2}>
          <Text style={styles.statValue}>{unitStats.occupiedBusinessUnits}</Text>
          <Text style={styles.statLabel}>Occupied</Text>
        </Surface>
        
        <Surface style={styles.statCard} elevation={2}>
          <Text style={styles.statValue}>{unitStats.vacantBusinessUnits}</Text>
          <Text style={styles.statLabel}>Vacant</Text>
        </Surface>
      </View>
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search business units..."
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
      <Briefcase size={64} color={theme.colors.onSurfaceDisabled} />
      <Text style={styles.emptyTitle}>No business units found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try a different search term'
          : 'Add business units to your building'}
      </Text>
    </View>
  );

  const renderUnitItem = ({ item }: { item: BusinessUnit }) => (
    <Surface style={styles.unitCard} elevation={1}>
      <TouchableOpacity
        style={styles.unitCardContent}
        onPress={() => handleUnitPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.unitHeader}>
          <View style={styles.unitTitleContainer}>
            <View style={styles.unitTypeIconContainer}>
              <Briefcase size={20} color={theme.colors.primary} />
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
              <CreditCard size={16} color={theme.colors.primary} style={styles.metadataIcon} />
              <Text style={styles.metadataLabel}>Rent</Text>
              <Text style={styles.metadataValue}>€{item.rent || 0}</Text>
            </View>
            
            <View style={styles.metadataItem}>
              <Store size={16} color={theme.colors.primary} style={styles.metadataIcon} />
              <Text style={styles.metadataLabel}>Business</Text>
              <Text style={styles.metadataValue} numberOfLines={1}>
                {item.businessName ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </View>
        
        {item.businessName && (
          <View style={styles.businessInfoContainer}>
            <Text style={styles.businessName}>{item.businessName}</Text>
            <Text style={styles.businessType}>{item.businessType}</Text>
            
            {item.contactPerson && (
              <Text style={styles.contactPerson}>{item.contactPerson}</Text>
            )}
            
            <View style={styles.contactActions}>
              {item.contactEmail && (
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleContact(item.contactEmail, undefined)}
                >
                  <Mail size={16} color={theme.colors.primary} />
                  <Text style={[styles.contactButtonText, {color: theme.colors.primary}]}>
                    Email
                  </Text>
                </TouchableOpacity>
              )}
              
              {item.contactPhone && (
                <TouchableOpacity
                  style={styles.contactButton}
                  onPress={() => handleContact(undefined, item.contactPhone)}
                >
                  <Phone size={16} color={theme.colors.primary} />
                  <Text style={[styles.contactButtonText, {color: theme.colors.primary}]}>
                    Call
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        
        <View style={styles.unitFooter}>
          {item.leaseStart && item.leaseEnd ? (
            <Chip 
              icon={() => <CreditCard size={16} color={theme.colors.primary} />}
              style={styles.leaseChip}
            >
              Lease: {formatDate(item.leaseStart)} - {formatDate(item.leaseEnd)}
            </Chip>
          ) : (
            <Text style={styles.noLeaseText}>No active lease</Text>
          )}
          
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
      title="Business Units"
      refreshing={refreshing}
      onRefresh={handleRefresh}
      disableScrollView={true}
      forceShowContextSwitcher={false}
    >
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading business units...</Text>
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
  businessInfoContainer: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    marginBottom: 16,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  businessType: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  contactPerson: {
    fontSize: 14,
    marginBottom: 8,
  },
  contactActions: {
    flexDirection: 'row',
    marginTop: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  contactButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  unitFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leaseChip: {
    height: 28,
  },
  noLeaseText: {
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

