import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar, FAB, SegmentedButtons, Chip, Button } from 'react-native-paper';
import { Receipt, Plus, Filter, CreditCard, AlertCircle, Check, History } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';

import { Header } from '../../../components/Header';
import { ListItem } from '../../../components/ListItem';
import { SideMenu } from '../../../components/SideMenu';
import { FilterModal, FilterConfig } from '../../../components/FilterModal';
import { Payment, AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { fetchPayments } from '../../../store/slices/paymentsSlice';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { STATUS_COLORS } from '../../../utils/constants';

type Props = NativeStackScreenProps<AdministratorStackParamList, 'Payments'>;

// Filter and sort configurations
const filterConfig: FilterConfig = {
  filterGroups: [
    {
      id: 'status',
      name: 'Payment Status',
      options: [
        { id: 'pending', label: 'Pending', value: false },
        { id: 'completed', label: 'Completed', value: false },
        { id: 'overdue', label: 'Overdue', value: false },
        { id: 'cancelled', label: 'Cancelled', value: false },
      ],
    },
    {
      id: 'type',
      name: 'Payment Type',
      options: [
        { id: 'rent', label: 'Rent', value: false },
        { id: 'maintenance', label: 'Maintenance', value: false },
        { id: 'utilities', label: 'Utilities', value: false },
        { id: 'other', label: 'Other', value: false },
      ],
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
    { id: 'dueDate', label: 'Due Date' },
    { id: 'amount', label: 'Amount' },
    { id: 'createdAt', label: 'Created Date' },
  ],
};

export const PaymentsList = ({ navigation }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { payments, loading } = useAppSelector((state) => state.payments);
  
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Advanced filter state
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [activeSort, setActiveSort] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: '',
    direction: 'asc'
  });
  
  useEffect(() => {
    fetchPaymentsList();
  }, []);
  
  useEffect(() => {
    filterPayments();
  }, [payments, searchQuery, selectedFilter, activeFilters, activeSort]);
  
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
    
    // Apply segment filter
    if (selectedFilter !== 'all') {
      if (selectedFilter === 'pending') {
        result = result.filter((payment) => payment.status === 'pending');
      } else if (selectedFilter === 'completed') {
        result = result.filter((payment) => payment.status === 'completed');
      } else if (selectedFilter === 'overdue') {
        result = result.filter((payment) => payment.status === 'overdue');
      }
    }
    
    // Apply advanced filters
    if (Object.keys(activeFilters).length > 0) {
      Object.entries(activeFilters).forEach(([groupId, selectedOptions]) => {
        if (selectedOptions.length > 0) {
          if (groupId === 'status') {
            result = result.filter(payment => 
              selectedOptions.includes(payment.status)
            );
          } else if (groupId === 'type') {
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
        const field = activeSort.field as keyof Payment;
        const direction = activeSort.direction === 'asc' ? 1 : -1;
        
        if (typeof a[field] === 'string' && typeof b[field] === 'string') {
          return (a[field] as string).localeCompare(b[field] as string) * direction;
        } else if (typeof a[field] === 'number' && typeof b[field] === 'number') {
          return ((a[field] as number) - (b[field] as number)) * direction;
        } else if (field === 'dueDate' || field === 'createdAt' || field === 'updatedAt') {
          return (new Date(a[field] as string).getTime() - new Date(b[field] as string).getTime()) * direction;
        }
        
        return 0;
      });
    }
    
    setFilteredPayments(result);
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
  
  const handleAddPayment = () => {
    navigation.navigate('AddPayment');
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check size={16} color={STATUS_COLORS.success} />;
      case 'pending':
        return <CreditCard size={16} color={STATUS_COLORS.warning} />;
      case 'overdue':
        return <AlertCircle size={16} color={STATUS_COLORS.error} />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return STATUS_COLORS.success;
      case 'pending':
        return STATUS_COLORS.warning;
      case 'overdue':
        return STATUS_COLORS.error;
      case 'cancelled':
        return STATUS_COLORS.disabled;
      default:
        return STATUS_COLORS.default;
    }
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
        No payments found
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
          onPress={handleAddPayment}
        >
          <Plus size={16} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.emptyButtonText}>Add Payment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <ListItem
      title={item.residentName}
      subtitle={`${item.buildingName} • ${formatCurrency(item.amount)}`}
      description={`Due: ${formatDate(item.dueDate)} • ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`}
      leftIcon={() => (
        <View style={[styles.iconContainer, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Receipt size={24} color={getStatusColor(item.status)} />
        </View>
      )}
      onPress={() => handlePaymentPress(item.id)}
      badge={{
        text: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        color: getStatusColor(item.status),
        icon: getStatusIcon(item.status),
      }}
      rightContent={
        <Chip 
          mode="flat" 
          style={[styles.amountChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
          textStyle={{ color: getStatusColor(item.status), fontWeight: 'bold' }}
        >
          {formatCurrency(item.amount)}
        </Chip>
      }
    />
  );
  
  if (loading && !refreshing) {
    return (
      <>
        <Header 
          title="Payments" 
          showBack={true}
          showMenu={true}
          onMenuPress={() => setMenuVisible(true)}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading payments...
          </Text>
        </View>
        <SideMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </>
    );
  }
  
  // Count active filters for badge
  const activeFilterCount = Object.values(activeFilters)
    .reduce((count, options) => count + options.length, 0) + (activeSort.field ? 1 : 0);
  
  return (
    <>
      <Header 
        title="Payments" 
        showBack={true}
        showMenu={true}
        onMenuPress={() => setMenuVisible(true)}
      />
      
      <View 
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
        ]}
      >
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search payments..."
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={[
              styles.searchBar,
              { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
            ]}
            iconColor={isDarkMode ? '#aaa' : '#666'}
            inputStyle={{ color: isDarkMode ? '#fff' : '#333' }}
            placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
          />
          
          <TouchableOpacity 
            style={[
              styles.filterButton,
              { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
            ]}
            onPress={handleOpenFilterModal}
          >
            <Filter size={20} color={theme.colors.primary} />
            {activeFilterCount > 0 && (
              <View style={[
                styles.filterBadge, 
                { backgroundColor: theme.colors.primary }
              ]}>
                <Text style={styles.filterBadgeText}>
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <SegmentedButtons
          value={selectedFilter}
          onValueChange={setSelectedFilter}
          style={styles.segmentedButtons}
          buttons={[
            {
              value: 'all',
              label: 'All',
            },
            {
              value: 'pending',
              label: 'Pending',
            },
            {
              value: 'completed',
              label: 'Completed',
            },
            {
              value: 'overdue',
              label: 'Overdue',
            },
          ]}
        />
        
        <View style={styles.actionButtonsContainer}>
          <Button 
            mode="outlined"
            icon={props => <History {...props} />}
            onPress={() => navigation.navigate('PaymentHistory')}
            style={styles.historyButton}
          >
            View Payment History
          </Button>
        </View>
        
        <FlatList
          data={filteredPayments}
          renderItem={renderPaymentItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={
            filteredPayments.length === 0
              ? { flex: 1, justifyContent: 'center' }
              : { paddingBottom: 80 }
          }
        />
      </View>
      
      <FAB
        icon={props => <Plus {...props} />}
        style={[
          styles.fab,
          { backgroundColor: theme.colors.primary }
        ]}
        onPress={handleAddPayment}
        color="white"
      />
      
      <FilterModal
        isVisible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        config={filterConfig}
        onApplyFilters={handleApplyFilters}
        activeFilters={activeFilters}
        activeSort={activeSort}
      />
      
      <SideMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flex: 1,
    borderRadius: 8,
    elevation: 2,
  },
  filterButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountChip: {
    alignSelf: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  actionButtonsContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  historyButton: {
  },
}); 