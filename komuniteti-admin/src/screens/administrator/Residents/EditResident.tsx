import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { SideMenu } from '../../../components/SideMenu';
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
  const [menuVisible, setMenuVisible] = useState(false);
  
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
      const updatedResident = await residentService.updateResident(residentId, {
        ...data,
        // Preserve fields not in the form
        building: resident.building,
        paymentStatus: resident.paymentStatus,
        accountBalance: resident.accountBalance,
        lastPaymentDate: resident.lastPaymentDate,
        image: resident.image
      });
      
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
          showMenu={true}
          onMenuPress={() => setMenuVisible(true)}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading resident details...
          </Text>
        </View>
        <SideMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </>
    );
  }
  
  if (!resident) {
    return (
      <>
        <Header 
          title="Edit Resident" 
          showBack={true}
          showMenu={true}
          onMenuPress={() => setMenuVisible(true)}
        />
        <View style={styles.loadingContainer}>
          <Text style={{ color: isDarkMode ? '#fff' : '#333' }}>
            Resident not found
          </Text>
        </View>
        <SideMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </>
    );
  }
  
  const initialFormData: ResidentFormData = {
    name: resident.name,
    email: resident.email,
    phone: resident.phone,
    unit: resident.unit,
    status: resident.status,
    moveInDate: resident.moveInDate,
    familyMembers: resident.familyMembers,
    pets: resident.pets,
    communicationPreference: resident.communicationPreference,
  };
  
  return (
    <>
      <Header 
        title={`Edit: ${resident.name}`} 
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
        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? '#aaa' : '#666' }
          ]}
        >
          Update resident information
        </Text>
        
        <ResidentForm
          initialData={initialFormData}
          onSubmit={handleSubmit}
          isLoading={submitting}
          buildingName={resident.building}
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
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
}); 