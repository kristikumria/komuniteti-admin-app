import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MasterDetailView } from '../../../components/MasterDetailView';
import { UnitsList } from './UnitsList';
import { UnitDetails } from './UnitDetails';
import { AdministratorStackParamList } from '../../../navigation/types';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { Header } from '../../../components/Header';

type NavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;
type UnitsRouteProps = RouteProp<AdministratorStackParamList, 'Units'>;
type UnitDetailsRouteProps = RouteProp<AdministratorStackParamList, 'UnitDetails'>;

/**
 * Responsive layout for Units section that shows a master-detail view on tablets
 * and a standard stack navigation on phones
 */
export const UnitsTabletLayout = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<UnitsRouteProps | UnitDetailsRouteProps>();
  const { isTablet } = useBreakpoint();
  const { commonStyles } = useThemedStyles();
  
  // Get the unit ID from the route params if we're on the details screen
  const unitId = route.params?.unitId ?? null;
  
  // State to track the selected unit in the list
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(unitId);
  
  // Update selectedUnitId when navigation changes
  useEffect(() => {
    if (unitId) {
      setSelectedUnitId(unitId);
    }
  }, [unitId]);
  
  // Custom navigation for the units list that updates the selected unit
  const handleUnitSelect = (id: string) => {
    setSelectedUnitId(id);
    
    // Only navigate on non-tablet devices
    if (!isTablet) {
      navigation.navigate('UnitDetails', { unitId: id });
    }
  };
  
  // Wrap the UnitsList component with custom navigation
  const UnitsListWrapper = () => (
    <View style={{ flex: 1 }}>
      <UnitsList 
        navigation={navigation as any} 
        route={route as any}
        customSelectHandler={handleUnitSelect}
        selectedUnitId={selectedUnitId}
      />
    </View>
  );
  
  // Conditionally render UnitDetails only if we have a selected unit
  const UnitDetailsWrapper = () => (
    selectedUnitId ? (
      <View style={{ flex: 1 }}>
        <UnitDetails 
          route={{ params: { unitId: selectedUnitId }} as any}
          navigation={navigation as any}
          hideHeader={isTablet} 
        />
      </View>
    ) : (
      <View style={[commonStyles.centeredContainer, { padding: 20 }]}>
        <Header 
          title="Unit Details"
          subtitle="Select a unit from the list"
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
        masterContent={<UnitsListWrapper />}
        detailContent={<UnitDetailsWrapper />}
        ratio={0.35} // Master takes 35% of the width
      />
    );
  }
  
  // On phones, just render the list
  return <UnitsListWrapper />;
}; 