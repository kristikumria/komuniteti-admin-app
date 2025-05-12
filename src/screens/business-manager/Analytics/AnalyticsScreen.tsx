import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, SegmentedButtons, Button, Chip, Divider, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessManagerStackParamList } from '../../../navigation/types';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { format, subDays, subMonths } from 'date-fns';
import { Header } from '../../../components/Header';
import { useAppSelector } from '../../../store/hooks';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  Building, 
  ShieldCheck, 
  DollarSign, 
  CalendarDays,
  Download
} from 'lucide-react-native';

type Props = NativeStackScreenProps<BusinessManagerStackParamList, 'Analytics'>;

// Mock data for analytics
const MOCK_REVENUE_DATA = {
  monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [30500, 28900, 33400, 32200, 34100, 36800],
        color: (opacity = 1) => `rgba(71, 136, 255, ${opacity})`,
        strokeWidth: 2
      }
    ]
  },
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [4500, 5200, 4800, 5900, 6100, 5400, 4900],
        color: (opacity = 1) => `rgba(71, 136, 255, ${opacity})`,
        strokeWidth: 2
      }
    ]
  }
};

const MOCK_OCCUPANCY_DATA = {
  monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [87, 86, 88, 91, 92, 94],
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        strokeWidth: 2
      }
    ]
  },
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [92, 92, 93, 93, 94, 94, 94],
        color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
        strokeWidth: 2
      }
    ]
  }
};

const MOCK_ISSUES_DATA = {
  monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [14, 12, 18, 10, 8, 6]
  },
  daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [3, 2, 0, 1, 0, 0, 0]
  }
};

