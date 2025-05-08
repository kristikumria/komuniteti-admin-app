import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BuildingForm, BuildingFormData } from '../../../components/BuildingForm';
import { Header } from '../../../components/Header';
import { SideMenu } from '../../../components/SideMenu';
import { buildingService } from '../../../services/buildingService';
import { useAppSelector } from '../../../store/hooks';
import { BusinessManagerStackParamList } from '../../../navigation/types';

type BuildingNavigationProps = NativeStackNavigationProp<BusinessManagerStackParamList>;

export const AddBuilding = () => {
  const theme = useTheme();
  const navigation = useNavigation<BuildingNavigationProps>();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  
  const handleSubmit = async (data: BuildingFormData) => {
    setLoading(true);
    try {
      await buildingService.createBuilding({
        ...data,
        residents: 0,
        issues: 0,
        occupancyRate: 0,
        maintenanceCost: '€0',
        amenities: [
          data.hasParking ? 'Parking' : null,
          data.hasSecurity ? 'Security' : null
        ].filter(Boolean) as string[],
        image: 'https://images.unsplash.com/photo-1665686310429-ee4d8b4c7cbc?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3' // Default image
      });
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
        showMenu={true}
        onMenuPress={() => setMenuVisible(true)}
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
}); 