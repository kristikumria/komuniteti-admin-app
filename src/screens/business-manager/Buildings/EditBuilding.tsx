import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BuildingForm, BuildingFormData } from '../../../components/BuildingForm';
import { Header } from '../../../components/Header';
import { buildingService } from '../../../services/buildingService';
import { useAppSelector } from '../../../store/hooks';
import { BusinessManagerStackParamList } from '../../../navigation/types';

type EditBuildingRouteProp = RouteProp<BusinessManagerStackParamList, 'EditBuilding'>;

export const EditBuilding = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<EditBuildingRouteProp>();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  
  const { buildingId } = route.params;
  const [building, setBuilding] = useState<BuildingFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const data = await buildingService.getBuildingById(buildingId);
        
        if (data) {
          // Convert the building data to the form data format
          setBuilding({
            name: data.name,
            address: data.address,
            propertyType: data.propertyType || 'Residential', // Default value if not available
            units: data.units,
            floors: Math.ceil(data.units / 4), // Assuming 4 units per floor as an example
            totalArea: data.units * 85, // Assuming 85 square meters per unit as an example
            yearBuilt: data.buildYear || 2020, // Adapt to match available fields
            description: `${data.propertyType || 'Residential'} building with ${data.units} units.`,
            hasParking: data.propertyManager?.includes('Parking') || false,
            hasSecurity: data.propertyManager?.includes('Security') || false,
          });
        }
      } catch (error) {
        console.error('Error fetching building:', error);
        Alert.alert('Error', 'Failed to load building details.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    
    fetchBuilding();
  }, [buildingId, navigation]);
  
  const handleSubmit = async (data: BuildingFormData) => {
    setSubmitting(true);
    try {
      await buildingService.updateBuilding(buildingId, {
        name: data.name,
        address: data.address,
        // Add all necessary fields that match the Building type
        units: data.units,
        buildYear: data.yearBuilt,
        propertyManager: [
          data.hasParking ? 'Parking' : '',
          data.hasSecurity ? 'Security' : ''
        ].filter(Boolean).join(', ')
      });
      Alert.alert('Success', 'Building updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating building:', error);
      Alert.alert('Error', 'Failed to update building. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <>
        <Header 
          title="Edit Building" 
          showBack={true}
        />
        <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading building details...
          </Text>
        </View>
      </>
    );
  }
  
  return (
    <>
      <Header 
        title="Edit Building" 
        showBack={true}
      />
      <BuildingForm 
        initialData={building || undefined} 
        onSubmit={handleSubmit}
        isLoading={submitting}
      />
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
