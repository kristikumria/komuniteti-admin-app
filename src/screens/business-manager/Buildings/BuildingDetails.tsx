import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, RefreshControl, Alert, ImageBackground, Platform, Dimensions } from 'react-native';
import { Text, useTheme, ActivityIndicator, Card, Badge, Button, Divider, FAB, IconButton, Avatar, Chip } from 'react-native-paper';
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
  UserPlus,
  Plus,
  Settings,
  Pencil,
  MapPin,
  LayoutGrid,
  Layers,
  UserCheck,
  AlertTriangle,
  ShieldCheck,
  ChevronLeft,
  MoreVertical,
  Heart,
  ArrowLeft
} from 'lucide-react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import { Header } from '../../../components/Header';
import { InfoCard } from '../../../components/InfoCard';
import { ListItem } from '../../../components/ListItem';
import { buildingService } from '../../../services/buildingService';
import { Building as BuildingType, BusinessManagerStackParamList } from '../../../navigation/types';
import { Building as ServiceBuildingType } from '../../../types/buildingTypes';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { BuildingUnits } from './components/BuildingUnits';
import { ResidentsList } from '../Units/Residents/ResidentsList';

type BuildingDetailsRouteProps = RouteProp<BusinessManagerStackParamList, 'BuildingDetails'>;
type BuildingNavigationProps = NativeStackNavigationProp<BusinessManagerStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Create a custom Badge component
const CustomBadge = ({ text, backgroundColor }: { text: string, backgroundColor: string }) => {
  return (
    <View style={[{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }, { backgroundColor }]}>
      <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>{text}</Text>
    </View>
  );
};

