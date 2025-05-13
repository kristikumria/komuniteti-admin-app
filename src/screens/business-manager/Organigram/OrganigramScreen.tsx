import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Card, ActivityIndicator, useTheme, Button, FAB, Portal, Dialog, RadioButton, Divider, IconButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessManagerStackParamList, Building } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import OrgChart from '../../../components/Organigram/OrgChart';
import { Header } from '../../../components/Header';
import { ZoomIn, ZoomOut, Share, Download, RefreshCw } from 'lucide-react-native';
import { organizationService, OrgNode } from '../../../services/organizationService';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

type Props = NativeStackScreenProps<BusinessManagerStackParamList, 'Organigram'>;

export const OrganigramScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const { commonStyles } = useThemedStyles();
  const [loading, setLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState<OrgNode | null>(null);
  const [scale, setScale] = useState(1);
  const [viewMode, setViewMode] = useState<'hierarchy' | 'buildings'>('hierarchy');
  const [viewOptionsVisible, setViewOptionsVisible] = useState(false);
  const { user } = useAppSelector(state => state.auth);
  const isDarkMode = useAppSelector(state => state.settings.darkMode);

  useEffect(() => {
    generateOrgChart();
  }, [viewMode]);

  // Create organization chart data structure
  const generateOrgChart = async () => {
    setLoading(true);
    
    try {
      // Use the organization service
      const data = await organizationService.getOrganizationChart(
        user?.id || 'bm1',
        viewMode
      );
      
      setOrganizationData(data);
    } catch (error) {
      console.error('Error generating organization chart:', error);
    } finally {
      setLoading(false);
    }
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
          style={{ backgroundColor: isDarkMode ? '#1E1E1E' : 'white' }}
        >
          <Dialog.Title style={{ color: isDarkMode ? 'white' : 'black' }}>
            Select View Mode
          </Dialog.Title>
          
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) => handleChangeViewMode(value as 'hierarchy' | 'buildings')} 
              value={viewMode}
            >
              <View style={styles.radioOption}>
                <RadioButton value="hierarchy" color={theme.colors.primary} />
                <Text style={{ color: isDarkMode ? 'white' : 'black' }}>
                  Hierarchical View
                </Text>
              </View>
              
              <Text style={[styles.optionDescription, { color: isDarkMode ? '#ccc' : '#666' }]}>
                Shows the organizational structure from Business Manager to Administrators to Buildings
              </Text>
              
              <Divider style={{ marginVertical: 12 }} />
              
              <View style={styles.radioOption}>
                <RadioButton value="buildings" color={theme.colors.primary} />
                <Text style={{ color: isDarkMode ? 'white' : 'black' }}>
                  Building-Focused View
                </Text>
              </View>
              
              <Text style={[styles.optionDescription, { color: isDarkMode ? '#ccc' : '#666' }]}>
                Groups buildings by type with administrators assigned to them
              </Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewModeCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  viewModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  zoomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    minWidth: Dimensions.get('window').width * 0.8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionDescription: {
    marginLeft: 36,
    fontSize: 12,
    marginBottom: 8,
  }
});