import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, useTheme, IconButton, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { BuildingForm, BuildingFormData } from '../../../components/BuildingForm';
import { buildingService } from '../../../services/buildingService';
import { useAppSelector } from '../../../store/hooks';
import { BusinessManagerStackParamList } from '../../../navigation/types';
import { StatusBar } from 'expo-status-bar';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

type BuildingNavigationProps = NativeStackNavigationProp<BusinessManagerStackParamList>;

export const AddBuilding = () => {
  const theme = useTheme();
  const navigation = useNavigation<BuildingNavigationProps>();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  
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
          <Text variant="headlineMedium" style={styles.title}>Add Building</Text>
        </View>
        
        {loading && (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        )}
      </View>
      
      <View style={styles.formContainer}>
        <BuildingForm 
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </View>
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
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

      