const MOCK_PIE_DATA = {
  maintenance: [
    {
      name: 'Plumbing',
      population: 32,
      color: '#4788FF',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Electrical',
      population: 28,
      color: '#FF9C27',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'HVAC',
      population: 24,
      color: '#4CAF50',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Security',
      population: 10,
      color: '#9C27B0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Other',
      population: 6,
      color: '#607D8B',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  ],
  revenue: [
    {
      name: 'Rent',
      population: 68,
      color: '#4788FF',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Maintenance',
      population: 18,
      color: '#FF9C27',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Utilities',
      population: 10,
      color: '#4CAF50',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    },
    {
      name: 'Other',
      population: 4,
      color: '#607D8B',
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }
  ]
};

export const AnalyticsScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const screenWidth = Dimensions.get('window').width;
  const [timeRange, setTimeRange] = useState('monthly');
  const [chartType, setChartType] = useState('revenue');
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const chartConfig = {
    backgroundGradientFrom: isDarkMode ? '#222' : '#fff',
    backgroundGradientTo: isDarkMode ? '#222' : '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const getSummaryMetrics = () => {
    const metrics = [
      {
        title: 'Total Revenue',
        value: '$198,900',
        change: '+5.2%',
        changeType: 'positive',
        icon: <DollarSign size={24} color={theme.colors.primary} />
      },
      {
        title: 'Occupancy Rate',
        value: '94%',
        change: '+2.8%',
        changeType: 'positive',
        icon: <Users size={24} color="#4CAF50" />
      },
      {
        title: 'Buildings',
        value: '12',
        change: '+1',
        changeType: 'positive',
        icon: <Building size={24} color="#FF9C27" />
      },
      {
        title: 'Open Issues',
        value: '6',
        change: '-25%',
        changeType: 'positive',
        icon: <ShieldCheck size={24} color="#9C27B0" />
      }
    ];
    
    return metrics;
  };

  const metrics = getSummaryMetrics();
  
  const renderMetricCards = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsScrollView}>
        {metrics.map((metric, index) => (
          <Card 
            key={index} 
            style={[
              styles.metricCard, 
              { backgroundColor: isDarkMode ? '#1E1E1E' : 'white' }
            ]}
          >
            <Card.Content>
              <View style={styles.metricHeader}>
                <Text style={[styles.metricTitle, { color: isDarkMode ? '#ccc' : '#666' }]}>
                  {metric.title}
                </Text>
                {metric.icon}
              </View>
              <Text style={[styles.metricValue, { color: isDarkMode ? 'white' : '#333' }]}>
                {metric.value}
              </Text>
              <View style={styles.metricChange}>
                {metric.changeType === 'positive' ? (
                  <ArrowUpRight size={14} color="#4CAF50" />
                ) : (
                  <ArrowDownRight size={14} color="#E53935" />
                )}
                <Text 
                  style={{ 
                    color: metric.changeType === 'positive' ? '#4CAF50' : '#E53935',
                    marginLeft: 4,
                    fontWeight: '500'
                  }}
                >
                  {metric.change}
                </Text>
                <Text style={{ color: isDarkMode ? '#999' : '#999', marginLeft: 4, fontSize: 12 }}>
                  vs last month
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    );
  };

  const renderTimeRangeSelector = () => {
    return (
      <View style={styles.timeRangeContainer}>
        <SegmentedButtons
          value={timeRange}
          onValueChange={setTimeRange}
          buttons={[
            {
              value: 'daily',
              label: 'Daily',
              style: { 
                backgroundColor: timeRange === 'daily' 
                  ? theme.colors.primary 
                  : (isDarkMode ? '#333' : '#f0f0f0') 
              }
            },
            {
              value: 'monthly',
              label: 'Monthly',
              style: { 
                backgroundColor: timeRange === 'monthly' 
                  ? theme.colors.primary 
                  : (isDarkMode ? '#333' : '#f0f0f0')
              }
            }
          ]}
          style={styles.segmentedButtons}
        />
        <View style={styles.dateRange}>
          <CalendarDays size={16} color={isDarkMode ? '#ccc' : '#666'} style={styles.calendarIcon} />
          <Text style={{ color: isDarkMode ? '#ccc' : '#666' }}>
            {timeRange === 'daily' 
              ? `${format(subDays(new Date(), 7), 'MMM d')} - ${format(new Date(), 'MMM d, yyyy')}`
              : `${format(subMonths(new Date(), 6), 'MMM yyyy')} - ${format(new Date(), 'MMM yyyy')}`
            }
          </Text>
        </View>
      </View>
    );
  };

  const renderChartTypeSelector = () => {
    return (
      <View style={styles.chartTypeContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip 
            selected={chartType === 'revenue'} 
            onPress={() => setChartType('revenue')}
            style={[
              styles.chartTypeChip,
              { 
                backgroundColor: chartType === 'revenue' 
                  ? theme.colors.primary 
                  : (isDarkMode ? '#333' : '#f0f0f0') 
              }
            ]}
            textStyle={{ 
              color: chartType === 'revenue' 
                ? 'white' 
                : (isDarkMode ? '#ccc' : '#666') 
            }}
          >
            Revenue
          </Chip>
          <Chip 
            selected={chartType === 'occupancy'} 
            onPress={() => setChartType('occupancy')}
            style={[
              styles.chartTypeChip,
              { 
                backgroundColor: chartType === 'occupancy' 
                  ? theme.colors.primary 
                  : (isDarkMode ? '#333' : '#f0f0f0') 
              }
            ]}
            textStyle={{ 
              color: chartType === 'occupancy' 
                ? 'white' 
                : (isDarkMode ? '#ccc' : '#666') 
            }}
          >
            Occupancy Rate
          </Chip>
          <Chip 
            selected={chartType === 'issues'} 
            onPress={() => setChartType('issues')}
            style={[
              styles.chartTypeChip,
              { 
                backgroundColor: chartType === 'issues' 
                  ? theme.colors.primary 
                  : (isDarkMode ? '#333' : '#f0f0f0') 
              }
            ]}
            textStyle={{ 
              color: chartType === 'issues' 
                ? 'white' 
                : (isDarkMode ? '#ccc' : '#666') 
            }}
          >
            Issues
          </Chip>
          <Chip 
            selected={chartType === 'breakdown'} 
            onPress={() => setChartType('breakdown')}
            style={[
              styles.chartTypeChip,
              { 
                backgroundColor: chartType === 'breakdown' 
                  ? theme.colors.primary 
                  : (isDarkMode ? '#333' : '#f0f0f0') 
              }
            ]}
            textStyle={{ 
              color: chartType === 'breakdown' 
                ? 'white' 
                : (isDarkMode ? '#ccc' : '#666') 
            }}
          >
            Breakdown
          </Chip>
        </ScrollView>
      </View>
    );
  };

  const renderMainChart = () => {
    if (chartType === 'revenue') {
      return (
        <LineChart
          data={timeRange === 'monthly' ? MOCK_REVENUE_DATA.monthly : MOCK_REVENUE_DATA.daily}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(71, 136, 255, ${opacity})`,
          }}
          bezier
          style={styles.chart}
          yAxisLabel="$"
          yAxisSuffix=""
        />
      );
    } else if (chartType === 'occupancy') {
      return (
        <LineChart
          data={timeRange === 'monthly' ? MOCK_OCCUPANCY_DATA.monthly : MOCK_OCCUPANCY_DATA.daily}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
          }}
          bezier
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix="%"
        />
      );
    } else if (chartType === 'issues') {
      const issuesData = timeRange === 'monthly' ? MOCK_ISSUES_DATA.monthly : MOCK_ISSUES_DATA.daily;
      return (
        <BarChart
          data={{
            labels: issuesData.labels,
            datasets: [
              {
                data: issuesData.data
              }
            ]
          }}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
            barPercentage: 0.5,
          }}
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix=""
        />
      );
    } else if (chartType === 'breakdown') {
      return (
        <PieChart
          data={MOCK_PIE_DATA.maintenance}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      );
    }
    
    return null;
  };

  const renderBuildingFilter = () => {
    const buildings = ['All Buildings', 'Building A', 'Building B', 'Building C'];
    
    return (
      <View style={styles.buildingFilterContainer}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : '#333' }]}>Buildings</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.buildingChips}>
          {buildings.map((building, index) => (
            <Chip
              key={index}
              selected={selectedBuilding === building || (building === 'All Buildings' && !selectedBuilding)}
              onPress={() => setSelectedBuilding(building === 'All Buildings' ? null : building)}
              style={[
                styles.buildingChip,
                { 
                  backgroundColor: (selectedBuilding === building || (building === 'All Buildings' && !selectedBuilding))
                    ? theme.colors.primary 
                    : (isDarkMode ? '#333' : '#f0f0f0') 
                }
              ]}
              textStyle={{ 
                color: (selectedBuilding === building || (building === 'All Buildings' && !selectedBuilding))
                  ? 'white' 
                  : (isDarkMode ? '#ccc' : '#666') 
              }}
            >
              {building}
            </Chip>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderExportButton = () => {
    return (
      <Button 
        mode="contained" 
        icon={({size, color}) => <Download size={size} color={color} />}
        style={styles.exportButton}
        onPress={() => {}}
      >
        Export Report
      </Button>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <Header 
          title="Analytics" 
          showBack={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#ccc' : '#666' }}>Loading analytics data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <Header 
        title="Analytics" 
        showBack={true}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : '#333' }]}>
            Summary Metrics
          </Text>
          
          {renderMetricCards()}
          <Divider style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : '#eee' }]} />
          
          <View style={styles.chartContainer}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : '#333' }]}>
              Performance Charts
            </Text>
            
            {renderTimeRangeSelector()}
            {renderChartTypeSelector()}
            {renderBuildingFilter()}
            
            <Card 
              style={[
                styles.chartCard, 
                { backgroundColor: isDarkMode ? '#1E1E1E' : 'white' }
              ]}
            >
              <Card.Content>
                <Text style={[styles.chartTitle, { color: isDarkMode ? 'white' : '#333' }]}>
                  {chartType === 'revenue' && 'Revenue Trends'}
                  {chartType === 'occupancy' && 'Occupancy Rate Trends'}
                  {chartType === 'issues' && 'Maintenance Issues'}
                  {chartType === 'breakdown' && 'Revenue Source Breakdown'}
                </Text>
                {renderMainChart()}
              </Card.Content>
            </Card>
          </View>
          
          {renderExportButton()}
        </View>
      </ScrollView>
    </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metricsScrollView: {
    marginBottom: 16,
  },
  metricCard: {
    width: 160,
    marginRight: 12,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 16,
  },
  chartContainer: {
    marginBottom: 16,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  segmentedButtons: {
    flex: 1,
    maxWidth: 180,
  },
  dateRange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: 4,
  },
  chartTypeContainer: {
    marginBottom: 16,
  },
  chartTypeChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  buildingFilterContainer: {
    marginBottom: 16,
  },
  buildingChips: {
    marginBottom: 8,
  },
  buildingChip: {
    marginRight: 8,
  },
  chartCard: {
    elevation: 2,
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
  exportButton: {
    marginTop: 16,
  },
});