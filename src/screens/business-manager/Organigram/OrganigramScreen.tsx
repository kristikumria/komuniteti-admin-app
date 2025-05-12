import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Card, ActivityIndicator, useTheme, Button, FAB, Portal, Dialog, RadioButton, Divider, IconButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessManagerStackParamList, Building } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import OrgChart from '../../../components/Organigram/OrgChart';
import { Header } from '../../../components/Header';
import { ZoomIn, ZoomOut, Share, Download, RefreshCw } from 'lucide-react-native';

type Props = NativeStackScreenProps<BusinessManagerStackParamList, 'Organigram'>;

interface OrgNode {
  id: string;
  name: string;
  role: string;
  image?: string;
  children?: OrgNode[];
}

export const OrganigramScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState<OrgNode | null>(null);
  const [scale, setScale] = useState(1);
  const [viewMode, setViewMode] = useState<'hierarchy' | 'buildings'>('hierarchy');
  const [viewOptionsVisible, setViewOptionsVisible] = useState(false);
  const { buildings } = useAppSelector(state => state.buildings);
  const { administrators } = useAppSelector(state => state.administrators);
  const { user } = useAppSelector(state => state.auth);
  const isDarkMode = useAppSelector(state => state.settings.darkMode);

  useEffect(() => {
    generateOrgChart();
  }, [administrators, buildings, user, viewMode]);

  // Create organization chart data structure
  const generateOrgChart = () => {
    setLoading(true);
    
    // In a real implementation, this would be fetched from the API
    // For now, we'll create a mock structure based on the buildings and administrators
    
    // Root node is the business manager
    const rootNode: OrgNode = {
      id: user?.id || 'bm1',
      name: user?.name || 'Business Manager',
      role: 'Business Manager',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      children: []
    };

    // Different view modes
    if (viewMode === 'hierarchy') {
      // Hierarchical view: Business Manager -> Administrators -> Buildings
      administrators.forEach(admin => {
        const adminNode: OrgNode = {
          id: admin.id,
          name: admin.name,
          role: 'Administrator',
          image: admin.profileImage || 'https://randomuser.me/api/portraits/men/41.jpg',
          children: []
        };
        
        // Add buildings for each administrator
        const adminBuildings = buildings.filter(b => {
          return 'administratorId' in b && b.administratorId === admin.id;
        });
        
        adminBuildings.forEach(building => {
          adminNode.children?.push({
            id: building.id,
            name: building.name,
            role: 'Building',
            image: building.image,
            children: []
          });
        });
        
        rootNode.children?.push(adminNode);
      });
    } else {
      // Buildings-focused view: Group by building type or area
      const buildingsByType: { [key: string]: Building[] } = {};
      
      // Group buildings by type (mock data - in real app this would be by actual building type or area)
      buildings.forEach(building => {
        const type = 'administratorId' in building ? 'Managed' : 'Unassigned';
        if (!buildingsByType[type]) {
          buildingsByType[type] = [];
        }
        buildingsByType[type].push(building as any); // Type cast to avoid type errors
      });
      
      // Add building types as first level, then buildings under each type
      Object.keys(buildingsByType).forEach(type => {
        const typeNode: OrgNode = {
          id: `type-${type}`,
          name: type,
          role: 'Building Type',
          children: []
        };
        
        buildingsByType[type].forEach(building => {
          // Find the administrator for this building
          const admin = administrators.find(a => 'administratorId' in building && building.administratorId === a.id);
          
          typeNode.children?.push({
            id: building.id,
            name: building.name,
            role: 'Building',
            image: building.image,
            children: admin ? [{
              id: admin.id,
              name: admin.name,
              role: 'Administrator',
              image: admin.profileImage || 'https://randomuser.me/api/portraits/men/41.jpg',
            }] : []
          });
        });
        
        rootNode.children?.push(typeNode);
      });
    }
    
    // Wait a short time to simulate loading
    setTimeout(() => {
      setOrganizationData(rootNode);
      setLoading(false);
    }, 1000);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.6));
  };

  const handleChangeViewMode = (newMode: 'hierarchy' | 'buildings') => {
    setViewMode(newMode);
    setViewOptionsVisible(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={[styles.centered, { flex: 1 }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#ccc' : '#666' }}>
            Building organization chart...
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Card style={[styles.viewModeCard, { backgroundColor: isDarkMode ? '#333' : '#f8f8f8' }]}>
          <View style={styles.viewModeContainer}>
            <Text style={{ color: isDarkMode ? '#ccc' : '#666', marginRight: 8 }}>View Mode:</Text>
            <Button 
              mode="outlined" 
              onPress={() => setViewOptionsVisible(true)}
              style={{ borderColor: theme.colors.primary }}
            >
              {viewMode === 'hierarchy' ? 'Hierarchical View' : 'Building-Focused View'}
            </Button>
          </View>
        </Card>
        
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={[styles.zoomButton, { backgroundColor: isDarkMode ? '#333' : 'white' }]}
            onPress={handleZoomOut}
          >
            <ZoomOut size={24} color={theme.colors.primary} />
          </TouchableOpacity>

          <Text style={{ marginHorizontal: 8, color: isDarkMode ? '#ccc' : '#666' }}>
            {Math.round(scale * 100)}%
          </Text>

          <TouchableOpacity
            style={[styles.zoomButton, { backgroundColor: isDarkMode ? '#333' : 'white' }]}
            onPress={handleZoomIn}
          >
            <ZoomIn size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { transform: [{ scale }] }
          ]}
        >
          <ScrollView>
            {organizationData ? (
              <OrgChart node={organizationData} />
            ) : (
              <View style={styles.centered}>
                <Text style={{ color: isDarkMode ? '#ccc' : '#666' }}>No organization data available</Text>
              </View>
            )}
          </ScrollView>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f8f8f8' }]}>
      <Header 
        title="Organization Chart" 
        showBack
      />
      
      {renderContent()}
      
      <Portal>
        <Dialog
          visible={viewOptionsVisible}
          onDismiss={() => setViewOptionsVisible(false)}
          style={{ backgroundColor: isDarkMode ? '#333' : 'white' }}
        >
          <Dialog.Title style={{ color: isDarkMode ? 'white' : '#333' }}>
            Select View Mode
          </Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={value => handleChangeViewMode(value as 'hierarchy' | 'buildings')}
              value={viewMode}
            >
              <View style={styles.radioOption}>
                <RadioButton value="hierarchy" color={theme.colors.primary} />
                <Text style={{ color: isDarkMode ? 'white' : '#333' }}>Hierarchical View</Text>
              </View>
              <View style={styles.radioOptionDescription}>
                <Text style={{ color: isDarkMode ? '#ccc' : '#666', fontSize: 12, marginLeft: 40 }}>
                  Shows the management structure from Business Manager to Administrators to Buildings
                </Text>
              </View>
              
              <Divider style={{ marginVertical: 8 }} />
              
              <View style={styles.radioOption}>
                <RadioButton value="buildings" color={theme.colors.primary} />
                <Text style={{ color: isDarkMode ? 'white' : '#333' }}>Building-Focused View</Text>
              </View>
              <View style={styles.radioOptionDescription}>
                <Text style={{ color: isDarkMode ? '#ccc' : '#666', fontSize: 12, marginLeft: 40 }}>
                  Groups buildings by type with their assigned administrators
                </Text>
              </View>
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setViewOptionsVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
      <FAB
        icon={() => <RefreshCw size={24} color="white" />}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={generateOrgChart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    minWidth: Dimensions.get('window').width,
    transformOrigin: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  zoomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  zoomButton: {
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  viewModeCard: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 8,
  },
  viewModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  radioOptionDescription: {
    marginBottom: 12,
  },
});