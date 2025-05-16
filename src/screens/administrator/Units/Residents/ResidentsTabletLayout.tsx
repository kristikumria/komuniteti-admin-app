import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MasterDetailView } from '../../../components/MasterDetailView';
import { ResidentsList } from './ResidentsList';
import { ResidentDetails } from './ResidentDetails';
import { AdministratorStackParamList } from '../../../navigation/types';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { Header } from '../../../components/Header';

type NavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;
type ResidentsRouteProps = RouteProp<AdministratorStackParamList, 'Residents'>;
type ResidentDetailsRouteProps = RouteProp<AdministratorStackParamList, 'ResidentDetails'>;

/**
 * Responsive layout for Residents section that shows a master-detail view on tablets
 * and a standard stack navigation on phones
 */
export const ResidentsTabletLayout = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResidentsRouteProps | ResidentDetailsRouteProps>();
  const { isTablet } = useBreakpoint();
  const { commonStyles } = useThemedStyles();
  
  // Get the resident ID from the route params if we're on the details screen
  const residentId = route.params?.residentId ?? null;
  
  // State to track the selected resident in the list
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(residentId);
  
  // Update selectedResidentId when navigation changes
  useEffect(() => {
    if (residentId) {
      setSelectedResidentId(residentId);
    }
  }, [residentId]);
  
  // Custom navigation for the residents list that updates the selected resident
  const handleResidentSelect = (id: string) => {
    setSelectedResidentId(id);
    
    // Only navigate on non-tablet devices
    if (!isTablet) {
      navigation.navigate('ResidentDetails', { residentId: id });
    }
  };
  
  // Wrap the ResidentsList component with custom navigation
  const ResidentsListWrapper = () => (
    <View style={{ flex: 1 }}>
      <ResidentsList 
        navigation={navigation as any} 
        route={route as any}
        customSelectHandler={handleResidentSelect}
        selectedResidentId={selectedResidentId}
      />
    </View>
  );
  
  // Conditionally render ResidentDetails only if we have a selected resident
  const ResidentDetailsWrapper = () => (
    selectedResidentId ? (
      <View style={{ flex: 1 }}>
        <ResidentDetails 
          residentId={selectedResidentId} 
          hideHeader={isTablet} 
        />
      </View>
    ) : (
      <View style={[commonStyles.centeredContainer, { padding: 20 }]}>
        <Header 
          title="Resident Details"
          subtitle="Select a resident from the list"
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
        masterContent={<ResidentsListWrapper />}
        detailContent={<ResidentDetailsWrapper />}
        ratio={0.35} // Master takes 35% of the width
      />
    );
  }
  
  // On phones, just render the list
  return <ResidentsListWrapper />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 