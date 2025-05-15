import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, SegmentedButtons, DataTable, Divider, Chip, Button, ActivityIndicator } from 'react-native-paper';
import { Building2, ArrowLeft, BarChart3, Users, DollarSign, Home, AlertTriangle } from 'lucide-react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { Building, BusinessManagerStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { STATUS_COLORS } from '../../../utils/constants';

// Define route props type
type BuildingsComparisonRouteProps = RouteProp<
  BusinessManagerStackParamList,
  'BuildingsComparison'
>;

// Define navigation props type
type BuildingsNavigationProp = NativeStackNavigationProp<
  BusinessManagerStackParamList
>;

// Mock buildings data based on buildingIds (would fetch from API in a real app)
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
  }
];

// Additional comparison metrics
interface BuildingMetrics {
  revenue: {
    monthly: number;
    growth: number;
  };
  expenses: {
    monthly: number;
    growth: number;
  };
  netProfit: number;
  occupancyTrend: number;
  avgRent: number;
  maintenanceCostPerUnit: number;
  issuesPerUnit: number;
}

// Mock comparison metrics
const mockBuildingMetrics: Record<string, BuildingMetrics> = {
  'building-1': {
    revenue: {
      monthly: 85000,
      growth: 6.2
    },
    expenses: {
      monthly: 32000,
      growth: -2.5
    },
    netProfit: 53000,
    occupancyTrend: 4.5,
    avgRent: 1307,
    maintenanceCostPerUnit: 23,
    issuesPerUnit: 0.03
  },
  'building-2': {
    revenue: {
      monthly: 52000,
      growth: 3.8
    },
    expenses: {
      monthly: 21000,
      growth: 1.2
    },
    netProfit: 31000,
    occupancyTrend: -2.3,
    avgRent: 1238,
    maintenanceCostPerUnit: 28.5,
    issuesPerUnit: 0.02
  },
  'building-3': {
    revenue: {
      monthly: 78000,
      growth: 9.5
    },
    expenses: {
      monthly: 25000,
      growth: -5.8
    },
    netProfit: 53000,
    occupancyTrend: 8.2,
    avgRent: 2600,
    maintenanceCostPerUnit: 66.6,
    issuesPerUnit: 0
  }
};

