import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Text, useTheme, ActivityIndicator, Card, Chip, Searchbar, FAB, SegmentedButtons, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Building2, Plus, Filter, AlertTriangle, Home, Users, Briefcase, PieChart, ChevronRight } from 'lucide-react-native';
import { BusinessManagerStackParamList, Building } from '../../../navigation/types';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { FilterModal, FilterConfig } from '../../../components/FilterModal';
import { StatusBar } from 'expo-status-bar';
import { buildingService } from '../../../services/buildingService';
import { LinearGradient } from 'expo-linear-gradient';

// Define navigation props type
type BuildingsNavigationProp = NativeStackNavigationProp<
  BusinessManagerStackParamList
>;

// Improved filter and sort configurations
const filterConfig: FilterConfig = {
  filterGroups: [
    {
      id: 'propertyType',
      name: 'Property Type',
      options: [
        { id: 'residential', label: 'Residential', value: false },
        { id: 'commercial', label: 'Commercial', value: false },
        { id: 'mixed', label: 'Mixed Use', value: false },
        { id: 'apartment', label: 'Apartment', value: false },
        { id: 'office', label: 'Office', value: false },
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
      id: 'size',
      name: 'Building Size',
      options: [
        { id: 'small', label: 'Small (<30 units)', value: false },
        { id: 'medium', label: 'Medium (30-60 units)', value: false },
        { id: 'large', label: 'Large (>60 units)', value: false },
      ],
    },
    {
      id: 'status',
      name: 'Status',
      options: [
        { id: 'active', label: 'Active', value: false },
        { id: 'maintenance', label: 'Under Maintenance', value: false },
        { id: 'development', label: 'In Development', value: false },
      ],
    },
  ],
  sortOptions: [
    { id: 'name', label: 'Name' },
    { id: 'units', label: 'Number of Units' },
    { id: 'occupancyRate', label: 'Occupancy Rate' },
    { id: 'residents', label: 'Resident Count' },
    { id: 'yearBuilt', label: 'Year Built' },
  ],
};

// Enhanced mock data for buildings with additional fields
const mockBuildings: Building[] = [
  {
    id: '1',
    name: 'Riviera Towers',
    address: '145 Rruga Ismail Qemali, Tirana',
    units: 65,
    residents: 220,
    issues: 2,
    occupancyRate: 92,
    maintenanceCost: '€1,500/month',
    yearBuilt: 2018,
    propertyType: 'Residential',
    amenities: ['Gym', 'Pool', 'Parking', 'Security'],
    image: 'https://via.placeholder.com/600/300',
    businessAccountId: 'ba-1',
    residentialUnits: 58,
    businessUnits: 7,
    status: 'active',
    adminAssigned: true,
    location: {
      country: 'Albania',
      city: 'Tirana',
      coordinates: {
        latitude: 41.3275,
        longitude: 19.8187
      }
    },
    floorArea: 12500,
    floors: 18
  },
  {
    id: '2',
    name: 'Park View Residence',
    address: '78 Rruga Sami Frasheri, Tirana',
    units: 42,
    residents: 150,
    issues: 1,
    occupancyRate: 85,
    maintenanceCost: '€1,200/month',
    yearBuilt: 2016,
    propertyType: 'Mixed Use',
    amenities: ['Gym', 'Parking', 'Security'],
    image: 'https://via.placeholder.com/600/300',
    businessAccountId: 'ba-1',
    residentialUnits: 32,
    businessUnits: 10,
    status: 'active',
    adminAssigned: true,
    location: {
      country: 'Albania',
      city: 'Tirana',
      coordinates: {
        latitude: 41.3217,
        longitude: 19.8233
      }
    },
    floorArea: 8750,
    floors: 12
  },
  {
    id: '3',
    name: 'Central Plaza',
    address: '25 Bulevardi Dëshmorët e Kombit, Tirana',
    units: 30,
    residents: 10,
    issues: 0,
    occupancyRate: 95,
    maintenanceCost: '€2,000/month',
    yearBuilt: 2020,
    propertyType: 'Commercial',
    amenities: ['Parking', 'Security', 'Conference Room'],
    image: 'https://via.placeholder.com/600/300',
    businessAccountId: 'ba-1',
    residentialUnits: 0,
    businessUnits: 30,
    status: 'active',
    adminAssigned: true,
    location: {
      country: 'Albania',
      city: 'Tirana',
      coordinates: {
        latitude: 41.3275,
        longitude: 19.8187
      }
    },
    floorArea: 9000,
    floors: 10
  },
  {
    id: '4',
    name: 'Urban Lofts',
    address: '56 Rruga Ibrahim Rugova, Tirana',
    units: 25,
    residents: 75,
    issues: 4,
    occupancyRate: 80,
    maintenanceCost: '€1,100/month',
    yearBuilt: 2015,
    propertyType: 'Apartment',
    amenities: ['Parking', 'Security'],
    image: 'https://via.placeholder.com/600/300',
    businessAccountId: 'ba-2',
    residentialUnits: 25,
    businessUnits: 0,
    status: 'maintenance',
    adminAssigned: false,
    location: {
      country: 'Albania',
      city: 'Tirana',
      coordinates: {
        latitude: 41.3248,
        longitude: 19.8199
      }
    },
    floorArea: 5500,
    floors: 8
  },
  {
    id: '5',
    name: 'Metropolitan Center',
    address: '120 Rruga e Kavajës, Tirana',
    units: 20,
    residents: 15,
    issues: 1,
    occupancyRate: 90,
    maintenanceCost: '€1,800/month',
    yearBuilt: 2019,
    propertyType: 'Office',
    amenities: ['Parking', 'Security', 'Conference Room'],
    image: 'https://via.placeholder.com/600/300',
    businessAccountId: 'ba-2',
    residentialUnits: 0,
    businessUnits: 20,
    status: 'active',
    adminAssigned: true,
    location: {
      country: 'Albania',
      city: 'Tirana',
      coordinates: {
        latitude: 41.3289,
        longitude: 19.8122
      }
    },
    floorArea: 7800,
    floors: 6
  },
  {
    id: '6',
    name: 'Luxury Heights',
    address: '33 Rruga Mustafa Matohiti, Tirana',
    units: 15,
    residents: 45,
    issues: 0,
    occupancyRate: 95,
    maintenanceCost: '€1,600/month',
    yearBuilt: 2021,
    propertyType: 'Apartment',
    amenities: ['Gym', 'Pool', 'Parking', 'Security', 'Spa'],
    image: 'https://via.placeholder.com/600/300',
    businessAccountId: 'ba-3',
    residentialUnits: 15,
    businessUnits: 0,
    status: 'active',
    adminAssigned: true,
    location: {
      country: 'Albania',
      city: 'Tirana',
      coordinates: {
        latitude: 41.3293,
        longitude: 19.8241
      }
    },
    floorArea: 4500,
    floors: 6
  },
  {
    id: '7',
    name: 'Green Tower',
    address: '48 Rruga Myslym Shyri, Tirana',
    units: 55,
    residents: 180,
    issues: 2,
    occupancyRate: 88,
    maintenanceCost: '€1,400/month',
    yearBuilt: 2022,
    propertyType: 'Residential',
    amenities: ['Gym', 'Garden', 'Parking', 'Security'],
    image: 'https://via.placeholder.com/600/300',
    businessAccountId: 'ba-1',
    residentialUnits: 50,
    businessUnits: 5,
    status: 'development',
    adminAssigned: false,
    location: {
      country: 'Albania',
      city: 'Tirana',
      coordinates: {
        latitude: 41.3237,
        longitude: 19.8157
      }
    },
    floorArea: 11000,
    floors: 15
  },
];

export const BuildingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<BuildingsNavigationProp>();
  const { commonStyles } = useThemedStyles();
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeSort, setActiveSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'name',
    direction: 'asc',
  });
  const [viewMode, setViewMode] = useState('grid');
  
  // Stats for dashboard
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalUnits: 0,
    totalResidents: 0,
    averageOccupancy: 0,
    issuesCount: 0,
  });
  
  useEffect(() => {
    fetchBuildings();
  }, []);
  
  // Calculate statistics for the dashboard
  const calculateStatistics = () => {
    const total = buildings.length;
    const units = buildings.reduce((sum, building) => sum + building.units, 0);
    const residents = buildings.reduce((sum, building) => sum + building.residents, 0);
    const occupancySum = buildings.reduce((sum, building) => sum + building.occupancyRate, 0);
    const avgOccupancy = total > 0 ? Math.round(occupancySum / total) : 0;
    const issues = buildings.reduce((sum, building) => sum + building.issues, 0);
    
    setStats({
      totalBuildings: total,
      totalUnits: units,
      totalResidents: residents,
      averageOccupancy: avgOccupancy,
      issuesCount: issues,
    });
  };
  
  // Fetch buildings from service or mock data
  const fetchBuildings = () => {
    // In a real app, you would use the buildingService here instead of mockBuildings
    setTimeout(() => {
      try {
        const fetchedBuildings = mockBuildings;
        
        // Sort buildings by default sort
        const sortedBuildings = [...fetchedBuildings].sort((a, b) => {
          // Default sort by name
          return a.name.localeCompare(b.name);
        });
        
        setBuildings(sortedBuildings);
        setFilteredBuildings(sortedBuildings);
        calculateStatistics();
      } catch (error) {
        console.error("Error fetching buildings:", error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    }, 1000); // Simulate network delay
  };
  
  // Filter buildings based on search and filter criteria
  const filterBuildings = () => {
    // Apply filters and search
    let filtered = [...buildings];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(building => 
        building.name.toLowerCase().includes(query) || 
        building.address.toLowerCase().includes(query) || 
        building.propertyType.toLowerCase().includes(query)
      );
    }
    
    // Apply active filters
    if (Object.keys(activeFilters).length) {
      Object.entries(activeFilters).forEach(([key, values]) => {
        if (values.length === 0) return;
        
        switch (key) {
          case 'propertyType':
            filtered = filtered.filter(b => values.some(v => b.propertyType.toLowerCase().includes(v.toLowerCase())));
            break;
          case 'occupancyRange':
            filtered = filtered.filter(b => {
              const occupancy = b.occupancyRate;
              return values.some(v => {
                if (v === 'low') return occupancy < 70;
                if (v === 'medium') return occupancy >= 70 && occupancy <= 90;
                if (v === 'high') return occupancy > 90;
                return false;
              });
            });
            break;
          case 'size':
            filtered = filtered.filter(b => {
              const units = b.units;
              return values.some(v => {
                if (v === 'small') return units < 30;
                if (v === 'medium') return units >= 30 && units <= 60;
                if (v === 'large') return units > 60;
                return false;
              });
            });
            break;
          case 'status':
            filtered = filtered.filter(b => values.includes(b.status || ''));
            break;
        }
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const direction = activeSort.direction === 'asc' ? 1 : -1;
      
      switch (activeSort.field) {
        case 'name':
          return direction * a.name.localeCompare(b.name);
        case 'units':
          return direction * (a.units - b.units);
        case 'occupancyRate':
          return direction * (a.occupancyRate - b.occupancyRate);
        case 'residents':
          return direction * (a.residents - b.residents);
        case 'yearBuilt':
          return direction * ((a.yearBuilt || 0) - (b.yearBuilt || 0));
        default:
          return 0;
      }
    });
    
    setFilteredBuildings(filtered);
  };
  
  // Update filtered buildings when filters or search changes
  useEffect(() => {
    filterBuildings();
  }, [buildings, searchQuery, activeFilters, activeSort]);
  
  // Handle the pull-to-refresh gesture
  const handleRefresh = () => {
    setRefreshing(true);
    fetchBuildings();
  };
  
  // Navigate to building details
  const handleBuildingPress = (buildingId: string) => {
    navigation.navigate('BuildingDetails', { buildingId });
  };
  
  // Handle search query changes
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Navigate to add building screen
  const handleAddBuilding = () => {
    navigation.navigate('AddBuilding');
  };
  
  // Open filter modal
  const handleOpenFilterModal = () => {
    setFilterModalVisible(true);
  };
  
  // Apply filters from modal
  const handleApplyFilters = (
    filters: Record<string, string[]>,
    sort: { field: string; direction: 'asc' | 'desc' }
  ) => {
    setActiveFilters(filters);
    setActiveSort(sort);
    setFilterModalVisible(false);
  };
  
  // Navigate to view by business account
  const handleViewByBusinessAccount = () => {
    // Navigate back to the main BuildingsList screen
    // In reality, we should define "BuildingsList" in BusinessManagerStackParamList
    // But for now, let's work with what we have
    navigation.navigate('Buildings');
  };
  
  // Render empty list view
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Building2 size={80} color={theme.colors.primary} style={{ opacity: 0.5, marginBottom: 16 }} />
      <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 8 }}>
        No Buildings Found
      </Text>
      <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant, marginBottom: 24 }}>
        {searchQuery || Object.keys(activeFilters).length > 0
          ? "Try adjusting your filters or search query"
          : "Add your first building to get started"}
      </Text>
      <TouchableOpacity onPress={handleAddBuilding}>
        <LinearGradient
          colors={[theme.colors.primary, '#0a4bab']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.emptyAddButton}
        >
          <Plus size={20} color="#fff" />
          <Text style={styles.emptyAddButtonText}>Add Building</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
  
  // Render building item (Grid View)
  const renderBuildingItem = ({ item }: { item: Building }) => {
    // Calculate occupancy color
    const getOccupancyColor = (rate: number) => {
      if (rate >= 90) return '#4CAF50';  // High occupancy - green
      if (rate >= 70) return '#FF9800';  // Medium occupancy - orange
      return '#F44336';                  // Low occupancy - red
    };
    
    // Determine building status color
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active': return '#4CAF50';
        case 'maintenance': return '#FF9800';
        case 'development': return '#2196F3';
        default: return '#9E9E9E';
      }
    };
    
    return (
      <TouchableOpacity 
        style={styles.buildingCard}
        onPress={() => handleBuildingPress(item.id)}
        activeOpacity={0.7}
      >
        <Card style={styles.card} mode="elevated">
          <Card.Cover 
            source={{ uri: item.image || 'https://via.placeholder.com/300' }} 
            style={styles.cardImage}
          />
          
          <View style={styles.cardBadgeContainer}>
            <Chip 
              style={[styles.statusChip, { backgroundColor: getStatusColor(item.status || '') }]}
              textStyle={{ color: '#fff', fontSize: 10 }}
            >
              {item.status === 'active' ? 'Active' : 
               item.status === 'maintenance' ? 'Maintenance' : 
               item.status === 'development' ? 'Development' : item.status}
            </Chip>
          </View>
          
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" numberOfLines={1} style={styles.buildingName}>
              {item.name}
            </Text>
            
            <Text variant="bodySmall" numberOfLines={1} style={styles.buildingAddress}>
              {item.address}
            </Text>
            
            <View style={styles.buildingDetailsRow}>
              <View style={styles.buildingDetailItem}>
                <Home size={14} color={theme.colors.onSurfaceVariant} />
                <Text variant="labelSmall" style={styles.detailText}>
                  {item.units} Units
                </Text>
              </View>
              
              <View style={styles.buildingDetailItem}>
                <Users size={14} color={theme.colors.onSurfaceVariant} />
                <Text variant="labelSmall" style={styles.detailText}>
                  {item.residents} Residents
                </Text>
              </View>
            </View>
            
            <View style={styles.occupancyContainer}>
              <View style={styles.occupancyLabelRow}>
                <Text variant="labelSmall" style={styles.occupancyLabel}>
                  Occupancy
                </Text>
                <Text variant="labelSmall" style={[styles.occupancyValue, { color: getOccupancyColor(item.occupancyRate) }]}>
                  {item.occupancyRate}%
                </Text>
              </View>
              
              <View style={styles.occupancyBarContainer}>
                <View 
                  style={[
                    styles.occupancyBar, 
                    { 
                      width: `${item.occupancyRate}%`,
                      backgroundColor: getOccupancyColor(item.occupancyRate)
                    }
                  ]} 
                />
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
  
  // Render compact building item (List View)
  const renderCompactBuildingItem = ({ item }: { item: Building }) => {
    // Calculate occupancy color
    const getOccupancyColor = (rate: number) => {
      if (rate >= 90) return '#4CAF50';  // High occupancy - green
      if (rate >= 70) return '#FF9800';  // Medium occupancy - orange
      return '#F44336';                  // Low occupancy - red
    };
    
    return (
      <TouchableOpacity 
        onPress={() => handleBuildingPress(item.id)}
        activeOpacity={0.7}
      >
        <Card style={styles.compactCard} mode="outlined">
          <Card.Content style={styles.compactCardContent}>
            <View style={styles.compactImageContainer}>
              <Avatar.Image 
                source={{ uri: item.image || 'https://via.placeholder.com/60' }} 
                size={60}
              />
              <View 
                style={[
                  styles.statusIndicator, 
                  { 
                    backgroundColor: 
                      item.status === 'active' ? '#4CAF50' : 
                      item.status === 'maintenance' ? '#FF9800' : 
                      item.status === 'development' ? '#2196F3' : 
                      '#9E9E9E'
                  }
                ]}
              />
            </View>
            
            <View style={styles.compactDetails}>
              <View>
                <Text variant="titleMedium" numberOfLines={1} style={styles.compactName}>
                  {item.name}
                </Text>
                <Text variant="bodySmall" numberOfLines={1} style={styles.compactAddress}>
                  {item.address}
                </Text>
                
                <View style={styles.compactTagsContainer}>
                  <View style={styles.compactTag}>
                    <Home size={12} color={theme.colors.onSurfaceVariant} />
                    <Text variant="labelSmall" style={styles.compactTagText}>
                      {item.units}
                    </Text>
                  </View>
                  
                  <View style={styles.compactTag}>
                    <Users size={12} color={theme.colors.onSurfaceVariant} />
                    <Text variant="labelSmall" style={styles.compactTagText}>
                      {item.residents}
                    </Text>
                  </View>
                  
                  <View style={[styles.compactTag, styles.occupancyTag]}>
                    <Text variant="labelSmall" style={[styles.compactTagText, { color: getOccupancyColor(item.occupancyRate) }]}>
                      {item.occupancyRate}% Occupancy
                    </Text>
                  </View>
                </View>
              </View>
              
              <ChevronRight size={20} color={theme.colors.primary} />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={[commonStyles.screenContainer, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Buildings</Text>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={handleOpenFilterModal}
        >
          <Filter size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search buildings..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={theme.colors.primary}
          inputStyle={styles.searchInput}
          elevation={1}
        />
      </View>
      
      <View style={styles.viewToggleContainer}>
        <SegmentedButtons
          value={viewMode}
          onValueChange={setViewMode}
          buttons={[
            {
              value: 'grid',
              icon: 'view-grid-outline',
              label: 'Grid'
            },
            {
              value: 'list',
              icon: 'format-list-bulleted',
              label: 'List'
            },
          ]}
          style={styles.viewToggle}
        />
        
        <TouchableOpacity 
          style={styles.businessAccountButton} 
          onPress={handleViewByBusinessAccount}
        >
          <Briefcase size={16} color={theme.colors.primary} style={styles.businessAccountIcon} />
          <Text variant="labelMedium" style={{ color: theme.colors.primary }}>By Account</Text>
        </TouchableOpacity>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
            Loading buildings...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBuildings}
          renderItem={viewMode === 'grid' ? renderBuildingItem : renderCompactBuildingItem}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode === 'grid' ? 'grid' : 'list'}
          contentContainerStyle={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={renderEmptyList}
        />
      )}
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddBuilding}
        color="#fff"
      />
      
      <FilterModal
        visible={filterModalVisible}
        onDismiss={() => setFilterModalVisible(false)}
        onApplyFilters={handleApplyFilters}
        config={filterConfig}
        initialFilters={activeFilters}
        initialSort={activeSort}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    borderRadius: 12,
    elevation: 2,
  },
  searchInput: {
    fontSize: 14,
  },
  viewToggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewToggle: {
    flex: 2,
  },
  businessAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginLeft: 12,
  },
  businessAccountIcon: {
    marginRight: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 80,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  buildingCard: {
    width: '50%',
    padding: 4,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardBadgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  statusChip: {
    height: 22,
  },
  cardContent: {
    padding: 12,
  },
  buildingName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  buildingAddress: {
    marginBottom: 8,
    opacity: 0.7,
  },
  buildingDetailsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  buildingDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    marginLeft: 4,
  },
  occupancyContainer: {
    marginTop: 4,
  },
  occupancyLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  occupancyLabel: {
    opacity: 0.7,
  },
  occupancyValue: {
    fontWeight: '600',
  },
  occupancyBarContainer: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  occupancyBar: {
    height: '100%',
    borderRadius: 2,
  },
  compactCard: {
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  compactCardContent: {
    padding: 12,
    flexDirection: 'row',
  },
  compactImageContainer: {
    position: 'relative',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  compactDetails: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactName: {
    fontWeight: '600',
    marginBottom: 2,
  },
  compactAddress: {
    marginBottom: 6,
    opacity: 0.7,
  },
  compactTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  compactTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  compactTagText: {
    marginLeft: 4,
  },
  occupancyTag: {
    backgroundColor: 'transparent',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1363DF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
}); 