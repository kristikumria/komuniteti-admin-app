import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Building } from '../../../../../navigation/types';
import { BuildingListItem } from '../BuildingListItem';
import { EmptyBuildingsList } from '../EmptyBuildingsList';
import { BuildingsHeader } from '../BuildingsHeader';
import { BusinessManagerStackParamList } from '../../../../../navigation/types';

// This could be moved to a separate service file
const MOCK_BUILDINGS: Building[] = [
  {
    id: 'b1',
    name: 'Riviera Towers',
    address: 'Rruga Kont Urani, Nr. 12, Tirana',
    units: 48,
    residents: 86,
    issues: 2,
    occupancyRate: 92,
    maintenanceCost: '€2,450',
    yearBuilt: 2019,
    propertyType: 'Residential',
    amenities: ['Pool', 'Gym', 'Parking'],
    image: 'https://example.com/riviera-towers.jpg',
    administratorId: 'admin1',
    businessAccountId: 'ba-1'
  },
  {
    id: 'b2',
    name: 'Park View Residence',
    address: 'Rruga Pjeter Bogdani, Nr. 15, Tirana',
    units: 32,
    residents: 64,
    issues: 1,
    occupancyRate: 88,
    maintenanceCost: '€1,800',
    yearBuilt: 2020,
    propertyType: 'Residential',
    amenities: ['Garden', 'Parking'],
    image: 'https://example.com/park-view.jpg',
    administratorId: 'admin2',
    businessAccountId: 'ba-1'
  },
  {
    id: 'b3',
    name: 'Central Plaza',
    address: 'Bulevardi Zogu I, Nr. 72, Tirana',
    units: 24,
    residents: 45,
    issues: 3,
    occupancyRate: 75,
    maintenanceCost: '€3,200',
    yearBuilt: 2018,
    propertyType: 'Mixed Use',
    amenities: ['Retail', 'Security', 'Parking'],
    image: 'https://example.com/central-plaza.jpg',
    administratorId: 'admin1',
    businessAccountId: 'ba-2'
  },
];

type BuildingsListNavigationProp = NativeStackNavigationProp<
  BusinessManagerStackParamList,
  'Buildings'
>;

interface BuildingsListProps {
  businessAccountId?: string;
  showHeader?: boolean;
}

export const BuildingsList: React.FC<BuildingsListProps> = ({ 
  businessAccountId,
  showHeader = true,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<BuildingsListNavigationProp>();
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Simulate API fetch with delay
    setLoading(true);
    setTimeout(() => {
      let data = [...MOCK_BUILDINGS];
      
      // Filter by business account if specified
      if (businessAccountId) {
        data = data.filter(building => building.businessAccountId === businessAccountId);
      }
      
      setBuildings(data);
      setFilteredBuildings(data);
      setLoading(false);
    }, 1000);
  }, [businessAccountId]);
  
  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = buildings.filter(
        building => 
          building.name.toLowerCase().includes(lowercasedQuery) ||
          building.address.toLowerCase().includes(lowercasedQuery) ||
          building.propertyType.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredBuildings(filtered);
    } else {
      setFilteredBuildings(buildings);
    }
  }, [buildings, searchQuery]);
  
  const handleBuildingPress = (buildingId: string) => {
    navigation.navigate('BuildingDetails', { buildingId });
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleAddBuilding = () => {
    navigation.navigate('AddBuilding');
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {showHeader && (
        <BuildingsHeader 
          title="Buildings"
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onAddPress={handleAddBuilding}
        />
      )}
      
      <FlatList
        data={filteredBuildings}
        renderItem={({ item }) => (
          <BuildingListItem
            building={item}
            onPress={() => handleBuildingPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyBuildingsList 
            onAddPress={handleAddBuilding}
            searchQuery={searchQuery}
          />
        }
      />
    </View>
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
  listContent: {
    padding: 16,
  },
}); 