import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar, FAB } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserPlus, Plus } from 'lucide-react-native';
import { BusinessManagerStackParamList, Administrator } from '../../../navigation/types';
import { Header } from '../../../components/Header';
import { ListItem } from '../../../components/ListItem';
import { useAppSelector } from '../../../store/hooks';
import { commonStyles } from '../../../styles/commonStyles';

// Mock data for administrators (replace with actual service later)
const mockAdministrators: Administrator[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+355 69 123 4567',
    buildings: 3,
    buildingsList: ['Residence Plaza', 'Park Apartments', 'City View Residences'],
    role: 'Senior Administrator',
    hireDate: '2020-05-15',
    performance: 95,
    tenantSatisfaction: 92,
    issueResolutionTime: '24h',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'Sara Williams',
    email: 'sara.williams@example.com',
    phone: '+355 69 234 5678',
    buildings: 2,
    buildingsList: ['Lakeview Apartments', 'Mountain Residences'],
    role: 'Building Administrator',
    hireDate: '2021-02-10',
    performance: 88,
    tenantSatisfaction: 85,
    issueResolutionTime: '36h',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '3',
    name: 'Mark Davis',
    email: 'mark.davis@example.com',
    phone: '+355 69 345 6789',
    buildings: 1,
    buildingsList: ['Central Heights'],
    role: 'Junior Administrator',
    hireDate: '2022-08-22',
    performance: 78,
    tenantSatisfaction: 80,
    issueResolutionTime: '48h',
    image: 'https://randomuser.me/api/portraits/men/67.jpg'
  }
];

type Props = NativeStackScreenProps<BusinessManagerStackParamList, 'Administrators'>;

export const AdministratorsList = ({ navigation }: Props) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Administrator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setAdministrators(mockAdministrators);
      setFilteredAdmins(mockAdministrators);
      setLoading(false);
    }, 1000);
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = administrators.filter(
        admin => 
          admin.name.toLowerCase().includes(lowercasedQuery) || 
          admin.email.toLowerCase().includes(lowercasedQuery) ||
          admin.role.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredAdmins(filtered);
    } else {
      setFilteredAdmins(administrators);
    }
  }, [searchQuery, administrators]);
  
  const handleAdminPress = (adminId: string) => {
    navigation.navigate('AdministratorDetails', { adminId });
  };
  
  const renderAdminItem = ({ item }: { item: Administrator }) => (
    <ListItem
      title={item.name}
      subtitle={item.role}
      description={`${item.buildings} buildings • ${item.performance}% performance`}
      avatar={{
        uri: item.image,
      }}
      onPress={() => handleAdminPress(item.id)}
      badge={{
        text: item.buildings > 0 ? `${item.buildings} buildings` : 'No buildings',
        color: theme.colors.primary,
      }}
    />
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <UserPlus size={50} color={isDarkMode ? '#555' : '#ccc'} />
      <Text style={[styles.emptyText, { color: isDarkMode ? '#aaa' : '#888' }]}>
        No administrators found
      </Text>
      {searchQuery ? (
        <Text style={[styles.emptySubText, { color: isDarkMode ? '#888' : '#aaa' }]}>
          Try adjusting your search
        </Text>
      ) : (
        <TouchableOpacity 
          style={[styles.emptyButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => alert('Add administrator functionality will be implemented soon')}
        >
          <Plus size={16} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.emptyButtonText}>Add Administrator</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  if (loading) {
    return (
      <>
        <Header 
          title="Administrators" 
          showBack={false}
          showNotifications={false}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading administrators...
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Header 
        title="Administrators" 
        showBack={false}
        showNotifications={false}
      />
      
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search administrators..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={[styles.searchBar, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}
            iconColor={isDarkMode ? '#aaa' : '#666'}
            inputStyle={{ color: isDarkMode ? '#fff' : '#333' }}
            placeholderTextColor={isDarkMode ? '#666' : '#aaa'}
          />
        </View>
        
        <FlatList
          data={filteredAdmins}
          renderItem={renderAdminItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={
            filteredAdmins.length === 0
              ? { flex: 1, justifyContent: 'center' }
              : { paddingBottom: 80 }
          }
        />
      </View>
      
      <FAB
        icon={props => <Plus {...props} />}
        style={[commonStyles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => alert('Add administrator functionality will be implemented soon')}
        color="white"
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
    padding: 16,
  },
  searchBar: {
    borderRadius: 8,
    elevation: 2,
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
    textAlign: 'center',
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
}); 