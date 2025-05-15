import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useTheme, Card, Text } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MasterDetailView } from '../../../components/MasterDetailView';
import { InfoPointsScreen } from './InfoPointsScreen';
import { AdministratorStackParamList } from '../../../navigation/types';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { Header } from '../../../components/Header';
import { InfoPoint } from '../../../types/infoPointTypes';
import { useAppSelector } from '../../../store/hooks';
import { selectInfoPoints } from '../../../store/slices/infoPointSlice';

type NavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;
type InfoPointsRouteProps = RouteProp<AdministratorStackParamList, 'InfoPoints'>;

/**
 * Responsive layout for InfoPoints that shows a master-detail view on tablets
 * and a standard stack navigation on phones
 */
export const InfoPointsTabletLayout = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<InfoPointsRouteProps>();
  const { isTablet, breakpoint } = useBreakpoint();
  const { commonStyles } = useThemedStyles();
  const infoPoints = useAppSelector(selectInfoPoints);
  
  // State to track the selected info point
  const [selectedInfoPointId, setSelectedInfoPointId] = useState<string | undefined>(undefined);
  const [selectedInfoPoint, setSelectedInfoPoint] = useState<InfoPoint | null>(null);
  
  // Update selectedInfoPoint when the ID changes
  useEffect(() => {
    if (selectedInfoPointId) {
      const foundInfoPoint = infoPoints.find(ip => ip.id === selectedInfoPointId);
      setSelectedInfoPoint(foundInfoPoint || null);
    } else {
      setSelectedInfoPoint(null);
    }
  }, [selectedInfoPointId, infoPoints]);
  
  // Custom handler for InfoPoints screen
  const handleInfoPointSelect = (infoPointId: string) => {
    setSelectedInfoPointId(infoPointId);
  };
  
  // Modified InfoPoints screen with custom selection handler
  const InfoPointsListWrapper = () => (
    <View style={{ flex: 1 }}>
      <InfoPointsScreen 
        hideHeader={isTablet}
        customSelectHandler={handleInfoPointSelect}
      />
    </View>
  );
  
  // InfoPoint details panel
  const InfoPointDetailsWrapper = () => (
    selectedInfoPoint ? (
      <View style={{ flex: 1, padding: 16 }}>
        <Card style={{ flex: 1 }}>
          <Card.Content style={{ flex: 1 }}>
            <Header 
              title={selectedInfoPoint.title}
              subtitle={selectedInfoPoint.category}
              centerTitle={true}
              showBack={!isTablet}
              onBackPress={() => setSelectedInfoPointId(undefined)}
            />
            
            <View style={{ marginTop: 20 }}>
              {selectedInfoPoint.buildingName && (
                <Text variant="bodyLarge" style={{ marginBottom: 8 }}>
                  Building: {selectedInfoPoint.buildingName}
                </Text>
              )}
              
              <Text variant="bodyMedium" style={{ marginTop: 16 }}>
                {selectedInfoPoint.content}
              </Text>
              
              <View style={{ marginTop: 24, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="bodySmall">
                  {selectedInfoPoint.pinned ? 'Pinned' : 'Not Pinned'}
                </Text>
                <Text variant="bodySmall">
                  {selectedInfoPoint.published ? 'Published' : 'Draft'}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>
    ) : (
      <View style={[commonStyles.centeredContainer, { padding: 20 }]}>
        <Header 
          title="Info Points"
          subtitle="Select an info point from the list"
          centerTitle={true}
          showBack={!isTablet}
        />
      </View>
    )
  );
  
  // Return different layouts based on device size
  if (isTablet) {
    // Use different ratios for portrait vs landscape on tablets
    const { width, height } = Dimensions.get('window');
    const isLandscape = width > height;
    const ratio = isLandscape ? 0.35 : 0.4; // Master takes less width in landscape
    
    return (
      <MasterDetailView
        masterContent={<InfoPointsListWrapper />}
        detailContent={<InfoPointDetailsWrapper />}
        ratio={ratio}
      />
    );
  }
  
  // On phones, just render the list
  return <InfoPointsListWrapper />;
}; 