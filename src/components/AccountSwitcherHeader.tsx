import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, FlatList, Dimensions, Animated, PanResponder } from 'react-native';
import { Text, Button, Divider, IconButton, useTheme, Surface, Avatar, Chip } from 'react-native-paper';
import { ChevronDown, User, Building2, Check, Minus, ChevronRight, Home, Briefcase, X, ChevronLeft } from 'lucide-react-native';
import { useAppSelector } from '../store/hooks';
import { BlurView } from 'expo-blur';
import { ElevationLevel } from '../theme';
import type { AppTheme } from '../theme/theme';

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

/**
 * Account switcher header component that allows users to switch between business accounts and buildings.
 * Follows Material Design 3 guidelines with proper elevation, interactive states, and accessibility.
 * 
 * @example
 * <AccountSwitcherHeader onAccountSwitch={(id, type) => handleAccountSwitch(id, type)} />
 */
export const AccountSwitcherHeader: React.FC<AccountSwitcherHeaderProps> = ({ onAccountSwitch }) => {
  const theme = useTheme() as AppTheme;
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
  
  // Animations for bottom sheet and overlay
  const slideAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  
  // Pan responder for dragging the bottom sheet
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          const newValue = 1 - (gestureState.dy / (Dimensions.get('window').height * 0.6));
          slideAnim.setValue(Math.max(0, Math.min(1, newValue)));
          overlayOpacity.setValue(Math.max(0, Math.min(1, newValue * 0.7)));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          handleCloseModal();
        } else {
          Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
          Animated.timing(overlayOpacity, {
            toValue: 0.7,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;
  
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
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.7,
          duration: 250,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [modalVisible, slideAnim, overlayOpacity]);
  
  const handleOpenModal = () => {
    setModalVisible(true);
    setShowBuildingsList(false); // Reset to business list for business managers
  };
  
  const handleCloseModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
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
    outputRange: [Dimensions.get('window').height, 0],
  });
  
  // Calculate the border radius based on the animation progress
  const borderRadius = slideAnim.interpolate({
    inputRange: [0.9, 1],
    outputRange: [20, 0],
    extrapolate: 'clamp',
  });
  
  const getBuildingIcon = (type: string) => {
    switch (type) {
      case 'residential':
        return <Home size={24} color={theme.colors.primary} />;
      case 'commercial':
        return <Briefcase size={24} color={theme.colors.primary} />;
      case 'mixed':
        return <Building2 size={24} color={theme.colors.primary} />;
      default:
        return <Building2 size={24} color={theme.colors.primary} />;
    }
  };
  
  const getBuildingTypeLabel = (type: string) => {
    switch (type) {
      case 'residential':
        return 'Residential';
      case 'commercial':
        return 'Commercial';
      case 'mixed':
        return 'Mixed-Use';
      default:
        return 'Unknown';
    }
  };
  
  const getBuildingTypeChipColor = (type: string) => {
    switch (type) {
      case 'residential':
        return { background: theme.colors.primaryContainer, text: theme.colors.onPrimaryContainer };
      case 'commercial':
        return { background: theme.colors.secondaryContainer, text: theme.colors.onSecondaryContainer };
      case 'mixed':
        return { background: theme.colors.tertiaryContainer, text: theme.colors.onTertiaryContainer };
      default:
        return { background: theme.colors.surfaceVariant, text: theme.colors.onSurfaceVariant };
    }
  };
  
  const renderBusinessItem = ({ item }: { item: BusinessAccount }) => {
    const isSelected = item.id === selectedBusinessId;
    
    return (
      <TouchableOpacity
        style={[
          styles(theme).listItem,
          isSelected && styles(theme).selectedItem
        ]}
        onPress={() => handleBusinessSelect(item.id)}
        accessibilityRole="radio"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`${item.name}${item.email ? `, ${item.email}` : ''}, ${item.buildings.length} buildings`}
      >
        <View style={styles(theme).listItemContent}>
          <View style={styles(theme).iconContainer}>
            <Avatar.Icon 
              size={40} 
              icon={props => <Briefcase {...props} />} 
              style={{ backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
              color={isSelected ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant}
            />
          </View>
          
          <View style={styles(theme).itemDetails}>
            <Text 
              variant="titleMedium" 
              style={[
                styles(theme).itemTitle,
                isSelected && { color: theme.colors.primary }
              ]}
            >
              {item.name}
            </Text>
            {item.email && (
              <Text 
                variant="bodySmall" 
                style={styles(theme).itemSubtitle}
              >
                {item.email}
              </Text>
            )}
            <Text 
              variant="labelSmall" 
              style={styles(theme).buildingCount}
            >
              {item.buildings.length} {item.buildings.length === 1 ? 'building' : 'buildings'}
            </Text>
          </View>
          
          <View style={styles(theme).actionContainer}>
            {isSelected ? (
              <Check size={24} color={theme.colors.primary} />
            ) : (
              <ChevronRight size={20} color={theme.colors.onSurfaceVariant} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderBuildingItem = ({ item }: { item: Building }) => {
    const isSelected = item.id === selectedAccountId;
    const chipColors = getBuildingTypeChipColor(item.type);
    
    return (
      <TouchableOpacity
        style={[
          styles(theme).listItem,
          isSelected && styles(theme).selectedItem
        ]}
        onPress={() => handleBuildingSelect(item.id)}
        accessibilityRole="radio"
        accessibilityState={{ checked: isSelected }}
        accessibilityLabel={`${item.name}, ${getBuildingTypeLabel(item.type)}, ${item.address}, ${item.totalUnits} units`}
      >
        <View style={styles(theme).listItemContent}>
          <View style={styles(theme).iconContainer}>
            <Avatar.Icon 
              size={40} 
              icon={props => getBuildingIcon(item.type)}
              style={{ backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
              color={isSelected ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant}
            />
          </View>
          
          <View style={styles(theme).itemDetails}>
            <Text 
              variant="titleMedium" 
              style={[
                styles(theme).itemTitle,
                isSelected && { color: theme.colors.primary }
              ]}
            >
              {item.name}
            </Text>
            
            <Text 
              variant="bodySmall" 
              style={styles(theme).itemSubtitle}
            >
              {item.address}
            </Text>
            
            <View style={styles(theme).chipContainer}>
              <Chip 
                style={[
                  styles(theme).chip, 
                  { backgroundColor: chipColors.background }
                ]}
                textStyle={{ color: chipColors.text, fontSize: 12 }}
              >
                {getBuildingTypeLabel(item.type)}
              </Chip>
              
              <Text variant="labelSmall" style={styles(theme).unitsText}>
                {item.totalUnits} {item.totalUnits === 1 ? 'unit' : 'units'}
              </Text>
            </View>
          </View>
          
          {isSelected && (
            <View style={styles(theme).actionContainer}>
              <Check size={24} color={theme.colors.primary} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderDragHandle = () => (
    <View {...panResponder.panHandlers} style={styles(theme).dragHandle}>
      <View style={styles(theme).dragIndicator} />
    </View>
  );
  
  const renderHeader = () => (
    <View style={styles(theme).modalHeader}>
      {showBuildingsList && isBusinessManager ? (
        <>
          <Button
            mode="text"
            icon={() => <ChevronLeft size={18} color={theme.colors.primary} />}
            onPress={handleBackToBusinesses}
            style={styles(theme).backButton}
            accessibilityLabel="Back to business accounts"
          >
            Back
          </Button>
          <Text variant="titleMedium" style={styles(theme).modalTitle}>
            {selectedBusinessName} Buildings
          </Text>
        </>
      ) : (
        <Text variant="titleLarge" style={styles(theme).modalTitle}>
          {isBusinessManager ? 'Select Business Account' : 'Select Building'}
        </Text>
      )}
      
      <IconButton
        icon={() => <X size={20} color={theme.colors.onSurfaceVariant} />}
        onPress={handleCloseModal}
        accessibilityLabel="Close"
      />
    </View>
  );
  
  const renderContent = () => {
    if (showBuildingsList && isBusinessManager) {
      return (
        <FlatList
          data={currentBusinessBuildings}
          renderItem={renderBuildingItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider style={styles(theme).divider} />}
          contentContainerStyle={styles(theme).listContent}
          ListEmptyComponent={() => (
            <View style={styles(theme).emptyContainer}>
              <Text variant="bodyMedium" style={styles(theme).emptyText}>
                No buildings found for this business account.
              </Text>
            </View>
          )}
        />
      );
    } else if (isBusinessManager) {
      return (
        <FlatList
          data={businessAccounts}
          renderItem={renderBusinessItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider style={styles(theme).divider} />}
          contentContainerStyle={styles(theme).listContent}
          ListEmptyComponent={() => (
            <View style={styles(theme).emptyContainer}>
              <Text variant="bodyMedium" style={styles(theme).emptyText}>
                No business accounts found.
              </Text>
            </View>
          )}
        />
      );
    } else {
      return (
        <FlatList
          data={adminBuildings}
          renderItem={renderBuildingItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider style={styles(theme).divider} />}
          contentContainerStyle={styles(theme).listContent}
          ListEmptyComponent={() => (
            <View style={styles(theme).emptyContainer}>
              <Text variant="bodyMedium" style={styles(theme).emptyText}>
                No buildings assigned.
              </Text>
            </View>
          )}
        />
      );
    }
  };
  
  return (
    <View style={styles(theme).container}>
      <TouchableOpacity
        style={styles(theme).switcher}
        onPress={handleOpenModal}
        accessibilityRole="button"
        accessibilityLabel={`Current ${isBusinessManager ? 'building' : 'building'}: ${selectedAccountName}. Tap to change.`}
      >
        <View style={styles(theme).switcherIconContainer}>
          {isBusinessManager ? (
            <Building2 size={24} color={theme.colors.primary} />
          ) : (
            <Building2 size={24} color={theme.colors.primary} />
          )}
        </View>
        
        <View style={styles(theme).switcherTextContainer}>
          <Text
            variant="labelSmall"
            style={styles(theme).switcherLabel}
          >
            {isBusinessManager ? 'CURRENT BUILDING' : 'BUILDING'}
          </Text>
          
          <View style={styles(theme).switcherNameContainer}>
            <Text
              variant="titleSmall"
              style={styles(theme).switcherName}
              numberOfLines={1}
            >
              {selectedAccountName || (isBusinessManager ? 'Select Building' : 'Select Building')}
            </Text>
            <ChevronDown size={14} color={theme.colors.primary} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseModal}
        statusBarTranslucent
      >
        <View style={styles(theme).modalContainer}>
          <Animated.View 
            style={[
              styles(theme).overlay,
              { opacity: overlayOpacity }
            ]}
          >
            <TouchableOpacity 
              style={styles(theme).overlayTouchable} 
              activeOpacity={1} 
              onPress={handleCloseModal}
              accessibilityRole="button"
              accessibilityLabel="Close menu"
            />
          </Animated.View>
          
          <Animated.View
            style={[
              styles(theme).bottomSheet,
              {
                transform: [{ translateY }],
                borderTopLeftRadius: borderRadius,
                borderTopRightRadius: borderRadius,
              },
            ]}
          >
            <Surface style={styles(theme).sheetContent} elevation={ElevationLevel.Level3}>
              <View style={styles(theme).sheetOverflowContainer}>
                {renderDragHandle()}
                {renderHeader()}
                <Divider />
                {renderContent()}
              </View>
            </Surface>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  switcher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant + '20',
    borderRadius: theme.roundness,
    padding: theme.spacing.s,
  },
  switcherIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.s,
  },
  switcherTextContainer: {
    flex: 1,
  },
  switcherLabel: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  switcherNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switcherName: {
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: theme.colors.surface,
  },
  sheetContent: {
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  sheetOverflowContainer: {
    overflow: 'hidden',
    width: '100%',
  },
  dragHandle: {
    width: '100%',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragIndicator: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.outlineVariant,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  backButton: {
    marginRight: theme.spacing.s,
  },
  modalTitle: {
    flex: 1,
    color: theme.colors.onSurface,
  },
  divider: {
    backgroundColor: theme.colors.outlineVariant,
  },
  listContent: {
    paddingBottom: theme.spacing.l,
  },
  listItem: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
  },
  selectedItem: {
    backgroundColor: theme.colors.surfaceVariant + '40',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: theme.spacing.m,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  itemSubtitle: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  buildingCount: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  chip: {
    height: 24,
  },
  unitsText: {
    color: theme.colors.onSurfaceVariant,
    marginLeft: theme.spacing.s,
  },
  actionContainer: {
    marginLeft: theme.spacing.s,
  },
  emptyContainer: {
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
}); 