import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuildingForm, BuildingFormData } from '../../../components/BuildingForm';
import { Header } from '../../../components/Header';
import { buildingService } from '../../../services/buildingService';
import { useAppSelector } from '../../../store/hooks';
import { BusinessManagerStackParamList } from '../../../navigation/types';

type BuildingNavigationProps = NativeStackNavigationProp<BusinessManagerStackParamList>;

export const AddBuilding = () => {
  const theme = useTheme();
  const navigation = useNavigation<BuildingNavigationProps>();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (data: BuildingFormData) => {
    setLoading(true);
    try {
      const buildingData = {
        ...data,
        city: 'Tirana',
        zipCode: '1001',
        country: 'Albania',
        floors: data.floors || 1,
        buildYear: data.yearBuilt || 2020,
        totalArea: data.totalArea || 0,
        propertyManager: [
          data.hasParking ? 'Parking' : '',
          data.hasSecurity ? 'Security' : ''
        ].filter(Boolean).join(', '),
        image: 'https://images.unsplash.com/photo-1665686310429-ee4d8b4c7cbc?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3' // Default image
      };
      
      await buildingService.createBuilding(buildingData);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating building:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Header 
        title="Add Building" 
        showBack={true}
      />
      
      <View 
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
        ]}
      >
        <BuildingForm 
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
});

      
