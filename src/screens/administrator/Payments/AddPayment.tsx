import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';

import { Header } from '../../../components/Header';
import { SideMenu } from '../../../components/SideMenu';
import { PaymentForm, PaymentFormData } from '../../../components/PaymentForm';
import { buildingService } from '../../../services/buildingService';
import { residentService } from '../../../services/residentService';
import { createPayment } from '../../../store/slices/paymentsSlice';
import { AdministratorStackParamList, Building, Resident } from '../../../navigation/types';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';

type Props = NativeStackScreenProps<AdministratorStackParamList, 'AddPayment'>;

export const AddPayment = ({ navigation }: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [buildingsData, residentsData] = await Promise.all([
        buildingService.getBuildings(),
        residentService.getResidents()
      ]);
      setBuildings(buildingsData);
      setResidents(residentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: PaymentFormData) => {
    setSubmitting(true);
    try {
      // Find the resident and building to get their names for display
      const resident = residents.find(r => r.id === data.residentId);
      const building = buildings.find(b => b.id === data.buildingId);
      
      if (!resident || !building) {
        throw new Error('Resident or building not found');
      }
      
      // Add resident and building names to the payment data
      const paymentData = {
        ...data,
        residentName: resident.name,
        buildingName: building.name,
        status: 'pending' as const
      };
      
      await dispatch(createPayment(paymentData));
      
      Alert.alert(
        'Success',
        'Payment created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Payments')
          }
        ]
      );
    } catch (error) {
      console.error('Error creating payment:', error);
      Alert.alert('Error', 'Failed to create payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header 
          title="Add Payment" 
          showBack={true}
          showMenu={true}
          onMenuPress={() => setMenuVisible(true)}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading...
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
        title="Add Payment" 
        showBack={true}
        showMenu={true}
        onMenuPress={() => setMenuVisible(true)}
      />
      
      <PaymentForm
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        buildings={buildings}
        residents={residents}
      />
      
      <SideMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
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