import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Text, useTheme, Card, Divider, Switch, Button, Avatar, List, Searchbar } from 'react-native-paper';
import { 
  Briefcase, 
  Settings, 
  Bell, 
  FileText, 
  Shield, 
  Users, 
  Building2, 
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Globe,
  Pencil,
  ChevronDown,
  Check
} from 'lucide-react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Header } from '../../../components/Header';
import { BusinessManagerStackParamList, BusinessAccount } from '../../../navigation/types';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { setSelectedAccount } from '../../../store/slices/businessAccountSlice';

// Define a proper navigation type
type BusinessAccountsNavigationProp = NativeStackNavigationProp<
  BusinessManagerStackParamList,
  'BusinessAccounts'
>;

// Mock data for business accounts
const mockBusinessAccounts: BusinessAccount[] = [
  {
    id: 'ba-1',
    name: 'Komuniteti Holdings',
    description: 'Main real estate management company',
    type: 'Property Management',
    buildings: 12,
    administrators: 8,
    residents: 450,
    address: 'Rruga Ismail Qemali, Tirana',
    email: 'info@komuniteti.al',
    phone: '+355 69 123 4567',
    logoUrl: 'https://via.placeholder.com/100',
    createdAt: '2022-01-15',
    performanceMetrics: {
      occupancyRate: 94,
      revenueGrowth: 8.5,
      maintenanceCosts: -2.3,
      tenantSatisfaction: 4.7
    },
    pendingIssues: 5
  },
  {
    id: 'ba-2',
    name: 'Urban Spaces',
    description: 'Commercial property management',
    type: 'Commercial Property',
    buildings: 5,
    administrators: 3,
    residents: 65,
    address: 'Rruga Ibrahim Rugova, Tirana',
    email: 'contact@urbanspaces.al',
    phone: '+355 69 876 5432',
    logoUrl: 'https://via.placeholder.com/100',
    createdAt: '2022-05-20',
    performanceMetrics: {
      occupancyRate: 88,
      revenueGrowth: 12.1,
      maintenanceCosts: 1.5,
      tenantSatisfaction: 4.2
    },
    pendingIssues: 2
  },
  {
    id: 'ba-3',
    name: 'Luxury Residences',
    description: 'High-end residential property',
    type: 'Luxury Residential',
    buildings: 3,
    administrators: 2,
    residents: 120,
    address: 'Rruga Mustafa Matohiti, Tirana',
    email: 'info@luxuryresidences.al',
    phone: '+355 69 987 6543',
    logoUrl: 'https://via.placeholder.com/100',
    createdAt: '2022-08-10',
    performanceMetrics: {
      occupancyRate: 97,
      revenueGrowth: 5.2,
      maintenanceCosts: -3.8,
      tenantSatisfaction: 4.9
    },
    pendingIssues: 0
  },
];

