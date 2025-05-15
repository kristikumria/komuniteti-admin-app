import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button, Card, Chip, Divider, FAB, ActivityIndicator, IconButton, Badge, Banner } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdministratorStackParamList } from '../../../navigation/types';
import { Header } from '../../../components/Header';
import { Home, User, DollarSign, Calendar, Edit, ArrowLeft, ArrowRight, Users, Briefcase, Car, Archive, Mail, Phone, Building2, Circle } from 'lucide-react-native';
import { useAppSelector } from '../../../store/hooks';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { STATUS_COLORS } from '../../../utils/constants';
import { useContextData } from '../../../hooks/useContextData';

// Define Unit type
interface Unit {
  id: string;
  number: string;
  floor: number;
  buildingId: string;
  building: string;
  type: 'residential' | 'business' | 'storage' | 'parking';
  status: 'occupied' | 'vacant' | 'maintenance';
  area: number;
  // Residential-specific properties
  bedrooms?: number;
  bathrooms?: number;
  resident?: string;
  residentId?: string;
  residentCount?: number;
  residents?: Resident[];
  // Business-specific properties
  businessName?: string;
  businessType?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  // Common properties
  rent?: number;
  leaseStart?: string;
  leaseEnd?: string;
  lastMaintenance?: string;
}

// Define a Resident type
interface Resident {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isPrimary?: boolean;
}