export const BuildingDetails = () => {
  const theme = useTheme();
  const navigation = useNavigation<BuildingNavigationProps>();
  const route = useRoute<BuildingDetailsRouteProps>();
  const { buildingId } = route.params;
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  
  const [building, setBuilding] = useState<BuildingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [scrollY, setScrollY] = useState(0);
  const [showActions, setShowActions] = useState(false);
  
  useEffect(() => {
    fetchBuilding();
  }, [buildingId]);
  
  const fetchBuilding = async () => {
    try {
      const data = await buildingService.getBuildingById(buildingId);
      
      if (data) {
        // Convert from service Building type to UI BuildingType
        const adaptedBuilding: BuildingType = {
          id: data.id,
          name: data.name,
          address: data.address,
          units: data.units,
          residents: data.residents || 0,
          issues: data.issues || 0,
          occupancyRate: data.occupancyRate || 0,
          maintenanceCost: data.maintenanceCost || '€0/month',
          yearBuilt: data.buildYear,
          propertyType: data.propertyType || 'Residential',
          amenities: data.amenities || [],
          image: data.image || 'https://via.placeholder.com/800x400',
          residentialUnits: data.residentialUnits || 0,
          businessUnits: data.businessUnits || 0,
          status: data.status || 'active',
          adminAssigned: data.adminAssigned || false,
          location: data.location || {
            country: data.country,
            city: data.city,
            coordinates: {
              latitude: 41.3275,
              longitude: 19.8187
            }
          },
          floorArea: data.floorArea || data.totalArea,
          floors: data.floors
        };
        setBuilding(adaptedBuilding);
      } else {
        console.log('Building not found with ID:', buildingId);
        setBuilding(null);
      }
    } catch (error) {
      console.error(`Error fetching building ${buildingId}:`, error);
      setBuilding(null);
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

  const toggleActions = () => {
    setShowActions(!showActions);
  };
  
  const getStatusColor = (status?: string) => {
    switch(status) {
      case 'active': return '#4CAF50';
      case 'maintenance': return '#FF9800';
      case 'development': return '#2196F3';
      default: return '#9E9E9E';
    }
  };
  
  if (loading && !refreshing) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
            Loading building details...
          </Text>
        </View>
      </View>
    );
  }
  
  // For safety, in case the building is not found
  if (!building) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        <View style={styles.headerBackButton}>
          <IconButton
            icon={(props) => <ArrowLeft {...props} />}
            size={24}
            onPress={() => navigation.goBack()}
          />
        </View>
        
        <View style={styles.notFoundContainer}>
          <AlertCircle size={80} color={theme.colors.error} />
          <Text variant="headlineMedium" style={{marginTop: 24, marginBottom: 8}}>
            Building Not Found
          </Text>
          <Text variant="bodyMedium" style={{textAlign: 'center', marginBottom: 24}}>
            The building you're looking for doesn't exist or has been removed.
          </Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Buildings')}
          >
            Back to Buildings
          </Button>
        </View>
      </View>
    );
  }

  const renderHeader = () => {
    const headerHeight = 250;
    const isScrolled = scrollY > headerHeight - 60;
    
    return (
      <>
        <View style={styles.heroContainer}>
          <Image 
            source={{uri: building.image}} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
            style={styles.heroGradient}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 0.6}}
          />
          
          <View style={styles.headerBackButton}>
            <IconButton
              icon={(props) => <ArrowLeft {...props} color="#fff" />}
              size={24}
              onPress={() => navigation.goBack()}
              style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
            />
          </View>
        </View>
        
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text variant="headlineMedium" style={styles.buildingName}>
                {building.name}
              </Text>
              <View style={styles.locationRow}>
                <MapPin size={16} color={theme.colors.onSurfaceVariant} style={{marginRight: 4}} />
                <Text variant="bodyMedium" style={styles.addressText}>
                  {building.address}
                </Text>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              <IconButton
                icon={(props) => <Edit3 {...props} />}
                size={20}
                mode="contained"
                onPress={handleEdit}
                style={styles.headerActionButton}
              />
              <IconButton
                icon={(props) => <MoreVertical {...props} />}
                size={20}
                mode="contained"
                onPress={toggleActions}
                style={styles.headerActionButton}
              />
            </View>
          </View>
          
          {showActions && (
            <Card style={styles.actionsCard} mode="elevated">
              <Card.Content style={styles.actionsCardContent}>
                <TouchableOpacity 
                  style={styles.actionItem} 
                  onPress={handleAssignAdministrator}
                >
                  <UserPlus size={20} color={theme.colors.primary} />
                  <Text variant="bodyMedium" style={styles.actionText}>
                    Assign Administrator
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionItem} 
                  onPress={handleDelete}
                >
                  <Trash2 size={20} color={theme.colors.error} />
                  <Text variant="bodyMedium" style={[styles.actionText, {color: theme.colors.error}]}>
                    Delete Building
                  </Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          )}
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Home size={20} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.statValue}>
                {building.units}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Units
              </Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Users size={20} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.statValue}>
                {building.residents}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Residents
              </Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Building2 size={20} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.statValue}>
                {building.floors || '—'}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Floors
              </Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <AlertTriangle size={20} color={building.issues > 0 ? '#FF5252' : theme.colors.primary} />
              <Text variant="titleMedium" style={[
                styles.statValue, 
                building.issues > 0 ? {color: '#FF5252'} : {}
              ]}>
                {building.issues}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Issues
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Chip 
              style={[styles.infoChip, {backgroundColor: getStatusColor(building.status)}]} 
              textStyle={{color: '#fff'}}
            >
              {building.status === 'active' ? 'Active' : 
               building.status === 'maintenance' ? 'Under Maintenance' : 
               building.status === 'development' ? 'In Development' : 'Unknown'}
            </Chip>
            
            <Chip 
              style={styles.infoChip} 
              icon="office-building"
            >
              {building.propertyType}
            </Chip>
            
            {building.yearBuilt && (
              <Chip 
                style={styles.infoChip} 
                icon="calendar"
              >
                Built {building.yearBuilt}
              </Chip>
            )}
            
            {!building.adminAssigned && (
              <Chip 
                style={[styles.infoChip, {backgroundColor: 'rgba(244, 67, 54, 0.1)'}]} 
                textStyle={{color: '#F44336'}}
                icon={() => <ShieldCheck size={16} color="#F44336" />}
              >
                Needs Admin
              </Chip>
            )}
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'overview' && styles.activeTab
              ]}
              onPress={() => setActiveTab('overview')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'overview' && styles.activeTabText
                ]}
              >
                Overview
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'units' && styles.activeTab
              ]}
              onPress={() => setActiveTab('units')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'units' && styles.activeTabText
                ]}
              >
                Units
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'residents' && styles.activeTab
              ]}
              onPress={() => setActiveTab('residents')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'residents' && styles.activeTabText
                ]}
              >
                Residents
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'financials' && styles.activeTab
              ]}
              onPress={() => setActiveTab('financials')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'financials' && styles.activeTabText
                ]}
              >
                Financials
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'maintenance' && styles.activeTab
              ]}
              onPress={() => setActiveTab('maintenance')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'maintenance' && styles.activeTabText
                ]}
              >
                Maintenance
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        {renderHeader()}
        
        {/* Tab-specific content */}
        <View style={styles.contentContainer}>
          {activeTab === 'overview' && (
            <View>
              <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: 'bold' }}>Building Overview</Text>
              {/* Building overview content */}
              <Text variant="bodyMedium">Overview content would go here</Text>
            </View>
          )}
          
          {activeTab === 'units' && (
            <BuildingUnits buildingId={buildingId} buildingName={building?.name || ''} />
          )}
          
          {activeTab === 'residents' && (
            <View>
              <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: 'bold' }}>Residents</Text>
              <Text variant="bodyMedium">Residents content would go here</Text>
            </View>
          )}
          
          {activeTab === 'financials' && (
            <View>
              <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: 'bold' }}>Financials</Text>
              {/* Financials content */}
              <Text variant="bodyMedium">Financials content would go here</Text>
            </View>
          )}
          
          {activeTab === 'maintenance' && (
            <View>
              <Text variant="titleMedium" style={{ marginBottom: 16, fontWeight: 'bold' }}>Maintenance</Text>
              {/* Maintenance content */}
              <Text variant="bodyMedium">Maintenance content would go here</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {}}
        color="#fff"
      />
    </View>
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
  headerBackButton: {
    position: 'absolute',
    top: 44,
    left: 16,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 1,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  buildingName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    opacity: 0.7,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    margin: 0,
    marginLeft: 8,
  },
  actionsCard: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 1000,
    width: 220,
  },
  actionsCardContent: {
    padding: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionText: {
    marginLeft: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    opacity: 0.7,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  infoChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1363DF',
  },
  tabText: {
    fontWeight: '500',
    opacity: 0.7,
  },
  activeTabText: {
    opacity: 1,
    color: '#1363DF',
  },
  contentContainer: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1363DF',
  },
}); 