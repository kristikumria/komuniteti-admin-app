import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar, Card, Badge, Button, Divider, Avatar, IconButton, Chip } from 'react-native-paper';
import { Users, ChevronRight, Filter, Mail, Phone, Home, Plus } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BusinessManagerStackParamList } from '../../../../navigation/types';

// Define Resident type
interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
  unitNumber: string;
  buildingId: string;
  buildingName: string;
  status: 'owner' | 'tenant';
  paymentStatus: 'current' | 'overdue';
  moveInDate: string;
  familyMembers: number;
  image?: string;
}

type ResidentsNavigationProp = NativeStackNavigationProp<BusinessManagerStackParamList>;

interface ResidentsListProps {
  unitId?: string;
  buildingId?: string;
  buildingName?: string;
}

export const ResidentsList = ({ unitId, buildingId, buildingName }: ResidentsListProps) => {
  const theme = useTheme();
  const navigation = useNavigation<ResidentsNavigationProp>();
  
  const [residents, setResidents] = useState<Resident[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'owners' | 'tenants' | 'overdue'>('all');
  
  // Mock residents data
  const mockResidents: Resident[] = [
    {
      id: 'resident-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+355 69 123 4567',
      unitId: 'unit-1',
      unitNumber: '101',
      buildingId: 'building-1',
      buildingName: 'Riviera Towers',
      status: 'owner',
      paymentStatus: 'current',
      moveInDate: '2022-06-15',
      familyMembers: 3,
    },
    {
      id: 'resident-2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+355 69 234 5678',
      unitId: 'unit-3',
      unitNumber: '201',
      buildingId: 'building-2',
      buildingName: 'Park View Residence',
      status: 'tenant',
      paymentStatus: 'overdue',
      moveInDate: '2023-01-10',
      familyMembers: 4,
    },
    {
      id: 'resident-3',
      name: 'Arben Hoxha',
      email: 'arben.hoxha@example.com',
      phone: '+355 68 345 6789',
      unitId: 'unit-4',
      unitNumber: '202',
      buildingId: 'building-1',
      buildingName: 'Riviera Towers',
      status: 'owner',
      paymentStatus: 'current',
      moveInDate: '2021-09-20',
      familyMembers: 2,
    },
    {
      id: 'resident-4',
      name: 'Elona Meti',
      email: 'elona.meti@example.com',
      phone: '+355 67 456 7890',
      unitId: 'unit-5',
      unitNumber: '301',
      buildingId: 'building-1',
      buildingName: 'Riviera Towers',
      status: 'tenant',
      paymentStatus: 'overdue',
      moveInDate: '2023-05-01',
      familyMembers: 1,
    },
    {
      id: 'resident-5',
      name: 'Genti Kraja',
      email: 'genti.kraja@example.com',
      phone: '+355 69 567 8901',
      unitId: 'unit-6',
      unitNumber: '302',
      buildingId: 'building-2',
      buildingName: 'Park View Residence',
      status: 'owner',
      paymentStatus: 'current',
      moveInDate: '2022-11-15',
      familyMembers: 5,
    },
  ];
  
  useEffect(() => {
    // Simulate API call to fetch residents
    setLoading(true);
    setTimeout(() => {
      let data = [...mockResidents];
      
      // Filter by building ID if provided
      if (buildingId) {
        data = data.filter(resident => resident.buildingId === buildingId);
      }
      
      // Filter by unit ID if provided
      if (unitId) {
        data = data.filter(resident => resident.unitId === unitId);
      }
      
      setResidents(data);
      setLoading(false);
    }, 1000);
  }, [buildingId, unitId]);
  
  // Filter residents based on search and filter criteria
  useEffect(() => {
    let result = [...residents];
    
    // Apply active filter
    if (activeFilter === 'owners') {
      result = result.filter(resident => resident.status === 'owner');
    } else if (activeFilter === 'tenants') {
      result = result.filter(resident => resident.status === 'tenant');
    } else if (activeFilter === 'overdue') {
      result = result.filter(resident => resident.paymentStatus === 'overdue');
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        resident =>
          resident.name.toLowerCase().includes(query) ||
          resident.email.toLowerCase().includes(query) ||
          resident.unitNumber.toLowerCase().includes(query) ||
          resident.phone.includes(query)
      );
    }
    
    setFilteredResidents(result);
  }, [residents, activeFilter, searchQuery]);
  
  const handleResidentPress = (residentId: string) => {
    // Temporarily just log the action until we have this screen
    console.log('View resident details:', residentId);
    // In the future, we'll navigate to the resident details screen
    // navigation.navigate('ResidentDetails', { residentId });
  };
  
  const handleAddResident = () => {
    // Temporarily just log the action until we have this screen
    console.log('Add resident for building:', buildingId, 'unit:', unitId);
    // In the future, we'll navigate to the add resident screen
    // navigation.navigate('AddResident', { buildingId, unitId });
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'owner': return '#4CAF50';
      case 'tenant': return '#2196F3';
      default: return '#9E9E9E';
    }
  };
  
  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'current': return '#4CAF50';
      case 'overdue': return '#F44336';
      default: return '#9E9E9E';
    }
  };
  
  // Render filter chips
  const renderFilterChips = () => (
    <View style={styles.filterChips}>
      <Chip 
        selected={activeFilter === 'all'} 
        onPress={() => setActiveFilter('all')}
        style={styles.filterChip}
      >
        All
      </Chip>
      <Chip 
        selected={activeFilter === 'owners'} 
        onPress={() => setActiveFilter('owners')}
        style={styles.filterChip}
        icon={() => <Home size={16} color={getStatusColor('owner')} />}
      >
        Owners
      </Chip>
      <Chip 
        selected={activeFilter === 'tenants'} 
        onPress={() => setActiveFilter('tenants')}
        style={styles.filterChip}
        icon={() => <Home size={16} color={getStatusColor('tenant')} />}
      >
        Tenants
      </Chip>
      <Chip 
        selected={activeFilter === 'overdue'} 
        onPress={() => setActiveFilter('overdue')}
        style={styles.filterChip}
        icon={() => <Filter size={16} color={getPaymentStatusColor('overdue')} />}
      >
        Payment Overdue
      </Chip>
    </View>
  );
  
  // Render a resident item
  const renderResidentItem = ({ item }: { item: Resident }) => (
    <Card style={styles.residentCard} mode="outlined" onPress={() => handleResidentPress(item.id)}>
      <Card.Content>
        <View style={styles.residentHeader}>
          <Avatar.Text
            size={50}
            label={`${item.name.split(' ')[0][0]}${item.name.split(' ')[1][0]}`}
            color={theme.colors.onPrimary}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={styles.residentInfo}>
            <Text variant="titleMedium">{item.name}</Text>
            <View style={styles.statusRow}>
              <Badge style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
              {item.paymentStatus === 'overdue' && (
                <Badge style={[styles.statusBadge, { backgroundColor: getPaymentStatusColor(item.paymentStatus) }]}>
                  Payment Overdue
                </Badge>
              )}
            </View>
            <Text variant="bodySmall" style={styles.unitText}>
              Unit {item.unitNumber} • {item.buildingName}
            </Text>
          </View>
        </View>
        
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Mail size={16} color={theme.colors.onSurface} style={styles.contactIcon} />
            <Text variant="bodySmall">{item.email}</Text>
          </View>
          <View style={styles.contactItem}>
            <Phone size={16} color={theme.colors.onSurface} style={styles.contactIcon} />
            <Text variant="bodySmall">{item.phone}</Text>
          </View>
          <View style={styles.contactItem}>
            <Users size={16} color={theme.colors.onSurface} style={styles.contactIcon} />
            <Text variant="bodySmall">{item.familyMembers} family members</Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button mode="text" onPress={() => handleResidentPress(item.id)}>View Details</Button>
        <IconButton icon={() => <ChevronRight size={20} />} onPress={() => handleResidentPress(item.id)} />
      </Card.Actions>
    </Card>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Users size={64} color={theme.colors.primary} opacity={0.3} />
      <Text variant="titleMedium" style={styles.emptyTitle}>No residents found</Text>
      <Text variant="bodyMedium" style={styles.emptyDescription}>
        {searchQuery 
          ? 'Try different search terms or filters' 
          : unitId 
            ? 'No residents are assigned to this unit yet'
            : 'No residents found for this building'}
      </Text>
      <Button 
        mode="contained" 
        onPress={handleAddResident} 
        style={styles.addButton}
        icon={() => <Plus size={16} />}
      >
        Add Resident
      </Button>
    </View>
  );
  
  // Render summary stats
  const renderSummary = () => (
    <Card style={styles.summaryCard}>
      <Card.Content>
        <Text variant="titleSmall" style={styles.summaryTitle}>Residents Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text variant="headlineSmall" style={styles.summaryValue}>{residents.length}</Text>
            <Text variant="bodySmall" style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              {residents.filter(resident => resident.status === 'owner').length}
            </Text>
            <Text variant="bodySmall" style={styles.summaryLabel}>Owners</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              {residents.filter(resident => resident.status === 'tenant').length}
            </Text>
            <Text variant="bodySmall" style={styles.summaryLabel}>Tenants</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text variant="headlineSmall" style={styles.summaryValue}>
              {residents.filter(resident => resident.paymentStatus === 'overdue').length}
            </Text>
            <Text variant="bodySmall" style={styles.summaryLabel}>Overdue</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading residents...</Text>
      </View>
    );
  }
  
  const pageTitle = unitId 
    ? `Unit ${residents[0]?.unitNumber || ''} Residents` 
    : buildingId 
      ? `${residents[0]?.buildingName || 'Building'} Residents`
      : 'All Residents';
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>{pageTitle}</Text>
        <Button 
          mode="contained" 
          onPress={handleAddResident}
          icon={() => <Plus size={16} />}
        >
          Add Resident
        </Button>
      </View>
      
      <Searchbar
        placeholder="Search residents..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      {renderFilterChips()}
      
      {residents.length > 0 && renderSummary()}
      
      <FlatList
        data={filteredResidents}
        renderItem={renderResidentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  residentCard: {
    marginBottom: 12,
    elevation: 2,
  },
  residentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  residentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 4,
  },
  statusBadge: {
    marginRight: 8,
    marginBottom: 4,
  },
  unitText: {
    opacity: 0.7,
  },
  contactInfo: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    marginRight: 8,
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  addButton: {
    marginTop: 8,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    marginBottom: 12,
    opacity: 0.7,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    opacity: 0.7,
  },
}); 