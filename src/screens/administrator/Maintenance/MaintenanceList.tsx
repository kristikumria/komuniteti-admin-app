import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Text, useTheme, Searchbar, Chip, Card, Button, Menu, Divider, Badge, Avatar, ActivityIndicator, Surface, IconButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdministratorStackParamList, Report } from '../../../navigation/types';
import { Header } from '../../../components/Header';
import { format } from 'date-fns';
import { Filter, Calendar, AlertCircle, Building, Home, Plus, CircleSlash } from 'lucide-react-native';
import { useAppSelector } from '../../../store/hooks';

// Update Props type to include optional tablet layout properties
interface Props extends NativeStackScreenProps<AdministratorStackParamList, 'Maintenance'> {
  customSelectHandler?: (maintenanceId: string) => void;
  selectedMaintenanceId?: string | null;
}

// Export the mock data for use in other components
export const MOCK_MAINTENANCE: Report[] = [
  {
    id: '1',
    title: 'Water Leak in Apartment 3B',
    submitter: 'John Smith',
    submitterId: 'user1',
    location: 'Building A, Floor 3, Apartment 3B',
    building: 'Building A',
    status: 'open',
    priority: 'high',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    description: 'Water leaking from ceiling in bathroom. Needs immediate attention.',
    assignedTo: 'Maintenance Team',
    images: ['https://picsum.photos/seed/leak1/400/300']
  },
  {
    id: '3',
    title: 'Heating System Issue',
    submitter: 'Mike Davis',
    submitterId: 'user3',
    location: 'Building A, All units',
    building: 'Building A',
    status: 'open',
    priority: 'medium',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    description: 'Heating system not working properly in multiple units.',
    assignedTo: 'HVAC Specialist',
    images: ['https://picsum.photos/seed/heating/400/300']
  },
  {
    id: '5',
    title: 'Noise Complaint',
    submitter: 'Robert Chen',
    submitterId: 'user5',
    location: 'Building A, Floor 5, Apartment 5C',
    building: 'Building A',
    status: 'open',
    priority: 'low',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    description: 'Excessive noise from apartment 5D during late hours.',
    assignedTo: 'Building Manager',
    images: []
  },
  {
    id: '6',
    title: 'Parking Space Dispute',
    submitter: 'Lisa Brown',
    submitterId: 'user6',
    location: 'Building A, Parking Area',
    building: 'Building A',
    status: 'in-progress',
    priority: 'low',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    description: 'Dispute over assigned parking space with neighbor.',
    assignedTo: 'Building Manager',
    images: ['https://picsum.photos/seed/parking/400/300']
  },
  {
    id: '7',
    title: 'Mailbox Broken',
    submitter: 'David Kim',
    submitterId: 'user7',
    location: 'Building A, Entrance Hall',
    building: 'Building A',
    status: 'resolved',
    priority: 'medium',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    description: 'Mailbox lock is broken and cannot be secured.',
    assignedTo: 'Maintenance Team',
    images: ['https://picsum.photos/seed/mailbox/400/300'],
    resolvedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
  }
];

