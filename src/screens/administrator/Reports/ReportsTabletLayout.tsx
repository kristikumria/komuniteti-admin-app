import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MasterDetailView } from '../../../components/MasterDetailView';
import { ReportsList } from './ReportsList';
import { ReportDetails } from './ReportDetails';
import { AdministratorStackParamList } from '../../../navigation/types';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { Header } from '../../../components/Header';

type NavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;
type ReportsRouteProps = RouteProp<AdministratorStackParamList, 'Reports'>;
type ReportDetailsRouteProps = RouteProp<AdministratorStackParamList, 'ReportDetails'>;

/**
 * Responsive layout for Reports section that shows a master-detail view on tablets
 * and a standard stack navigation on phones
 */
export const ReportsTabletLayout = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ReportsRouteProps | ReportDetailsRouteProps>();
  const { isTablet } = useBreakpoint();
  const { commonStyles } = useThemedStyles();
  
  // Get the report ID from the route params if we're on the details screen
  const reportId = route.params?.reportId ?? null;
  
  // State to track the selected report in the list
  const [selectedReportId, setSelectedReportId] = useState<string | null>(reportId);
  
  // Update selectedReportId when navigation changes
  useEffect(() => {
    if (reportId) {
      setSelectedReportId(reportId);
    }
  }, [reportId]);
  
  // Custom navigation for the reports list that updates the selected report
  const handleReportSelect = (id: string) => {
    setSelectedReportId(id);
    
    // Only navigate on non-tablet devices
    if (!isTablet) {
      navigation.navigate('ReportDetails', { reportId: id });
    }
  };
  
  // Wrap the ReportsList component with custom navigation
  const ReportsListWrapper = () => (
    <View style={{ flex: 1 }}>
      <ReportsList 
        navigation={navigation as any} 
        route={route as any}
        customSelectHandler={handleReportSelect}
        selectedReportId={selectedReportId}
      />
    </View>
  );
  
  // Conditionally render ReportDetails only if we have a selected report
  const ReportDetailsWrapper = () => (
    selectedReportId ? (
      <View style={{ flex: 1 }}>
        <ReportDetails 
          route={{ params: { reportId: selectedReportId }} as any}
          navigation={navigation as any}
          hideHeader={isTablet} 
        />
      </View>
    ) : (
      <View style={[commonStyles.centeredContainer, { padding: 20 }]}>
        <Header 
          title="Report Details"
          subtitle="Select a report from the list"
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
        masterContent={<ReportsListWrapper />}
        detailContent={<ReportDetailsWrapper />}
        ratio={0.4} // Master takes 40% of the width
      />
    );
  }
  
  // On phones, just render the list
  return <ReportsListWrapper />;
}; 