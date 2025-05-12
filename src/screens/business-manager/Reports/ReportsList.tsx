import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Text, useTheme, Searchbar, Chip, Card, Button, Menu, Divider, Badge, Avatar, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessManagerStackParamList, Report } from '../../../navigation/types';
import { Header } from '../../../components/Header';
import { format } from 'date-fns';
import { Filter, Calendar, BarChart3, ChevronRight, FileCog, AlertCircle, Building } from 'lucide-react-native';
import { useAppSelector } from '../../../store/hooks';

type Props = NativeStackScreenProps<BusinessManagerStackParamList, 'Reports'>;

// Mock data for reports
const MOCK_REPORTS: Report[] = [
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
    id: '2',
    title: 'Broken Elevator',
    submitter: 'Sarah Johnson',
    submitterId: 'user2',
    location: 'Building B, Main Entrance',
    building: 'Building B',
    status: 'in-progress',
    priority: 'urgent',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    description: 'Elevator is not working. Multiple residents are affected.',
    assignedTo: 'Technical Service',
    images: ['https://picsum.photos/seed/elevator/400/300']
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
    id: '4',
    title: 'Playground Safety Concern',
    submitter: 'Emma Wilson',
    submitterId: 'user4',
    location: 'Building C, Common Area',
    building: 'Building C',
    status: 'resolved',
    priority: 'medium',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    description: 'Loose screws on playground slide. Children might get hurt.',
    assignedTo: 'Maintenance Team',
    images: ['https://picsum.photos/seed/playground/400/300'],
    resolvedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() // 8 days ago
  },
  {
    id: '5',
    title: 'Noise Complaint',
    submitter: 'Robert Chen',
    submitterId: 'user5',
    location: 'Building B, Floor 5, Apartment 5C',
    building: 'Building B',
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
    location: 'Building C, Entrance Hall',
    building: 'Building C',
    status: 'resolved',
    priority: 'medium',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    description: 'Mailbox lock is broken and cannot be secured.',
    assignedTo: 'Maintenance Team',
    images: ['https://picsum.photos/seed/mailbox/400/300'],
    resolvedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
  }
];

