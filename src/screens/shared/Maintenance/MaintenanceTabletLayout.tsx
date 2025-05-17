import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MasterDetailView } from '../../../components/MasterDetailView';
import { MaintenanceList } from './MaintenanceList';
import { MaintenanceDetails } from './MaintenanceDetails';
import { AdministratorStackParamList } from '../../../navigation/types';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { Header } from '../../../components/Header';

type NavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;
type MaintenanceRouteProps = RouteProp<AdministratorStackParamList, 'Maintenance'>;
type MaintenanceDetailsRouteProps = RouteProp<AdministratorStackParamList, 'MaintenanceDetails'>;

/**
 * Responsive layout for Maintenance section that shows a master-detail view on tablets
 * and a standard stack navigation on phones
 */
export const MaintenanceTabletLayout = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MaintenanceRouteProps | MaintenanceDetailsRouteProps>();
  const { isTablet } = useBreakpoint();
  const { commonStyles } = useThemedStyles();
  
  // Get the maintenance ID from the route params if we're on the details screen
  const maintenanceId = route.params?.maintenanceId ?? null;
  
  // State to track the selected maintenance request in the list
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState<string | null>(maintenanceId);
  
  // Update selectedMaintenanceId when navigation changes
  useEffect(() => {
    if (maintenanceId) {
      setSelectedMaintenanceId(maintenanceId);
    }
  }, [maintenanceId]);
  
  // Custom navigation for the maintenance list that updates the selected maintenance request
  const handleMaintenanceSelect = (id: string) => {
    setSelectedMaintenanceId(id);
    
    // Only navigate on non-tablet devices
    if (!isTablet) {
      navigation.navigate('MaintenanceDetails', { maintenanceId: id });
    }
  };
  
  // Wrap the MaintenanceList component with custom navigation
  const MaintenanceListWrapper = () => (
    <View style={{ flex: 1 }}>
      <MaintenanceList 
        navigation={navigation as any} 
        route={route as any}
        customSelectHandler={handleMaintenanceSelect}
        selectedMaintenanceId={selectedMaintenanceId}
      />
    </View>
  );
  
  // Conditionally render MaintenanceDetails only if we have a selected maintenance request
  const MaintenanceDetailsWrapper = () => (
    selectedMaintenanceId ? (
      <View style={{ flex: 1 }}>
        <MaintenanceDetails 
          route={{ params: { maintenanceId: selectedMaintenanceId }} as any}
          navigation={navigation as any}
          hideHeader={isTablet} 
        />
      </View>
    ) : (
      <View style={[commonStyles.centeredContainer, { padding: 20 }]}>
        <Header 
          title="Maintenance Details"
          subtitle="Select a maintenance request from the list"
          centerTitle={true}
        />
      </View>
    )
  );
  
  // Return different layouts based on device size
  if (isTablet) {
    return (
      <MasterDetailView
        masterContent={<MaintenanceListWrapper />}
        detailContent={<MaintenanceDetailsWrapper />}
        ratio={0.4} // Master takes 40% of the width
      />
    );
  }
  
  // On phones, just render the list
  return <MaintenanceListWrapper />;
}; 