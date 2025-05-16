import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar, Card, Badge, Button, Divider, Avatar, IconButton, Chip } from 'react-native-paper';
import { Users, Plus, Home, UserCheck, UserX, AlertCircle } from 'lucide-react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { AdministratorStackParamList } from '../../../navigation/types';

// Define Resident type for this component
interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'owner' | 'tenant';
  paymentStatus: 'current' | 'overdue';
  moveInDate: string;
  image?: string;
  familyMembers: number;
}

type UnitResidentsRouteProps = RouteProp<AdministratorStackParamList, 'UnitResidents'>;
type NavigationProps = NativeStackNavigationProp<AdministratorStackParamList>;

export const UnitResidents = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<UnitResidentsRouteProps>();
  const { unitId, unitNumber, buildingName } = route.params;
  
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  
  // Mock data for demonstration
  const mockResidents: Resident[] = [
    {
      id: 'resident-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+355 69 123 4567',
      status: 'owner',
      paymentStatus: 'current',
      moveInDate: '2022-06-15',
      familyMembers: 3,
    },
    {
      id: 'resident-2',
      name: 'Maria Veshi',
      email: 'maria.veshi@example.com',
      phone: '+355 69 234 5678',
      status: 'tenant',
      paymentStatus: 'overdue',
      moveInDate: '2023-01-10',
      familyMembers: 2,
    },
    {
      id: 'resident-3',
      name: 'Genti Kraja',
      email: 'genti.kraja@example.com',
      phone: '+355 68 345 6789',
      status: 'tenant',
      paymentStatus: 'current',
      moveInDate: '2022-11-15',
      familyMembers: 1,
    },
  ];
  
  useEffect(() => {
    // Simulate API call to fetch residents for this unit
    setLoading(true);
    setTimeout(() => {
      setResidents(mockResidents);
      setLoading(false);
    }, 1000);
  }, [unitId]);
  
  // Filter residents based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResidents(residents);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = residents.filter(
      resident =>
        resident.name.toLowerCase().includes(query) ||
        resident.email.toLowerCase().includes(query) ||
        resident.phone.includes(query)
    );
    
    setFilteredResidents(filtered);
  }, [residents, searchQuery]);
  
  const handleResidentPress = (residentId: string) => {
    navigation.navigate('ResidentDetails', { residentId });
  };
  
  const handleAddResident = () => {
    navigation.navigate('AddResident', { unitId });
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
            <View style={styles.statusContainer}>
              <Badge style={[styles.badge, { backgroundColor: getStatusColor(item.status) }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
              {item.paymentStatus === 'overdue' && (
                <Badge style={[styles.badge, { backgroundColor: getPaymentStatusColor(item.paymentStatus) }]}>
                  Payment Overdue
                </Badge>
              )}
            </View>
            <Text variant="bodySmall" style={styles.moveInDate}>
              Move-in: {new Date(item.moveInDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.contactContainer}>
          <Text variant="bodySmall">Email: {item.email}</Text>
          <Text variant="bodySmall">Phone: {item.phone}</Text>
          <Text variant="bodySmall">Family members: {item.familyMembers}</Text>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="text" 
          onPress={() => handleResidentPress(item.id)}
        >
          View Details
        </Button>
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
          ? 'Try different search terms' 
          : 'This unit has no assigned residents yet'}
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
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Header 
          title={`Unit ${unitNumber} Residents`}
          subtitle={buildingName}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16 }}>Loading residents...</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Header 
        title={`Unit ${unitNumber} Residents`}
        subtitle={buildingName}
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text variant="headlineSmall">{residents.length}</Text>
            <Text variant="bodySmall">Total</Text>
          </View>
          <View style={styles.stat}>
            <Text variant="headlineSmall">
              {residents.filter(r => r.status === 'owner').length}
            </Text>
            <Text variant="bodySmall">Owners</Text>
          </View>
          <View style={styles.stat}>
            <Text variant="headlineSmall">
              {residents.filter(r => r.status === 'tenant').length}
            </Text>
            <Text variant="bodySmall">Tenants</Text>
          </View>
          <View style={styles.stat}>
            <Text variant="headlineSmall">
              {residents.filter(r => r.paymentStatus === 'overdue').length}
            </Text>
            <Text variant="bodySmall">Overdue</Text>
          </View>
        </View>
        
        <Searchbar
          placeholder="Search residents..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <FlatList
          data={filteredResidents}
          renderItem={renderResidentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
      
      <Button
        mode="contained"
        icon={() => <Plus size={20} />}
        style={styles.fab}
        onPress={handleAddResident}
      >
        Add Resident
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 70, // Extra padding for FAB
  },
  residentCard: {
    marginBottom: 12,
    elevation: 2,
  },
  residentHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  residentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  badge: {
    marginRight: 8,
    marginBottom: 4,
  },
  moveInDate: {
    marginTop: 4,
    opacity: 0.7,
  },
  divider: {
    marginVertical: 12,
  },
  contactContainer: {
    gap: 4,
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 28,
  },
}); 