export const ReportsList = ({ navigation }: Props) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [buildingFilter, setBuildingFilter] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dateRangeVisible, setDateRangeVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setReports(MOCK_REPORTS);
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
    setBuildingFilter(null);
    closeMenu();
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = searchQuery === '' || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.submitter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.building.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || report.status === statusFilter;
    const matchesPriority = !priorityFilter || report.priority === priorityFilter;
    const matchesBuilding = !buildingFilter || report.building === buildingFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesBuilding;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return theme.colors.error;
      case 'in-progress':
        return theme.colors.primary;
      case 'resolved':
        return '#4CAF50'; // Green color for resolved status
      default:
        return theme.colors.primary;
    }
  };

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

  const handleReportPress = (reportId: string) => {
    navigation.navigate('ReportDetails', { reportId });
  };

  const renderReportCard = ({ item }: { item: Report }) => {
    const isPastDay = (dateString: string, days: number) => {
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return diff <= days;
    };

    const isRecent = isPastDay(item.date, 2); // Reports within last 2 days are considered "recent"

    return (
      <TouchableOpacity onPress={() => handleReportPress(item.id)}>
        <Card 
          style={[
            styles.reportCard, 
            { backgroundColor: isDarkMode ? '#1E1E1E' : 'white' }
          ]}
          mode="elevated"
        >
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <Text 
                  variant="titleMedium" 
                  style={[styles.cardTitle, { color: isDarkMode ? 'white' : '#333' }]}
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
                  style={{ backgroundColor: getStatusColor(item.status) + '20' }}
                  textStyle={{ color: getStatusColor(item.status), fontWeight: '500' }}
                  compact
                >
                  {item.status === 'in-progress' ? 'In Progress' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Chip>
              </View>
            </View>
            
            <View style={styles.reportInfo}>
              <View style={styles.infoRow}>
                <Building size={16} color={isDarkMode ? '#aaa' : '#666'} style={styles.infoIcon} />
                <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>{item.building}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <AlertCircle size={16} color={getPriorityColor(item.priority)} style={styles.infoIcon} />
                <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                  Priority: <Text style={{ color: getPriorityColor(item.priority), fontWeight: '500' }}>
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                  </Text>
                </Text>
              </View>
            </View>
            
            <Text 
              style={[styles.description, { color: isDarkMode ? '#ddd' : '#555' }]} 
              numberOfLines={2}
            >
              {item.description}
            </Text>
            
            <View style={styles.cardFooter}>
              <View style={styles.submitterInfo}>
                <Avatar.Text 
                  size={24} 
                  label={item.submitter.split(' ').map(n => n[0]).join('')} 
                  style={styles.submitterAvatar} 
                />
                <Text style={{ color: isDarkMode ? '#aaa' : '#666', fontSize: 12 }}>{item.submitter}</Text>
              </View>
              <Text style={{ color: isDarkMode ? '#aaa' : '#666', fontSize: 12 }}>
                {format(new Date(item.date), 'MMM d, yyyy')}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderFilterChips = () => {
    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.filtersScrollView}
        contentContainerStyle={styles.filtersContainer}
      >
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { borderColor: theme.colors.primary }
          ]} 
          onPress={toggleMenu}
        >
          <Filter size={16} color={theme.colors.primary} style={{ marginRight: 4 }} />
          <Text style={{ color: theme.colors.primary }}>Filter</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { borderColor: theme.colors.primary }
          ]} 
          onPress={toggleDateRange}
        >
          <Calendar size={16} color={theme.colors.primary} style={{ marginRight: 4 }} />
          <Text style={{ color: theme.colors.primary }}>Date</Text>
        </TouchableOpacity>
        
        {statusFilter && (
          <Chip 
            style={styles.filterChip} 
            onClose={() => setStatusFilter(null)}
            closeIconAccessibilityLabel="Clear status filter"
          >
            Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          </Chip>
        )}
        
        {priorityFilter && (
          <Chip 
            style={styles.filterChip} 
            onClose={() => setPriorityFilter(null)}
            closeIconAccessibilityLabel="Clear priority filter"
          >
            Priority: {priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}
          </Chip>
        )}
        
        {buildingFilter && (
          <Chip 
            style={styles.filterChip} 
            onClose={() => setBuildingFilter(null)}
            closeIconAccessibilityLabel="Clear building filter"
          >
            {buildingFilter}
          </Chip>
        )}
        
        {(statusFilter || priorityFilter || buildingFilter) && (
          <Chip 
            style={styles.clearChip} 
            onPress={handleClearFilters}
            closeIconAccessibilityLabel="Clear all filters"
          >
            Clear All
          </Chip>
        )}
      </ScrollView>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#ccc' : '#666' }}>Loading reports...</Text>
        </View>
      );
    }

    if (filteredReports.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <FileCog size={64} color={isDarkMode ? '#555' : '#ccc'} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#ccc' : '#666', textAlign: 'center' }}>
            {searchQuery || statusFilter || priorityFilter || buildingFilter ? 
              'No reports match your filters' : 
              'No reports available'}
          </Text>
          {(searchQuery || statusFilter || priorityFilter || buildingFilter) && (
            <Button 
              mode="outlined" 
              onPress={handleClearFilters} 
              style={{ marginTop: 16 }}
            >
              Clear Filters
            </Button>
          )}
        </View>
      );
    }

    return (
      <FlatList
        data={filteredReports}
        renderItem={renderReportCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
      <Header 
        title="Reports" 
        showBack={true}
      />
      
      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search reports"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={[
              styles.searchbar, 
              { backgroundColor: isDarkMode ? '#333' : 'white' }
            ]}
            iconColor={theme.colors.primary}
            inputStyle={{ color: isDarkMode ? 'white' : 'black' }}
            placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
          />
        </View>
        
        {renderFilterChips()}
        
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={{ x: 20, y: 170 }}
          style={{ width: 200 }}
        >
          <Menu.Item 
            title="Status" 
            disabled 
            titleStyle={{ fontWeight: 'bold' }} 
          />
          <Divider />
          <Menu.Item 
            onPress={() => { setStatusFilter('open'); closeMenu(); }} 
            title="Open" 
            titleStyle={{ color: statusFilter === 'open' ? theme.colors.primary : undefined }}
          />
          <Menu.Item 
            onPress={() => { setStatusFilter('in-progress'); closeMenu(); }} 
            title="In Progress" 
            titleStyle={{ color: statusFilter === 'in-progress' ? theme.colors.primary : undefined }}
          />
          <Menu.Item 
            onPress={() => { setStatusFilter('resolved'); closeMenu(); }} 
            title="Resolved" 
            titleStyle={{ color: statusFilter === 'resolved' ? theme.colors.primary : undefined }}
          />
          <Divider />
          
          <Menu.Item 
            title="Priority" 
            disabled 
            titleStyle={{ fontWeight: 'bold' }} 
          />
          <Divider />
          <Menu.Item 
            onPress={() => { setPriorityFilter('urgent'); closeMenu(); }} 
            title="Urgent" 
            titleStyle={{ color: priorityFilter === 'urgent' ? theme.colors.primary : undefined }}
          />
          <Menu.Item 
            onPress={() => { setPriorityFilter('high'); closeMenu(); }} 
            title="High" 
            titleStyle={{ color: priorityFilter === 'high' ? theme.colors.primary : undefined }}
          />
          <Menu.Item 
            onPress={() => { setPriorityFilter('medium'); closeMenu(); }} 
            title="Medium" 
            titleStyle={{ color: priorityFilter === 'medium' ? theme.colors.primary : undefined }}
          />
          <Menu.Item 
            onPress={() => { setPriorityFilter('low'); closeMenu(); }} 
            title="Low" 
            titleStyle={{ color: priorityFilter === 'low' ? theme.colors.primary : undefined }}
          />
          <Divider />
          
          <Menu.Item 
            title="Building" 
            disabled 
            titleStyle={{ fontWeight: 'bold' }} 
          />
          <Divider />
          <Menu.Item 
            onPress={() => { setBuildingFilter('Building A'); closeMenu(); }} 
            title="Building A" 
            titleStyle={{ color: buildingFilter === 'Building A' ? theme.colors.primary : undefined }}
          />
          <Menu.Item 
            onPress={() => { setBuildingFilter('Building B'); closeMenu(); }} 
            title="Building B" 
            titleStyle={{ color: buildingFilter === 'Building B' ? theme.colors.primary : undefined }}
          />
          <Menu.Item 
            onPress={() => { setBuildingFilter('Building C'); closeMenu(); }} 
            title="Building C" 
            titleStyle={{ color: buildingFilter === 'Building C' ? theme.colors.primary : undefined }}
          />
        </Menu>
        
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    marginVertical: 16,
  },
  searchbar: {
    elevation: 2,
    borderRadius: 8,
  },
  filtersScrollView: {
    marginBottom: 16,
  },
  filtersContainer: {
    paddingRight: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  clearChip: {
    marginRight: 8,
    backgroundColor: '#e53935',
  },
  listContent: {
    paddingBottom: 16,
  },
  reportCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
    marginRight: 8,
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  chipContainer: {
    marginLeft: 8,
  },
  reportInfo: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 4,
  },
  description: {
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  submitterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitterAvatar: {
    marginRight: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});