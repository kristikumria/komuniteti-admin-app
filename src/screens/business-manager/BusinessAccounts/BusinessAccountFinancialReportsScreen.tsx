import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, Divider, Button, SegmentedButtons, DataTable, ActivityIndicator } from 'react-native-paper';
import { BarChart3, TrendingUp, DollarSign, Calendar, Download, FileText, Filter } from 'lucide-react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { BusinessManagerStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { STATUS_COLORS } from '../../../utils/constants';

// Define route props type
type BusinessAccountFinancialReportsRouteProps = RouteProp<
  BusinessManagerStackParamList,
  'BusinessAccountFinancialReports'
>;

// Define navigation props type
type BusinessAccountsNavigationProp = NativeStackNavigationProp<
  BusinessManagerStackParamList
>;

// Financial data types
interface FinancialMetric {
  id: string;
  name: string;
  current: number;
  previous: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface FinancialReportData {
  revenue: FinancialMetric[];
  expenses: FinancialMetric[];
  overview: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    occupancyRate: number;
    revenueGrowth: number;
    expenseReduction: number;
  };
  reports: {
    id: string;
    name: string;
    type: string;
    date: string;
    size: string;
  }[];
}

// Mock financial data
const mockFinancialData: FinancialReportData = {
  revenue: [
    {
      id: 'rev-1',
      name: 'Rental Income',
      current: 95000,
      previous: 92000,
      change: 3.26,
      trend: 'up'
    },
    {
      id: 'rev-2',
      name: 'Parking Fees',
      current: 15000,
      previous: 14000,
      change: 7.14,
      trend: 'up'
    },
    {
      id: 'rev-3',
      name: 'Amenity Usage',
      current: 8000,
      previous: 7500,
      change: 6.67,
      trend: 'up'
    },
    {
      id: 'rev-4',
      name: 'Late Payment Fees',
      current: 1200,
      previous: 1500,
      change: -20,
      trend: 'down'
    }
  ],
  expenses: [
    {
      id: 'exp-1',
      name: 'Maintenance',
      current: 22000,
      previous: 24000,
      change: -8.33,
      trend: 'down'
    },
    {
      id: 'exp-2',
      name: 'Utilities',
      current: 18500,
      previous: 17800,
      change: 3.93,
      trend: 'up'
    },
    {
      id: 'exp-3',
      name: 'Staff Salaries',
      current: 35000,
      previous: 35000,
      change: 0,
      trend: 'stable'
    },
    {
      id: 'exp-4',
      name: 'Insurance',
      current: 12000,
      previous: 11500,
      change: 4.35,
      trend: 'up'
    }
  ],
  overview: {
    totalRevenue: 119200,
    totalExpenses: 87500,
    netIncome: 31700,
    occupancyRate: 94,
    revenueGrowth: 4.2,
    expenseReduction: -1.8
  },
  reports: [
    {
      id: 'report-1',
      name: 'Q1 2023 Financial Report',
      type: 'Quarterly',
      date: '2023-04-10',
      size: '1.2 MB'
    },
    {
      id: 'report-2',
      name: 'March 2023 Financial Statement',
      type: 'Monthly',
      date: '2023-04-05',
      size: '850 KB'
    },
    {
      id: 'report-3',
      name: 'February 2023 Financial Statement',
      type: 'Monthly',
      date: '2023-03-05',
      size: '820 KB'
    },
    {
      id: 'report-4',
      name: 'January 2023 Financial Statement',
      type: 'Monthly',
      date: '2023-02-05',
      size: '805 KB'
    },
    {
      id: 'report-5',
      name: '2022 Annual Financial Report',
      type: 'Annual',
      date: '2023-01-20',
      size: '4.5 MB'
    }
  ]
};

export const BusinessAccountFinancialReportsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<BusinessAccountsNavigationProp>();
  const route = useRoute<BusinessAccountFinancialReportsRouteProps>();
  const { businessAccountId, businessAccountName } = route.params;
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  
  const [reportPeriod, setReportPeriod] = useState('quarterly');
  const [reportTab, setReportTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  const handleDownloadReport = (reportId: string) => {
    // In a real app, this would download the report
    console.log('Download report:', reportId);
  };
  
  const renderTrendIcon = (trend: 'up' | 'down' | 'stable', value: number) => {
    if (trend === 'stable') {
      return <View style={styles.stableTrend} />;
    }
    
    const isPositive = trend === 'up';
    const color = isPositive ? STATUS_COLORS.success : STATUS_COLORS.error;
    
    return (
      <View style={[styles.trendContainer, { backgroundColor: `${color}15` }]}>
        <TrendingUp 
          size={14} 
          color={color} 
          style={{ transform: [{ rotate: isPositive ? '0deg' : '180deg' }] }} 
        />
        <Text style={[styles.trendPercentage, { color }]}>
          {value > 0 ? '+' : ''}{value}%
        </Text>
      </View>
    );
  };
  
  const renderOverviewSection = () => (
    <View style={styles.overviewSection}>
      <Text style={styles.sectionTitle}>Current Quarter Overview</Text>
      
      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <Card.Content>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
                <DollarSign size={18} color={theme.colors.primary} />
              </View>
              <Text style={styles.metricTitle}>Total Revenue</Text>
            </View>
            <Text style={styles.metricValue}>€{mockFinancialData.overview.totalRevenue.toLocaleString()}</Text>
            {renderTrendIcon('up', mockFinancialData.overview.revenueGrowth)}
          </Card.Content>
        </Card>
        
        <Card style={styles.metricCard}>
          <Card.Content>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: `${STATUS_COLORS.warning}15` }]}>
                <DollarSign size={18} color={STATUS_COLORS.warning} />
              </View>
              <Text style={styles.metricTitle}>Total Expenses</Text>
            </View>
            <Text style={styles.metricValue}>€{mockFinancialData.overview.totalExpenses.toLocaleString()}</Text>
            {renderTrendIcon('down', mockFinancialData.overview.expenseReduction)}
          </Card.Content>
        </Card>
      </View>
      
      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <Card.Content>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: `${STATUS_COLORS.success}15` }]}>
                <DollarSign size={18} color={STATUS_COLORS.success} />
              </View>
              <Text style={styles.metricTitle}>Net Income</Text>
            </View>
            <Text style={styles.metricValue}>€{mockFinancialData.overview.netIncome.toLocaleString()}</Text>
            <Text style={styles.metricSubtitle}>
              {((mockFinancialData.overview.netIncome / mockFinancialData.overview.totalRevenue) * 100).toFixed(1)}% margin
            </Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.metricCard}>
          <Card.Content>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: `${theme.colors.secondary}15` }]}>
                <BarChart3 size={18} color={theme.colors.secondary} />
              </View>
              <Text style={styles.metricTitle}>Occupancy Rate</Text>
            </View>
            <Text style={styles.metricValue}>{mockFinancialData.overview.occupancyRate}%</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${mockFinancialData.overview.occupancyRate}%`,
                    backgroundColor: theme.colors.secondary
                  }
                ]} 
              />
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
  
  const renderRevenueSection = () => (
    <View style={styles.tableSection}>
      <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
      
      <Card style={styles.tableCard}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Source</DataTable.Title>
            <DataTable.Title numeric>Current</DataTable.Title>
            <DataTable.Title numeric>Previous</DataTable.Title>
            <DataTable.Title numeric>Change</DataTable.Title>
          </DataTable.Header>
          
          {mockFinancialData.revenue.map((item) => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell>{item.name}</DataTable.Cell>
              <DataTable.Cell numeric>€{item.current.toLocaleString()}</DataTable.Cell>
              <DataTable.Cell numeric>€{item.previous.toLocaleString()}</DataTable.Cell>
              <DataTable.Cell numeric>
                <View style={styles.tableTrendCell}>
                  {renderTrendIcon(item.trend, item.change)}
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
          
          <Divider style={styles.tableDivider} />
          
          <DataTable.Row style={styles.totalRow}>
            <DataTable.Cell>
              <Text style={styles.totalText}>Total Revenue</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text style={styles.totalText}>
                €{mockFinancialData.overview.totalRevenue.toLocaleString()}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text style={styles.totalText}>
                €{(mockFinancialData.overview.totalRevenue / (1 + mockFinancialData.overview.revenueGrowth / 100)).toFixed(0)}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <View style={styles.tableTrendCell}>
                {renderTrendIcon('up', mockFinancialData.overview.revenueGrowth)}
              </View>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </Card>
    </View>
  );
  
  const renderExpensesSection = () => (
    <View style={styles.tableSection}>
      <Text style={styles.sectionTitle}>Expenses Breakdown</Text>
      
      <Card style={styles.tableCard}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Category</DataTable.Title>
            <DataTable.Title numeric>Current</DataTable.Title>
            <DataTable.Title numeric>Previous</DataTable.Title>
            <DataTable.Title numeric>Change</DataTable.Title>
          </DataTable.Header>
          
          {mockFinancialData.expenses.map((item) => (
            <DataTable.Row key={item.id}>
              <DataTable.Cell>{item.name}</DataTable.Cell>
              <DataTable.Cell numeric>€{item.current.toLocaleString()}</DataTable.Cell>
              <DataTable.Cell numeric>€{item.previous.toLocaleString()}</DataTable.Cell>
              <DataTable.Cell numeric>
                <View style={styles.tableTrendCell}>
                  {renderTrendIcon(item.trend, item.change)}
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
          
          <Divider style={styles.tableDivider} />
          
          <DataTable.Row style={styles.totalRow}>
            <DataTable.Cell>
              <Text style={styles.totalText}>Total Expenses</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text style={styles.totalText}>
                €{mockFinancialData.overview.totalExpenses.toLocaleString()}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text style={styles.totalText}>
                €{(mockFinancialData.overview.totalExpenses / (1 + mockFinancialData.overview.expenseReduction / 100)).toFixed(0)}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <View style={styles.tableTrendCell}>
                {renderTrendIcon('down', mockFinancialData.overview.expenseReduction)}
              </View>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </Card>
    </View>
  );
  
  const renderReportsSection = () => (
    <View style={styles.reportsSection}>
      <Text style={styles.sectionTitle}>Available Reports</Text>
      
      {mockFinancialData.reports.map((report) => (
        <Card key={report.id} style={styles.reportCard}>
          <Card.Content>
            <View style={styles.reportHeader}>
              <View style={styles.reportIcon}>
                <FileText size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.reportInfo}>
                <Text style={styles.reportName}>{report.name}</Text>
                <Text style={styles.reportMeta}>
                  {report.type} • {report.date} • {report.size}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => handleDownloadReport(report.id)}
              >
                <Download size={18} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
  
  return (
    <View style={[commonStyles.screenContainer, { backgroundColor: theme.colors.background }]}>
      <Header 
        title={`${businessAccountName} Financials`}
        showBack={true}
        action={{
          icon: <Filter size={24} color={theme.colors.primary} />,
          onPress: () => {}
        }}
      />
      
      <View style={styles.periodFilterContainer}>
        <Text style={styles.periodFilterLabel}>Period:</Text>
        <SegmentedButtons
          value={reportPeriod}
          onValueChange={setReportPeriod}
          buttons={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' },
            { value: 'yearly', label: 'Yearly' },
          ]}
          style={styles.periodFilter}
          density="small"
        />
      </View>
      
      <View style={styles.tabContainer}>
        <SegmentedButtons
          value={reportTab}
          onValueChange={setReportTab}
          buttons={[
            { value: 'overview', label: 'Overview' },
            { value: 'revenue', label: 'Revenue' },
            { value: 'expenses', label: 'Expenses' },
            { value: 'reports', label: 'Reports' },
          ]}
          style={styles.tabButtons}
          density="small"
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading financial data...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {reportTab === 'overview' && renderOverviewSection()}
          {reportTab === 'revenue' && renderRevenueSection()}
          {reportTab === 'expenses' && renderExpensesSection()}
          {reportTab === 'reports' && renderReportsSection()}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  periodFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  periodFilterLabel: {
    marginRight: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  periodFilter: {
    flex: 1,
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
    marginBottom: 12,
  },
  overviewSection: {
    marginBottom: 24,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  metricTitle: {
    fontSize: 13,
    opacity: 0.8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricSubtitle: {
    fontSize: 12,
    opacity: 0.6,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  trendPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  stableTrend: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 1,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  tableSection: {
    marginBottom: 24,
  },
  tableCard: {
    borderRadius: 8,
  },
  tableTrendCell: {
    alignItems: 'flex-end',
  },
  tableDivider: {
    marginVertical: 4,
  },
  totalRow: {
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  totalText: {
    fontWeight: 'bold',
  },
  reportsSection: {
    marginBottom: 24,
  },
  reportCard: {
    marginBottom: 10,
    borderRadius: 8,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reportMeta: {
    fontSize: 12,
    opacity: 0.6,
  },
  downloadButton: {
    padding: 8,
  },
}); 