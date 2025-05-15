import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar, FAB, Button, Card, SegmentedButtons, Divider, ProgressBar } from 'react-native-paper';
import { Building2, Plus, Filter, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Users, AlertTriangle } from 'lucide-react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { ListItem } from '../../../components/ListItem';
import { FilterModal, FilterConfig } from '../../../components/FilterModal';
import { buildingService } from '../../../services/buildingService';
import { Building, BusinessManagerStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

// Define route props type
type BuildingsByBusinessAccountRouteProps = RouteProp<
  BusinessManagerStackParamList,
  'BuildingsByBusinessAccount'
>;

// Define navigation props type
type BuildingsNavigationProp = NativeStackNavigationProp<
  BusinessManagerStackParamList
>;

// Filter and sort configurations (reused from BuildingsList)
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

// Mock data for buildings (we would filter by businessAccountId in a real scenario)
const mockBuildings: Building[] = [
  {
    id: 'building-1',
    name: 'Riviera Towers',
    address: '145 Rruga Ismail Qemali, Tirana',
    units: 65,
    residents: 220,
    issues: 2,
    occupancyRate: 92,
    maintenanceCost: '€1,500/month',
    yearBuilt: 2018,
    propertyType: 'Apartment',
    amenities: ['Gym', 'Pool', 'Parking', 'Security'],
    image: 'https://via.placeholder.com/600/300',
    businessAccountId: 'ba-1'
  },
  {
    id: 'building-2',
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
    businessAccountId: 'ba-1'
  },
  {
    id: 'building-3',
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
    businessAccountId: 'ba-1'
  },
  {
    id: 'building-4',
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
    businessAccountId: 'ba-2'
  },
  {
    id: 'building-5',
    name: 'Metropolitan Center',
    address: '120 Rruga e Kavajës, Tirana',
    units: 20,
    residents: 15,
    issues: 1,
    occupancyRate: 90,
    maintenanceCost: '€1,800/month',
    yearBuilt: 2019,
    propertyType: 'Commercial',
    amenities: ['Parking', 'Security', 'Conference Room'],
    image: 'https://via.placeholder.com/600/300',
    businessAccountId: 'ba-2'
  },
  {
    id: 'building-6',
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
    businessAccountId: 'ba-3'
  },
];

// Add financial insights mock data
const financialInsightsMock = {
  revenue: {
    total: 125000,
    previousPeriod: 115000,
    trend: 8.7,
    breakdown: [
      { name: 'Riviera Towers', value: 65000, percentage: 52 },
      { name: 'Park View Residence', value: 42000, percentage: 33.6 },
      { name: 'Central Plaza', value: 18000, percentage: 14.4 }
    ]
  },
  expenses: {
    total: 48500,
    previousPeriod: 52000,
    trend: -6.7,
    breakdown: [
      { name: 'Riviera Towers', value: 23000, percentage: 47.4 },
      { name: 'Park View Residence', value: 16500, percentage: 34 },
      { name: 'Central Plaza', value: 9000, percentage: 18.6 }
    ]
  },
  occupancy: {
    average: 90.6,
    previousPeriod: 88.2,
    trend: 2.7,
    breakdown: [
      { name: 'Riviera Towers', value: 92, percentage: 92 },
      { name: 'Park View Residence', value: 85, percentage: 85 },
      { name: 'Central Plaza', value: 95, percentage: 95 }
    ]
  },
  issues: {
    total: 3,
    previousPeriod: 5,
    trend: -40,
    breakdown: [
      { name: 'Riviera Towers', value: 2, percentage: 66.7 },
      { name: 'Park View Residence', value: 1, percentage: 33.3 },
      { name: 'Central Plaza', value: 0, percentage: 0 }
    ]
  }
};

export const BuildingsByBusinessAccount = () => {
  const theme = useTheme();
  const navigation = useNavigation<BuildingsNavigationProp>();
  const route = useRoute<BuildingsByBusinessAccountRouteProps>();
  const { businessAccountId, businessAccountName } = route.params;
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [insightsTab, setInsightsTab] = useState('overview');
  
  // Advanced filter state
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeSort, setActiveSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: '',
    direction: 'asc'
  });
  
  useEffect(() => {
    fetchBuildings();
  }, [businessAccountId]);
  
  useEffect(() => {
    filterBuildings();
  }, [buildings, searchQuery, activeFilters, activeSort]);
  
  const fetchBuildings = () => {
    setLoading(true);
    
    // Filter mock buildings by businessAccountId
    // In a real app, this would be an API call
    const filteredBuildings = mockBuildings.filter(
      building => building.businessAccountId === businessAccountId
    );
    
    setBuildings(filteredBuildings);
    setFilteredBuildings(filteredBuildings);
    setLoading(false);
    setRefreshing(false);
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
  
  const handleViewAllAccounts = () => {
    navigation.navigate('BusinessAccounts');
  };

  const renderTrendIndicator = (value: number, inverted: boolean = false) => {
    const isPositive = inverted ? value < 0 : value > 0;
    const color = isPositive ? STATUS_COLORS.success : STATUS_COLORS.error;
    
    return (
      <View style={[styles.trendIndicator, { backgroundColor: `${color}15` }]}>
        {isPositive ? (
          <ArrowUpRight size={14} color={color} />
        ) : (
          <ArrowDownRight size={14} color={color} />
        )}
        <Text style={[styles.trendText, { color }]}>
          {value > 0 ? '+' : ''}{value}%
        </Text>
      </View>
    );
  };
  
  const renderFinancialInsightsCard = () => {
    const insights = financialInsightsMock;

    return (
      <Card style={styles.insightsCard}>
        <Card.Content>
          <View style={styles.insightsHeader}>
            <Text style={styles.insightsTitle}>Financial Insights</Text>
            <SegmentedButtons
              value={insightsTab}
              onValueChange={setInsightsTab}
              buttons={[
                { value: 'overview', label: 'Overview' },
                { value: 'compare', label: 'Compare' },
              ]}
              style={styles.segmentedButtons}
              density="small"
            />
          </View>
          
          {insightsTab === 'overview' ? (
            <View style={styles.insightsOverview}>
              <View style={styles.metricsRow}>
                {/* Revenue Card */}
                <View style={styles.metricCard}>
                  <View style={styles.metricIconContainer}>
                    <DollarSign size={18} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.metricLabel}>Revenue</Text>
                  <Text style={styles.metricValue}>€{insights.revenue.total.toLocaleString()}</Text>
                  {renderTrendIndicator(insights.revenue.trend)}
                </View>
                
                {/* Expenses Card */}
                <View style={styles.metricCard}>
                  <View style={[styles.metricIconContainer, { backgroundColor: `${STATUS_COLORS.warning}15` }]}>
                    <DollarSign size={18} color={STATUS_COLORS.warning} />
                  </View>
                  <Text style={styles.metricLabel}>Expenses</Text>
                  <Text style={styles.metricValue}>€{insights.expenses.total.toLocaleString()}</Text>
                  {renderTrendIndicator(insights.expenses.trend, true)}
                </View>
              </View>
              
              <View style={styles.metricsRow}>
                {/* Occupancy Card */}
                <View style={styles.metricCard}>
                  <View style={[styles.metricIconContainer, { backgroundColor: `${theme.colors.secondary}15` }]}>
                    <Users size={18} color={theme.colors.secondary} />
                  </View>
                  <Text style={styles.metricLabel}>Avg. Occupancy</Text>
                  <Text style={styles.metricValue}>{insights.occupancy.average}%</Text>
                  {renderTrendIndicator(insights.occupancy.trend)}
                </View>
                
                {/* Issues Card */}
                <View style={styles.metricCard}>
                  <View style={[styles.metricIconContainer, { backgroundColor: `${STATUS_COLORS.error}15` }]}>
                    <AlertTriangle size={18} color={STATUS_COLORS.error} />
                  </View>
                  <Text style={styles.metricLabel}>Issues</Text>
                  <Text style={styles.metricValue}>{insights.issues.total}</Text>
                  {renderTrendIndicator(insights.issues.trend, true)}
                </View>
              </View>
            </View>
          ) : (
            <ScrollView style={styles.comparisonSection}>
              <Text style={styles.comparisonTitle}>Revenue Distribution</Text>
              {insights.revenue.breakdown.map((item, index) => (
                <View key={`revenue-${index}`} style={styles.comparisonItem}>
                  <View style={styles.comparisonHeader}>
                    <Text style={styles.comparisonItemName}>{item.name}</Text>
                    <Text style={styles.comparisonItemValue}>€{item.value.toLocaleString()}</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <ProgressBar progress={item.percentage / 100} color={theme.colors.primary} style={styles.progressBar} />
                    <Text style={styles.progressBarLabel}>{item.percentage}%</Text>
                  </View>
                </View>
              ))}
              
              <Divider style={styles.comparisonDivider} />
              
              <Text style={styles.comparisonTitle}>Occupancy Rates</Text>
              {insights.occupancy.breakdown.map((item, index) => (
                <View key={`occupancy-${index}`} style={styles.comparisonItem}>
                  <View style={styles.comparisonHeader}>
                    <Text style={styles.comparisonItemName}>{item.name}</Text>
                    <Text style={styles.comparisonItemValue}>{item.value}%</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <ProgressBar 
                      progress={item.value / 100} 
                      color={
                        item.value > 90 ? STATUS_COLORS.success : 
                        item.value > 70 ? STATUS_COLORS.warning : 
                        STATUS_COLORS.error
                      } 
                      style={styles.progressBar} 
                    />
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </Card.Content>
      </Card>
    );
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
        No buildings found for this business account
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
      subtitle={`${item.propertyType} • ${item.units} Units`}
      description={`${item.residents} Residents • ${item.occupancyRate}% Occupied`}
      onPress={() => handleBuildingPress(item.id)}
      badge={{
        text: item.issues > 0 ? `${item.issues} Issues` : 'No Issues',
        color: item.issues > 0 ? STATUS_COLORS.error : STATUS_COLORS.success
      }}
    />
  );
  
  return (
    <View style={[commonStyles.screenContainer, { backgroundColor: theme.colors.background }]}>
      <Header 
        title={`${businessAccountName} Buildings`}
        showBack={true}
        action={{
          icon: <Building2 size={24} color={theme.colors.primary} />,
          onPress: () => {}
        }}
      />
      
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>{businessAccountName}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{filteredBuildings.length}</Text>
            <Text style={styles.statLabel}>Buildings</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {filteredBuildings.reduce((sum, building) => sum + building.units, 0)}
            </Text>
            <Text style={styles.statLabel}>Units</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {filteredBuildings.reduce((sum, building) => sum + building.residents, 0)}
            </Text>
            <Text style={styles.statLabel}>Residents</Text>
          </View>
        </View>
      </View>
      
      {renderFinancialInsightsCard()}
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.viewAllAccountsButton} onPress={handleViewAllAccounts}>
          <Text style={{ color: theme.colors.primary }}>View All Business Accounts</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterContainer}>
        <Searchbar
          placeholder="Search buildings..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ fontSize: 14 }}
        />
        
        <TouchableOpacity style={styles.filterButton} onPress={handleOpenFilterModal}>
          <Filter size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredBuildings}
          renderItem={renderBuildingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyList}
        />
      )}
      
      <FAB
        icon={props => <Plus {...props} />}
        style={[commonStyles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddBuilding}
        color="white"
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
  infoCard: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  insightsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    maxWidth: 200,
  },
  insightsOverview: {
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  metricIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,128,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  comparisonSection: {
    maxHeight: 280,
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  comparisonItem: {
    marginBottom: 12,
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comparisonItemName: {
    fontSize: 14,
  },
  comparisonItemValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  progressBarLabel: {
    marginLeft: 8,
    fontSize: 12,
    opacity: 0.7,
    width: 40,
    textAlign: 'right',
  },
  comparisonDivider: {
    marginVertical: 16,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  viewAllAccountsButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    elevation: 0,
  },
  filterButton: {
    marginLeft: 8,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
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
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
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