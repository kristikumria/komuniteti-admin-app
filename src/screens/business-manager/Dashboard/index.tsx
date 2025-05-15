import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl, Dimensions, Modal, FlatList } from 'react-native';
import { Text, Card, Surface, useTheme, ActivityIndicator, Button, Divider, Avatar, Badge, IconButton, Searchbar } from 'react-native-paper';
import { 
  Building2, 
  Users, 
  AlertCircle, 
  Wallet, 
  BarChart3, 
  ChevronRight, 
  Plus, 
  Home,
  MessageSquare,
  Calendar,
  FileText,
  Settings,
  CheckCircle2,
  TrendingUp,
  PieChart,
  Clock,
  ArrowUpRight,
  Briefcase,
  ChevronDown,
  Check
} from 'lucide-react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';

import { Header } from '../../../components/Header';
import { InfoCard } from '../../../components/InfoCard';
import { ListItem } from '../../../components/ListItem';
import { buildingService } from '../../../services/buildingService';
import { BusinessManagerStackParamList, RootStackParamList } from '../../../navigation/types';
import { Building as NavigationBuilding } from '../../../navigation/types';
import { Building } from '../../../types/buildingTypes';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import type { AppTheme } from '../../../theme/theme';
import { SafeSurface } from '../../../utils/componentUtils';
import { setSelectedAccount } from '../../../store/slices/businessAccountSlice';

// Define a proper navigation type for the business manager dashboard
type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<any, 'DashboardTab'>,
  NativeStackNavigationProp<BusinessManagerStackParamList>
>;

const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock tasks for Today's Tasks section
const MOCK_TASKS = [
  { id: 't1', title: 'Review maintenance request', building: 'Riviera Towers', completed: false, priority: 'high' },
  { id: 't2', title: 'Assign new administrator', building: 'Park View Residence', completed: false, priority: 'medium' },
  { id: 't3', title: 'Confirm invoice payment', building: 'Central Plaza', completed: true, priority: 'low' },
  { id: 't4', title: 'Schedule building inspection', building: 'Urban Lofts', completed: false, priority: 'medium' },
];

