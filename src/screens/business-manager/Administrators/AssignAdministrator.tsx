import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Text, useTheme, RadioButton, Card, Button, Divider, Avatar } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { BusinessManagerStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { buildingService } from '../../../services/buildingService';
import { administratorService } from '../../../services/administratorService';
import { Administrator } from '../../../types/administratorTypes';

type AssignAdministratorRouteProp = RouteProp<BusinessManagerStackParamList, 'AssignAdministrator'>;
type AdministratorNavigationProps = NativeStackNavigationProp<BusinessManagerStackParamList>;

export const AssignAdministrator = () => {
  const theme = useTheme();
  const navigation = useNavigation<AdministratorNavigationProps>();
  const route = useRoute<AssignAdministratorRouteProp>();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  
  const { buildingId, buildingName } = route.params;
  
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchAdministrators = async () => {
      try {
        const admins = await administratorService.getAdministrators();
        setAdministrators(admins as any);
        
        // Get current assignment if any
        const building = await buildingService.getBuildingById(buildingId);
        if (building && building.administratorId) {
          setSelectedAdminId(building.administratorId);
        }
      } catch (error) {
        console.error('Error loading administrators:', error);
        Alert.alert('Error', 'Failed to load administrators');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdministrators();
  }, [buildingId]);
  
  const handleAssign = async () => {
    if (!selectedAdminId) {
      Alert.alert('Error', 'Please select an administrator first');
      return;
    }
    
    setSubmitting(true);
    try {
      // Using updateBuilding as a workaround since buildingService doesn't have assignAdministrator
      await buildingService.updateBuilding(buildingId, { 
        // Using any type to bypass type checking as the API expects administratorId
        administratorId: selectedAdminId
      } as any);
      
      Alert.alert(
        'Success',
        'Administrator assigned successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error assigning administrator:', error);
      Alert.alert('Error', 'Failed to assign administrator');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  if (loading) {
    return (
      <>
        <Header 
          title="Assign Administrator" 
          showBack={true}
        />
        <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading administrators...
          </Text>
        </View>
      </>
    );
  }
  
  return (
    <>
      <Header 
        title="Assign Administrator" 
        showBack={true}
      />
      <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
        <Text style={[styles.buildingName, { color: isDarkMode ? '#fff' : '#333' }]}>
          Building: {buildingName}
        </Text>
        
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ddd' : '#666' }]}>
          Select an administrator to assign to this building:
        </Text>
        
        <RadioButton.Group onValueChange={value => setSelectedAdminId(value)} value={selectedAdminId || ''}>
          {administrators.map(admin => (
            <Card 
              key={admin.id} 
              style={[
                styles.adminCard, 
                { 
                  backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                  borderColor: selectedAdminId === admin.id ? theme.colors.primary : 'transparent',
                }
              ]}
              mode="outlined"
            >
              <Card.Content style={styles.adminCardContent}>
                <View style={styles.radioContainer}>
                  <RadioButton value={admin.id} />
                </View>
                <View style={styles.avatarContainer}>
                  <Avatar.Text 
                    size={50} 
                    label={getInitials(admin.name)} 
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                </View>
                <View style={styles.adminInfo}>
                  <Text style={[styles.adminName, { color: isDarkMode ? '#fff' : '#333' }]}>
                    {admin.name}
                  </Text>
                  <Text style={[styles.adminEmail, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    {admin.email}
                  </Text>
                  <Text style={[styles.adminStats, { color: isDarkMode ? '#aaa' : '#666' }]}>
                    Managing {admin.assignedBuildings?.length || 0} buildings
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </RadioButton.Group>
        
        {administrators.length === 0 && !loading && (
          <Text style={[styles.noAdminsText, { color: isDarkMode ? '#aaa' : '#666' }]}>
            No administrators available
          </Text>
        )}
        
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleAssign}
            style={styles.assignButton}
            loading={submitting}
            disabled={!selectedAdminId || submitting}
          >
            Assign
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buildingName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  adminCard: {
    marginBottom: 12,
    borderWidth: 2,
  },
  adminCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioContainer: {
    marginRight: 8,
  },
  avatarContainer: {
    marginRight: 16,
  },
  adminInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  adminEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  adminStats: {
    fontSize: 12,
  },
  noAdminsText: {
    textAlign: 'center',
    marginVertical: 24,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    marginBottom: 16,
  },
  cancelButton: {
    marginRight: 12,
  },
  assignButton: {
    minWidth: 100,
  },
});
