import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { 
  Text, 
  useTheme, 
  Searchbar, 
  Chip, 
  FAB, 
  Badge, 
  Surface,
  Button,
  SegmentedButtons,
  Divider,
  ActivityIndicator,
  Menu,
  IconButton
} from 'react-native-paper';
import { 
  Wrench, 
  Filter, 
  Plus, 
  AlertCircle, 
  Home, 
  Calendar,
  ChevronRight,
  Building,
  SlidersHorizontal,
  Droplets,
  Zap,
  Wind,
  Construction,
  Radar
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation, ParamListBase, NavigationProp } from '@react-navigation/native';

import { AdministratorStackParamList, BusinessManagerStackParamList } from '../../../navigation/types';
import { Header } from '../../../components/Header';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { 
  fetchAllRequests, 
  selectFilteredRequests, 
  selectRequestsLoading, 
  selectRequestsError,
  setSearchQuery as setMaintenanceSearchQuery,
  setStatusFilter,
  setTypeFilter,
  selectFilters
} from '../../../store/slices/maintenanceSlice';
import { MaintenanceRequest, MaintenanceStatus, MaintenanceType, MaintenancePriority } from '../../../types/maintenanceTypes';
import { MOCK_REPORTS } from '../Reports';
import { Report } from '../../../navigation/types';

// Define the types for navigation (with more explicit screen names)
type AdminProps = NativeStackScreenProps<AdministratorStackParamList, 'MaintenanceReports'>;
type BusinessProps = NativeStackScreenProps<BusinessManagerStackParamList, 'MaintenanceRequests'>;
type Props = AdminProps | BusinessProps;

// Create a union type for list items
type ListItem = Report | MaintenanceRequest;