// Mock data for business accounts (same as in BusinessAccountsList)
const mockBusinessAccounts = [
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

export const Dashboard = () => {
  const { theme, commonStyles } = useThemedStyles();
  const navigation = useNavigation<DashboardNavigationProp>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Get business accounts from Redux store
  const { accounts, selectedAccount } = useAppSelector((state) => state.businessAccount);
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  
  // Local state for account switcher UI
  const [accountSwitcherVisible, setAccountSwitcherVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState(accounts);
  
  // Get current time for greeting
  const greeting = useMemo(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);
  
  // Calculate statistics from buildings
  const stats = useMemo(() => {
    const totalUnits = buildings.reduce((acc, building) => acc + building.units, 0);
    // Use mock values for missing properties
    const totalResidents = buildings.reduce((acc, building) => acc + (building.residents || 0), 0) || buildings.length * 3;
    const totalIssues = buildings.reduce((acc, building) => acc + (building.issues || 0), 0) || buildings.length;
    const avgOccupancy = buildings.length ? 
      Math.round(buildings.reduce((acc, building) => acc + (building.occupancyRate || 0), 0) / buildings.length) : 85;
    
    return {
      totalUnits,
      totalResidents,
      totalIssues,
      avgOccupancy,
      totalRevenue: 24500, // Mock data
      newResidents: 12, // Mock data
      occupiedUnits: Math.round(totalUnits * (avgOccupancy / 100)),
    };
  }, [buildings]);
  
  const fetchBuildings = useCallback(async () => {
    try {
      const data = await buildingService.getBuildings();
      setBuildings(data);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  
  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);
  
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBuildings();
  }, [fetchBuildings]);
  
  const handleBuildingPress = useCallback((buildingId: string) => {
    navigation.navigate('BuildingsTab', { 
      screen: 'BuildingDetails', 
      params: { buildingId } 
    });
  }, [navigation]);
  
  const navigateToBuildings = useCallback(() => {
    navigation.navigate('BuildingsTab');
  }, [navigation]);
  
  const navigateToAdministrators = useCallback(() => {
    navigation.navigate('AdminsTab');
  }, [navigation]);
  
  const navigateToReports = useCallback(() => {
    navigation.navigate('MoreTab', {
      screen: 'ReportsStack'
    });
  }, [navigation]);
  
  const navigateToMessages = useCallback(() => {
    // @ts-ignore
    navigation.navigate('Messages');
  }, [navigation]);
  
  const navigateToInfoPoints = useCallback(() => {
    // @ts-ignore
    navigation.navigate('InfoPointsScreen');
  }, [navigation]);
  
  const toggleTaskCompletion = useCallback((taskId: string) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);
  
  // Filter accounts based on search
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
  
  // Switch business account using Redux
  const switchBusinessAccount = useCallback((account) => {
    dispatch(setSelectedAccount(account));
    setAccountSwitcherVisible(false);
    
    // In a real app, we would fetch buildings for this account
    // For now, simulate changing buildings based on account
    setLoading(true);
    setTimeout(() => {
      // Simulate different buildings for different accounts
      const accountMultiplier = account.id === 'ba-1' ? 1 : account.id === 'ba-2' ? 0.5 : 0.25;
      buildingService.getBuildings().then(data => {
        const modifiedData = data.slice(0, Math.ceil(data.length * accountMultiplier));
        setBuildings(modifiedData);
        setLoading(false);
      });
    }, 500);
  }, [dispatch]);
  
  // Render KPI Summary Cards
  const renderKPISummary = () => {
    return (
      <View style={styles(theme).kpiSummaryContainer}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles(theme).kpiCardsContainer}
        >
          <LinearGradient
            colors={['#4A69FF', '#304EFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles(theme).kpiCard}
          >
            <View style={styles(theme).kpiIconContainer}>
              <Building2 size={24} color="#FFFFFF" />
            </View>
            <Text style={styles(theme).kpiValue}>{buildings.length}</Text>
            <Text style={styles(theme).kpiLabel}>Buildings</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#FF6B8A', '#FF5376']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles(theme).kpiCard}
          >
            <View style={styles(theme).kpiIconContainer}>
              <Home size={24} color="#FFFFFF" />
            </View>
            <Text style={styles(theme).kpiValue}>{stats.totalUnits}</Text>
            <Text style={styles(theme).kpiLabel}>Units</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#50D3B4', '#3BC7A7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles(theme).kpiCard}
          >
            <View style={styles(theme).kpiIconContainer}>
              <Users size={24} color="#FFFFFF" />
            </View>
            <Text style={styles(theme).kpiValue}>{stats.totalResidents}</Text>
            <Text style={styles(theme).kpiLabel}>Residents</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#FFBE4F', '#FFA53B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles(theme).kpiCard}
          >
            <View style={styles(theme).kpiIconContainer}>
              <PieChart size={24} color="#FFFFFF" />
            </View>
            <Text style={styles(theme).kpiValue}>{stats.avgOccupancy}%</Text>
            <Text style={styles(theme).kpiLabel}>Occupancy</Text>
          </LinearGradient>
          
          <LinearGradient
            colors={['#FF6259', '#FF4A40']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles(theme).kpiCard}
          >
            <View style={styles(theme).kpiIconContainer}>
              <AlertCircle size={24} color="#FFFFFF" />
            </View>
            <Text style={styles(theme).kpiValue}>{stats.totalIssues}</Text>
            <Text style={styles(theme).kpiLabel}>Issues</Text>
          </LinearGradient>
        </ScrollView>
      </View>
    );
  };
  
  // Render Revenue Summary Section
  const renderRevenueSummary = () => {
    return (
      <View style={styles(theme).cardWrapper}>
        <LinearGradient
          colors={[theme.colors.primary, '#0A4BBF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles(theme).revenueSummaryCard}
        >
          <View style={styles(theme).revenueSummaryHeader}>
            <Text style={styles(theme).revenueSummaryTitle}>Revenue Summary</Text>
            <TouchableOpacity style={styles(theme).detailsButton}>
              <Text style={styles(theme).detailsButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles(theme).revenueStatsRow}>
            <View style={styles(theme).revenueStatItem}>
              <Text style={styles(theme).revenueStatValue}>€{stats.totalRevenue.toLocaleString()}</Text>
              <Text style={styles(theme).revenueStatLabel}>Monthly Revenue</Text>
              <View style={styles(theme).trendContainer}>
                <ArrowUpRight size={14} color="#FFFFFF" />
                <Text style={styles(theme).trendText}>+5.2%</Text>
              </View>
            </View>
            
            <View style={styles(theme).revenueChart}>
              <BarChart3 size={60} color="#FFFFFF" opacity={0.6} />
            </View>
          </View>
          
          <View style={styles(theme).revenueMetricsRow}>
            <View style={styles(theme).revenueMetricItem}>
              <Text style={styles(theme).revenueMetricValue}>{stats.occupiedUnits}/{stats.totalUnits}</Text>
              <Text style={styles(theme).revenueMetricLabel}>Occupied Units</Text>
            </View>
            
            <View style={styles(theme).revenueMetricDivider} />
            
            <View style={styles(theme).revenueMetricItem}>
              <Text style={styles(theme).revenueMetricValue}>+{stats.newResidents}</Text>
              <Text style={styles(theme).revenueMetricLabel}>New Residents</Text>
            </View>
            
            <View style={styles(theme).revenueMetricDivider} />
            
            <View style={styles(theme).revenueMetricItem}>
              <Text style={styles(theme).revenueMetricValue}>€185</Text>
              <Text style={styles(theme).revenueMetricLabel}>Avg Revenue/Unit</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };
  
  // Render Today's Tasks
  const renderTodaysTasks = () => {
    const pendingTasks = tasks.filter(task => !task.completed);
    
    return (
      <>
        <View style={styles(theme).sectionHeader}>
          <Text variant="titleMedium" style={styles(theme).sectionHeaderText}>
            Today's Tasks
          </Text>
          <Badge size={24} style={styles(theme).tasksBadge}>
            {pendingTasks.length}
          </Badge>
        </View>
        
        <View style={styles(theme).cardWrapper}>
          <SafeSurface elevation={1} style={styles(theme).sectionCard}>
            <View style={styles(theme).cardContent}>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <View key={task.id}>
                    <View style={styles(theme).taskItem}>
                      <TouchableOpacity 
                        style={styles(theme).taskCheckbox}
                        onPress={() => toggleTaskCompletion(task.id)}
                      >
                        {task.completed ? (
                          <CheckCircle2 size={22} color={theme.colors.primary} />
                        ) : (
                          <View style={styles(theme).uncheckedBox} />
                        )}
                      </TouchableOpacity>
                      
                      <View style={styles(theme).taskDetails}>
                        <Text 
                          variant="bodyMedium" 
                          style={[
                            styles(theme).taskTitle,
                            task.completed && styles(theme).completedTaskTitle
                          ]}
                        >
                          {task.title}
                        </Text>
                        <Text variant="bodySmall" style={styles(theme).taskSubtitle}>
                          {task.building}
                        </Text>
                      </View>
                      
                      <View style={[
                        styles(theme).priorityIndicator,
                        styles(theme)[`${task.priority}Priority` as keyof typeof styles]
                      ]} />
                    </View>
                    {index < tasks.length - 1 && <Divider style={styles(theme).taskDivider} />}
                  </View>
                ))
              ) : (
                <View style={styles(theme).emptyState}>
                  <Clock size={40} color={theme.colors.outlineVariant} />
                  <Text 
                    variant="bodyMedium" 
                    style={styles(theme).emptyStateText}
                  >
                    No tasks for today
                  </Text>
                  <Button 
                    mode="contained" 
                    style={styles(theme).emptyStateButton}
                  >
                    Add New Task
                  </Button>
                </View>
              )}
            </View>
          </SafeSurface>
        </View>
      </>
    );
  };
  
  const renderAccountSwitcher = () => (
    <Modal
      visible={accountSwitcherVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setAccountSwitcherVisible(false)}
    >
      <View style={styles(theme).modalOverlay}>
        <View style={[
          styles(theme).accountSwitcherContainer, 
          { backgroundColor: theme.dark ? '#1E1E1E' : '#FFFFFF' }
        ]}>
          <View style={styles(theme).accountSwitcherHeader}>
            <Text style={styles(theme).accountSwitcherTitle}>Select Business Account</Text>
            <Searchbar
              placeholder="Search accounts..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles(theme).searchBar}
            />
          </View>
          
          <FlatList
            data={filteredAccounts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles(theme).accountItem,
                  selectedAccount?.id === item.id && styles(theme).selectedAccountItem
                ]}
                onPress={() => switchBusinessAccount(item)}
              >
                <Avatar.Icon 
                  size={40} 
                  icon={(props) => <Briefcase {...props} />} 
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                  color={theme.colors.primary}
                />
                <View style={styles(theme).accountItemInfo}>
                  <Text style={styles(theme).accountItemName}>{item.name}</Text>
                  <Text style={styles(theme).accountItemDescription}>{item.description}</Text>
                </View>
                {selectedAccount?.id === item.id && (
                  <Check size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <Divider />}
          />
          
          <View style={styles(theme).accountSwitcherFooter}>
            <Button 
              mode="outlined" 
              onPress={() => setAccountSwitcherVisible(false)}
              style={styles(theme).cancelButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
  
  const renderContent = () => {
    if (loading) {
      return (
        <View style={commonStyles.centeredContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }
    
    return (
      <ScrollView
        contentContainerStyle={styles(theme).scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {renderKPISummary()}
        
        {/* Buildings summary card */}
        <View style={styles(theme).cardWrapper}>
          <SafeSurface>
            <Card style={styles(theme).sectionCard}>
              <Card.Content>
                <View style={styles(theme).sectionHeader}>
                  <View style={styles(theme).sectionTitleContainer}>
                    <Building2 size={20} color={theme.colors.primary} style={styles(theme).sectionTitleIcon} />
                    <Text style={styles(theme).sectionTitle}>Buildings</Text>
                  </View>
                  <TouchableOpacity onPress={navigateToBuildings}>
                    <Text style={styles(theme).viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles(theme).buildingsList}>
                  {buildings.slice(0, 3).map((building) => (
                    <TouchableOpacity 
                      key={building.id} 
                      style={styles(theme).buildingItem}
                      onPress={() => handleBuildingPress(building.id)}
                    >
                      <View style={styles(theme).buildingItemContent}>
                        <Building2 size={20} color={theme.colors.primary} />
                        <View style={styles(theme).buildingInfo}>
                          <Text style={styles(theme).buildingName}>{building.name}</Text>
                          <Text style={styles(theme).buildingAddress}>{building.address} • {building.units} Units</Text>
                        </View>
                        <ChevronRight size={16} color="#999" />
                      </View>
                      {buildings.indexOf(building) < buildings.slice(0, 3).length - 1 && (
                        <Divider style={styles(theme).buildingDivider} />
                      )}
                    </TouchableOpacity>
                  ))}
                  
                  {buildings.length === 0 && (
                    <View style={styles(theme).emptyStateContainer}>
                      <Text style={styles(theme).emptyStateText}>
                        No buildings found {selectedAccount ? `for ${selectedAccount.name}` : ''}
                      </Text>
                      <Button 
                        mode="outlined" 
                        onPress={navigateToBuildings}
                        style={{ marginTop: 8 }}
                      >
                        Add Building
                      </Button>
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>
          </SafeSurface>
        </View>
        
        {/* Quick Actions section */}
        {/* Revenue Summary section */}
        {renderRevenueSummary()}
        
        {/* Today's Tasks section */}
        {renderTodaysTasks()}
      </ScrollView>
    );
  };
  
  return (
    <View style={commonStyles.screenContainer}>
      <Header 
        title="Dashboard"
        showBack={false}
        showAccountSwitcher={true}
        onAccountSwitcherPress={() => setAccountSwitcherVisible(true)}
      />
      {renderAccountSwitcher()}
      {renderContent()}
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.m,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    paddingHorizontal: theme.spacing.xl - 8,
    paddingVertical: theme.spacing.l,
    marginHorizontal: theme.spacing.m,
    borderRadius: theme.roundness * 2,
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: theme.colors.onPrimary,
    opacity: 0.9,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: theme.colors.onPrimary,
    opacity: 0.8,
  },
  kpiSummaryContainer: {
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.l,
  },
  kpiCardsContainer: {
    paddingHorizontal: theme.spacing.m - 8,
    paddingBottom: theme.spacing.m,
    gap: 12,
  },
  kpiCard: {
    borderRadius: theme.roundness * 2,
    padding: theme.spacing.m,
    marginLeft: 8,
    width: 140,
    height: 120,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  kpiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.s,
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  kpiLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  quickActionButton: {
    alignItems: 'center',
    width: '22%',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  quickActionText: {
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl - 8,
    marginBottom: theme.spacing.m - 4,
  },
  sectionHeaderText: {
    color: theme.colors.onBackground,
    fontWeight: '600',
  },
  viewAllLink: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  cardWrapper: {
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.l,
  },
  sectionCard: {
    borderRadius: theme.roundness * 1.5,
    overflow: 'hidden',
  },
  cardContent: {
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateText: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.m,
    color: theme.colors.onSurfaceVariant,
  },
  emptyStateButton: {
    paddingHorizontal: theme.spacing.m,
  },
  revenueSummaryCard: {
    borderRadius: theme.roundness * 2,
    padding: theme.spacing.m,
    overflow: 'hidden',
  },
  revenueSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  revenueSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  detailsButton: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s - 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: theme.roundness,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 12,
  },
  revenueStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  revenueStatItem: {
    flex: 1,
  },
  revenueStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  revenueStatLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: theme.spacing.s - 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    borderRadius: theme.roundness,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 2,
  },
  revenueChart: {
    flex: 1,
    alignItems: 'flex-end',
  },
  revenueMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  revenueMetricItem: {
    flex: 1,
    alignItems: 'center',
  },
  revenueMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  revenueMetricLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  revenueMetricDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  taskCheckbox: {
    marginRight: theme.spacing.m,
  },
  uncheckedBox: {
    width: 22,
    height: 22,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.outline,
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontWeight: '500',
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: theme.colors.onSurfaceVariant,
  },
  taskSubtitle: {
    color: theme.colors.onSurfaceVariant,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: theme.spacing.s,
  },
  highPriority: {
    backgroundColor: STATUS_COLORS.error,
  },
  mediumPriority: {
    backgroundColor: STATUS_COLORS.warning,
  },
  lowPriority: {
    backgroundColor: STATUS_COLORS.success,
  },
  taskDivider: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
  },
  tasksBadge: {
    backgroundColor: theme.colors.primary,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    opacity: 0.7,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  accountSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 8,
  },
  accountSwitcherTextContainer: {
    marginLeft: 8,
    maxWidth: 120,
  },
  accountSwitcherLabel: {
    fontSize: 10,
    opacity: 0.6,
  },
  accountNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountSwitcherValue: {
    fontSize: 12,
    fontWeight: '600',
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
  emptyStateContainer: {
    padding: 16,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  buildingsList: {
    padding: theme.spacing.m,
  },
  buildingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buildingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buildingInfo: {
    flex: 1,
    marginLeft: theme.spacing.m,
  },
  buildingName: {
    fontWeight: '500',
  },
  buildingAddress: {
    color: theme.colors.onSurfaceVariant,
  },
  buildingDivider: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleIcon: {
    marginRight: theme.spacing.s,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 