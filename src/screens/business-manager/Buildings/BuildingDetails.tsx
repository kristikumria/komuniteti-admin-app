import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Text, useTheme, ActivityIndicator, Card, Badge, Button, Divider, FAB, IconButton } from 'react-native-paper';
import { 
  Building2, 
  Users, 
  Home, 
  Calendar, 
  ShowerHead, 
  Briefcase, 
  Wallet, 
  AlertCircle, 
  Edit3,
  Trash2,
  UserPlus
} from 'lucide-react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { InfoCard } from '../../../components/InfoCard';
import { ListItem } from '../../../components/ListItem';
import { SideMenu } from '../../../components/SideMenu';
import { buildingService } from '../../../services/buildingService';
import { Building as BuildingType, BusinessManagerStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';

type BuildingDetailsRouteProps = RouteProp<BusinessManagerStackParamList, 'BuildingDetails'>;
type BuildingNavigationProps = NativeStackNavigationProp<BusinessManagerStackParamList>;

// Create a custom Badge component
const CustomBadge = ({ text, backgroundColor }: { text: string, backgroundColor: string }) => {
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
};

export const BuildingDetails = () => {
  const theme = useTheme();
  const navigation = useNavigation<BuildingNavigationProps>();
  const route = useRoute<BuildingDetailsRouteProps>();
  const { buildingId } = route.params;
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const [building, setBuilding] = useState<BuildingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('info');
  
  useEffect(() => {
    fetchBuilding();
  }, [buildingId]);
  
  const fetchBuilding = async () => {
    try {
      const data = await buildingService.getBuildingById(buildingId);
      // Manually create a building object that matches the expected type
      if (data) {
        const adaptedBuilding: BuildingType = {
          id: data.id,
          name: data.name,
          address: data.address,
          units: data.units,
          residents: 15, // Default value
          issues: 2, // Default value
          occupancyRate: 85, // Default value
          maintenanceCost: '€500', // Default value
          yearBuilt: data.buildYear,
          propertyType: 'Apartment', // Default value
          amenities: ['Gym', 'Pool', 'Parking'], // Default values
          image: data.image || 'https://via.placeholder.com/800x400',
        };
        setBuilding(adaptedBuilding);
      } else {
        setBuilding(null);
      }
    } catch (error) {
      console.error(`Error fetching building ${buildingId}:`, error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchBuilding();
  };
  
  const handleEdit = () => {
    // Navigate to edit building screen with building data
    navigation.navigate('EditBuilding', { buildingId });
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Building',
      `Are you sure you want to delete ${building?.name}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await buildingService.deleteBuilding(buildingId);
              Alert.alert('Success', 'Building deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting building:', error);
              Alert.alert('Error', 'Failed to delete building. Please try again.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  const handleAssignAdministrator = () => {
    navigation.navigate('AssignAdministrator', { 
      buildingId, 
      buildingName: building?.name || 'Building' 
    });
  };
  
  if (loading && !refreshing) {
    return (
      <>
        <Header 
          title="Building Details" 
          showBack={true}
          showMenu={true}
          onMenuPress={() => setMenuVisible(true)}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading building details...
          </Text>
        </View>
        <SideMenu
          isVisible={menuVisible}
          onClose={() => setMenuVisible(false)}
        />
      </>
    );
  }
  
  // For safety, in case the building is not found
  if (!building) {
    return (
      <>
        <Header 
          title="Building Details" 
          showBack={true}
          showMenu={true}
          onMenuPress={() => setMenuVisible(true)}
        />
        <View style={styles.notFoundContainer}>
          <AlertCircle size={50} color={theme.colors.error} />
          <Text 
            style={[
              styles.notFoundText,
              { color: isDarkMode ? '#fff' : '#333' }
            ]}
          >
            Building not found
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 16 }}
          >
            Go Back
          </Button>
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
        title={building.name} 
        showBack={true}
        showMenu={true}
        onMenuPress={() => setMenuVisible(true)}
      />
      
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <Image 
          source={{ uri: building.image }} 
          style={styles.coverImage}
          resizeMode="cover"
        />
        
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text 
              style={[
                styles.buildingName,
                { color: isDarkMode ? '#fff' : '#333' }
              ]}
            >
              {building.name}
            </Text>
            
            <Text
              style={[
                styles.buildingAddress,
                { color: isDarkMode ? '#aaa' : '#666' }
              ]}
            >
              {building.address}
            </Text>
            
            <View style={styles.badgesContainer}>
              <CustomBadge 
                text={building.propertyType}
                backgroundColor={theme.colors.primary}
              />
              
              <CustomBadge
                text={`${building.occupancyRate}% Occupied`}
                backgroundColor={
                  building.occupancyRate >= 90 
                    ? STATUS_COLORS.success 
                    : building.occupancyRate >= 80
                      ? STATUS_COLORS.warning
                      : STATUS_COLORS.error
                }
              />
              
              <CustomBadge
                text={building.issues > 0 ? `${building.issues} Issues` : 'No Issues'}
                backgroundColor={building.issues > 0 ? STATUS_COLORS.error : STATUS_COLORS.success}
              />
            </View>
            
            <View style={styles.actionButtonsContainer}>
              <Button
                mode="outlined"
                onPress={handleEdit}
                icon={({ size, color }) => <Edit3 size={size} color={color} />}
                style={[styles.actionButton, { borderColor: theme.colors.primary }]}
                textColor={theme.colors.primary}
              >
                Edit
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleDelete}
                icon={({ size, color }) => <Trash2 size={size} color={color} />}
                style={[styles.actionButton, { borderColor: theme.colors.error }]}
                textColor={theme.colors.error}
              >
                Delete
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleAssignAdministrator}
                icon={({ size, color }) => <UserPlus size={size} color={color} />}
                style={[styles.actionButton, { borderColor: theme.colors.secondary }]}
                textColor={theme.colors.secondary}
              >
                Assign Admin
              </Button>
            </View>
          </View>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'info' && [
                styles.activeTabButton,
                { borderBottomColor: theme.colors.primary }
              ]
            ]}
            onPress={() => setSelectedTab('info')}
          >
            <Text 
              style={[
                styles.tabButtonText,
                selectedTab === 'info' && [
                  styles.activeTabButtonText,
                  { color: theme.colors.primary }
                ],
                { color: isDarkMode ? '#aaa' : '#666' }
              ]}
            >
              Information
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'residents' && [
                styles.activeTabButton,
                { borderBottomColor: theme.colors.primary }
              ]
            ]}
            onPress={() => setSelectedTab('residents')}
          >
            <Text 
              style={[
                styles.tabButtonText,
                selectedTab === 'residents' && [
                  styles.activeTabButtonText,
                  { color: theme.colors.primary }
                ],
                { color: isDarkMode ? '#aaa' : '#666' }
              ]}
            >
              Residents
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'issues' && [
                styles.activeTabButton,
                { borderBottomColor: theme.colors.primary }
              ]
            ]}
            onPress={() => setSelectedTab('issues')}
          >
            <Text 
              style={[
                styles.tabButtonText,
                selectedTab === 'issues' && [
                  styles.activeTabButtonText,
                  { color: theme.colors.primary }
                ],
                { color: isDarkMode ? '#aaa' : '#666' }
              ]}
            >
              Issues
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'analytics' && [
                styles.activeTabButton,
                { borderBottomColor: theme.colors.primary }
              ]
            ]}
            onPress={() => setSelectedTab('analytics')}
          >
            <Text 
              style={[
                styles.tabButtonText,
                selectedTab === 'analytics' && [
                  styles.activeTabButtonText,
                  { color: theme.colors.primary }
                ],
                { color: isDarkMode ? '#aaa' : '#666' }
              ]}
            >
              Analytics
            </Text>
          </TouchableOpacity>
        </View>
        
        {selectedTab === 'info' && (
          <View style={styles.infoContainer}>
            <View style={styles.statsContainer}>
              <InfoCard
                title="Units"
                value={building.units}
                icon={<Home size={24} color="white" />}
                color="#1976d2"
              />
              
              <InfoCard
                title="Residents"
                value={building.residents}
                icon={<Users size={24} color="white" />}
                color="#00897b"
              />
              
              <InfoCard
                title="Year Built"
                value={building.yearBuilt}
                icon={<Calendar size={24} color="white" />}
                color="#8e24aa"
              />
              
              <InfoCard
                title="Monthly Cost"
                value={building.maintenanceCost}
                icon={<Wallet size={24} color="white" />}
                color="#43a047"
              />
            </View>
            
            <Card 
              style={[
                styles.sectionCard,
                { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
              ]}
            >
              <Card.Content>
                <Text 
                  style={[
                    styles.sectionTitle,
                    { color: isDarkMode ? '#fff' : '#333' }
                  ]}
                >
                  Property Information
                </Text>
                
                <View style={styles.infoRow}>
                  <Text 
                    style={[
                      styles.infoLabel,
                      { color: isDarkMode ? '#aaa' : '#666' }
                    ]}
                  >
                    Property Type
                  </Text>
                  <Text 
                    style={[
                      styles.infoValue,
                      { color: isDarkMode ? '#fff' : '#333' }
                    ]}
                  >
                    {building.propertyType}
                  </Text>
                </View>
                
                <Divider style={styles.divider} />
                
                <View style={styles.infoRow}>
                  <Text 
                    style={[
                      styles.infoLabel,
                      { color: isDarkMode ? '#aaa' : '#666' }
                    ]}
                  >
                    Year Built
                  </Text>
                  <Text 
                    style={[
                      styles.infoValue,
                      { color: isDarkMode ? '#fff' : '#333' }
                    ]}
                  >
                    {building.yearBuilt}
                  </Text>
                </View>
                
                <Divider style={styles.divider} />
                
                <View style={styles.infoRow}>
                  <Text 
                    style={[
                      styles.infoLabel,
                      { color: isDarkMode ? '#aaa' : '#666' }
                    ]}
                  >
                    Total Units
                  </Text>
                  <Text 
                    style={[
                      styles.infoValue,
                      { color: isDarkMode ? '#fff' : '#333' }
                    ]}
                  >
                    {building.units}
                  </Text>
                </View>
                
                <Divider style={styles.divider} />
                
                <View style={styles.infoRow}>
                  <Text 
                    style={[
                      styles.infoLabel,
                      { color: isDarkMode ? '#aaa' : '#666' }
                    ]}
                  >
                    Occupancy Rate
                  </Text>
                  <Text 
                    style={[
                      styles.infoValue,
                      { color: isDarkMode ? '#fff' : '#333' }
                    ]}
                  >
                    {building.occupancyRate}%
                  </Text>
                </View>
                
                <Divider style={styles.divider} />
                
                <View style={styles.infoRow}>
                  <Text 
                    style={[
                      styles.infoLabel,
                      { color: isDarkMode ? '#aaa' : '#666' }
                    ]}
                  >
                    Total Residents
                  </Text>
                  <Text 
                    style={[
                      styles.infoValue,
                      { color: isDarkMode ? '#fff' : '#333' }
                    ]}
                  >
                    {building.residents}
                  </Text>
                </View>
                
                <Divider style={styles.divider} />
                
                <View style={styles.infoRow}>
                  <Text 
                    style={[
                      styles.infoLabel,
                      { color: isDarkMode ? '#aaa' : '#666' }
                    ]}
                  >
                    Monthly Maintenance
                  </Text>
                  <Text 
                    style={[
                      styles.infoValue,
                      { color: isDarkMode ? '#fff' : '#333' }
                    ]}
                  >
                    {building.maintenanceCost}
                  </Text>
                </View>
              </Card.Content>
            </Card>
            
            <Card 
              style={[
                styles.sectionCard,
                { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
              ]}
            >
              <Card.Content>
                <Text 
                  style={[
                    styles.sectionTitle,
                    { color: isDarkMode ? '#fff' : '#333' }
                  ]}
                >
                  Amenities
                </Text>
                
                <View style={styles.amenitiesContainer}>
                  {building.amenities ? (
                    building.amenities.map((amenity, index) => (
                      <CustomBadge
                        key={index}
                        text={amenity}
                        backgroundColor={isDarkMode ? '#333' : '#eee'}
                      />
                    ))
                  ) : (
                    <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>
                      No amenities available
                    </Text>
                  )}
                </View>
              </Card.Content>
            </Card>
          </View>
        )}
        
        {selectedTab === 'residents' && (
          <View style={styles.tabContent}>
            <Card 
              style={[
                styles.sectionCard,
                { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
              ]}
            >
              <Card.Content>
                <Text 
                  style={[
                    styles.sectionTitle,
                    { color: isDarkMode ? '#fff' : '#333', marginBottom: 16 }
                  ]}
                >
                  Building Residents
                </Text>
                
                <ListItem
                  title="Endri Aliaj"
                  subtitle="Unit A203 • Owner"
                  description="Moved in March 15, 2020 • 3 family members"
                  avatar={{
                    uri: 'https://randomuser.me/api/portraits/men/32.jpg',
                  }}
                  badge={{
                    text: 'Current',
                    color: STATUS_COLORS.success,
                  }}
                />
                
                <ListItem
                  title="Elona Varfi"
                  subtitle="Unit B112 • Tenant"
                  description="Moved in January 10, 2022 • 2 family members"
                  avatar={{
                    uri: 'https://randomuser.me/api/portraits/women/44.jpg',
                  }}
                  badge={{
                    text: 'Overdue',
                    color: STATUS_COLORS.error,
                  }}
                />
                
                <View style={styles.viewAllContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      // Navigate to full residents list
                    }}
                  >
                    View All Residents
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </View>
        )}
        
        {selectedTab === 'issues' && (
          <View style={styles.tabContent}>
            <Card 
              style={[
                styles.sectionCard,
                { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
              ]}
            >
              <Card.Content>
                <Text 
                  style={[
                    styles.sectionTitle,
                    { color: isDarkMode ? '#fff' : '#333', marginBottom: 16 }
                  ]}
                >
                  Building Issues
                </Text>
                
                {building.issues > 0 ? (
                  <>
                    <ListItem
                      title="Water Leak in Lobby"
                      subtitle="High Priority • Open"
                      description="Reported 2 days ago by Administrator"
                      avatar={{
                        icon: <AlertCircle size={24} color="white" />,
                        color: STATUS_COLORS.error,
                      }}
                      badge={{
                        text: 'Open',
                        color: STATUS_COLORS.open,
                      }}
                    />
                    
                    <View style={styles.viewAllContainer}>
                      <Button
                        mode="outlined"
                        onPress={() => {
                          // Navigate to full issues list
                        }}
                      >
                        View All Issues
                      </Button>
                    </View>
                  </>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text 
                      style={[
                        styles.emptyText,
                        { color: isDarkMode ? '#aaa' : '#888' }
                      ]}
                    >
                      No issues reported for this building
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          </View>
        )}
        
        {selectedTab === 'analytics' && (
          <View style={styles.tabContent}>
            <Card 
              style={[
                styles.sectionCard,
                { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
              ]}
            >
              <Card.Content>
                <Text 
                  style={[
                    styles.sectionTitle,
                    { color: isDarkMode ? '#fff' : '#333', marginBottom: 16 }
                  ]}
                >
                  Building Analytics
                </Text>
                
                <View style={styles.analyticsContainer}>
                  <View style={styles.analyticsItem}>
                    <Text 
                      style={[
                        styles.analyticsValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      {building.occupancyRate}%
                    </Text>
                    <Text 
                      style={[
                        styles.analyticsLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Occupancy Rate
                    </Text>
                  </View>
                  
                  <View style={styles.analyticsItem}>
                    <Text 
                      style={[
                        styles.analyticsValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      €24,500
                    </Text>
                    <Text 
                      style={[
                        styles.analyticsLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Monthly Revenue
                    </Text>
                  </View>
                  
                  <View style={styles.analyticsItem}>
                    <Text 
                      style={[
                        styles.analyticsValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      €120
                    </Text>
                    <Text 
                      style={[
                        styles.analyticsLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Cost per Unit
                    </Text>
                  </View>
                  
                  <View style={styles.analyticsItem}>
                    <Text 
                      style={[
                        styles.analyticsValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      25%
                    </Text>
                    <Text 
                      style={[
                        styles.analyticsLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      ROI
                    </Text>
                  </View>
                </View>
                
                <View style={styles.viewAllContainer}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      navigation.navigate('Analytics' as never);
                    }}
                  >
                    View Detailed Analytics
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </View>
        )}
        
        <View style={{ height: 80 }} />
      </ScrollView>
      
      <FAB
        icon={props => <Edit3 {...props} />}
        style={[
          styles.fab,
          { backgroundColor: theme.colors.primary }
        ]}
        onPress={handleEdit}
        color="white"
      />
      
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  headerContainer: {
    padding: 16,
  },
  headerContent: {
    marginTop: -20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    padding: 16,
  },
  buildingName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buildingAddress: {
    fontSize: 16,
    marginTop: 4,
    color: 'rgba(255,255,255,0.8)',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  badgeWrapper: {
    marginRight: 8,
    marginBottom: 8,
  },
  badge: {
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabButtonText: {
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 8,
  },
  tabContent: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionCard: {
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  viewAllContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  analyticsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  analyticsItem: {
    width: '48%',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  analyticsLabel: {
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    marginRight: 8,
  },
}); 