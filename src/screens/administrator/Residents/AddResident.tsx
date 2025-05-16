import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Text, 
  Button, 
  TextInput, 
  useTheme, 
  Divider,
  Snackbar
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdministratorStackParamList } from '../../../navigation/types';

type AddResidentNavigationProp = NativeStackNavigationProp<
  AdministratorStackParamList,
  'AddResident'
>;

export const AddResident = () => {
  const theme = useTheme();
  const navigation = useNavigation<AddResidentNavigationProp>();
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [unitId, setUnitId] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  // Validation and UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = () => {
    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !unitId) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarVisible(true);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSnackbarMessage('Please enter a valid email address');
      setSnackbarVisible(true);
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would be an API call to create the resident
    setTimeout(() => {
      setIsSubmitting(false);
      setSnackbarMessage('Resident added successfully');
      setSnackbarVisible(true);
      
      // Navigate back to the residents list after a short delay
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }, 1000);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button icon="arrow-left" onPress={handleCancel}>
          Back
        </Button>
        <Text variant="headlineMedium">Add New Resident</Text>
        <View style={{ width: 80 }} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.formSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Personal Information</Text>
          <TextInput
            label="First Name *"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Last Name *"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            mode="outlined"
          />
          <Divider style={styles.divider} />
        </View>
        
        <View style={styles.formSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Contact Information</Text>
          <TextInput
            label="Email *"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
          />
          <TextInput
            label="Phone Number *"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />
          <Divider style={styles.divider} />
        </View>
        
        <View style={styles.formSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Residence Information</Text>
          <TextInput
            label="Unit ID *"
            value={unitId}
            onChangeText={setUnitId}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="City"
            value={city}
            onChangeText={setCity}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="State"
            value={state}
            onChangeText={setState}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Zip Code"
            value={zipCode}
            onChangeText={setZipCode}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />
          <Divider style={styles.divider} />
        </View>
        
        <View style={styles.formSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Lease Information</Text>
          <TextInput
            label="Move-in Date"
            value={moveInDate}
            onChangeText={setMoveInDate}
            style={styles.input}
            mode="outlined"
            placeholder="YYYY-MM-DD"
          />
          <TextInput
            label="Lease End Date"
            value={leaseEndDate}
            onChangeText={setLeaseEndDate}
            style={styles.input}
            mode="outlined"
            placeholder="YYYY-MM-DD"
          />
          <Divider style={styles.divider} />
        </View>
        
        <View style={styles.formSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Emergency Contact</Text>
          <TextInput
            label="Emergency Contact Name"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Emergency Contact Phone"
            value={emergencyContactPhone}
            onChangeText={setEmergencyContactPhone}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />
          <Divider style={styles.divider} />
        </View>
        
        <View style={styles.formSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Additional Information</Text>
          <TextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={4}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={handleCancel} 
            style={styles.button}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSubmit} 
            style={styles.button}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Save Resident
          </Button>
        </View>
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
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
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  divider: {
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  button: {
    width: '48%',
  },
}); 