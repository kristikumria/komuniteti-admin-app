import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar, Card, Badge, Button, Divider, Chip, IconButton } from 'react-native-paper';
import { Home, Users, Building2, Briefcase, Archive, Car, ChevronRight, Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// Define a Unit interface for this component
interface Unit {
  id: string;
  number: string;
  floor: number;
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
}

interface BuildingUnitsProps {
  buildingId: string;
  buildingName: string;
}

export const BuildingUnits = ({ buildingId, buildingName }: BuildingUnitsProps) => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'residential' | 'business' | 'storage' | 'parking'>('all');
  
  // Mock units data for demonstration
  const mockUnits: Unit[] = [
    {
      id: 'unit-1',
      number: '101',
      floor: 1,
      type: 'residential',
      status: 'occupied',
      area: 85,
      bedrooms: 2,
      bathrooms: 1,
      resident: 'John Doe',
      residentId: 'resident-1',
      residentCount: 3,
    },
    {
      id: 'unit-2',
      number: '102',
      floor: 1,
      type: 'residential',
      status: 'vacant',
      area: 65,
      bedrooms: 1,
      bathrooms: 1,
      residentCount: 0,
    },
    {
      id: 'unit-3',
      number: '201',
      floor: 2,
      type: 'residential',
      status: 'occupied',
      area: 110,
      bedrooms: 3,
      bathrooms: 2,
      resident: 'Jane Smith',
      residentId: 'resident-2',
      residentCount: 4,
    },
    {
      id: 'unit-4',
      number: 'B101',
      floor: 0,
      type: 'business',
      status: 'occupied',
      area: 150,
      businessName: 'Coffee Shop LLC',
      businessType: 'Food & Beverage',
    },
    {
      id: 'unit-5',
      number: 'B102',
      floor: 0,
      type: 'business',
      status: 'occupied',
      area: 180,
      businessName: 'Pharmacy Plus',
      businessType: 'Healthcare',
    },
    {
      id: 'unit-6',
      number: 'P12',
      floor: -1,
      type: 'parking',
      status: 'occupied',
      area: 15,
    },
    {
      id: 'unit-7',
      number: 'S05',
      floor: -2,
      type: 'storage',
      status: 'vacant',
      area: 10,
    },
  ];
  
  useEffect(() => {
    // Simulate API call to fetch units
    setLoading(true);
    setTimeout(() => {
      setUnits(mockUnits); // In a real app, you would fetch data from your API
      setLoading(false);
    }, 1000);
  }, [buildingId]);
  
  // Filter units based on search query and active filter
  useEffect(() => {
    let result = [...units];
    
    // Apply active filter
    if (activeFilter !== 'all') {
      result = result.filter(unit => unit.type === activeFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(unit => 
        unit.number.toLowerCase().includes(lowercasedQuery) ||
        (unit.resident && unit.resident.toLowerCase().includes(lowercasedQuery)) ||
        (unit.businessName && unit.businessName.toLowerCase().includes(lowercasedQuery))
      );
    }
    
    setFilteredUnits(result);
  }, [units, activeFilter, searchQuery]);
  
  const handleUnitPress = (unitId: string) => {
    navigation.navigate('UnitDetails', { unitId, buildingId });
  };
  
  const handleViewResidents = (unitId: string) => {
    // Navigate to residents list with the unit filter
    navigation.navigate('ResidentsList', { unitId, buildingId });
  };
  
  const handleAddUnit = () => {
    navigation.navigate('AddUnit', { buildingId });
  };
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'occupied': return '#4CAF50';
      case 'vacant': return '#2196F3';
      case 'maintenance': return '#FF9800';
      default: return '#9E9E9E';
    }
  };
  
  // Helper function to get unit type icon
  const getUnitTypeIcon = (type: string) => {
    switch(type) {
      case 'residential': return <Home size={20} color={theme.colors.primary} />;
      case 'business': return <Briefcase size={20} color="#FF9800" />;
      case 'storage': return <Archive size={20} color="#607D8B" />;
      case 'parking': return <Car size={20} color="#8BC34A" />;
      default: return <Building2 size={20} color={theme.colors.primary} />;
    }
  };
  
  // Render unit item
  const renderUnitItem = ({ item }: { item: Unit }) => (
    <Card style={styles.unitCard} mode="outlined" onPress={() => handleUnitPress(item.id)}>
      <Card.Content>
        <View style={styles.unitHeader}>
          <View style={styles.unitTypeIconContainer}>
            {getUnitTypeIcon(item.type)}
          </View>
          <View style={styles.unitInfo}>
            <Text variant="titleMedium">Unit {item.number}</Text>
            <Text variant="bodySmall" style={styles.floorText}>Floor {item.floor}</Text>
            <View style={styles.unitMeta}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.areaText}>{item.area} m²</Text>
            </View>
          </View>
        </View>
        
        {item.type === 'residential' && (
          <View style={styles.occupantInfo}>
            {item.resident ? (
              <>
                <Text variant="bodyMedium" style={styles.occupantLabel}>Resident:</Text>
                <Text variant="bodyMedium" style={styles.occupantValue}>{item.resident}</Text>
                <Text variant="bodySmall" style={styles.residentsCount}>
                  {item.residentCount} {item.residentCount === 1 ? 'person' : 'people'}
                </Text>
                <Button 
                  mode="text" 
                  onPress={() => handleViewResidents(item.id)}
                  style={styles.viewButton}
                >
                  View Residents
                </Button>
              </>
            ) : (
              <Text variant="bodyMedium" style={styles.vacantText}>No residents</Text>
            )}
          </View>
        )}
        
        {item.type === 'business' && (
          <View style={styles.occupantInfo}>
            {item.businessName ? (
              <>
                <Text variant="bodyMedium" style={styles.occupantLabel}>Business:</Text>
                <Text variant="bodyMedium" style={styles.occupantValue}>{item.businessName}</Text>
                <Text variant="bodySmall" style={styles.businessType}>{item.businessType}</Text>
              </>
            ) : (
              <Text variant="bodyMedium" style={styles.vacantText}>No business</Text>
            )}
          </View>
        )}
      </Card.Content>
      <Card.Actions>
        <IconButton icon={() => <ChevronRight size={20} />} onPress={() => handleUnitPress(item.id)} />
      </Card.Actions>
    </Card>
  );
  
  // Render filter chips
  const renderFilterChips = () => (
    <View style={styles.filterChips}>
      <Chip 
        selected={activeFilter === 'all'} 
        onPress={() => setActiveFilter('all')}
        style={styles.filterChip}
      >
        All
      </Chip>
      <Chip 
        selected={activeFilter === 'residential'} 
        onPress={() => setActiveFilter('residential')}
        style={styles.filterChip}
        icon={() => <Home size={16} />}
      >
        Residential
      </Chip>
      <Chip 
        selected={activeFilter === 'business'} 
        onPress={() => setActiveFilter('business')}
        style={styles.filterChip}
        icon={() => <Briefcase size={16} />}
      >
        Business
      </Chip>
      <Chip 
        selected={activeFilter === 'storage'} 
        onPress={() => setActiveFilter('storage')}
        style={styles.filterChip}
        icon={() => <Archive size={16} />}
      >
        Storage
      </Chip>
      <Chip 
        selected={activeFilter === 'parking'} 
        onPress={() => setActiveFilter('parking')}
        style={styles.filterChip}
        icon={() => <Car size={16} />}
      >
        Parking
      </Chip>
    </View>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Building2 size={64} color={theme.colors.primary} opacity={0.3} />
      <Text variant="titleMedium" style={styles.emptyTitle}>No units found</Text>
      <Text variant="bodyMedium" style={styles.emptyDescription}>
        {searchQuery 
          ? 'Try different search terms or filters' 
          : 'This building has no units yet'}
      </Text>
      <Button 
        mode="contained" 
        onPress={handleAddUnit} 
        style={styles.addButton}
        icon={() => <Plus size={16} />}
      >
        Add Unit
      </Button>
    </View>
  );
  
  // Summary at the top showing counts of different unit types
  const renderSummary = () => (
    <Card style={styles.summaryCard}>
      <Card.Content>
        <Text variant="titleSmall" style={styles.summaryTitle}>Units Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text variant="headlineSmall" style={styles.summaryValue}>{units.length}</Text>
            <Text variant="bodySmall" style={styles.summaryLabel}>Total Units</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              {units.filter(unit => unit.type === 'residential').length}
            </Text>
            <Text variant="bodySmall" style={styles.summaryLabel}>Residential</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              {units.filter(unit => unit.type === 'business').length}
            </Text>
            <Text variant="bodySmall" style={styles.summaryLabel}>Business</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              {units.filter(unit => unit.status === 'occupied').length}
            </Text>
            <Text variant="bodySmall" style={styles.summaryLabel}>Occupied</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading units...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>Units</Text>
        <Button 
          mode="contained" 
          onPress={handleAddUnit}
          icon={() => <Plus size={16} />}
        >
          Add Unit
        </Button>
      </View>
      
      <Searchbar
        placeholder="Search units..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      {renderFilterChips()}
      
      {units.length > 0 && renderSummary()}
      
      <FlatList
        data={filteredUnits}
        renderItem={renderUnitItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  unitCard: {
    marginBottom: 12,
    elevation: 2,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unitTypeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unitInfo: {
    flex: 1,
  },
  floorText: {
    opacity: 0.7,
    marginBottom: 4,
  },
  unitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  areaText: {
    opacity: 0.7,
  },
  occupantInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  occupantLabel: {
    opacity: 0.7,
    marginBottom: 4,
  },
  occupantValue: {
    fontWeight: '500',
  },
  residentsCount: {
    opacity: 0.7,
    marginTop: 2,
  },
  businessType: {
    opacity: 0.7,
    marginTop: 2,
  },
  vacantText: {
    fontStyle: 'italic',
    opacity: 0.7,
  },
  viewButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  addButton: {
    marginTop: 8,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    marginBottom: 12,
    opacity: 0.7,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    opacity: 0.7,
  },
}); 