export const MaintenanceReports = ({ navigation }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  
  // Helper functions moved inside component
  const getTypeIcon = (type: MaintenanceType, size = 20, color: string) => {
    switch (type) {
      case 'plumbing':
        return <Droplets size={size} color={color} />;
      case 'electrical':
        return <Zap size={size} color={color} />;
      case 'hvac':
        return <Wind size={size} color={color} />;
      case 'appliance':
        return <Home size={size} color={color} />;
      case 'structural':
        return <Construction size={size} color={color} />;
      case 'common_area':
        return <Radar size={size} color={color} />;
      case 'landscaping':
        return <Radar size={size} color={color} />;
      case 'security':
        return <AlertCircle size={size} color={color} />;
      default:
        return <Wrench size={size} color={color} />;
    }
  };

  const getPriorityText = (priority: MaintenancePriority): string => {
    switch (priority) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      case 'urgent':
        return 'Urgent';
      default:
        return '';
    }
  };
  
  // View state
  const [activeTab, setActiveTab] = useState<'maintenance' | 'reports'>('maintenance');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [statusFilter, setLocalStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  
  // Data
  const maintenanceRequests = useAppSelector(selectFilteredRequests);
  const maintenanceLoading = useAppSelector(selectRequestsLoading);
  const maintenanceError = useAppSelector(selectRequestsError);
  const maintenanceFilters = useAppSelector(selectFilters);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  // Load maintenance requests
  useEffect(() => {
    dispatch(fetchAllRequests());
  }, [dispatch]);

  // Load reports (simulated)
  useEffect(() => {
    const timer = setTimeout(() => {
      setReports(MOCK_REPORTS);
      setReportsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    
    if (activeTab === 'maintenance') {
      dispatch(setMaintenanceSearchQuery(query));
    }
  };

  const toggleFilterMenu = () => setFilterMenuVisible(!filterMenuVisible);
  const closeFilterMenu = () => setFilterMenuVisible(false);

  // Filter reports based on search query and filters
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchQuery === '' || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || report.status === statusFilter;
    const matchesPriority = !priorityFilter || report.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handle report press
  const handleReportPress = (reportId: string) => {
    navigation.navigate('ReportDetails', { reportId });
  };

  // Handle maintenance press
  const handleMaintenancePress = (maintenanceId: string) => {
    navigation.navigate('MaintenanceDetail', { requestId: maintenanceId });
  };

  // Handle adding new item based on active tab
  const handleAddNew = () => {
    if (activeTab === 'maintenance') {
      navigation.navigate('MaintenanceForm', {});
    } else {
      // Replace with actual report form navigation when available
      alert('Create new report functionality would be here');
    }
  };

  // Get status color based on status value
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return theme.colors.error;
      case 'in-progress':
        return theme.colors.primary;
      case 'resolved':
        return '#4CAF50';
      case 'cancelled':
        return '#9E9E9E';
      default:
        return theme.colors.primary;
    }
  };

  // Get priority color based on priority value
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#D32F2F';
      case 'high':
        return '#F57C00';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  // Render a report item
  const renderReportItem = ({ item }: { item: Report }) => {
    return (
      <TouchableOpacity 
        onPress={() => handleReportPress(item.id)}
        style={styles.itemContainer}
      >
        <Surface style={styles.itemSurface} elevation={2}>
          <View style={styles.itemHeader}>
            <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Chip 
              style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
              textStyle={{ color: getStatusColor(item.status) }}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Chip>
          </View>
          
          <View style={styles.itemBody}>
            <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          
          <View style={styles.itemFooter}>
            <View style={styles.footerLeft}>
              <Building size={16} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodySmall" style={styles.location} numberOfLines={1}>
                {item.building}
              </Text>
            </View>
            
            <View style={styles.footerRight}>
              <Chip 
                style={[styles.priorityChip, { borderColor: getPriorityColor(item.priority) }]}
                textStyle={{ color: getPriorityColor(item.priority) }}
              >
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
              </Chip>
              
              <Text variant="bodySmall" style={styles.date}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    );
  };

  // Render a maintenance item
  const renderMaintenanceItem = ({ item }: { item: MaintenanceRequest }) => {
    return (
      <TouchableOpacity 
        onPress={() => handleMaintenancePress(item.id)}
        style={styles.itemContainer}
      >
        <Surface style={styles.itemSurface} elevation={2}>
          <View style={styles.itemHeader}>
            <View style={styles.typeIconContainer}>
              {getTypeIcon(item.type, 22, theme.colors.primary)}
            </View>
            <View style={styles.titleContainer}>
              <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text variant="bodySmall" style={styles.location} numberOfLines={1}>
                {item.buildingName} • {item.location}
                {item.unitNumber && ` • Unit ${item.unitNumber}`}
              </Text>
            </View>
            {item.priority === 'urgent' && (
              <Badge style={[styles.priorityBadge, { backgroundColor: getPriorityColor('urgent') }]}>
                Urgent
              </Badge>
            )}
          </View>
          
          <View style={styles.itemBody}>
            <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          
          <View style={styles.itemFooter}>
            <Chip 
              style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
              textStyle={{ color: getStatusColor(item.status) }}
            >
              {item.status === 'in-progress' ? 'In Progress' : 
                item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Chip>
            
            <View style={styles.footerRight}>
              {item.priority !== 'urgent' && (
                <Chip 
                  style={[styles.priorityChip, { borderColor: getPriorityColor(item.priority) }]}
                  textStyle={{ color: getPriorityColor(item.priority) }}
                >
                  {getPriorityText(item.priority)}
                </Chip>
              )}
              
              <Text variant="bodySmall" style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    );
  };

  // Render filter chips
  const renderFilterChips = () => {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {statusFilter && (
          <Chip 
            onClose={() => setLocalStatusFilter(null)}
            style={styles.filterChip}
            closeIconAccessibilityLabel="Clear status filter"
          >
            Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          </Chip>
        )}
        {priorityFilter && (
          <Chip 
            onClose={() => setPriorityFilter(null)}
            style={styles.filterChip}
            closeIconAccessibilityLabel="Clear priority filter"
          >
            Priority: {priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}
          </Chip>
        )}
        {(statusFilter || priorityFilter) && (
          <Button 
            mode="text" 
            onPress={() => {
              setLocalStatusFilter(null);
              setPriorityFilter(null);
            }}
            style={styles.clearButton}
          >
            Clear All
          </Button>
        )}
      </ScrollView>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    if (activeTab === 'maintenance') {
      if (maintenanceLoading && maintenanceRequests.length === 0) {
        return (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading maintenance requests...</Text>
          </View>
        );
      }
      
      if (maintenanceError) {
        return (
          <View style={styles.centerContainer}>
            <AlertCircle size={40} color={theme.colors.error} />
            <Text style={styles.errorText}>Error loading maintenance requests</Text>
            <Button mode="contained" onPress={() => dispatch(fetchAllRequests())}>
              Retry
            </Button>
          </View>
        );
      }
      
      if (maintenanceRequests.length === 0) {
        return (
          <View style={styles.centerContainer}>
            <Wrench size={40} color={theme.colors.primary} />
            <Text style={styles.emptyText}>No maintenance requests found</Text>
            <Button 
              mode="contained" 
              onPress={handleAddNew}
              style={styles.emptyButton}
            >
              Create New Request
            </Button>
          </View>
        );
      }
      
      return (
        <FlatList
          data={maintenanceRequests}
          renderItem={renderMaintenanceItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={maintenanceLoading && maintenanceRequests.length > 0}
              onRefresh={() => dispatch(fetchAllRequests())}
              colors={[theme.colors.primary]}
            />
          }
        />
      );
    } else {
      if (reportsLoading) {
        return (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading reports...</Text>
          </View>
        );
      }
      
      if (filteredReports.length === 0) {
        return (
          <View style={styles.centerContainer}>
            <AlertCircle size={40} color={theme.colors.primary} />
            <Text style={styles.emptyText}>No reports found</Text>
            <Button 
              mode="contained" 
              onPress={handleAddNew}
              style={styles.emptyButton}
            >
              Create New Report
            </Button>
          </View>
        );
      }
      
      return (
        <FlatList
          data={filteredReports}
          renderItem={renderReportItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={reportsLoading}
              onRefresh={() => {
                setReportsLoading(true);
                setTimeout(() => {
                  setReports(MOCK_REPORTS);
                  setReportsLoading(false);
                }, 1000);
              }}
              colors={[theme.colors.primary]}
            />
          }
        />
      );
    }
  };

  return (
    <>
      <Header title="Maintenance & Reports" />
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Searchbar
            placeholder="Search..."
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchInput}
          />
          <IconButton
            icon={props => <Filter {...props} />}
            onPress={toggleFilterMenu}
            mode="contained"
            style={styles.filterButton}
          />
          
          <Menu
            visible={filterMenuVisible}
            onDismiss={closeFilterMenu}
            anchor={{ x: 0, y: 0 }}
            style={styles.filterMenu}
          >
            <Menu.Item 
              title="Filter by Status"
              disabled
              titleStyle={styles.menuHeader}
            />
            <Divider />
            <Menu.Item 
              title="Open"
              onPress={() => {
                setLocalStatusFilter('open');
                closeFilterMenu();
              }}
              titleStyle={{ color: statusFilter === 'open' ? theme.colors.primary : undefined }}
            />
            <Menu.Item 
              title="In Progress"
              onPress={() => {
                setLocalStatusFilter('in-progress');
                closeFilterMenu();
              }}
              titleStyle={{ color: statusFilter === 'in-progress' ? theme.colors.primary : undefined }}
            />
            <Menu.Item 
              title="Resolved"
              onPress={() => {
                setLocalStatusFilter('resolved');
                closeFilterMenu();
              }}
              titleStyle={{ color: statusFilter === 'resolved' ? theme.colors.primary : undefined }}
            />
            <Divider />
            <Menu.Item 
              title="Filter by Priority"
              disabled
              titleStyle={styles.menuHeader}
            />
            <Divider />
            <Menu.Item 
              title="Urgent"
              onPress={() => {
                setPriorityFilter('urgent');
                closeFilterMenu();
              }}
              titleStyle={{ color: priorityFilter === 'urgent' ? theme.colors.primary : undefined }}
            />
            <Menu.Item 
              title="High"
              onPress={() => {
                setPriorityFilter('high');
                closeFilterMenu();
              }}
              titleStyle={{ color: priorityFilter === 'high' ? theme.colors.primary : undefined }}
            />
            <Menu.Item 
              title="Medium"
              onPress={() => {
                setPriorityFilter('medium');
                closeFilterMenu();
              }}
              titleStyle={{ color: priorityFilter === 'medium' ? theme.colors.primary : undefined }}
            />
            <Menu.Item 
              title="Low"
              onPress={() => {
                setPriorityFilter('low');
                closeFilterMenu();
              }}
              titleStyle={{ color: priorityFilter === 'low' ? theme.colors.primary : undefined }}
            />
            <Divider />
            <Menu.Item 
              title="Clear All Filters"
              onPress={() => {
                setLocalStatusFilter(null);
                setPriorityFilter(null);
                closeFilterMenu();
              }}
              titleStyle={{ color: theme.colors.primary }}
            />
          </Menu>
        </View>
        
        <SegmentedButtons
          value={activeTab}
          onValueChange={value => setActiveTab(value as 'maintenance' | 'reports')}
          buttons={[
            {
              value: 'maintenance',
              label: 'Maintenance',
              icon: Wrench,
              style: { flex: 1 }
            },
            {
              value: 'reports',
              label: 'Reports',
              icon: AlertCircle,
              style: { flex: 1 }
            }
          ]}
          style={styles.segmentedButtons}
        />
        
        {renderFilterChips()}
        {renderContent()}
      </View>
      
      <FAB
        icon={props => <Plus {...props} />}
        onPress={handleAddNew}
        style={styles.fab}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
  },
  filterButton: {
    margin: 0,
  },
  filterMenu: {
    marginTop: 50,
    width: 200,
  },
  menuHeader: {
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
  },
  filterChip: {
    marginRight: 8,
  },
  clearButton: {
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  itemContainer: {
    marginBottom: 12,
  },
  itemSurface: {
    padding: 16,
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIconContainer: {
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    flexShrink: 1,
  },
  location: {
    color: 'gray',
    marginTop: 2,
  },
  priorityBadge: {
    marginLeft: 8,
  },
  itemBody: {
    marginBottom: 12,
  },
  description: {
    opacity: 0.8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  priorityChip: {
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  date: {
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 8,
  },
}); 