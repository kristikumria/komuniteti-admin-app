import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { ResidentForm, ResidentFormData } from '../../../components/ResidentForm';
import { residentService } from '../../../services/residentService';
import { AdministratorStackParamList, Resident } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';

type EditResidentRouteProps = RouteProp<AdministratorStackParamList, 'EditResident'>;
type NavigationProp = NativeStackNavigationProp<AdministratorStackParamList, 'EditResident'>;

export const EditResident = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditResidentRouteProps>();
  const { residentId } = route.params;
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchResident();
  }, [residentId]);
  
  const fetchResident = async () => {
    try {
      const data = await residentService.getResidentById(residentId);
      setResident(data);
    } catch (error) {
      console.error(`Error fetching resident ${residentId}:`, error);
      Alert.alert('Error', 'Failed to load resident details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (data: ResidentFormData) => {
    if (!resident) return;
    
    setSubmitting(true);
    
    try {
      // Create an object with just the fields from the Resident type
      // to avoid type errors with accountBalance and lastPaymentDate
      const updateData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        unit: data.unit,
        status: data.status,
        familyMembers: data.familyMembers,
        moveInDate: data.moveInDate,
        // Preserve the building and payment status
        building: resident.building,
        paymentStatus: resident.paymentStatus,
        image: resident.image
      };
      
      await residentService.updateResident(residentId, updateData);
      
      Alert.alert(
        'Success',
        'Resident updated successfully',
        [
          {
            text: 'View Details',
            onPress: () => navigation.navigate('ResidentDetails', { residentId }),
          },
          {
            text: 'Back to List',
            onPress: () => navigation.navigate('Residents'),
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update resident');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <>
        <Header 
          title="Edit Resident" 
          showBack={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading resident details...
          </Text>
        </View>
      </>
    );
  }
  
  // Create a custom cancel handler to navigate back
  const handleCancel = () => {
    navigation.navigate('Residents');
  };
  
  return (
    <>
      <Header 
        title="Edit Resident" 
        showBack={true}
      />
      {resident && (
        <ResidentForm
          initialData={{
            name: resident.name,
            email: resident.email,
            phone: resident.phone,
            unit: resident.unit,
            status: resident.status,
            familyMembers: resident.familyMembers,
            moveInDate: resident.moveInDate,
            pets: '', // Add default values for fields not in the Resident type
            communicationPreference: 'email'
          }}
          onSubmit={handleSubmit}
          isLoading={submitting}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
