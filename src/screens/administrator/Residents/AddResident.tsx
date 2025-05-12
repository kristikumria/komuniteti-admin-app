import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { ResidentForm, ResidentFormData } from '../../../components/ResidentForm';
import { residentService } from '../../../services/residentService';
import { AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';

type NavigationProp = NativeStackNavigationProp<AdministratorStackParamList, 'AddResident'>;

export const AddResident = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (data: ResidentFormData) => {
    setLoading(true);
    
    try {
      const newResident = await residentService.createResident({
        ...data,
        building: 'Not specified', // This would be replaced with actual building selection
        paymentStatus: 'current',
        image: 'https://randomuser.me/api/portraits/lego/1.jpg' // Default image
      });
      
      Alert.alert(
        'Success',
        'Resident added successfully',
        [
          {
            text: 'View Details',
            onPress: () => navigation.replace('ResidentDetails', { residentId: newResident.id }),
          },
          {
            text: 'Back to List',
            onPress: () => navigation.goBack(),
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add resident');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Header 
        title="Add New Resident" 
        showBack={true}
      />
      
      <View 
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
        ]}
      >
        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}
        >
          Enter the details for the new resident
        </Text>
        
        <ResidentForm
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
});

      