// Mock images for units
const mockUnitImages: Record<string, string[]> = {
  'unit-1': [
    'https://images.unsplash.com/photo-1569597970494-886d9611a7c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  ],
  'unit-2': [
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  ],
  'bunit-1': [
    'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1517502884422-41eaead166d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  ],
  'sunit-1': [
    'https://images.unsplash.com/photo-1505491589873-7866acd708f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  ],
  'punit-1': [
    'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  ]
};

// Mock data for units with all types
const mockUnits: Unit[] = [
  // Residential units
  {
    id: 'unit-1',
    number: '101',
    floor: 1,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    type: 'residential',
    status: 'occupied',
    area: 85,
    bedrooms: 2,
    bathrooms: 1,
    resident: 'John Doe',
    residentId: 'resident-1',
    residentCount: 3,
    residents: [
      { id: 'resident-1', name: 'John Doe', email: 'john.doe@example.com', phone: '+355 68 123 4567', isPrimary: true },
      { id: 'resident-2', name: 'Jane Doe', email: 'jane.doe@example.com', phone: '+355 69 987 6543', isPrimary: false },
      { id: 'resident-3', name: 'Bob Smith', email: 'bob.smith@example.com', phone: '+355 67 456 7890', isPrimary: false }
    ],
    rent: 850,
    lastMaintenance: '2023-08-15',
  },
  {
    id: 'unit-2',
    number: '102',
    floor: 1,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    type: 'residential',
    status: 'vacant',
    area: 65,
    bedrooms: 1,
    bathrooms: 1,
    residentCount: 0,
    residents: [],
    rent: 650,
    lastMaintenance: '2023-09-20',
  },
  {
    id: 'unit-3',
    number: '201',
    floor: 2,
    buildingId: 'building-2',
    building: 'Park View Residence',
    type: 'residential',
    status: 'occupied',
    area: 110,
    bedrooms: 3,
    bathrooms: 2,
    resident: 'Jane Smith',
    residentId: 'resident-4',
    residentCount: 4,
    residents: [
      { id: 'resident-4', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+355 66 111 2222', isPrimary: true },
      { id: 'resident-5', name: 'Mike Johnson', email: 'mike.j@example.com', phone: '+355 69 333 4444', isPrimary: false },
      { id: 'resident-6', name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '+355 68 555 6666', isPrimary: false },
      { id: 'resident-7', name: 'Tom Brown', email: 'tom.b@example.com', phone: '+355 67 777 8888', isPrimary: false }
    ],
    rent: 1100,
    lastMaintenance: '2023-07-10',
  },
  // Business units
  {
    id: 'bunit-1',
    number: 'B101',
    floor: 0,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    type: 'business',
    status: 'occupied',
    area: 120,
    businessName: 'Coffee Shop LLC',
    businessType: 'Food & Beverage',
    contactPerson: 'Maria Popescu',
    contactEmail: 'maria@coffeeshop.al',
    contactPhone: '+355 69 123 4567',
    rent: 1800,
    leaseStart: '2022-05-01',
    leaseEnd: '2025-05-01',
    lastMaintenance: '2023-07-12',
  },
  // Storage units
  {
    id: 'sunit-1',
    number: 'S08',
    floor: -2,
    buildingId: 'building-2',
    building: 'Park View Residence',
    type: 'storage',
    status: 'vacant',
    area: 8,
    rent: 75,
    lastMaintenance: '2023-09-15',
  },
  // Parking units
  {
    id: 'punit-1',
    number: 'P12',
    floor: -1,
    buildingId: 'building-1',
    building: 'Riviera Towers',
    type: 'parking',
    status: 'occupied',
    area: 15,
    resident: 'John Doe',
    residentId: 'resident-1',
    residentCount: 1,
    rent: 100,
    lastMaintenance: '2023-10-05',
  },
];

// Update Props to include hideHeader for tablet layout
type Props = NativeStackScreenProps<AdministratorStackParamList, 'UnitDetails'> & {
  hideHeader?: boolean;
};

export const UnitDetails = ({ route, navigation, hideHeader = false }: Props) => {
  const { unitId } = route.params;
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  const { currentBuilding } = useContextData();
  
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [unitImages, setUnitImages] = useState<string[]>([]);
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, just use mock data
    const foundUnit = mockUnits.find(u => u.id === unitId);
    if (foundUnit) {
      setUnit(foundUnit);
      
      // Get mock images for the unit, or use default image based on unit type
      const defaultImage = getDefaultImageForType(foundUnit.type);
      const images = mockUnitImages[unitId] || [defaultImage];
      setUnitImages(images);
    }
    
    setLoading(false);
  }, [unitId]);
  
  const getDefaultImageForType = (type: string): string => {
    switch (type) {
      case 'residential':
        return 'https://images.unsplash.com/photo-1560185008-b033106af5c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
      case 'business':
        return 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
      case 'storage':
        return 'https://images.unsplash.com/photo-1505491589873-7866acd708f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
      case 'parking':
        return 'https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
      default:
        return 'https://images.unsplash.com/photo-1560185008-b033106af5c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
    }
  };
  
  const handleEditUnit = () => {
    navigation.navigate('EditUnit', { unitId });
  };
  
  const handleViewOccupant = () => {
    if (unit?.type === 'residential' && unit?.residentId) {
      navigation.navigate('ResidentDetails', { residentId: unit.residentId });
    }
    // For business units, could navigate to a business details screen
  };
  
  const handleContact = (type: 'email' | 'phone') => {
    if (!unit) return;
    
    if (type === 'email' && unit.contactEmail) {
      console.log(`Opening email to: ${unit.contactEmail}`);
      // In a real app, would open email app
    } else if (type === 'phone' && unit.contactPhone) {
      console.log(`Calling: ${unit.contactPhone}`);
      // In a real app, would open phone app
    }
  };
  
  const nextImage = () => {
    if (currentImageIndex < unitImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return STATUS_COLORS.success;
      case 'vacant':
        return STATUS_COLORS.info;
      case 'maintenance':
        return STATUS_COLORS.warning;
      default:
        return STATUS_COLORS.default;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const renderUnitTypeIcon = () => {
    if (!unit) return <Building2 size={24} color={theme.colors.primary} />;
    
    switch (unit.type) {
      case 'residential':
        return <Home size={24} color={theme.colors.primary} />;
      case 'business':
        return <Briefcase size={24} color={theme.colors.primary} />;
      case 'storage':
        return <Archive size={24} color={theme.colors.primary} />;
      case 'parking':
        return <Car size={24} color={theme.colors.primary} />;
      default:
        return <Building2 size={24} color={theme.colors.primary} />;
    }
  };
  
  const renderOccupantSection = () => {
    if (!unit) return null;
    
    if (unit.type === 'residential' && (unit.resident || (unit.residents && unit.residents.length > 0))) {
      return (
        <Card style={styles.detailCard}>
          <Card.Title
            title="Resident Information"
            left={(props) => <Users {...props} />}
          />
          <Card.Content>
            {unit.residentCount && unit.residentCount > 0 ? (
              <>
                <View style={styles.residentCountRow}>
                  <Text style={styles.sectionSubtitle}>
                    {unit.residentCount} Resident{unit.residentCount !== 1 ? 's' : ''}
                  </Text>
                  <Button
                    mode="text"
                    onPress={() => navigation.navigate('AddResident')}
                    style={styles.addButton}
                  >
                    Add Resident
                  </Button>
                </View>

                {unit.residents && unit.residents.length > 0 ? (
                  <View style={styles.residentsList}>
                    {unit.residents.map((resident, index) => (
                      <Card key={resident.id} style={styles.residentCard}>
                        <Card.Content style={styles.residentCardContent}>
                          <View style={styles.residentAvatarContainer}>
                            <Users size={24} color={theme.colors.primary} />
                            {resident.isPrimary && (
                              <Badge style={styles.primaryBadge}>
                                P
                              </Badge>
                            )}
                          </View>
                          <View style={styles.residentDetails}>
                            <Text style={styles.residentName}>
                              {resident.name}
                            </Text>
                            <View style={styles.residentContactRow}>
                              {resident.email && (
                                <View style={styles.contactItem}>
                                  <Mail size={14} color={theme.colors.secondary} style={styles.contactIcon} />
                                  <Text style={styles.residentContact}>{resident.email}</Text>
                                </View>
                              )}
                              {resident.phone && (
                                <View style={styles.contactItem}>
                                  <Phone size={14} color={theme.colors.secondary} style={styles.contactIcon} />
                                  <Text style={styles.residentContact}>{resident.phone}</Text>
                                </View>
                              )}
                            </View>
                          </View>
                          <Button
                            mode="outlined"
                            onPress={() => navigation.navigate('ResidentDetails', { residentId: resident.id })}
                            style={styles.viewResidentButton}
                            compact
                          >
                            Details
                          </Button>
                        </Card.Content>
                      </Card>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noResidentsText}>No resident details available</Text>
                )}
              </>
            ) : (
              <View style={styles.emptyResidentSection}>
                <Text style={styles.noResidentsText}>No residents assigned to this unit</Text>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('AddResident')}
                  style={styles.addResidentButton}
                  icon={({ size, color }) => <Users size={size} color={color} />}
                >
                  Add Resident
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      );
    } else if (unit.type === 'business' && unit.businessName) {
      return (
        <Card style={styles.detailCard}>
          <Card.Title
            title="Business Information"
            left={(props) => <Briefcase {...props} />}
          />
          <Card.Content>
            <Text style={styles.occupantName}>{unit.businessName}</Text>
            <Text style={styles.occupantSubtitle}>{unit.businessType}</Text>
            
            {unit.contactPerson && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Contact Person:</Text>
                <Text style={styles.contactValue}>{unit.contactPerson}</Text>
              </View>
            )}
            
            <View style={styles.contactActions}>
              {unit.contactEmail && (
                <Button
                  mode="outlined"
                  icon={Mail}
                  onPress={() => handleContact('email')}
                  style={styles.contactButton}
                >
                  Email
                </Button>
              )}
              
              {unit.contactPhone && (
                <Button
                  mode="outlined"
                  icon={Phone}
                  onPress={() => handleContact('phone')}
                  style={styles.contactButton}
                >
                  Call
                </Button>
              )}
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.leaseDetails}>
              <View style={styles.leaseItem}>
                <Text style={styles.leaseLabel}>Lease Start:</Text>
                <Text style={styles.leaseValue}>{formatDate(unit.leaseStart)}</Text>
              </View>
              
              <View style={styles.leaseItem}>
                <Text style={styles.leaseLabel}>Lease End:</Text>
                <Text style={styles.leaseValue}>{formatDate(unit.leaseEnd)}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      );
    } else if (unit.status === 'vacant') {
      return (
        <Banner
          visible={true}
          icon={({ size }) => (
            <Circle
              size={size}
              color={theme.colors.primary}
              strokeWidth={2}
              fill="transparent"
            />
          )}
          actions={[
            {
              label: 'Add Occupant',
              onPress: () => {
                if (unit.type === 'residential') {
                  navigation.navigate('AddResident');
                } else if (unit.type === 'business') {
                  // Would navigate to add business screen
                  console.log('Add business tenant');
                }
              },
            },
          ]}
        >
          This unit is currently vacant and available for occupancy.
        </Banner>
      );
    } else if (unit.status === 'maintenance') {
      return (
        <Banner
          visible={true}
          icon={({ size }) => (
            <Circle
              size={size}
              color={theme.colors.error}
              strokeWidth={2}
              fill="transparent"
            />
          )}
        >
          This unit is currently under maintenance and not available for occupancy.
        </Banner>
      );
    }
    
    return null;
  };
  
  // Show loading state
  if (loading) {
    return (
      <>
        {!hideHeader && (
          <Header 
            title="Unit Details" 
            showBack={true}
          />
        )}
        <View style={commonStyles.centeredContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16 }}>Loading unit details...</Text>
        </View>
      </>
    );
  }

  // Show error state if unit not found
  if (!unit) {
    return (
      <>
        {!hideHeader && (
          <Header 
            title="Unit Details" 
            showBack={true}
          />
        )}
        <View style={commonStyles.centeredContainer}>
          <Text>Unit not found. The unit may have been deleted.</Text>
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
  
  return (
    <View style={styles.container}>
      {!hideHeader && (
        <Header 
          title={`Unit ${unit.number}`} 
          subtitle={`${unit.building}, Floor ${unit.floor}`}
          showBack={true}
          rightAction={
            <TouchableOpacity onPress={handleEditUnit}>
              <Edit size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          }
        />
      )}
      
      <ScrollView style={styles.scrollView}>
        {/* Unit Images */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: unitImages[currentImageIndex] }}
            style={styles.unitImage}
            resizeMode="cover"
          />
          
          {unitImages.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.imageNavButton, styles.prevButton]}
                onPress={prevImage}
                disabled={currentImageIndex === 0}
              >
                <ArrowLeft size={24} color={currentImageIndex === 0 ? '#ccc' : theme.colors.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.imageNavButton, styles.nextButton]}
                onPress={nextImage}
                disabled={currentImageIndex === unitImages.length - 1}
              >
                <ArrowRight size={24} color={currentImageIndex === unitImages.length - 1 ? '#ccc' : theme.colors.primary} />
              </TouchableOpacity>
              
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1}/{unitImages.length}
                </Text>
              </View>
              
              {/* Image indicators */}
              <View style={styles.indicatorContainer}>
                {unitImages.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.indicator, 
                      index === currentImageIndex && styles.activeIndicator,
                      { backgroundColor: index === currentImageIndex ? theme.colors.primary : 'rgba(255,255,255,0.6)' }
                    ]} 
                  />
                ))}
              </View>
            </>
          )}
        </View>
        
        {/* Unit Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerSection}>
              <View style={styles.unitInfo}>
                <Text style={styles.unitNumber}>Unit {unit.number}</Text>
                <View style={styles.buildingRow}>
                  <Building2 size={16} color={theme.colors.secondary} style={styles.buildingIcon} />
                  <Text style={styles.buildingName}>{unit.building}</Text>
                </View>
              </View>
              
              <Badge
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(unit.status) }
                ]}
              >
                {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
              </Badge>
            </View>
            
            {/* Unit Type Tag */}
            <View style={styles.typeContainer}>
              <View style={[styles.typeTag, { backgroundColor: `${theme.colors.primary}15` }]}>
                {renderUnitTypeIcon()}
                <Text style={[styles.typeText, { color: theme.colors.primary }]}>
                  {unit.type.charAt(0).toUpperCase() + unit.type.slice(1)}
                </Text>
              </View>
              
              <Chip mode="outlined" style={styles.floorChip}>
                Floor {unit.floor}
              </Chip>
              
              <Chip mode="outlined" style={styles.areaChip}>
                {unit.area} m²
              </Chip>
            </View>
          </Card.Content>
        </Card>
        
        {/* Unit Basic Details */}
        <Card style={styles.detailCard}>
          <Card.Title
            title="Unit Details"
            left={(props) => <Building2 {...props} color={theme.colors.primary} />}
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Floor</Text>
                <Text style={styles.detailValue}>{unit.floor}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Area</Text>
                <Text style={styles.detailValue}>{unit.area} m²</Text>
              </View>
              
              {unit.rent && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Monthly Rent</Text>
                  <Text style={styles.detailValue}>€{unit.rent}</Text>
                </View>
              )}
            </View>
            
            {/* Type-specific details */}
            {unit.type === 'residential' && (
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Bedrooms</Text>
                  <Text style={styles.detailValue}>{unit.bedrooms}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Bathrooms</Text>
                  <Text style={styles.detailValue}>{unit.bathrooms}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Last Maintenance</Text>
                  <Text style={styles.detailValue}>{formatDate(unit.lastMaintenance)}</Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
        
        {/* Resident/Business Information */}
        {renderOccupantSection()}
        
        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            mode="outlined"
            icon={Edit}
            onPress={handleEditUnit}
            style={styles.actionButton}
          >
            Edit Unit
          </Button>
        </View>
      </ScrollView>
      
      <FAB
        icon="pencil"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleEditUnit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  unitImage: {
    width: '100%',
    height: '100%',
  },
  imageNavButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 12,
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  unitInfo: {
    flex: 1,
  },
  unitNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buildingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buildingIcon: {
    marginRight: 8,
  },
  buildingName: {
    fontSize: 16,
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typeContainer: {
    marginBottom: 16,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  typeText: {
    marginLeft: 8,
    fontWeight: '500',
  },
  detailCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detailItem: {
    minWidth: '30%',
    marginRight: 12,
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  occupantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  occupantInfo: {
    flex: 1,
  },
  occupantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  occupantSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  viewButton: {
    borderRadius: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  contactIcon: {
    marginRight: 4,
  },
  contactLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  contactActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  contactButton: {
    marginRight: 12,
    borderRadius: 20,
  },
  divider: {
    marginVertical: 16,
  },
  leaseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leaseItem: {
    flex: 1,
  },
  leaseLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  leaseValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: 80,
    marginTop: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  residentCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  residentsList: {
    marginBottom: 16,
  },
  residentCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  residentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  residentAvatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  residentDetails: {
    flex: 1,
  },
  residentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  primaryBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  residentContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  residentContact: {
    fontSize: 14,
    opacity: 0.7,
  },
  viewResidentButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  residentDivider: {
    marginVertical: 8,
  },
  emptyResidentSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  noResidentsText: {
    fontSize: 16,
    marginBottom: 12,
  },
  addResidentButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#007bff',
  },
  floorChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  areaChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