export const BuildingsComparisonScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<BuildingsNavigationProp>();
  const route = useRoute<BuildingsComparisonRouteProps>();
  const { businessAccountId, buildingIds } = route.params;
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  
  const [comparisonTab, setComparisonTab] = useState('overview');
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load buildings data
  useEffect(() => {
    setLoading(true);
    
    // Filter mock buildings based on buildingIds
    // In a real app, this would be an API call
    const filteredBuildings = mockBuildings.filter(building => 
      buildingIds.includes(building.id)
    );
    
    // Simulate API loading
    setTimeout(() => {
      setBuildings(filteredBuildings);
      setLoading(false);
    }, 800);
  }, [buildingIds]);
  
  const handleBuildingPress = (buildingId: string) => {
    navigation.navigate('BuildingDetails', { buildingId });
  };
  
  const handleBackToBuildingsList = () => {
    navigation.navigate('BuildingsByBusinessAccount', { 
      businessAccountId, 
      businessAccountName: 'Business Account' // Ideally this should be passed or retrieved
    });
  };
  
  const getBestPerformer = (metric: string): string | null => {
    if (buildings.length === 0) return null;
    
    let bestBuildingId = buildings[0].id;
    let bestValue = 0;
    
    switch(metric) {
      case 'occupancy':
        bestValue = buildings[0].occupancyRate;
        buildings.forEach(building => {
          if (building.occupancyRate > bestValue) {
            bestValue = building.occupancyRate;
            bestBuildingId = building.id;
          }
        });
        break;
      case 'revenue':
        bestValue = mockBuildingMetrics[buildings[0].id].revenue.monthly;
        buildings.forEach(building => {
          if (mockBuildingMetrics[building.id].revenue.monthly > bestValue) {
            bestValue = mockBuildingMetrics[building.id].revenue.monthly;
            bestBuildingId = building.id;
          }
        });
        break;
      case 'profit':
        bestValue = mockBuildingMetrics[buildings[0].id].netProfit;
        buildings.forEach(building => {
          if (mockBuildingMetrics[building.id].netProfit > bestValue) {
            bestValue = mockBuildingMetrics[building.id].netProfit;
            bestBuildingId = building.id;
          }
        });
        break;
      case 'efficiency':
        // Lower maintenance cost per unit is better
        bestValue = mockBuildingMetrics[buildings[0].id].maintenanceCostPerUnit;
        buildings.forEach(building => {
          if (mockBuildingMetrics[building.id].maintenanceCostPerUnit < bestValue) {
            bestValue = mockBuildingMetrics[building.id].maintenanceCostPerUnit;
            bestBuildingId = building.id;
          }
        });
        break;
    }
    
    return bestBuildingId;
  };
  
  const renderOverviewSection = () => (
    <View style={styles.overviewSection}>
      <Text style={styles.sectionTitle}>Building Comparison Overview</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.overviewTable}>
          <View style={styles.tableHeaderRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.tableHeader}>Property</Text>
            </View>
            {buildings.map(building => (
              <View key={`header-${building.id}`} style={styles.tableBuildingColumn}>
                <Text style={styles.tableHeader}>{building.name}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Type</Text>
            </View>
            {buildings.map(building => (
              <View key={`type-${building.id}`} style={styles.tableBuildingColumn}>
                <Text>{building.propertyType}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Year Built</Text>
            </View>
            {buildings.map(building => (
              <View key={`year-${building.id}`} style={styles.tableBuildingColumn}>
                <Text>{building.yearBuilt}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Units</Text>
            </View>
            {buildings.map(building => (
              <View key={`units-${building.id}`} style={styles.tableBuildingColumn}>
                <Text>{building.units}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Residents</Text>
            </View>
            {buildings.map(building => (
              <View key={`residents-${building.id}`} style={styles.tableBuildingColumn}>
                <Text>{building.residents}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Occupancy</Text>
            </View>
            {buildings.map(building => {
              const isBest = getBestPerformer('occupancy') === building.id;
              return (
                <View key={`occupancy-${building.id}`} style={styles.tableBuildingColumn}>
                  <Text style={isBest ? styles.bestValue : undefined}>{building.occupancyRate}%</Text>
                  {isBest && <Chip style={styles.bestChip} textStyle={styles.bestChipText}>Best</Chip>}
                </View>
              );
            })}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Issues</Text>
            </View>
            {buildings.map(building => (
              <View key={`issues-${building.id}`} style={styles.tableBuildingColumn}>
                <Text>{building.issues}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Maintenance</Text>
            </View>
            {buildings.map(building => (
              <View key={`maintenance-${building.id}`} style={styles.tableBuildingColumn}>
                <Text>{building.maintenanceCost}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buildingCardsContainer}>
        {buildings.map(building => (
          <TouchableOpacity 
            key={`card-${building.id}`} 
            onPress={() => handleBuildingPress(building.id)}
            style={{ flex: 1 }}
          >
            <Card style={styles.buildingCard}>
              <Card.Content>
                <View style={styles.buildingCardHeader}>
                  <Building2 size={18} color={theme.colors.primary} />
                  <Text style={styles.buildingCardTitle}>{building.name}</Text>
                </View>
                <Text style={styles.buildingCardSubtitle}>{building.units} Units • {building.residents} Residents</Text>
                <View style={styles.buildingCardMetrics}>
                  <View style={styles.miniMetricItem}>
                    <Text style={styles.miniMetricLabel}>Occupancy</Text>
                    <Text style={styles.miniMetricValue}>{building.occupancyRate}%</Text>
                  </View>
                  <View style={styles.miniMetricItem}>
                    <Text style={styles.miniMetricLabel}>Revenue</Text>
                    <Text style={styles.miniMetricValue}>€{mockBuildingMetrics[building.id].revenue.monthly.toLocaleString()}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  
  const renderPerformanceSection = () => (
    <View style={styles.performanceSection}>
      <Text style={styles.sectionTitle}>Financial Performance Comparison</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.performanceTable}>
          <View style={styles.tableHeaderRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.tableHeader}>Metric</Text>
            </View>
            {buildings.map(building => (
              <View key={`header-${building.id}`} style={styles.tableBuildingColumn}>
                <Text style={styles.tableHeader}>{building.name}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Monthly Revenue</Text>
            </View>
            {buildings.map(building => {
              const isBest = getBestPerformer('revenue') === building.id;
              return (
                <View key={`revenue-${building.id}`} style={styles.tableBuildingColumn}>
                  <Text style={isBest ? styles.bestValue : undefined}>
                    €{mockBuildingMetrics[building.id].revenue.monthly.toLocaleString()}
                  </Text>
                  {isBest && <Chip style={styles.bestChip} textStyle={styles.bestChipText}>Best</Chip>}
                </View>
              );
            })}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Revenue Growth</Text>
            </View>
            {buildings.map(building => (
              <View key={`revenue-growth-${building.id}`} style={styles.tableBuildingColumn}>
                <Text style={mockBuildingMetrics[building.id].revenue.growth > 0 ? styles.positiveValue : styles.negativeValue}>
                  {mockBuildingMetrics[building.id].revenue.growth > 0 ? '+' : ''}
                  {mockBuildingMetrics[building.id].revenue.growth}%
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Monthly Expenses</Text>
            </View>
            {buildings.map(building => (
              <View key={`expenses-${building.id}`} style={styles.tableBuildingColumn}>
                <Text>€{mockBuildingMetrics[building.id].expenses.monthly.toLocaleString()}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Expense Growth</Text>
            </View>
            {buildings.map(building => (
              <View key={`expense-growth-${building.id}`} style={styles.tableBuildingColumn}>
                <Text style={mockBuildingMetrics[building.id].expenses.growth < 0 ? styles.positiveValue : styles.negativeValue}>
                  {mockBuildingMetrics[building.id].expenses.growth > 0 ? '+' : ''}
                  {mockBuildingMetrics[building.id].expenses.growth}%
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Net Profit</Text>
            </View>
            {buildings.map(building => {
              const isBest = getBestPerformer('profit') === building.id;
              return (
                <View key={`profit-${building.id}`} style={styles.tableBuildingColumn}>
                  <Text style={isBest ? styles.bestValue : undefined}>
                    €{mockBuildingMetrics[building.id].netProfit.toLocaleString()}
                  </Text>
                  {isBest && <Chip style={styles.bestChip} textStyle={styles.bestChipText}>Best</Chip>}
                </View>
              );
            })}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Profit Margin</Text>
            </View>
            {buildings.map(building => {
              const margin = (mockBuildingMetrics[building.id].netProfit / mockBuildingMetrics[building.id].revenue.monthly) * 100;
              return (
                <View key={`margin-${building.id}`} style={styles.tableBuildingColumn}>
                  <Text>{margin.toFixed(1)}%</Text>
                </View>
              );
            })}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Avg. Rent per Unit</Text>
            </View>
            {buildings.map(building => (
              <View key={`avg-rent-${building.id}`} style={styles.tableBuildingColumn}>
                <Text>€{mockBuildingMetrics[building.id].avgRent}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tablePropertyColumn}>
              <Text style={styles.propertyLabel}>Maintenance per Unit</Text>
            </View>
            {buildings.map(building => {
              const isBest = getBestPerformer('efficiency') === building.id;
              return (
                <View key={`maintenance-per-unit-${building.id}`} style={styles.tableBuildingColumn}>
                  <Text style={isBest ? styles.bestValue : undefined}>
                    €{mockBuildingMetrics[building.id].maintenanceCostPerUnit.toFixed(1)}
                  </Text>
                  {isBest && <Chip style={styles.bestChip} textStyle={styles.bestChipText}>Best</Chip>}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
  
  return (
    <View style={[commonStyles.screenContainer, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Buildings Comparison" 
        showBack={true}
        action={{
          icon: <BarChart3 size={24} color={theme.colors.primary} />,
          onPress: () => {}
        }}
      />
      
      <View style={styles.buildingCount}>
        <Text style={styles.buildingCountText}>Comparing {buildings.length} Buildings</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <SegmentedButtons
          value={comparisonTab}
          onValueChange={setComparisonTab}
          buttons={[
            { value: 'overview', label: 'Overview' },
            { value: 'performance', label: 'Performance' },
          ]}
          style={styles.tabButtons}
          density="small"
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading building data for comparison...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {comparisonTab === 'overview' && renderOverviewSection()}
          {comparisonTab === 'performance' && renderPerformanceSection()}
          
          <Button 
            mode="outlined"
            icon={({ size, color }) => <ArrowLeft size={size-2} color={color} />}
            onPress={handleBackToBuildingsList}
            style={styles.backButton}
          >
            Back to Buildings
          </Button>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buildingCount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  buildingCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  tabContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabButtons: {
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  overviewSection: {
    marginBottom: 24,
  },
  performanceSection: {
    marginBottom: 24,
  },
  overviewTable: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    marginBottom: 20,
  },
  performanceTable: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tablePropertyColumn: {
    width: 140,
    padding: 12,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.05)',
  },
  tableBuildingColumn: {
    width: 150,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  propertyLabel: {
    fontSize: 14,
  },
  buildingCardsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  buildingCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  buildingCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  buildingCardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  buildingCardSubtitle: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  buildingCardMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  miniMetricItem: {
    flex: 1,
  },
  miniMetricLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  miniMetricValue: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  bestValue: {
    fontWeight: 'bold',
    color: STATUS_COLORS.success,
  },
  bestChip: {
    backgroundColor: `${STATUS_COLORS.success}20`,
    height: 20,
    marginTop: 4,
  },
  bestChipText: {
    color: STATUS_COLORS.success,
    fontSize: 10,
  },
  positiveValue: {
    color: STATUS_COLORS.success,
  },
  negativeValue: {
    color: STATUS_COLORS.error,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 32,
    borderRadius: 8,
  },
}); 