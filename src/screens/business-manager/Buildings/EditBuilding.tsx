import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, useTheme, IconButton, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { BuildingForm, BuildingFormData } from '../../../components/BuildingForm';
import { buildingService } from '../../../services/buildingService';
import { useAppSelector } from '../../../store/hooks';
import { BusinessManagerStackParamList } from '../../../navigation/types';
import { StatusBar } from 'expo-status-bar';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

type EditBuildingRouteProp = RouteProp<BusinessManagerStackParamList, 'EditBuilding'>;

export const EditBuilding = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<EditBuildingRouteProp>();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  
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
            floors: data.floors || Math.ceil(data.units / 4), // Use floors data or estimate
            totalArea: data.floorArea || data.totalArea || (data.units * 85), // Use existing data or estimate
            yearBuilt: data.buildYear || 2020, // Adapt to match available fields
            description: data.description || `${data.propertyType || 'Residential'} building with ${data.units} units.`,
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
        propertyType: data.propertyType,
        units: data.units,
        floors: data.floors,
        totalArea: data.totalArea,
        buildYear: data.yearBuilt,
        description: data.description,
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
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon={(props) => <ArrowLeft {...props} />}
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text variant="headlineMedium" style={styles.title}>Edit Building</Text>
        </View>
        
        {submitting && (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        )}
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
            Loading building details...
          </Text>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <BuildingForm 
            initialData={building || undefined} 
            onSubmit={handleSubmit}
            isLoading={submitting}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    margin: 0,
    marginRight: 8,
  },
  title: {
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
