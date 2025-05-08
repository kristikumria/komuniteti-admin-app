import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Text, useTheme, RadioButton, Card, Button, Divider, Avatar } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { SideMenu } from '../../../components/SideMenu';
import { Administrator, BusinessManagerStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { buildingService } from '../../../services/buildingService';
import { administratorService } from '../../../services/administratorService';

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
  const [menuVisible, setMenuVisible] = useState(false);
  
  useEffect(() => {
    const fetchAdministrators = async () => {
      try {
        const admins = await administratorService.getAdministrators();
        setAdministrators(admins);
        
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
      await buildingService.assignAdministrator(buildingId, selectedAdminId);
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
          showMenu={true}
          onMenuPress={() => setMenuVisible(true)}
        />
        <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading administrators...
          </Text>
        </View>
        <SideMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </>
    );
  }
  
  return (
    <>
      <Header 
        title="Assign Administrator" 
        showBack={true}
        showMenu={true}
        onMenuPress={() => setMenuVisible(true)}
      />
      
      <View 
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
        ]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={[styles.headerCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
            <Card.Content>
              <Text style={[styles.buildingTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                {buildingName}
              </Text>
              <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>
                Select an administrator for this building
              </Text>
            </Card.Content>
          </Card>
          
          <Card style={[styles.adminListCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }]}>
            <Card.Content>
              <RadioButton.Group 
                onValueChange={(value) => setSelectedAdminId(value)} 
                value={selectedAdminId || ''}
              >
                {administrators.length > 0 ? (
                  administrators.map((admin) => (
                    <View key={admin.id} style={styles.adminItem}>
                      <View style={styles.adminInfo}>
                        <RadioButton 
                          value={admin.id} 
                          color={theme.colors.primary}
                        />
                        
                        <View style={styles.avatarContainer}>
                          {admin.image ? (
                            <Avatar.Image 
                              size={40} 
                              source={{ uri: admin.image }} 
                            />
                          ) : (
                            <Avatar.Text
                              size={40}
                              label={getInitials(admin.name)}
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                          )}
                        </View>
                        
                        <View style={styles.adminDetails}>
                          <Text style={[styles.adminName, { color: isDarkMode ? '#fff' : '#333' }]}>
                            {admin.name}
                          </Text>
                          <Text style={[styles.adminEmail, { color: isDarkMode ? '#aaa' : '#666' }]}>
                            {admin.email}
                          </Text>
                          <Text style={[styles.adminStats, { color: isDarkMode ? '#aaa' : '#666' }]}>
                            {admin.buildings} buildings • {admin.tenantSatisfaction}% satisfaction
                          </Text>
                        </View>
                      </View>
                      
                      <Divider style={styles.divider} />
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: isDarkMode ? '#aaa' : '#888' }]}>
                      No administrators available
                    </Text>
                  </View>
                )}
              </RadioButton.Group>
            </Card.Content>
          </Card>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={[styles.button, styles.cancelButton]}
              disabled={submitting}
            >
              Cancel
            </Button>
            
            <Button
              mode="contained"
              onPress={handleAssign}
              style={[styles.button, styles.assignButton]}
              loading={submitting}
              disabled={submitting || !selectedAdminId}
            >
              Assign
            </Button>
          </View>
        </ScrollView>
      </View>
      
      <SideMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  buildingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  adminListCard: {
    borderRadius: 8,
    marginBottom: 24,
  },
  adminItem: {
    marginBottom: 16,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarContainer: {
    marginHorizontal: 12,
  },
  adminDetails: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '500',
  },
  adminEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  adminStats: {
    fontSize: 12,
  },
  divider: {
    marginTop: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderColor: 'transparent',
  },
  assignButton: {
  },
}); 