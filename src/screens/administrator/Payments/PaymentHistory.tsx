import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl, ScrollView } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar, SegmentedButtons, Chip, Card, Title, Paragraph, Divider, IconButton } from 'react-native-paper';
import { BarChart, Receipt, Calendar, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { FilterModal, FilterConfig } from '../../../components/FilterModal';
import { Payment, AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { fetchPayments } from '../../../store/slices/paymentsSlice';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { STATUS_COLORS } from '../../../utils/constants';

type Props = NativeStackScreenProps<AdministratorStackParamList, 'PaymentHistory'>;

// Filter and sort configurations
const filterConfig: FilterConfig = {
  filterGroups: [
    {
      id: 'period',
      name: 'Time Period',
      options: [
        { id: 'last30days', label: 'Last 30 Days', value: false },
        { id: 'last3months', label: 'Last 3 Months', value: false },
        { id: 'last6months', label: 'Last 6 Months', value: false },
        { id: 'lastyear', label: 'Last Year', value: false },
      ],
    },
    {
      id: 'paymentType',
      name: 'Payment Type',
      options: [
        { id: 'rent', label: 'Rent', value: false },
        { id: 'maintenance', label: 'Maintenance', value: false },
        { id: 'utilities', label: 'Utilities', value: false },
        { id: 'other', label: 'Other', value: false },
      ],
      multiSelect: true,
    },
    {
      id: 'building',
      name: 'Building',
      options: [
        { id: 'riviera', label: 'Riviera Towers', value: false },
        { id: 'parkview', label: 'Park View Residence', value: false },
        { id: 'central', label: 'Central Plaza', value: false },
      ],
      multiSelect: true,
    },
  ],
  sortOptions: [
    { id: 'date', label: 'Payment Date' },
    { id: 'amount', label: 'Amount' },
  ],
};

export const PaymentHistory = ({ navigation }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { payments, loading } = useAppSelector((state) => state.payments);
  
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState('list');
  
  // Advanced filter state
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeSort, setActiveSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'date',
    direction: 'desc'
  });
  
  // Summary data for reporting
  const [summaryData, setSummaryData] = useState({
    totalPayments: 0,
    totalAmount: 0,
    completedPayments: 0,
    completedAmount: 0,
    pendingPayments: 0,
    pendingAmount: 0,
    overduePayments: 0,
    overdueAmount: 0,
  });
  
  // Group data for charts
  const [typeBreakdown, setTypeBreakdown] = useState<{ type: string; amount: number; count: number }[]>([]);
  
  useEffect(() => {
    fetchPaymentsList();
  }, []);
  
  useEffect(() => {
    filterPayments();
  }, [payments, searchQuery, activeFilters, activeSort]);
  
  useEffect(() => {
    calculateSummaryData();
    calculateTypeBreakdown();
  }, [filteredPayments]);
  
  const fetchPaymentsList = async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchPayments());
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const filterPayments = () => {
    let result = [...payments];
    
    // Filter completed payments only for history
    result = result.filter(payment => payment.status === 'completed');
    
    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (payment) =>
          payment.residentName.toLowerCase().includes(lowercasedQuery) ||
          payment.buildingName.toLowerCase().includes(lowercasedQuery) ||
          payment.invoiceNumber.toLowerCase().includes(lowercasedQuery) ||
          payment.description.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    // Apply advanced filters
    if (Object.keys(activeFilters).length > 0) {
      Object.entries(activeFilters).forEach(([groupId, selectedOptions]) => {
        if (selectedOptions.length > 0) {
          if (groupId === 'period') {
            // Filter by time period
            const now = new Date();
            const option = selectedOptions[0]; // Only one period can be selected
            let cutoffDate = new Date();
            
            if (option === 'last30days') {
              cutoffDate.setDate(now.getDate() - 30);
            } else if (option === 'last3months') {
              cutoffDate.setMonth(now.getMonth() - 3);
            } else if (option === 'last6months') {
              cutoffDate.setMonth(now.getMonth() - 6);
            } else if (option === 'lastyear') {
              cutoffDate.setFullYear(now.getFullYear() - 1);
            }
            
            result = result.filter(payment => {
              const paymentDate = payment.paymentDate ? new Date(payment.paymentDate) : null;
              return paymentDate && paymentDate >= cutoffDate;
            });
          } else if (groupId === 'paymentType') {
            result = result.filter(payment => 
              selectedOptions.includes(payment.type)
            );
          } else if (groupId === 'building') {
            const buildingMap: Record<string, string> = {
              'riviera': 'Riviera Towers',
              'parkview': 'Park View Residence',
              'central': 'Central Plaza'
            };
            
            result = result.filter(payment => 
              selectedOptions.some(option => payment.buildingName === buildingMap[option])
            );
          }
        }
      });
    }
    
    // Apply sorting
    if (activeSort.field) {
      result.sort((a, b) => {
        const direction = activeSort.direction === 'asc' ? 1 : -1;
        
        if (activeSort.field === 'date') {
          return (new Date(a.paymentDate || a.createdAt).getTime() - new Date(b.paymentDate || b.createdAt).getTime()) * direction;
        } else if (activeSort.field === 'amount') {
          return (a.amount - b.amount) * direction;
        }
        
        return 0;
      });
    }
    
    setFilteredPayments(result);
  };
  
  const calculateSummaryData = () => {
    const summary = {
      totalPayments: 0,
      totalAmount: 0,
      completedPayments: 0,
      completedAmount: 0,
      pendingPayments: 0,
      pendingAmount: 0,
      overduePayments: 0,
      overdueAmount: 0,
    };
    
    // Calculate stats from all payments, not just filtered ones
    payments.forEach(payment => {
      summary.totalPayments++;
      summary.totalAmount += payment.amount;
      
      if (payment.status === 'completed') {
        summary.completedPayments++;
        summary.completedAmount += payment.amount;
      } else if (payment.status === 'pending') {
        summary.pendingPayments++;
        summary.pendingAmount += payment.amount;
      } else if (payment.status === 'overdue') {
        summary.overduePayments++;
        summary.overdueAmount += payment.amount;
      }
    });
    
    setSummaryData(summary);
  };
  
  const calculateTypeBreakdown = () => {
    // Group payments by type
    const typeGroups: Record<string, { amount: number; count: number }> = {
      rent: { amount: 0, count: 0 },
      maintenance: { amount: 0, count: 0 },
      utilities: { amount: 0, count: 0 },
      other: { amount: 0, count: 0 },
    };
    
    filteredPayments.forEach(payment => {
      if (typeGroups[payment.type]) {
        typeGroups[payment.type].amount += payment.amount;
        typeGroups[payment.type].count += 1;
      }
    });
    
    // Convert to array for display
    const breakdown = Object.entries(typeGroups).map(([type, data]) => ({
      type,
      amount: data.amount,
      count: data.count,
    }));
    
    setTypeBreakdown(breakdown);
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPaymentsList();
  };
  
  const handlePaymentPress = (paymentId: string) => {
    navigation.navigate('PaymentDetails', { paymentId });
  };
  
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
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
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Receipt size={50} color={isDarkMode ? '#555' : '#ccc'} />
      <Text 
        style={[
          styles.emptyText,
          { color: isDarkMode ? '#aaa' : '#888' }
        ]}
      >
        No payment history found
      </Text>
      <Text 
        style={[
          styles.emptySubText,
          { color: isDarkMode ? '#888' : '#aaa' }
        ]}
      >
        Try adjusting your filters or complete some payments
      </Text>
    </View>
  );
  
  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <TouchableOpacity 
      style={[
        styles.paymentItem,
        { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
      ]}
      onPress={() => handlePaymentPress(item.id)}
    >
      <View style={styles.paymentHeader}>
        <View style={styles.paymentInfo}>
          <Text style={[styles.paymentName, { color: isDarkMode ? '#fff' : '#333' }]}>
            {item.residentName}
          </Text>
          <Text style={[styles.paymentSubtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>
            {item.buildingName} • {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amountText, { color: isDarkMode ? '#fff' : '#333' }]}>
            {formatCurrency(item.amount)}
          </Text>
        </View>
      </View>
      <View style={styles.paymentFooter}>
        <View style={styles.dateContainer}>
          <Calendar size={14} color={isDarkMode ? '#aaa' : '#666'} />
          <Text style={[styles.dateText, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Paid on {formatDate(item.paymentDate!)}
          </Text>
        </View>
        <Chip 
          mode="flat" 
          style={[styles.methodChip, { backgroundColor: theme.colors.primary + '20' }]}
          textStyle={{ color: theme.colors.primary, fontSize: 12 }}
        >
          {item.paymentMethod || 'Not specified'}
        </Chip>
      </View>
    </TouchableOpacity>
  );
  
  const renderSummaryView = () => (
    <ScrollView 
      style={styles.summaryContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* Summary Cards */}
      <View style={styles.summaryCards}>
        <Card 
          style={[styles.summaryCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}
          mode="elevated"
        >
          <Card.Content>
            <Title style={[styles.cardTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
              Total Payments
            </Title>
            <View style={styles.cardContent}>
              <Text style={[styles.cardValue, { color: theme.colors.primary }]}>
                {formatCurrency(summaryData.completedAmount)}
              </Text>
              <View style={styles.cardSubValue}>
                <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                  {summaryData.completedPayments} transactions
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card 
          style={[styles.summaryCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}
          mode="elevated"
        >
          <Card.Content>
            <Title style={[styles.cardTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
              Pending
            </Title>
            <View style={styles.cardContent}>
              <Text style={[styles.cardValue, { color: STATUS_COLORS.warning }]}>
                {formatCurrency(summaryData.pendingAmount)}
              </Text>
              <View style={styles.cardSubValue}>
                <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                  {summaryData.pendingPayments} transactions
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card 
          style={[styles.summaryCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}
          mode="elevated"
        >
          <Card.Content>
            <Title style={[styles.cardTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
              Overdue
            </Title>
            <View style={styles.cardContent}>
              <Text style={[styles.cardValue, { color: STATUS_COLORS.error }]}>
                {formatCurrency(summaryData.overdueAmount)}
              </Text>
              <View style={styles.cardSubValue}>
                <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                  {summaryData.overduePayments} transactions
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
      
      {/* Payment Type Breakdown */}
      <Card 
        style={[styles.breakdownCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}
        mode="elevated"
      >
        <Card.Title title="Payment Type Breakdown" />
        <Card.Content>
          {typeBreakdown.map((type, index) => (
            <View key={type.type}>
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownInfo}>
                  <Text style={{ color: isDarkMode ? '#fff' : '#333', fontWeight: '500' }}>
                    {type.type.charAt(0).toUpperCase() + type.type.slice(1)}
                  </Text>
                  <Text style={{ color: isDarkMode ? '#aaa' : '#666', fontSize: 12 }}>
                    {type.count} payments
                  </Text>
                </View>
                <View style={styles.breakdownAmount}>
                  <Text style={{ color: isDarkMode ? '#fff' : '#333', fontWeight: '500' }}>
                    {formatCurrency(type.amount)}
                  </Text>
                  <Text style={{ color: isDarkMode ? '#aaa' : '#666', fontSize: 12 }}>
                    {filteredPayments.length > 0 
                      ? Math.round((type.amount / filteredPayments.reduce((sum, p) => sum + p.amount, 0)) * 100) 
                      : 0}%
                  </Text>
                </View>
              </View>
              {index < typeBreakdown.length - 1 && <Divider style={styles.breakdownDivider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Some visual placeholder for charts */}
      <Card 
        style={[styles.breakdownCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}
        mode="elevated"
      >
        <Card.Title title="Monthly Trend" />
        <Card.Content style={styles.chartPlaceholder}>
          <BarChart size={60} color={theme.colors.primary} opacity={0.6} />
          <Text style={{ color: isDarkMode ? '#aaa' : '#666', marginTop: 8 }}>
            Chart visualization will appear here
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
  
  if (loading && !refreshing) {
    return (
      <>
        <Header 
          title="Payment History" 
          showBack={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading payment history...
          </Text>
        </View>
      </>
    );
  }
  
  return (
    <>
      <Header 
        title="Payment History" 
        showBack={true}
      />

      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <View style={styles.headerActionsContainer}>
          <Searchbar
            placeholder="Search payments..."
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={theme.colors.primary}
          />
          <IconButton
            icon="filter"
            onPress={handleOpenFilterModal}
            style={styles.filterButton}
          />
        </View>
        
        <SegmentedButtons
          value={selectedView}
          onValueChange={setSelectedView}
          buttons={[
            { value: 'list', label: 'List', icon: 'view-list' },
            { value: 'summary', label: 'Summary', icon: 'chart-bar' },
          ]}
          style={styles.segmentedButtons}
        />
        
        {selectedView === 'list' ? (
          <FlatList
            data={filteredPayments}
            renderItem={renderPaymentItem}
            keyExtractor={item => item.id}
            contentContainerStyle={
              filteredPayments.length === 0 ? 
                { flex: 1, justifyContent: 'center' } : 
                { paddingBottom: 20 }
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[theme.colors.primary]}
              />
            }
            ListEmptyComponent={renderEmptyList}
          />
        ) : (
          renderSummaryView()
        )}
      </View>
      
      <FilterModal
        isVisible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        config={filterConfig}
        onApplyFilters={handleApplyFilters}
        activeFilters={activeFilters}
        activeSort={activeSort}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flex: 1,
    borderRadius: 8,
    margin: 0,
  },
  segmentedButtons: {
    marginHorizontal: 16,
    marginBottom: 16,
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
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: '80%',
  },
  paymentItem: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  paymentSubtitle: {
    fontSize: 14,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 4,
    fontSize: 12,
  },
  methodChip: {
    height: 24,
  },
  summaryContainer: {
    flex: 1,
    padding: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    width: '48%',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  cardContent: {
    alignItems: 'flex-start',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownCard: {
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  breakdownInfo: {
    flex: 1,
  },
  breakdownAmount: {
    alignItems: 'flex-end',
  },
  breakdownDivider: {
    height: 1,
  },
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  headerActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
  },
  filterButton: {
    marginLeft: 8,
  },
});