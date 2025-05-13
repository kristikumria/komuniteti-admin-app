import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, RefreshControl, Alert, Modal, FlatList } from 'react-native';
import { Text, useTheme, ActivityIndicator, Card, Button, Divider, FAB, Badge as PaperBadge, Searchbar, RadioButton, Avatar } from 'react-native-paper';
import { 
  UserRound, 
  Building, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  Wallet, 
  PawPrint,
  MessageSquare,
  AlertCircle, 
  Edit3,
  Trash2,
  Home,
  MapPin,
  DoorOpen
} from 'lucide-react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { ListItem } from '../../../components/ListItem';
import { residentService } from '../../../services/residentService';
import { Resident, AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { mockProperties, mockBuildings } from '../../../services/mockData';

type ResidentDetailsRouteProps = RouteProp<AdministratorStackParamList, 'ResidentDetails'>;
type NavigationProp = NativeStackNavigationProp<AdministratorStackParamList>;

export const ResidentDetails = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResidentDetailsRouteProps>();
  const { residentId } = route.params;
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('info');
  const [changePropertyVisible, setChangePropertyVisible] = useState(false);
  const [availableProperties, setAvailableProperties] = useState<typeof mockProperties>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  
  useEffect(() => {
    fetchResident();
    fetchAvailableProperties();
  }, [residentId]);
  
  const fetchResident = async () => {
    try {
      const data = await residentService.getResidentById(residentId);
      setResident(data);
    } catch (error) {
      console.error(`Error fetching resident ${residentId}:`, error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const fetchAvailableProperties = () => {
    // Get all vacant properties plus the resident's current property (if any)
    const properties = mockProperties.filter(p => 
      p.status === 'Vacant' || 
      (resident && p.residentId === resident.id)
    );
    setAvailableProperties(properties);
  };
  
  // Filter properties based on search query
  const filteredProperties = propertySearchQuery.length > 0
    ? availableProperties.filter(p => 
        p.name.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
        getBuildingName(p.buildingId).toLowerCase().includes(propertySearchQuery.toLowerCase())
      )
    : availableProperties;
  
  // Get building name
  const getBuildingName = (buildingId: string) => {
    const building = mockBuildings.find(b => b.id === buildingId);
    return building ? building.name : 'Unknown Building';
  };
  
  // Get resident's current property
  const residentProperty = resident
    ? mockProperties.find(p => p.residentId === resident.id)
    : null;
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchResident();
  };
  
  const handleEdit = () => {
    navigation.navigate('EditResident', { residentId });
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Resident',
      `Are you sure you want to delete ${resident?.name}? This action cannot be undone.`,
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
              await residentService.deleteResident(residentId);
              Alert.alert('Success', 'Resident deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting resident:', error);
              Alert.alert('Error', 'Failed to delete resident. Please try again.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  const handleChangeProperty = () => {
    fetchAvailableProperties();
    setSelectedPropertyId(residentProperty?.id || null);
    setChangePropertyVisible(true);
  };
  
  const confirmChangeProperty = () => {
    if (!selectedPropertyId) {
      Alert.alert('Error', 'Please select a property');
      return;
    }
    
    // In a real app, you would make an API call here
    // For now, we'll just show an alert
    Alert.alert(
      'Success',
      'Resident successfully assigned to the new property',
      [
        { 
          text: 'OK', 
          onPress: () => {
            setChangePropertyVisible(false);
            // In a real app, you would refresh the resident data here
            // For demonstration, we navigate back to refresh the screen
            navigation.goBack();
            setTimeout(() => {
              navigation.navigate('ResidentDetails', { residentId });
            }, 100);
          }
        }
      ]
    );
  };
  
  // Placeholder function for communication preferences - will be populated from an API in a real app
  const getCommunicationPreference = () => {
    return "Email"; // Default value
  };
  
  // Placeholder function for pets information - will be populated from an API in a real app
  const getPets = () => {
    return []; // Default empty array
  };
  
  // Placeholder function for account balance - will be populated from an API in a real app 
  const getAccountBalance = () => {
    return 0; // Default value
  };
  
  // Placeholder function for last payment date - will be populated from an API in a real app
  const getLastPaymentDate = () => {
    return "Not available"; // Default value
  };
  
  if (loading && !refreshing) {
    return (
      <>
        <Header 
          title="Resident Details" 
          showBack={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading resident details...
          </Text>
        </View>
      </>
    );
  }
  
  // For safety, in case the resident is not found
  if (!resident) {
    return (
      <>
        <Header 
          title="Resident Details" 
          showBack={true}
        />
        <View style={styles.notFoundContainer}>
          <AlertCircle size={50} color={theme.colors.error} />
          <Text 
            style={[
              styles.notFoundText,
              { color: isDarkMode ? '#fff' : '#333' }
            ]}
          >
            Resident not found
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 16 }}
          >
            Go Back
          </Button>
        </View>
      </>
    );
  }
  
  const Badge = ({ children, color }: { children: string, color: string }) => (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{children}</Text>
    </View>
  );
  
  return (
    <>
      <Header 
        title={resident.name} 
        showBack={true}
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
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: resident.image }} 
            style={styles.profileImage}
          />
          
          <View style={styles.profileInfo}>
            <Text 
              style={[
                styles.profileName,
                { color: isDarkMode ? '#fff' : '#333' }
              ]}
            >
              {resident.name}
            </Text>
            
            <View style={styles.badgesContainer}>
              <Badge
                color={resident.status === 'owner' 
                  ? theme.colors.primary 
                  : '#8e24aa'}
              >
                {resident.status === 'owner' ? 'Owner' : 'Tenant'}
              </Badge>
              
              <Badge
                color={resident.paymentStatus === 'current' 
                  ? STATUS_COLORS.success 
                  : STATUS_COLORS.error}
              >
                {resident.paymentStatus === 'current' ? 'Current' : 'Overdue'}
              </Badge>
            </View>
            
            <View style={styles.unitInfo}>
              <Building size={16} color={isDarkMode ? '#aaa' : '#666'} style={{ marginRight: 4 }} />
              <Text 
                style={[
                  styles.unitText,
                  { color: isDarkMode ? '#aaa' : '#666' }
                ]}
              >
                {resident.building}, Unit {resident.unit}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => {
              // Handle call action
            }}
          >
            <Phone size={20} color="white" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => {
              // Handle email action
            }}
          >
            <Mail size={20} color="white" />
            <Text style={styles.actionButtonText}>Email</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => {
              // Handle message action
            }}
          >
            <MessageSquare size={20} color="white" />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.secondary }
            ]}
            onPress={handleEdit}
          >
            <Edit3 size={20} color="white" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.error }
            ]}
            onPress={handleDelete}
          >
            <Trash2 size={20} color="white" />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
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
              selectedTab === 'payments' && [
                styles.activeTabButton,
                { borderBottomColor: theme.colors.primary }
              ]
            ]}
            onPress={() => setSelectedTab('payments')}
          >
            <Text 
              style={[
                styles.tabButtonText,
                selectedTab === 'payments' && [
                  styles.activeTabButtonText,
                  { color: theme.colors.primary }
                ],
                { color: isDarkMode ? '#aaa' : '#666' }
              ]}
            >
              Payments
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              selectedTab === 'reports' && [
                styles.activeTabButton,
                { borderBottomColor: theme.colors.primary }
              ]
            ]}
            onPress={() => setSelectedTab('reports')}
          >
            <Text 
              style={[
                styles.tabButtonText,
                selectedTab === 'reports' && [
                  styles.activeTabButtonText,
                  { color: theme.colors.primary }
                ],
                { color: isDarkMode ? '#aaa' : '#666' }
              ]}
            >
              Reports
            </Text>
          </TouchableOpacity>
        </View>
        
        {selectedTab === 'info' && (
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
                    { color: isDarkMode ? '#fff' : '#333' }
                  ]}
                >
                  Contact Information
                </Text>
                
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Phone size={20} color={isDarkMode ? theme.colors.primary : theme.colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text 
                      style={[
                        styles.infoLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Phone
                    </Text>
                    <Text 
                      style={[
                        styles.infoValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      {resident.phone}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Mail size={20} color={isDarkMode ? theme.colors.primary : theme.colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text 
                      style={[
                        styles.infoLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Email
                    </Text>
                    <Text 
                      style={[
                        styles.infoValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      {resident.email}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <MessageSquare size={20} color={isDarkMode ? theme.colors.primary : theme.colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text 
                      style={[
                        styles.infoLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Preferred Communication
                    </Text>
                    <Text 
                      style={[
                        styles.infoValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      {getCommunicationPreference()}
                    </Text>
                  </View>
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
                  Residence Details
                </Text>
                
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Building size={20} color={isDarkMode ? theme.colors.primary : theme.colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text 
                      style={[
                        styles.infoLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Building & Unit
                    </Text>
                    <Text 
                      style={[
                        styles.infoValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      {resident.building}, Unit {resident.unit}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <UserRound size={20} color={isDarkMode ? theme.colors.primary : theme.colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text 
                      style={[
                        styles.infoLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Status
                    </Text>
                    <Text 
                      style={[
                        styles.infoValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      {resident.status === 'owner' ? 'Owner' : 'Tenant'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Calendar size={20} color={isDarkMode ? theme.colors.primary : theme.colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text 
                      style={[
                        styles.infoLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Move In Date
                    </Text>
                    <Text 
                      style={[
                        styles.infoValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      {new Date(resident.moveInDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Users size={20} color={isDarkMode ? theme.colors.primary : theme.colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text 
                      style={[
                        styles.infoLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Family Members
                    </Text>
                    <Text 
                      style={[
                        styles.infoValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      {resident.familyMembers}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <PawPrint size={20} color={isDarkMode ? theme.colors.primary : theme.colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text 
                      style={[
                        styles.infoLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Pets
                    </Text>
                    <Text 
                      style={[
                        styles.infoValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      {getPets().join(', ')}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>
        )}
        
        {selectedTab === 'payments' && (
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
                    { color: isDarkMode ? '#fff' : '#333' }
                  ]}
                >
                  Payment Information
                </Text>
                
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Wallet size={20} color={isDarkMode ? theme.colors.primary : theme.colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text 
                      style={[
                        styles.infoLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Payment Status
                    </Text>
                    <Text 
                      style={[
                        styles.infoValue,
                        { 
                          color: resident.paymentStatus === 'current' 
                            ? STATUS_COLORS.success 
                            : STATUS_COLORS.error,
                          fontWeight: 'bold' 
                        }
                      ]}
                    >
                      {resident.paymentStatus === 'current' ? 'Current' : 'Overdue'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Wallet size={20} color={isDarkMode ? theme.colors.primary : theme.colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text 
                      style={[
                        styles.infoLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Account Balance
                    </Text>
                    <Text 
                      style={[
                        styles.infoValue,
                        { 
                          color: getAccountBalance() === 0 
                            ? (isDarkMode ? '#fff' : '#333')
                            : STATUS_COLORS.error,
                          fontWeight: 'bold'
                        }
                      ]}
                    >
                      {getAccountBalance()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.infoItem}>
                  <View style={styles.infoIcon}>
                    <Calendar size={20} color={isDarkMode ? theme.colors.primary : theme.colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text 
                      style={[
                        styles.infoLabel,
                        { color: isDarkMode ? '#aaa' : '#666' }
                      ]}
                    >
                      Last Payment Date
                    </Text>
                    <Text 
                      style={[
                        styles.infoValue,
                        { color: isDarkMode ? '#fff' : '#333' }
                      ]}
                    >
                      {getLastPaymentDate()}
                    </Text>
                  </View>
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
                  Recent Payments
                </Text>
                
                <ListItem
                  title="Monthly Maintenance"
                  subtitle="May 2023"
                  description="€350 • Paid on May 2, 2023"
                  avatar={{
                    icon: <Wallet size={24} color="white" />,
                    color: STATUS_COLORS.success,
                  }}
                  badge={{
                    text: 'Paid',
                    color: STATUS_COLORS.success,
                  }}
                />
                
                <ListItem
                  title="Parking Fee"
                  subtitle="April 2023"
                  description="€50 • Paid on April 15, 2023"
                  avatar={{
                    icon: <Wallet size={24} color="white" />,
                    color: STATUS_COLORS.success,
                  }}
                  badge={{
                    text: 'Paid',
                    color: STATUS_COLORS.success,
                  }}
                  showDivider={false}
                />
                
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Payments' as never)}
                  style={{ marginTop: 16 }}
                >
                  View All Payments
                </Button>
              </Card.Content>
            </Card>
          </View>
        )}
        
        {selectedTab === 'reports' && (
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
                    { color: isDarkMode ? '#fff' : '#333' }
                  ]}
                >
                  Recent Reports
                </Text>
                
                <ListItem
                  title="Water Leak in Bathroom"
                  subtitle="June 5, 2023 • High Priority"
                  description="Reported water leak under the sink. Plumber scheduled."
                  avatar={{
                    icon: <AlertCircle size={24} color="white" />,
                    color: STATUS_COLORS.error,
                  }}
                  badge={{
                    text: 'Open',
                    color: STATUS_COLORS.open,
                  }}
                />
                
                <ListItem
                  title="Light Fixture Replacement"
                  subtitle="May 15, 2023 • Low Priority"
                  description="Kitchen light fixture needs replacement."
                  avatar={{
                    icon: <AlertCircle size={24} color="white" />,
                    color: STATUS_COLORS.resolved,
                  }}
                  badge={{
                    text: 'Resolved',
                    color: STATUS_COLORS.resolved,
                  }}
                  showDivider={false}
                />
                
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Reports' as never)}
                  style={{ marginTop: 16 }}
                >
                  View All Reports
                </Button>
              </Card.Content>
            </Card>
          </View>
        )}
        
        {/* Property Information Card */}
        <Card style={[styles.card, { marginTop: 16 }]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={styles.cardTitle}>Property Information</Text>
              
              <Button
                mode="text"
                compact
                onPress={handleChangeProperty}
              >
                Change
              </Button>
            </View>
            
            <Divider style={styles.divider} />
            
            {residentProperty ? (
              <View>
                <View style={styles.propertyRow}>
                  <Home size={20} color={theme.colors.primary} style={styles.propertyIcon} />
                  <View>
                    <Text variant="bodyLarge" style={styles.propertyName}>
                      {residentProperty.name}
                    </Text>
                    <Text variant="bodyMedium" style={styles.propertyDetails}>
                      {residentProperty.type} • {residentProperty.bedrooms} bed • {residentProperty.bathrooms} bath
                    </Text>
                  </View>
                </View>
                
                <View style={styles.propertyRow}>
                  <Building size={20} color={theme.colors.primary} style={styles.propertyIcon} />
                  <Text variant="bodyMedium">
                    {getBuildingName(residentProperty.buildingId)}
                  </Text>
                </View>
                
                <View style={styles.propertyRow}>
                  <DoorOpen size={20} color={theme.colors.primary} style={styles.propertyIcon} />
                  <Text variant="bodyMedium">
                    Floor {residentProperty.floor} • {residentProperty.floorArea} m²
                  </Text>
                </View>
                
                <View style={styles.propertyRow}>
                  <Wallet size={20} color={theme.colors.primary} style={styles.propertyIcon} />
                  <Text variant="bodyMedium">
                    Monthly Rent: ${residentProperty.rentAmount}
                  </Text>
                </View>
                
                <Button
                  mode="outlined"
                  style={styles.viewPropertyButton}
                  onPress={() => navigation.navigate('PropertyDetails', { propertyId: residentProperty.id })}
                >
                  View Property Details
                </Button>
              </View>
            ) : (
              <View style={styles.noPropertyContainer}>
                <AlertCircle size={24} color={theme.colors.error} style={{ marginBottom: 8 }} />
                <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 16 }}>
                  This resident is not assigned to any property.
                </Text>
                <Button
                  mode="contained"
                  onPress={handleChangeProperty}
                >
                  Assign Property
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        
        <View style={{ height: 80 }} />
      </ScrollView>
      
      {/* Change Property Modal */}
      <Modal
        visible={changePropertyVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChangePropertyVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={styles.modalTitle}>Change Property</Text>
            
            <Searchbar
              placeholder="Search properties..."
              onChangeText={setPropertySearchQuery}
              value={propertySearchQuery}
              style={styles.searchBar}
            />
            
            <FlatList
              data={filteredProperties}
              keyExtractor={(item) => item.id}
              style={styles.propertiesList}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text>No available properties found</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.propertyItem}>
                  <View style={styles.propertyItemDetails}>
                    <View style={[styles.propertyItemIcon, {backgroundColor: theme.colors.primary + '20'}]}>
                      <Home size={20} color={theme.colors.primary} />
                    </View>
                    <View style={styles.propertyItemInfo}>
                      <Text variant="bodyLarge">{item.name}</Text>
                      <Text variant="bodySmall">{getBuildingName(item.buildingId)}</Text>
                      <Text variant="bodySmall">
                        {item.type} • {item.bedrooms} bed • ${item.rentAmount}/mo
                      </Text>
                    </View>
                  </View>
                  
                  <RadioButton
                    value={item.id}
                    status={selectedPropertyId === item.id ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedPropertyId(item.id)}
                  />
                </View>
              )}
            />
            
            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={() => setChangePropertyVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              
              <Button 
                mode="contained"
                onPress={confirmChangeProperty}
                style={styles.modalButton}
                disabled={!selectedPropertyId}
              >
                Confirm
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      
      <FAB
        icon={props => <Edit3 {...props} />}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleEdit}
        color="white"
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
  profileSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  badge: {
    marginRight: 8,
    marginBottom: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  unitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  actionButtonText: {
    color: 'white',
    marginTop: 4,
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginHorizontal: 16,
    marginVertical: 16,
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
  tabContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.5,
  },
  card: {
    margin: 16,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  divider: {
    marginBottom: 16,
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  propertyIcon: {
    marginRight: 12,
  },
  propertyName: {
    fontWeight: 'bold',
  },
  propertyDetails: {
    opacity: 0.7,
  },
  viewPropertyButton: {
    marginTop: 16,
  },
  noPropertyContainer: {
    alignItems: 'center',
    padding: 16,
  },
  searchBar: {
    marginVertical: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  propertiesList: {
    maxHeight: 300,
  },
  propertyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  propertyItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  propertyItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  propertyItemInfo: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    width: '48%',
  },
  emptyList: {
    alignItems: 'center',
    padding: 20,
  },
}); 