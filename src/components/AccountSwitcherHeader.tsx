import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, FlatList, Dimensions, Animated, PanResponder } from 'react-native';
import { Text, Button, Divider, IconButton, useTheme, Surface, Avatar, Chip } from 'react-native-paper';
import { ChevronDown, User, Building2, Check, Minus, ChevronRight, Home, Briefcase } from 'lucide-react-native';
import { useAppSelector } from '../store/hooks';
import { BlurView } from 'expo-blur';

interface Building {
  id: string;
  name: string;
  address: string;
  type: 'residential' | 'commercial' | 'mixed';
  totalUnits: number;
  residentialUnits?: number;
  businessUnits?: number;
}

interface BusinessAccount {
  id: string;
  name: string;
  email?: string;
  buildings: Building[];
}

interface Account {
  id: string;
  name: string;
  role: string;
  email?: string;
  icon?: string;
  type?: 'residential' | 'commercial' | 'mixed';
  address?: string;
  units?: number;
}

interface AccountSwitcherHeaderProps {
  onAccountSwitch: (accountId: string, accountType?: string) => void;
}

export const AccountSwitcherHeader: React.FC<AccountSwitcherHeaderProps> = ({ onAccountSwitch }) => {
  const theme = useTheme();
  const isDarkMode = useAppSelector(state => state.settings.darkMode);
  const { user } = useAppSelector(state => state.auth);
  const isBusinessManager = user?.role === 'business_manager';
  
  const [modalVisible, setModalVisible] = useState(false);
  const [businessAccounts, setBusinessAccounts] = useState<BusinessAccount[]>([]);
  const [adminBuildings, setAdminBuildings] = useState<Building[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(user?.id || '');
  const [selectedAccountName, setSelectedAccountName] = useState<string>('');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [selectedBusinessName, setSelectedBusinessName] = useState<string>('');
  const [showBuildingsList, setShowBuildingsList] = useState(false);
  const [currentBusinessBuildings, setCurrentBusinessBuildings] = useState<Building[]>([]);
  
  // Animation for bottom sheet
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  // Load mock data based on user role
  useEffect(() => {
    if (isBusinessManager) {
      // Mock business accounts with buildings for Business Manager
      const mockBusinessAccounts = [
        {
          id: 'bus1',
          name: 'MainBusiness LLC',
          email: 'main@business.com',
          buildings: [
            { id: 'b1', name: 'Residential Building A', address: '123 Main St', type: 'residential' as const, totalUnits: 24, residentialUnits: 24 },
            { id: 'b2', name: 'Commercial Plaza', address: '456 Market Ave', type: 'commercial' as const, totalUnits: 12, businessUnits: 12 },
            { id: 'b3', name: 'Mixed-Use Development', address: '789 Central Blvd', type: 'mixed' as const, totalUnits: 36, residentialUnits: 30, businessUnits: 6 }
          ]
        },
        {
          id: 'bus2',
          name: 'SecondaryBusiness Inc',
          email: 'secondary@business.com',
          buildings: [
            { id: 'b4', name: 'Downtown Apartments', address: '101 Urban St', type: 'residential' as const, totalUnits: 50, residentialUnits: 50 },
            { id: 'b5', name: 'Tech Office Center', address: '202 Innovation Rd', type: 'commercial' as const, totalUnits: 15, businessUnits: 15 }
          ]
        },
        {
          id: 'bus3',
          name: 'ThirdBusiness Co',
          email: 'third@business.com',
          buildings: [
            { id: 'b6', name: 'Suburban Homes', address: '303 Quiet Ave', type: 'residential' as const, totalUnits: 18, residentialUnits: 18 }
          ]
        }
      ];
      
      setBusinessAccounts(mockBusinessAccounts as BusinessAccount[]);
      
      // Set the initial selected business
      if (!selectedBusinessId && mockBusinessAccounts.length > 0) {
        setSelectedBusinessId(mockBusinessAccounts[0].id);
        setSelectedBusinessName(mockBusinessAccounts[0].name);
        
        // Set the initial selected building
        if (mockBusinessAccounts[0].buildings.length > 0) {
          setSelectedAccountId(mockBusinessAccounts[0].buildings[0].id);
          setSelectedAccountName(mockBusinessAccounts[0].buildings[0].name);
        }
      }
    } else {
      // Mock buildings for Administrator
      const mockBuildings = [
        { id: 'b1', name: 'Residential Building A', address: '123 Main St', type: 'residential' as const, totalUnits: 24, residentialUnits: 24 },
        { id: 'b2', name: 'Commercial Plaza', address: '456 Market Ave', type: 'commercial' as const, totalUnits: 12, businessUnits: 12 },
        { id: 'b3', name: 'Mixed-Use Development', address: '789 Central Blvd', type: 'mixed' as const, totalUnits: 36, residentialUnits: 30, businessUnits: 6 }
      ];
      
      setAdminBuildings(mockBuildings as Building[]);
      
      // Set the initial selected building
      if (!selectedAccountId && mockBuildings.length > 0) {
        setSelectedAccountId(mockBuildings[0].id);
        setSelectedAccountName(mockBuildings[0].name);
      }
    }
  }, [isBusinessManager]);

  useEffect(() => {
    // Update current business buildings when selected business changes
    if (isBusinessManager && selectedBusinessId) {
      const business = businessAccounts.find(bus => bus.id === selectedBusinessId);
      if (business) {
        setCurrentBusinessBuildings(business.buildings);
      }
    }
  }, [selectedBusinessId, businessAccounts, isBusinessManager]);
  
  // Handle animations
  useEffect(() => {
    if (modalVisible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }).start();
    }
  }, [modalVisible, slideAnim]);
  
  const handleOpenModal = () => {
    setModalVisible(true);
    setShowBuildingsList(false); // Reset to business list for business managers
  };
  
  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      setModalVisible(false);
    });
  };
  
  const handleBusinessSelect = (businessId: string) => {
    const selectedBusiness = businessAccounts.find(acc => acc.id === businessId);
    if (selectedBusiness) {
      setSelectedBusinessId(businessId);
      setSelectedBusinessName(selectedBusiness.name);
      setCurrentBusinessBuildings(selectedBusiness.buildings);
      setShowBuildingsList(true);
    }
  };
  
  const handleBuildingSelect = (buildingId: string) => {
    let selectedBuilding: Building | undefined;
    
    if (isBusinessManager) {
      selectedBuilding = currentBusinessBuildings.find(b => b.id === buildingId);
    } else {
      selectedBuilding = adminBuildings.find(b => b.id === buildingId);
    }
    
    if (selectedBuilding) {
      setSelectedAccountId(buildingId);
      setSelectedAccountName(selectedBuilding.name);
      handleCloseModal();
      onAccountSwitch(buildingId, 'building');
    }
  };

  const handleBackToBusinesses = () => {
    setShowBuildingsList(false);
  };
  
  // Calculate the translate Y value for the bottom sheet
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
    extrapolate: 'clamp'
  });
  
  // Create the pan responder for swipe down to close
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(1 - gestureState.dy / 400);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100) {
          handleCloseModal();
        } else {
          Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7
          }).start();
        }
      }
    })
  ).current;
  
  const getBuildingIcon = (type: string) => {
    switch (type) {
      case 'residential':
        return <Home size={16} color={theme.colors.onSurfaceVariant} />;
      case 'commercial':
        return <Briefcase size={16} color={theme.colors.onSurfaceVariant} />;
      case 'mixed':
        return <Building2 size={16} color={theme.colors.onSurfaceVariant} />;
      default:
        return <Building2 size={16} color={theme.colors.onSurfaceVariant} />;
    }
  };
  
  const getBuildingTypeLabel = (type: string) => {
    switch (type) {
      case 'residential':
        return 'Residential';
      case 'commercial':
        return 'Commercial';
      case 'mixed':
        return 'Mixed Use';
      default:
        return 'Building';
    }
  };
  
  const renderBusinessItem = ({ item }: { item: BusinessAccount }) => {
    const isSelected = selectedBusinessId === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.accountItem,
          isSelected && {
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 12
          }
        ]}
        onPress={() => handleBusinessSelect(item.id)}
      >
        <View style={styles.accountItemContent}>
          <Avatar.Icon 
            size={44} 
            icon="domain"
            style={{
              backgroundColor: isSelected 
                ? theme.colors.primary 
                : theme.colors.surfaceVariant
            }}
            color={isSelected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
          />
          <View style={styles.accountInfo}>
            <Text 
              variant="titleMedium" 
              style={[
                styles.accountName, 
                { 
                  color: isSelected ? theme.colors.primary : theme.colors.onSurface,
                  fontWeight: isSelected ? 'bold' : 'normal'  
                }
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text 
              variant="bodySmall" 
              style={{ 
                color: theme.colors.onSurfaceVariant 
              }}
              numberOfLines={1}
            >
              {item.buildings.length} {item.buildings.length === 1 ? 'Building' : 'Buildings'}
            </Text>
          </View>
          <ChevronRight size={20} color={theme.colors.onSurfaceVariant} />
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderBuildingItem = ({ item }: { item: Building }) => {
    const isSelected = selectedAccountId === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.accountItem,
          isSelected && {
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 12
          }
        ]}
        onPress={() => handleBuildingSelect(item.id)}
      >
        <View style={styles.accountItemContent}>
          <Avatar.Icon 
            size={44} 
            icon={item.type === 'residential' ? 'home' : item.type === 'commercial' ? 'office-building' : 'domain'}
            style={{
              backgroundColor: isSelected 
                ? theme.colors.primary 
                : theme.colors.surfaceVariant
            }}
            color={isSelected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
          />
          <View style={styles.accountInfo}>
            <Text 
              variant="titleMedium" 
              style={[
                styles.accountName, 
                { 
                  color: isSelected ? theme.colors.primary : theme.colors.onSurface,
                  fontWeight: isSelected ? 'bold' : 'normal'  
                }
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <View style={styles.buildingDetails}>
              <Text 
                variant="bodySmall" 
                style={{ color: theme.colors.onSurfaceVariant }}
                numberOfLines={1}
              >
                {item.address}
              </Text>
              <View style={styles.buildingStats}>
                <Chip 
                  style={styles.typeChip} 
                  textStyle={{ fontSize: 10 }}
                  icon={() => getBuildingIcon(item.type)}
                >
                  {getBuildingTypeLabel(item.type)}
                </Chip>
                <Text 
                  variant="bodySmall" 
                  style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8 }}
                >
                  {item.totalUnits} {item.totalUnits === 1 ? 'Unit' : 'Units'}
                </Text>
              </View>
            </View>
          </View>
          {isSelected && (
            <Check size={20} color={theme.colors.primary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Determine what to show: buildings for admin, businesses or buildings for business manager
  const renderContent = () => {
    if (isBusinessManager) {
      if (showBuildingsList) {
        return (
          <>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={handleBackToBusinesses}
              >
                <IconButton
                  icon="arrow-left"
                  size={20}
                  onPress={handleBackToBusinesses}
                />
                <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                  Back to Businesses
                </Text>
              </TouchableOpacity>
              <IconButton
                icon="close"
                size={24}
                onPress={handleCloseModal}
                style={styles.closeButton}
              />
            </View>
            
            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold', marginBottom: 8 }}>
              {selectedBusinessName}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
              Select a building to manage
            </Text>
            <Divider style={{ backgroundColor: theme.colors.outlineVariant, marginBottom: 16 }} />
            
            <FlatList
              data={currentBusinessBuildings}
              keyExtractor={(item) => item.id}
              renderItem={renderBuildingItem}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={{ color: theme.colors.onSurfaceVariant }}>
                    No buildings found for this business
                  </Text>
                </View>
              }
            />
          </>
        );
      } else {
        return (
          <>
            <View style={styles.modalHeader}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                Business Accounts
              </Text>
              <IconButton
                icon="close"
                size={24}
                onPress={handleCloseModal}
                style={styles.closeButton}
              />
            </View>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
              Select a business to view its buildings
            </Text>
            <Divider style={{ backgroundColor: theme.colors.outlineVariant, marginBottom: 16 }} />
            
            <FlatList
              data={businessAccounts}
              keyExtractor={(item) => item.id}
              renderItem={renderBusinessItem}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              contentContainerStyle={styles.listContainer}
            />
          </>
        );
      }
    } else {
      // Administrator view - just show buildings
      return (
        <>
          <View style={styles.modalHeader}>
            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
              Buildings
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={handleCloseModal}
              style={styles.closeButton}
            />
          </View>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
            Select a building to manage
          </Text>
          <Divider style={{ backgroundColor: theme.colors.outlineVariant, marginBottom: 16 }} />
          
          <FlatList
            data={adminBuildings}
            keyExtractor={(item) => item.id}
            renderItem={renderBuildingItem}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            contentContainerStyle={styles.listContainer}
          />
        </>
      );
    }
  };
  
  return (
    <>
      <TouchableOpacity onPress={handleOpenModal} style={[
        styles.button,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.outlineVariant,
        }
      ]}>
        <Avatar.Icon 
          size={24} 
          icon={isBusinessManager ? 'domain' : 'home'} 
          style={styles.buttonIcon}
          color={theme.colors.onSurfaceVariant}
        />
        <Text 
          style={[styles.buttonText, { color: theme.colors.onSurface }]} 
          numberOfLines={1}
        >
          {selectedAccountName}
        </Text>
        <ChevronDown size={16} color={theme.colors.onSurfaceVariant} />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <BlurView intensity={10} style={styles.modalOverlay} tint={isDarkMode ? "dark" : "light"}>
          <TouchableOpacity 
            style={styles.backdropTouchable} 
            activeOpacity={1} 
            onPress={handleCloseModal} 
          />
          
          <Animated.View 
            style={[
              styles.bottomSheetContainer, 
              { 
                transform: [{ translateY }],
                backgroundColor: theme.colors.surface
              }
            ]}
            {...panResponder.panHandlers}
          >
            {/* Drag handle */}
            <View style={styles.dragHandleContainer}>
              <View style={[styles.dragHandle, { backgroundColor: theme.colors.outlineVariant }]} />
            </View>
            
            <View style={styles.bottomSheetContent}>
              {renderContent()}
            </View>
          </Animated.View>
        </BlurView>
      </Modal>
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    maxWidth: 200,
    elevation: 1,
  },
  buttonIcon: {
    marginRight: 8,
    backgroundColor: 'transparent',
    height: 24,
    width: 24,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    maxHeight: height * 0.85,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  bottomSheetContent: {
    padding: 20,
    paddingTop: 0,
  },
  dragHandleContainer: {
    width: '100%',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    opacity: 0.5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    margin: -8,
  },
  listContainer: {
    paddingVertical: 8,
  },
  accountItem: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 2,
  },
  accountItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  accountIcon: {
    fontSize: 24,
  },
  accountInfo: {
    flex: 1,
    marginLeft: 16,
  },
  accountName: {
    marginBottom: 2,
  },
  buildingDetails: {
    flex: 1,
  },
  buildingStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  typeChip: {
    height: 22,
    alignItems: 'center',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  }
}); 