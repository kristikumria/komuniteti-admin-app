import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, Searchbar, useTheme, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdministratorStackParamList } from '../../../navigation/types';

type ResidentsListNavigationProp = NativeStackNavigationProp<
  AdministratorStackParamList,
  'Residents'
>;

// Sample resident data for initial rendering
const sampleResidents = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    unitId: 'A101',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+0987654321',
    unitId: 'B202',
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    phone: '+1122334455',
    unitId: 'C303',
  },
];

export const ResidentsList = () => {
  const theme = useTheme();
  const navigation = useNavigation<ResidentsListNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [residents, setResidents] = useState(sampleResidents);
  const [filteredResidents, setFilteredResidents] = useState(sampleResidents);

  useEffect(() => {
    // Filter residents based on search query
    const filtered = residents.filter(
      (resident) =>
        resident.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resident.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resident.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resident.unitId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResidents(filtered);
  }, [searchQuery, residents]);

  const handleAddResident = () => {
    navigation.navigate('AddResident');
  };

  const handleResidentPress = (residentId: string) => {
    navigation.navigate('ResidentDetails', { residentId });
  };

  const renderResidentItem = ({ item }: { item: typeof sampleResidents[0] }) => (
    <Card
      style={styles.card}
      onPress={() => handleResidentPress(item.id)}
    >
      <Card.Content>
        <Text variant="titleMedium">{`${item.firstName} ${item.lastName}`}</Text>
        <Text variant="bodyMedium">{`Email: ${item.email}`}</Text>
        <Text variant="bodyMedium">{`Phone: ${item.phone}`}</Text>
        <Text variant="bodyMedium">{`Unit: ${item.unitId}`}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Residents</Text>
        <Button mode="contained" onPress={handleAddResident}>
          Add Resident
        </Button>
      </View>
      <Searchbar
        placeholder="Search residents..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <Divider style={styles.divider} />
      <FlatList
        data={filteredResidents}
        keyExtractor={(item) => item.id}
        renderItem={renderResidentItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  listContent: {
    paddingBottom: 16,
  },
  divider: {
    marginBottom: 16,
  },
}); 