export const MaintenanceList = ({ navigation, customSelectHandler, selectedMaintenanceId }: Props) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dateRangeVisible, setDateRangeVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [maintenanceItems, setMaintenanceItems] = useState<Report[]>([]);
  const [showCreateMaintenanceModal, setShowCreateMaintenanceModal] = useState(false);

  // Get the buildings managed by this administrator
  const adminBuildings = useAppSelector(state => state.buildings.buildings) || [];
  
  // Define colors for different statuses and priorities
  const statusColors = {
    open: theme.colors.error,
    'in-progress': theme.colors.primary,
    resolved: '#4CAF50', // Fallback green color
  };

  const priorityColors = {
    urgent: theme.colors.error,
    high: '#F57C00', // Fallback orange color
    medium: '#0288D1', // Fallback blue color
    low: '#4CAF50', // Fallback green color
  };
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setMaintenanceItems(MOCK_MAINTENANCE);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const closeMenu = () => setMenuVisible(false);
  
  const toggleDateRange = () => setDateRangeVisible(!dateRangeVisible);
  const closeDateRange = () => setDateRangeVisible(false);

  const handleClearFilters = () => {
    setStatusFilter(null);
    setPriorityFilter(null);
    closeMenu();
  };

  const handleAddMaintenance = () => {
    // This would navigate to a form for creating a new maintenance request
    alert('Add maintenance request functionality would be here');
    setShowCreateMaintenanceModal(false);
  };

  const filteredMaintenanceItems = maintenanceItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submitter.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesPriority = !priorityFilter || item.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || theme.colors.primary;
  };

  const getPriorityColor = (priority: string) => {
    return priorityColors[priority as keyof typeof priorityColors] || theme.colors.primary;
  };

  const handleMaintenancePress = (maintenanceId: string) => {
    // Use custom handler if provided (for tablet layout)
    if (customSelectHandler) {
      customSelectHandler(maintenanceId);
    } else {
      // Default navigation behavior
      navigation.navigate('MaintenanceDetails', { maintenanceId });
    }
  };

  const renderMaintenanceCard = ({ item }: { item: Report }) => {
    const isPastDay = (dateString: string, days: number) => {
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return diff <= days;
    };

    const isRecent = isPastDay(item.date, 2);
    const isSelected = selectedMaintenanceId === item.id;

    return (
      <TouchableOpacity 
        onPress={() => handleMaintenancePress(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`Maintenance request: ${item.title}`}
        accessibilityHint="Tap to view details"
        accessibilityState={{ selected: isSelected }}
      >
        <Card 
          style={[
            styles.maintenanceCard, 
            { backgroundColor: isDarkMode ? theme.colors.elevation.level2 : theme.colors.surface },
            isSelected && { borderColor: theme.colors.primary, borderWidth: 2 }
          ]}
          mode="elevated"
          elevation={1}
        >
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text 
                  variant="titleMedium" 
                  style={[styles.cardTitle, { color: theme.colors.onSurface }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {isRecent && (
                  <Badge style={styles.newBadge}>New</Badge>
                )}
              </View>
              <View style={styles.chipContainer}>
                <Chip 
                  style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
                  textStyle={{ color: getStatusColor(item.status), fontWeight: '500' }}
                  compact
                >
                  {item.status === 'in-progress' ? 'In Progress' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Chip>
              </View>
            </View>
            
            <View style={styles.maintenanceInfo}>
              <View style={styles.infoRow}>
                <Home size={16} color={theme.colors.onSurfaceVariant} style={styles.infoIcon} />
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  {item.location}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <AlertCircle size={16} color={getPriorityColor(item.priority)} style={styles.infoIcon} />
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  Priority: <Text style={{ color: getPriorityColor(item.priority), fontWeight: '500' }}>
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                  </Text>
                </Text>
              </View>
            </View>
            
            <Text 
              variant="bodySmall" 
              style={{ color: theme.colors.onSurfaceVariant, marginBottom: 10 }}
              numberOfLines={2}
            >
              {item.description}
            </Text>
            
            <View style={styles.cardFooter}>
              <View style={styles.dateContainer}>
                <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                  Reported: {format(new Date(item.date), 'MMM d, yyyy')}
                </Text>
              </View>
              
              <View style={styles.assigneeContainer}>
                {item.assignedTo && (
                  <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
                    Assigned: {item.assignedTo}
                  </Text>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderFilterChips = () => {
    return (
      <View style={styles.filterChipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
          <TouchableOpacity onPress={toggleMenu}>
            <Chip 
              icon={({ size, color }) => <Filter size={size} color={color} />}
              onPress={toggleMenu}
              style={[styles.filterChip, { backgroundColor: isDarkMode ? theme.colors.elevation.level1 : theme.colors.surfaceVariant }]}
              selected={statusFilter !== null || priorityFilter !== null}
              mode="outlined"
              elevated
            >
              Filters {(statusFilter || priorityFilter) ? '•' : ''}
            </Chip>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={toggleDateRange}>
            <Chip 
              icon={({ size, color }) => <Calendar size={size} color={color} />}
              onPress={toggleDateRange}
              style={[styles.filterChip, { backgroundColor: isDarkMode ? theme.colors.elevation.level1 : theme.colors.surfaceVariant }]}
              mode="outlined"
              elevated
            >
              Date Range
            </Chip>
          </TouchableOpacity>
          
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={{ x: 20, y: 80 }}
            contentStyle={{ backgroundColor: isDarkMode ? theme.colors.elevation.level2 : theme.colors.surface }}
          >
            <View style={{ padding: 16 }}>
              <Text variant="titleMedium" style={{ marginBottom: 12, color: theme.colors.onSurface }}>Filter By Status</Text>
              <View style={styles.menuChips}>
                {['open', 'in-progress', 'resolved'].map((status) => (
                  <Chip
                    key={status}
                    selected={statusFilter === status}
                    onPress={() => setStatusFilter(statusFilter === status ? null : status)}
                    style={[
                      styles.menuChip, 
                      { backgroundColor: statusFilter === status ? getStatusColor(status) + '20' : (isDarkMode ? theme.colors.elevation.level3 : theme.colors.surfaceVariant) }
                    ]}
                    textStyle={{ 
                      color: statusFilter === status ? getStatusColor(status) : theme.colors.onSurfaceVariant,
                      fontWeight: statusFilter === status ? '500' : 'normal'
                    }}
                    mode="outlined"
                  >
                    {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Chip>
                ))}
              </View>
              
              <Divider style={{ marginVertical: 16 }} />
              
              <Text variant="titleMedium" style={{ marginBottom: 12, color: theme.colors.onSurface }}>Filter By Priority</Text>
              <View style={styles.menuChips}>
                {['urgent', 'high', 'medium', 'low'].map((priority) => (
                  <Chip
                    key={priority}
                    selected={priorityFilter === priority}
                    onPress={() => setPriorityFilter(priorityFilter === priority ? null : priority)}
                    style={[
                      styles.menuChip, 
                      { backgroundColor: priorityFilter === priority ? getPriorityColor(priority) + '20' : (isDarkMode ? theme.colors.elevation.level3 : theme.colors.surfaceVariant) }
                    ]}
                    textStyle={{ 
                      color: priorityFilter === priority ? getPriorityColor(priority) : theme.colors.onSurfaceVariant,
                      fontWeight: priorityFilter === priority ? '500' : 'normal'
                    }}
                    mode="outlined"
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Chip>
                ))}
              </View>
              
              <Button 
                mode="outlined" 
                onPress={handleClearFilters} 
                style={{ marginTop: 16 }}
              >
                Clear All Filters
              </Button>
            </View>
          </Menu>
        </ScrollView>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 20, color: theme.colors.onSurfaceVariant }}>
            Loading maintenance requests...
          </Text>
        </View>
      );
    }
    
    if (filteredMaintenanceItems.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Surface style={styles.emptyIconContainer} elevation={0}>
            <CircleSlash size={48} color={theme.colors.onSurfaceVariant} />
          </Surface>
          <Text 
            variant="titleMedium" 
            style={{ color: theme.colors.onSurface, marginTop: 16 }}
          >
            No maintenance requests found
          </Text>
          <Text 
            variant="bodyMedium" 
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, textAlign: 'center' }}
          >
            {statusFilter || priorityFilter ? 
              'Try adjusting your filters to see more results' : 
              'There are no maintenance requests to display'}
          </Text>
          <Button 
            mode="contained" 
            onPress={() => setShowCreateMaintenanceModal(true)} 
            style={{ marginTop: 24 }}
            icon={({ size, color }) => <Plus size={size} color={color} />}
          >
            Create Request
          </Button>
        </View>
      );
    }
    
    return (
      <FlatList
        data={filteredMaintenanceItems}
        renderItem={renderMaintenanceCard}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={[
      styles.container, 
      { backgroundColor: isDarkMode ? theme.colors.background : theme.colors.elevation.level0 }
    ]}>
      <Header
        title="Maintenance Requests"
        subtitle={`${filteredMaintenanceItems.length} maintenance ${filteredMaintenanceItems.length === 1 ? 'request' : 'requests'}`}
        navigation={navigation}
        showBackButton={!customSelectHandler}
        actionIcon="plus"
        actionLabel="Add Request"
      />
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search maintenance requests..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={[
            styles.searchbar, 
            { backgroundColor: isDarkMode ? theme.colors.elevation.level3 : theme.colors.surface }
          ]}
          inputStyle={{ color: theme.colors.onSurface }}
          iconColor={theme.colors.onSurfaceVariant}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          elevation={1}
        />
      </View>
      
      {renderFilterChips()}
      
      {renderContent()}
      
      <IconButton
        icon={({ size, color }) => <Plus size={size} color={color} />}
        mode="contained"
        containerColor={theme.colors.primary}
        iconColor={theme.colors.onPrimary}
        size={24}
        onPress={() => setShowCreateMaintenanceModal(true)}
        style={styles.fab}
        accessibilityLabel="Create new maintenance request"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchbar: {
    borderRadius: 12,
  },
  filterChipsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  filterChips: {
    paddingHorizontal: 8,
    flexDirection: 'row',
  },
  filterChip: {
    marginHorizontal: 8,
    borderRadius: 8,
  },
  menuChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  menuChip: {
    margin: 4,
    borderRadius: 8,
  },
  maintenanceCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
    fontWeight: '600',
  },
  newBadge: {
    marginLeft: 8,
    backgroundColor: '#FF6B6B',
  },
  chipContainer: {
    marginLeft: 8,
  },
  statusChip: {
    borderRadius: 6,
  },
  maintenanceInfo: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  dateContainer: {
    flex: 1,
  },
  assigneeContainer: {
    flex: 1,
    alignItems: 'flex-end',
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
    padding: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
}); 