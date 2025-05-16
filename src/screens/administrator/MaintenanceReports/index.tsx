import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
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
import { useNavigation } from '@react-navigation/native';

import { AdministratorStackParamList } from '../../../navigation/types';
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
import { MOCK_REPORTS } from '../Reports/ReportsList';
import { Report } from '../../../navigation/types';

type Props = NativeStackScreenProps<AdministratorStackParamList, 'MaintenanceReports'>;

// Create a union type for list items
type ListItem = Report | MaintenanceRequest;

const MaintenanceReports = ({ navigation }: Props) => {
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
        return '#8BC34A';
      default:
        return theme.colors.primary;
    }
  };

  // Render a report item
  const renderReportItem = ({ item }: { item: Report }) => {
    return (
      <TouchableOpacity onPress={() => handleReportPress(item.id)}>
        <View 
          style={[
            styles.shadowContainer,
            { 
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }
          ]}
        >
          <Surface 
            style={[
              styles.itemSurface, 
              { backgroundColor: isDarkMode ? '#1E1E1E' : 'white' }
            ]} 
            elevation={0}
          >
            <View style={styles.itemHeader}>
              <View style={styles.titleContainer}>
                <Text 
                  variant="titleMedium" 
                  style={[styles.title, { color: isDarkMode ? 'white' : '#333' }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text variant="bodySmall" style={styles.location} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
              <Chip 
                style={{ backgroundColor: getStatusColor(item.status) + '20' }}
                textStyle={{ color: getStatusColor(item.status), fontWeight: '500' }}
                compact
              >
                {item.status === 'in-progress' ? 'In Progress' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Chip>
            </View>
            
            <View style={styles.itemBody}>
              <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            
            <View style={styles.itemFooter}>
              <View style={styles.infoRow}>
                <Building size={16} color={isDarkMode ? '#aaa' : '#666'} style={styles.infoIcon} />
                <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>{item.building}</Text>
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
        </View>
      </TouchableOpacity>
    );
  };

  // Render a maintenance item
  const renderMaintenanceItem = ({ item }: { item: MaintenanceRequest }) => {
    return (
      <TouchableOpacity onPress={() => handleMaintenancePress(item.id)}>
        <View 
          style={[
            styles.shadowContainer,
            { 
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }
          ]}
        >
          <Surface 
            style={[
              styles.itemSurface, 
              { backgroundColor: isDarkMode ? '#1E1E1E' : 'white' }
            ]} 
            elevation={0}
          >
            <View style={styles.itemHeader}>
              <View style={styles.titleContainer}>
                <Text 
                  variant="titleMedium" 
                  style={[styles.title, { color: isDarkMode ? 'white' : '#333' }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text variant="bodySmall" style={styles.location} numberOfLines={1}>
                  {item.buildingName} • {item.location}
                  {item.unitNumber && ` • Unit ${item.unitNumber}`}
                </Text>
              </View>
              <Chip 
                style={{ backgroundColor: getStatusColor(item.status) + '20' }}
                textStyle={{ color: getStatusColor(item.status), fontWeight: '500' }}
                compact
              >
                {item.status === 'in-progress' ? 'In Progress' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Chip>
            </View>
            
            <View style={styles.itemBody}>
              <Text variant="bodyMedium" style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            
            <View style={styles.itemFooter}>
              <View style={styles.infoRow}>
                {getTypeIcon(item.type, 16, isDarkMode ? '#aaa' : '#666')}
                <Text style={{ color: isDarkMode ? '#aaa' : '#666', marginLeft: 4 }}>
                  {item.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Text>
              </View>
              
              <View style={styles.footerRight}>
                <Chip 
                  style={[styles.priorityChip, { borderColor: getPriorityColor(item.priority) }]}
                  textStyle={{ color: getPriorityColor(item.priority) }}
                >
                  {getPriorityText(item.priority)}
                </Chip>
                
                <Text variant="bodySmall" style={styles.date}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </Surface>
        </View>
      </TouchableOpacity>
    );
  };

  // Render filter chips
  const renderFilterChips = () => {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filtersScrollView}
        contentContainerStyle={styles.filtersContainer}
      >
        {statusFilter && (
          <Chip 
            icon={() => <AlertCircle size={16} color={getStatusColor(statusFilter)} />}
            onClose={() => setLocalStatusFilter(null)}
            style={styles.filterChip}
            mode="outlined"
          >
            Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          </Chip>
        )}
        
        {priorityFilter && (
          <Chip 
            icon="flag"
            onClose={() => setPriorityFilter(null)}
            style={styles.filterChip}
            mode="outlined"
          >
            Priority: {priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}
          </Chip>
        )}
        
        {(statusFilter || priorityFilter) && (
          <Chip 
            icon="close"
            onPress={() => {
              setLocalStatusFilter(null);
              setPriorityFilter(null);
            }}
            style={styles.filterChip}
            mode="outlined"
          >
            Clear All
          </Chip>
        )}
      </ScrollView>
    );
  };

  // Render content based on active tab and loading state
  const renderContent = () => {
    if (activeTab === 'maintenance' && maintenanceLoading && maintenanceRequests.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16 }}>Loading maintenance requests...</Text>
        </View>
      );
    }
    
    if (activeTab === 'reports' && reportsLoading && reports.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16 }}>Loading reports...</Text>
        </View>
      );
    }
    
    if (activeTab === 'maintenance' && (!maintenanceRequests || maintenanceRequests.length === 0)) {
      return (
        <View style={styles.emptyContainer}>
          <Wrench size={40} color={theme.colors.primary} />
          <Text style={{ marginTop: 16, marginBottom: 16 }}>No maintenance requests found</Text>
          <Button mode="contained" icon={() => <Plus size={18} color="white" />} onPress={handleAddNew}>
            Create New Request
          </Button>
        </View>
      );
    }
    
    if (activeTab === 'reports' && (!filteredReports || filteredReports.length === 0)) {
      return (
        <View style={styles.emptyContainer}>
          <AlertCircle size={40} color={theme.colors.primary} />
          <Text style={{ marginTop: 16, marginBottom: 16 }}>No reports found</Text>
          <Button mode="contained" icon={() => <Plus size={18} color="white" />} onPress={handleAddNew}>
            Create New Report
          </Button>
        </View>
      );
    }
    
    if (activeTab === 'maintenance') {
      return (
        <FlatList
          data={maintenanceRequests}
          renderItem={renderMaintenanceItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      );
    } else {
      return (
        <FlatList
          data={filteredReports}
          renderItem={renderReportItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Maintenance & Reports" 
        showBack={true}
        rightAction={
          <IconButton
            icon={() => <SlidersHorizontal size={24} color={theme.colors.onSurface} />} 
            onPress={toggleFilterMenu}
            size={24}
          />
        }
      />
      
      <View style={styles.content}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'maintenance' | 'reports')}
          buttons={[
            {
              value: 'maintenance',
              label: 'Maintenance',
              icon: 'wrench'
            },
            {
              value: 'reports',
              label: 'Reports',
              icon: 'file-document'
            }
          ]}
          style={styles.segmentedButtons}
        />
        
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder={`Search ${activeTab === 'maintenance' ? 'maintenance requests' : 'reports'}...`}
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
          />
          
          <Menu
            visible={filterMenuVisible}
            onDismiss={closeFilterMenu}
            anchor={{ x: 0, y: 0 }}
            style={styles.filterMenu}
          >
            <Menu.Item 
              title="Filter by Status" 
              leadingIcon="filter-variant"
              disabled={true}
              dense
            />
            <Divider />
            <Menu.Item 
              title="Open" 
              onPress={() => {
                setLocalStatusFilter("open");
                if (activeTab === 'maintenance') {
                  dispatch(setStatusFilter('open' as MaintenanceStatus));
                }
                closeFilterMenu();
              }}
              leadingIcon={() => <AlertCircle size={20} color={getStatusColor('open')} />}
            />
            <Menu.Item 
              title="In Progress" 
              onPress={() => {
                setLocalStatusFilter("in-progress");
                if (activeTab === 'maintenance') {
                  dispatch(setStatusFilter('in-progress' as MaintenanceStatus));
                }
                closeFilterMenu();
              }}
              leadingIcon={() => <AlertCircle size={20} color={getStatusColor('in-progress')} />}
            />
            <Menu.Item 
              title="Resolved" 
              onPress={() => {
                setLocalStatusFilter("resolved");
                if (activeTab === 'maintenance') {
                  dispatch(setStatusFilter('resolved' as MaintenanceStatus));
                }
                closeFilterMenu();
              }}
              leadingIcon={() => <AlertCircle size={20} color={getStatusColor('resolved')} />}
            />
            <Divider />
            <Menu.Item 
              title="Filter by Priority" 
              leadingIcon="flag"
              disabled={true} 
              dense
            />
            <Divider />
            <Menu.Item 
              title="Urgent" 
              onPress={() => {
                setPriorityFilter("urgent");
                closeFilterMenu();
              }}
              leadingIcon={() => <AlertCircle size={20} color={getPriorityColor('urgent')} />}
            />
            <Menu.Item 
              title="High" 
              onPress={() => {
                setPriorityFilter("high");
                closeFilterMenu();
              }}
              leadingIcon={() => <AlertCircle size={20} color={getPriorityColor('high')} />}
            />
            <Menu.Item 
              title="Medium" 
              onPress={() => {
                setPriorityFilter("medium");
                closeFilterMenu();
              }}
              leadingIcon={() => <AlertCircle size={20} color={getPriorityColor('medium')} />}
            />
            <Menu.Item 
              title="Low" 
              onPress={() => {
                setPriorityFilter("low");
                closeFilterMenu();
              }}
              leadingIcon={() => <AlertCircle size={20} color={getPriorityColor('low')} />}
            />
            <Divider />
            <Menu.Item 
              title="Clear All Filters" 
              onPress={() => {
                setLocalStatusFilter(null);
                setPriorityFilter(null);
                if (activeTab === 'maintenance') {
                  dispatch(setStatusFilter('all' as MaintenanceStatus));
                }
                closeFilterMenu();
              }}
              leadingIcon="filter-remove"
            />
          </Menu>
        </View>
        
        {renderFilterChips()}
        
        {renderContent()}
      </View>
      
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddNew}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  segmentedButtons: {
    margin: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
    position: 'relative',
  },
  searchBar: {
    elevation: 0,
  },
  filtersScrollView: {
    maxHeight: 56,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 80,
  },
  itemSurface: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 0,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontWeight: '500',
  },
  location: {
    opacity: 0.7,
    marginTop: 4,
  },
  itemBody: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  description: {
    opacity: 0.8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 4,
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
  priorityBadge: {
    borderRadius: 4,
  },
  date: {
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  filterMenu: {
    marginTop: 50,
  },
  shadowContainer: {
    marginBottom: 12,
    borderRadius: 12,
  },
});

export default MaintenanceReports; 