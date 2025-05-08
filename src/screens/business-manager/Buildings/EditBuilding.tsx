import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BuildingForm, BuildingFormData } from '../../../components/BuildingForm';
import { Header } from '../../../components/Header';
import { SideMenu } from '../../../components/SideMenu';
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
  const [menuVisible, setMenuVisible] = useState(false);
  
  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const data = await buildingService.getBuildingById(buildingId);
        
        // Convert the building data to the form data format
        setBuilding({
          name: data.name,
          address: data.address,
          propertyType: data.propertyType,
          units: data.units,
          floors: data.units / 4, // Assuming 4 units per floor as an example
          totalArea: data.units * 85, // Assuming 85 square meters per unit as an example
          yearBuilt: data.yearBuilt,
          description: `${data.propertyType} building with ${data.units} units.`,
          hasParking: data.amenities.includes('Parking'),
          hasSecurity: data.amenities.includes('Security'),
        });
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
        propertyType: data.propertyType,
        units: data.units,
        yearBuilt: data.yearBuilt,
        amenities: [
          data.hasParking ? 'Parking' : null,
          data.hasSecurity ? 'Security' : null
        ].filter(Boolean) as string[]
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
          showMenu={true}
          onMenuPress={() => setMenuVisible(true)}
        />
        <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading building details...
          </Text>
        </View>
        <SideMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </>
    );
  }
  
  return (
    <>
      <Header 
        title="Edit Building" 
        showBack={true}
        showMenu={true}
        onMenuPress={() => setMenuVisible(true)}
      />
      
      <View 
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
        ]}
      >
        {building && (
          <BuildingForm 
            initialData={building}
            onSubmit={handleSubmit}
            isLoading={submitting}
          />
        )}
      </View>
      
      <SideMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
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
}); 