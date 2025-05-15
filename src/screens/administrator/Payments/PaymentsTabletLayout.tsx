import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MasterDetailView } from '../../../components/MasterDetailView';
import { PaymentsList } from './PaymentsList';
import { PaymentDetails } from './PaymentDetails';
import { AdministratorStackParamList } from '../../../navigation/types';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { Header } from '../../../components/Header';

type NavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;
type PaymentsRouteProps = RouteProp<AdministratorStackParamList, 'Payments'>;
type PaymentDetailsRouteProps = RouteProp<AdministratorStackParamList, 'PaymentDetails'>;

/**
 * Responsive layout for Payments section that shows a master-detail view on tablets
 * and a standard stack navigation on phones
 */
export const PaymentsTabletLayout = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PaymentsRouteProps | PaymentDetailsRouteProps>();
  const { isTablet } = useBreakpoint();
  const { commonStyles } = useThemedStyles();
  
  // Get the payment ID from the route params if we're on the details screen
  const paymentId = route.params?.paymentId ?? null;
  
  // State to track the selected payment in the list
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(paymentId);
  
  // Update selectedPaymentId when navigation changes
  useEffect(() => {
    if (paymentId) {
      setSelectedPaymentId(paymentId);
    }
  }, [paymentId]);
  
  // Custom navigation for the payments list that updates the selected payment
  const handlePaymentSelect = (id: string) => {
    setSelectedPaymentId(id);
    
    // Only navigate on non-tablet devices
    if (!isTablet) {
      navigation.navigate('PaymentDetails', { paymentId: id });
    }
  };
  
  // Wrap the PaymentsList component with custom navigation
  const PaymentsListWrapper = () => (
    <View style={{ flex: 1 }}>
      <PaymentsList 
        navigation={navigation as any} 
        route={route as any}
        customSelectHandler={handlePaymentSelect}
        selectedPaymentId={selectedPaymentId}
      />
    </View>
  );
  
  // Conditionally render PaymentDetails only if we have a selected payment
  const PaymentDetailsWrapper = () => (
    selectedPaymentId ? (
      <View style={{ flex: 1 }}>
        <PaymentDetails 
          route={{ params: { paymentId: selectedPaymentId }} as any}
          navigation={navigation as any}
          hideHeader={isTablet} 
        />
      </View>
    ) : (
      <View style={[commonStyles.centeredContainer, { padding: 20 }]}>
        <Header 
          title="Payment Details"
          subtitle="Select a payment from the list"
          centerTitle={true}
          showBack={!isTablet}
        />
      </View>
    )
  );
  
  // Return different layouts based on device size
  if (isTablet) {
    return (
      <MasterDetailView
        masterContent={<PaymentsListWrapper />}
        detailContent={<PaymentDetailsWrapper />}
        ratio={0.35} // Master takes 35% of the width
      />
    );
  }
  
  // On phones, just render the list
  return <PaymentsListWrapper />;
}; 