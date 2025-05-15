import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Divider, Button, Searchbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useContextData } from '../../../hooks/useContextData';
import { ContextScreenWrapper } from '../../../components/ContextScreenWrapper';

// Define Resident type
interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  unit: string;
  buildingId: string;
  status: 'owner' | 'tenant';
  balance: number;
}

// Mock resident data
const mockResidents: Resident[] = [
  {
    id: 'r1',
    firstName: 'Ana',
    lastName: 'Koci',
    email: 'ana.koci@example.com',
    phone: '+355 69 123 4567',
    unit: '2A',
    buildingId: 'b1',
    status: 'owner',
    balance: 0,
  },
  {
    id: 'r2',
    firstName: 'Besnik',
    lastName: 'Hoxha',
    email: 'besnik.hoxha@example.com',
    phone: '+355 67 234 5678',
    unit: '3B',
    buildingId: 'b1',
    status: 'tenant',
    balance: 150,
  },
  {
    id: 'r3',
    firstName: 'Drita',
    lastName: 'Prifti',
    email: 'drita.prifti@example.com',
    phone: '+355 68 345 6789',
    unit: '5C',
    buildingId: 'b2',
    status: 'owner',
    balance: 50,
  },
  {
    id: 'r4',
    firstName: 'Flamur',
    lastName: 'Gashi',
    email: 'flamur.gashi@example.com',
    phone: '+355 69 456 7890',
    unit: '1A',
    buildingId: 'b2',
    status: 'tenant',
    balance: 0,
  },
  {
    id: 'r5',
    firstName: 'Klodian',
    lastName: 'Metaj',
    email: 'klodian.metaj@example.com',
    phone: '+355 67 567 8901',
    unit: '4B',
    buildingId: 'b3',
    status: 'owner',
    balance: 200,
  },
  {
    id: 'r6',
    firstName: 'Linda',
    lastName: 'Sejdiu',
    email: 'linda.sejdiu@example.com',
    phone: '+355 68 678 9012',
    unit: '7A',
    buildingId: 'b3',
    status: 'tenant',
    balance: 100,
  },
];

export const ResidentsList = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { userRole, currentBuilding } = useContextData();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [buildingFilter, setBuildingFilter] = useState<string | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  
  // Load residents data based on context and filters
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredResidents = [...mockResidents];
      
      // For administrators, only show residents from their building
      if (userRole === 'administrator' && currentBuilding) {
        filteredResidents = filteredResidents.filter(
          resident => resident.buildingId === currentBuilding.id
        );
      } 
      // For business managers with a building filter
      else if (userRole === 'business_manager' && buildingFilter) {
        filteredResidents = filteredResidents.filter(
          resident => resident.buildingId === buildingFilter
        );
      }
      
      // Apply search filter if any
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredResidents = filteredResidents.filter(
          resident => 
            resident.firstName.toLowerCase().includes(query) ||
            resident.lastName.toLowerCase().includes(query) ||
            resident.unit.toLowerCase().includes(query) ||
            resident.email.toLowerCase().includes(query)
        );
      }
      
      setResidents(filteredResidents);
      setLoading(false);
    }, 1000);
  }, [userRole, currentBuilding, buildingFilter, searchQuery]);
  
  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    // Reload data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  // Handle building filter change
  const handleFilterChange = (buildingId: string | null) => {
    setBuildingFilter(buildingId);
  };
  
  // Render resident item
  const renderResidentItem = ({ item }: { item: Resident }) => (
    <Card style={styles.residentCard} mode="outlined">
      <Card.Content>
        <View style={styles.residentHeader}>
          <Avatar.Text
            size={50}
            label={`${item.firstName.charAt(0)}${item.lastName.charAt(0)}`}
            color={theme.colors.onPrimary}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={styles.residentInfo}>
            <Text variant="titleMedium">{`${item.firstName} ${item.lastName}`}</Text>
            <Text variant="bodySmall">{`Unit ${item.unit} • ${item.status === 'owner' ? 'Owner' : 'Tenant'}`}</Text>
            <Text variant="bodySmall">{item.email}</Text>
          </View>
          <View style={styles.balanceContainer}>
            <Text variant="labelSmall">Balance</Text>
            <Text 
              variant="titleMedium" 
              style={item.balance > 0 ? styles.debt : styles.noDept}
            >
              €{item.balance}
            </Text>
          </View>
        </View>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('ResidentDetails', { id: item.id })}
        >
          View Details
        </Button>
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('EditResident', { id: item.id })}
        >
          Edit
        </Button>
        {item.balance > 0 && (
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('ProcessPayment', { residentId: item.id })}
          >
            Process Payment
          </Button>
        )}
      </Card.Actions>
    </Card>
  );
  
  return (
    <ContextScreenWrapper
      title="Residents"
      refreshing={refreshing}
      onRefresh={handleRefresh}
      isLoading={loading}
      showFilter={userRole === 'business_manager'}
      onFilterChange={handleFilterChange}
      initialFilter={buildingFilter}
      filterLabel="Filter by building:"
      disableScrollView={true}
    >
      <Searchbar
        placeholder="Search residents..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text variant="labelMedium">Total</Text>
          <Text variant="headlineSmall">{residents.length}</Text>
        </View>
        <View style={styles.stat}>
          <Text variant="labelMedium">Owners</Text>
          <Text variant="headlineSmall">
            {residents.filter(r => r.status === 'owner').length}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text variant="labelMedium">Tenants</Text>
          <Text variant="headlineSmall">
            {residents.filter(r => r.status === 'tenant').length}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text variant="labelMedium">With Debt</Text>
          <Text variant="headlineSmall">
            {residents.filter(r => r.balance > 0).length}
          </Text>
        </View>
      </View>
      
      <FlatList
        data={residents}
        renderItem={renderResidentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {!loading && <Text>No residents found</Text>}
          </View>
        }
      />
      
      <Button
        mode="contained"
        style={styles.addButton}
        onPress={() => navigation.navigate('AddResident')}
      >
        Add New Resident
      </Button>
    </ContextScreenWrapper>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    padding: 8,
  },
  listContent: {
    paddingBottom: 80,
  },
  residentCard: {
    marginVertical: 4,
  },
  residentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  residentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  debt: {
    color: '#e53935',
  },
  noDept: {
    color: '#43a047',
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 28,
  },
}); 