import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, ActivityIndicator, useTheme, Button, RadioButton, Divider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import OrgChart from '../../../components/Organigram/OrgChart';
import { Header } from '../../../components/Header';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react-native';
import { organizationService, OrgNode } from '../../../services/organizationService';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import DialogContainer from '../../../components/DialogContainer';
import FloatingActionButton from '../../../components/FloatingActionButton';

type Props = NativeStackScreenProps<AdministratorStackParamList, 'Organigram'>;

export const OrganigramScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const { commonStyles } = useThemedStyles();
  const [loading, setLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState<OrgNode | null>(null);
  const [scale, setScale] = useState(1);
  const [viewMode, setViewMode] = useState<'buildings' | 'residents'>('buildings');
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
      // Use the administrator-specific organization chart function
      const data = await organizationService.getAdministratorOrganizationChart(
        user?.id || 'admin1'
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

  const handleChangeViewMode = (newMode: 'buildings' | 'residents') => {
    setViewMode(newMode);
    setViewOptionsVisible(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={[styles.centered, { flex: 1 }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text 
            style={[
              styles.loadingText, 
              { color: theme.colors.onSurfaceVariant }
            ]}
          >
            Building organization chart...
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Card style={[
          styles.viewModeCard, 
          { backgroundColor: theme.colors.surfaceVariant }
        ]}>
          <View style={styles.viewModeContainer}>
            <Text style={{ 
              color: theme.colors.onSurfaceVariant, 
              marginRight: 8 
            }}>
              View Mode:
            </Text>
            <Button 
              mode="outlined" 
              onPress={() => setViewOptionsVisible(true)}
              style={{ borderColor: theme.colors.primary }}
              textColor={theme.colors.primary}
            >
              {viewMode === 'buildings' ? 'Building View' : 'Resident View'}
            </Button>
          </View>
        </Card>
        
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={[
              styles.zoomButton, 
              { backgroundColor: theme.colors.surfaceVariant }
            ]}
            onPress={handleZoomOut}
            accessibilityLabel="Zoom out"
            accessibilityRole="button"
          >
            <ZoomOut size={24} color={theme.colors.primary} />
          </TouchableOpacity>

          <Text style={{ 
            marginHorizontal: 8, 
            color: theme.colors.onSurfaceVariant 
          }}>
            {Math.round(scale * 100)}%
          </Text>

          <TouchableOpacity
            style={[
              styles.zoomButton, 
              { backgroundColor: theme.colors.surfaceVariant }
            ]}
            onPress={handleZoomIn}
            accessibilityLabel="Zoom in"
            accessibilityRole="button"
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
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  No organization data available
                </Text>
              </View>
            )}
          </ScrollView>
        </ScrollView>
      </View>
    );
  };

  const renderViewModeDialog = () => {
    return (
      <DialogContainer
        visible={viewOptionsVisible}
        onDismiss={() => setViewOptionsVisible(false)}
        title="Select View Mode"
        content={
          <RadioButton.Group
            onValueChange={(value) => handleChangeViewMode(value as 'buildings' | 'residents')} 
            value={viewMode}
          >
            <View style={styles.radioOption}>
              <RadioButton value="buildings" color={theme.colors.primary} />
              <Text style={{ color: theme.colors.onSurface }}>
                Building View
              </Text>
            </View>
            
            <Text style={[
              styles.optionDescription, 
              { color: theme.colors.onSurfaceVariant }
            ]}>
              Shows buildings with their units and basic information
            </Text>
            
            <Divider style={{ marginVertical: 12 }} />
            
            <View style={styles.radioOption}>
              <RadioButton value="residents" color={theme.colors.primary} />
              <Text style={{ color: theme.colors.onSurface }}>
                Resident View
              </Text>
            </View>
            
            <Text style={[
              styles.optionDescription, 
              { color: theme.colors.onSurfaceVariant }
            ]}>
              Shows buildings with their residents by unit
            </Text>
          </RadioButton.Group>
        }
        dismissLabel="Cancel"
      />
    );
  };

  return (
    <View style={[
      styles.container, 
      { backgroundColor: theme.colors.background }
    ]}>
      <Header 
        title="Organization Chart" 
        showBack
      />
      
      {renderContent()}
      {renderViewModeDialog()}
      
      <FloatingActionButton
        icon="refresh"
        onPress={generateOrgChart}
        accessibilityLabel="Refresh organization chart"
        position="bottomRight"
        animated={true}
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
    flex: 1,
  },
  viewModeCard: {
    margin: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
  },
  viewModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    minWidth: '100%',
    transformOrigin: 'top left',
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 16,
    marginVertical: 8,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionDescription: {
    fontSize: 14,
    marginLeft: 40,
    marginTop: 4,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
}); 