export const BusinessAccountsList = () => {
  const theme = useTheme();
  const navigation = useNavigation<BusinessAccountsNavigationProp>();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { commonStyles } = useThemedStyles();
  
  // Get business accounts from Redux store
  const { accounts, selectedAccount } = useAppSelector((state) => state.businessAccount);
  
  // Local state for account switcher UI
  const [accountSwitcherVisible, setAccountSwitcherVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState(accounts);
  
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoBackupsEnabled, setAutoBackupsEnabled] = useState(true);
  
  // Recent buildings would come from the API based on the selected account
  const [recentBuildings, setRecentBuildings] = useState([
    { id: 'bldg-1', name: 'Alpine Residences', address: 'Rruga e Kavajës', units: 42 },
    { id: 'bldg-2', name: 'City Center Plaza', address: 'Sheshi Skënderbej', units: 18 },
    { id: 'bldg-3', name: 'Sunny Towers', address: 'Bulevardi Zogu I', units: 64 },
  ]);
  
  useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      setFilteredAccounts(
        accounts.filter(account => 
          account.name.toLowerCase().includes(lowercasedQuery) ||
          (account.description?.toLowerCase() || '').includes(lowercasedQuery)
        )
      );
    } else {
      setFilteredAccounts(accounts);
    }
  }, [searchQuery, accounts]);
  
  // Use Redux to update selected account
  const switchBusinessAccount = (account: BusinessAccount) => {
    dispatch(setSelectedAccount(account));
    setAccountSwitcherVisible(false);
    
    // Update recent buildings based on the selected account (mock data)
    const newBuildings = [
      { id: `bldg-1-${account.id}`, name: `${account.name} Tower A`, address: 'Tirana Center', units: Math.floor(Math.random() * 50) + 10 },
      { id: `bldg-2-${account.id}`, name: `${account.name} Tower B`, address: 'Tirana East', units: Math.floor(Math.random() * 50) + 10 },
      { id: `bldg-3-${account.id}`, name: `${account.name} Plaza`, address: 'Tirana West', units: Math.floor(Math.random() * 50) + 10 },
    ];
    setRecentBuildings(newBuildings);
  };
  
  const handleEditProfile = () => {
    // Navigate to edit business profile screen
    console.log('Edit business profile');
  };
  
  const handleViewDocuments = () => {
    if (selectedAccount) {
      navigation.navigate('BusinessAccountDocuments', {
        businessAccountId: selectedAccount.id,
        businessAccountName: selectedAccount.name
      });
    }
  };

  const handleViewFinancialReports = () => {
    if (selectedAccount) {
      navigation.navigate('BusinessAccountFinancialReports', {
        businessAccountId: selectedAccount.id,
        businessAccountName: selectedAccount.name
      });
    }
  };

  const handleViewAllBuildings = () => {
    if (selectedAccount) {
      navigation.navigate('BuildingsByBusinessAccount', { 
        businessAccountId: selectedAccount.id,
        businessAccountName: selectedAccount.name
      });
    }
  };
  
  const handleViewBuilding = (buildingId: string, buildingName: string) => {
    navigation.navigate('BuildingDetails', { 
      buildingId: buildingId
    });
  };

  const handleViewAdministrators = () => {
    // Navigate to Administrators tab using CommonActions
    navigation.dispatch(
      CommonActions.navigate({
        name: 'MainTabs',
        params: {
          screen: 'AdminsTab'
        }
      })
    );
  };
  
  const renderAccountSwitcher = () => (
    <Modal
      visible={accountSwitcherVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setAccountSwitcherVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.accountSwitcherContainer, 
          { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }
        ]}>
          <View style={styles.accountSwitcherHeader}>
            <Text style={styles.accountSwitcherTitle}>Select Business Account</Text>
            <Searchbar
              placeholder="Search accounts..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />
          </View>
          
          <FlatList
            data={filteredAccounts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.accountItem,
                  selectedAccount?.id === item.id && styles.selectedAccountItem
                ]}
                onPress={() => switchBusinessAccount(item)}
              >
                <Avatar.Icon 
                  size={40} 
                  icon={(props) => <Briefcase {...props} />} 
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                  color={theme.colors.primary}
                />
                <View style={styles.accountItemInfo}>
                  <Text style={styles.accountItemName}>{item.name}</Text>
                  <Text style={styles.accountItemDescription}>{item.description}</Text>
                </View>
                {selectedAccount?.id === item.id && (
                  <Check size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <Divider style={styles.itemDivider} />}
          />
          
          <View style={styles.accountSwitcherFooter}>
            <Button 
              mode="outlined" 
              onPress={() => setAccountSwitcherVisible(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
  
  return (
    <View style={[commonStyles.screenContainer, { backgroundColor: theme.colors.background }]}>
      <Header 
        title="Account Settings" 
        showBack={true}
        showAccountSwitcher={true}
        onAccountSwitcherPress={() => setAccountSwitcherVisible(true)}
      />
      
      {renderAccountSwitcher()}
      
      <ScrollView style={styles.scrollView}>
        {/* Business Account Profile Card */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Icon 
                size={60} 
                icon={(props) => <Briefcase {...props} />} 
                style={{ backgroundColor: theme.colors.primaryContainer }}
                color={theme.colors.primary}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{selectedAccount?.name}</Text>
                <Text style={styles.profileType}>{selectedAccount?.type}</Text>
                <Text style={styles.profileCreatedAt}>
                  Since {selectedAccount?.createdAt ? new Date(selectedAccount.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
              <TouchableOpacity onPress={handleEditProfile}>
                <Pencil size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.contactItem}>
              <MapPin size={16} color={theme.colors.primary} style={styles.contactIcon} />
              <Text style={styles.contactText}>{selectedAccount?.address}</Text>
            </View>
            <View style={styles.contactItem}>
              <Mail size={16} color={theme.colors.primary} style={styles.contactIcon} />
              <Text style={styles.contactText}>{selectedAccount?.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Phone size={16} color={theme.colors.primary} style={styles.contactIcon} />
              <Text style={styles.contactText}>{selectedAccount?.phone}</Text>
            </View>
          </Card.Content>
        </Card>
        
        {/* Buildings Management - Redesigned */}
        <Text style={styles.sectionHeader}>BUILDINGS MANAGEMENT</Text>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.buildingsSummary}>
              <View style={styles.buildingsSummaryItem}>
                <Text style={styles.buildingsSummaryNumber}>{selectedAccount?.buildings}</Text>
                <Text style={styles.buildingsSummaryLabel}>Total Buildings</Text>
              </View>
              <View style={styles.buildingsSummaryItem}>
                <Text style={styles.buildingsSummaryNumber}>{selectedAccount?.residents}</Text>
                <Text style={styles.buildingsSummaryLabel}>Total Residents</Text>
              </View>
              <View style={styles.buildingsSummaryItem}>
                <Text style={styles.buildingsSummaryNumber}>{selectedAccount?.administrators}</Text>
                <Text style={styles.buildingsSummaryLabel}>Administrators</Text>
              </View>
            </View>
            
            <Divider style={[styles.divider, { marginTop: 16 }]} />
            
            <Text style={styles.recentBuildingsTitle}>Recent Buildings</Text>
            
            {recentBuildings.map((building, index) => (
              <TouchableOpacity 
                key={building.id}
                onPress={() => handleViewBuilding(building.id, building.name)}
              >
                <View style={styles.buildingItem}>
                  <Building2 size={24} color={theme.colors.primary} style={styles.buildingIcon} />
                  <View style={styles.buildingInfo}>
                    <Text style={styles.buildingName}>{building.name}</Text>
                    <Text style={styles.buildingAddress}>{building.address} • {building.units} Units</Text>
                  </View>
                  <ChevronRight size={18} color={isDarkMode ? '#aaa' : '#888'} />
                </View>
                {index < recentBuildings.length - 1 && <Divider style={styles.itemDivider} />}
              </TouchableOpacity>
            ))}
            
            <Button 
              mode="outlined" 
              icon={({ size, color }) => (
                <Building2 size={size} color={color} />
              )}
              onPress={handleViewAllBuildings}
              style={styles.viewAllButton}
            >
              View All Buildings
            </Button>
          </Card.Content>
        </Card>
        
        {/* Administrator Access */}
        <Text style={styles.sectionHeader}>ADMINISTRATOR ACCESS</Text>
        <Card style={styles.card}>
          <TouchableOpacity onPress={handleViewAdministrators}>
            <Card.Content style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Users size={22} color={theme.colors.primary} style={styles.settingIcon} />
                <Text style={styles.settingText}>Manage Administrators</Text>
              </View>
              <ChevronRight size={18} color={isDarkMode ? '#aaa' : '#888'} />
            </Card.Content>
          </TouchableOpacity>
        </Card>
        
        {/* Documents & Reports */}
        <Text style={styles.sectionHeader}>DOCUMENTS & REPORTS</Text>
        <Card style={styles.card}>
          <TouchableOpacity onPress={handleViewDocuments}>
            <Card.Content style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <FileText size={22} color={theme.colors.primary} style={styles.settingIcon} />
                <Text style={styles.settingText}>Documents</Text>
              </View>
              <ChevronRight size={18} color={isDarkMode ? '#aaa' : '#888'} />
            </Card.Content>
          </TouchableOpacity>
          
          <Divider style={styles.itemDivider} />
          
          <TouchableOpacity onPress={handleViewFinancialReports}>
            <Card.Content style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <FileText size={22} color={theme.colors.primary} style={styles.settingIcon} />
                <Text style={styles.settingText}>Financial Reports</Text>
              </View>
              <ChevronRight size={18} color={isDarkMode ? '#aaa' : '#888'} />
            </Card.Content>
          </TouchableOpacity>
        </Card>
        
        {/* Preferences */}
        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <Card style={styles.card}>
          <Card.Content style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={22} color={theme.colors.primary} style={styles.settingIcon} />
              <Text style={styles.settingText}>Email Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              color={theme.colors.primary}
            />
          </Card.Content>
          
          <Divider style={styles.itemDivider} />
          
          <Card.Content style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Shield size={22} color={theme.colors.primary} style={styles.settingIcon} />
              <Text style={styles.settingText}>Automatic Data Backups</Text>
            </View>
            <Switch
              value={autoBackupsEnabled}
              onValueChange={setAutoBackupsEnabled}
              color={theme.colors.primary}
            />
          </Card.Content>
        </Card>
        
        {/* Advanced */}
        <Text style={styles.sectionHeader}>ADVANCED</Text>
        <Card style={styles.card}>
          <TouchableOpacity onPress={() => console.log('Manage integrations')}>
            <Card.Content style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Globe size={22} color={theme.colors.primary} style={styles.settingIcon} />
                <Text style={styles.settingText}>API & Integrations</Text>
              </View>
              <ChevronRight size={18} color={isDarkMode ? '#aaa' : '#888'} />
            </Card.Content>
          </TouchableOpacity>
          
          <Divider style={styles.itemDivider} />
          
          <TouchableOpacity onPress={() => console.log('Advanced settings')}>
            <Card.Content style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Settings size={22} color={theme.colors.primary} style={styles.settingIcon} />
                <Text style={styles.settingText}>Advanced Settings</Text>
              </View>
              <ChevronRight size={18} color={isDarkMode ? '#aaa' : '#888'} />
            </Card.Content>
          </TouchableOpacity>
        </Card>
        
        {/* Account Actions */}
        <Card style={[styles.card, { marginTop: 24, marginBottom: 40 }]}>
          <TouchableOpacity onPress={() => console.log('Delete account')}>
            <Card.Content style={styles.dangerAction}>
              <Text style={styles.dangerText}>Delete Business Account</Text>
            </Card.Content>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileType: {
    fontSize: 14,
    opacity: 0.7,
  },
  profileCreatedAt: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  divider: {
    marginVertical: 12,
  },
  itemDivider: {
    marginHorizontal: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  contactIcon: {
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    opacity: 0.8,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 8,
    opacity: 0.6,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  dangerAction: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dangerText: {
    color: '#D32F2F',
    fontWeight: '500',
    fontSize: 16,
  },
  // Account switcher styles
  accountSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  accountSwitcherLeft: {
    flexDirection: 'column',
  },
  accountSwitcherLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  accountSwitcherValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountSwitcherContainer: {
    width: '90%',
    maxHeight: '70%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  accountSwitcherHeader: {
    padding: 16,
  },
  accountSwitcherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    borderRadius: 8,
    elevation: 0,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  selectedAccountItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  accountItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  accountItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  accountItemDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  accountSwitcherFooter: {
    padding: 16,
    alignItems: 'flex-end',
  },
  cancelButton: {
    minWidth: 100,
  },
  // Buildings management styles
  buildingsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  buildingsSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  buildingsSummaryNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0277BD', // Blue color
  },
  buildingsSummaryLabel: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  recentBuildingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 16,
  },
  buildingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  buildingIcon: {
    marginRight: 12,
  },
  buildingInfo: {
    flex: 1,
  },
  buildingName: {
    fontSize: 16,
    fontWeight: '500',
  },
  buildingAddress: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  viewAllButton: {
    marginTop: 16,
  },
}); 