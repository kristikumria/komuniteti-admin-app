import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AdministratorStackParamList } from '../../../navigation/types';

type ResidentDetailsNavigationProp = NativeStackNavigationProp<
  AdministratorStackParamList,
  'ResidentDetails'
>;

type ResidentDetailsRouteProp = RouteProp<
  AdministratorStackParamList,
  'ResidentDetails'
>;

// Sample resident data - in a real app, this would come from an API or state management
const sampleResidentData = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  unitId: 'A101',
  address: '123 Main Street, Apt 101',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  moveInDate: '2022-01-15',
  leaseEndDate: '2023-01-14',
  emergencyContact: 'Jane Doe',
  emergencyContactPhone: '+0987654321',
  notes: 'Resident has a pet cat named Whiskers',
};

export const ResidentDetails = () => {
  const theme = useTheme();
  const navigation = useNavigation<ResidentDetailsNavigationProp>();
  const route = useRoute<ResidentDetailsRouteProp>();
  const { residentId } = route.params;
  
  // In a real app, fetch resident data based on residentId
  const resident = sampleResidentData;

  const handleEditResident = () => {
    navigation.navigate('EditResident', { residentId });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button icon="arrow-left" onPress={handleGoBack}>
          Back
        </Button>
        <Text variant="headlineMedium">Resident Details</Text>
        <Button mode="contained" onPress={handleEditResident}>
          Edit
        </Button>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.section}>
              <Text variant="titleLarge">{`${resident.firstName} ${resident.lastName}`}</Text>
              <Divider style={styles.divider} />
            </View>
            
            <View style={styles.section}>
              <Text variant="titleMedium">Contact Information</Text>
              <Text variant="bodyMedium">{`Email: ${resident.email}`}</Text>
              <Text variant="bodyMedium">{`Phone: ${resident.phone}`}</Text>
              <Divider style={styles.divider} />
            </View>
            
            <View style={styles.section}>
              <Text variant="titleMedium">Residence Information</Text>
              <Text variant="bodyMedium">{`Unit ID: ${resident.unitId}`}</Text>
              <Text variant="bodyMedium">{`Address: ${resident.address}`}</Text>
              <Text variant="bodyMedium">{`City: ${resident.city}`}</Text>
              <Text variant="bodyMedium">{`State: ${resident.state}`}</Text>
              <Text variant="bodyMedium">{`Zip Code: ${resident.zipCode}`}</Text>
              <Divider style={styles.divider} />
            </View>
            
            <View style={styles.section}>
              <Text variant="titleMedium">Lease Information</Text>
              <Text variant="bodyMedium">{`Move-in Date: ${resident.moveInDate}`}</Text>
              <Text variant="bodyMedium">{`Lease End Date: ${resident.leaseEndDate}`}</Text>
              <Divider style={styles.divider} />
            </View>
            
            <View style={styles.section}>
              <Text variant="titleMedium">Emergency Contact</Text>
              <Text variant="bodyMedium">{`Name: ${resident.emergencyContact}`}</Text>
              <Text variant="bodyMedium">{`Phone: ${resident.emergencyContactPhone}`}</Text>
              <Divider style={styles.divider} />
            </View>
            
            <View style={styles.section}>
              <Text variant="titleMedium">Notes</Text>
              <Text variant="bodyMedium">{resident.notes}</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  section: {
    marginBottom: 16,
  },
  divider: {
    marginTop: 8,
    marginBottom: 8,
  },
}); 