import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Surface, useTheme, ActivityIndicator, Button, SegmentedButtons } from 'react-native-paper';
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
  Settings
} from 'lucide-react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { Header } from '../../../components/Header';
import { InfoCard } from '../../../components/InfoCard';
import { ListItem } from '../../../components/ListItem';
import { buildingService } from '../../../services/buildingService';
import { BusinessManagerStackParamList, RootStackParamList } from '../../../navigation/types';
import { Building as NavigationBuilding } from '../../../navigation/types';
import { Building } from '../../../types/buildingTypes';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import type { AppTheme } from '../../../theme/theme';
import { SafeSurface } from '../../../utils/componentUtils';

// Define a proper navigation type for the business manager dashboard
type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<any, 'DashboardTab'>,
  NativeStackNavigationProp<BusinessManagerStackParamList>
>;

export const Dashboard = () => {
  const { theme, commonStyles } = useThemedStyles();
  const navigation = useNavigation<DashboardNavigationProp>();
  const { user } = useAppSelector((state) => state.auth);
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Get current time for greeting
  const currentHour = new Date().getHours();
  let greeting = "Good Morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good Evening";
  }
  
  useEffect(() => {
    fetchBuildings();
  }, []);
  
  const fetchBuildings = async () => {
    try {
      const data = await buildingService.getBuildings();
      setBuildings(data);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchBuildings();
  };
  
  const handleBuildingPress = (buildingId: string) => {
    navigation.navigate('BuildingsTab', { 
      screen: 'BuildingDetails', 
      params: { buildingId } 
    });
  };
  
  const navigateToBuildings = () => {
    navigation.navigate('BuildingsTab');
  };
  
  const navigateToAdministrators = () => {
    navigation.navigate('AdminsTab');
  };
  
  const navigateToReports = () => {
    navigation.navigate('MoreTab', {
      screen: 'ReportsStack'
    });
  };
  
  const navigateToMessages = () => {
    // @ts-ignore
    navigation.navigate('Messages');
  };
  
  const navigateToInfoPoints = () => {
    // @ts-ignore
    navigation.navigate('InfoPointsScreen');
  };
  
  // Stats calculated from buildings data
  const totalUnits = buildings.reduce((acc, building) => acc + building.units, 0);
  // Use mock values for missing properties
  const totalResidents = buildings.length * 3; // Assuming an average of 3 residents per building
  const totalIssues = buildings.length * 2; // Assuming an average of 2 issues per building
  const avgOccupancy = 85;
  
  // Render KPI Summary Cards
  const renderKPISummary = () => {
    return (
      <View style={styles(theme).kpiSummaryContainer}>
        <View style={styles(theme).viewToggle}>
          <SegmentedButtons
            value={viewMode}
            onValueChange={setViewMode}
            buttons={[
              { value: 'grid', icon: 'view-grid-outline', label: 'Grid' },
              { value: 'list', icon: 'view-list-outline', label: 'List' }
            ]}
            style={styles(theme).segmentedButtons}
          />
          <TouchableOpacity 
            style={styles(theme).accountFilterButton}
            onPress={() => {}}
          >
            <Text style={styles(theme).accountFilterText}>By Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles(theme).kpiCardsRow}>
          <TouchableOpacity
            style={[styles(theme).kpiCard, { backgroundColor: '#4B63F3' }]}
            onPress={navigateToBuildings}
          >
            <View style={styles(theme).kpiIconContainer}>
              <Building2 size={24} color="#FFFFFF" />
            </View>
            <Text style={styles(theme).kpiValue}>{buildings.length}</Text>
            <Text style={styles(theme).kpiLabel}>Buildings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles(theme).kpiCard, { backgroundColor: '#FF5D8E' }]}
            onPress={navigateToBuildings}
          >
            <View style={styles(theme).kpiIconContainer}>
              <Home size={24} color="#FFFFFF" />
            </View>
            <Text style={styles(theme).kpiValue}>{totalUnits}</Text>
            <Text style={styles(theme).kpiLabel}>Units</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles(theme).kpiCard, { backgroundColor: '#6AD797' }]}
            onPress={() => {}}
          >
            <View style={styles(theme).kpiIconContainer}>
              <Users size={24} color="#FFFFFF" />
            </View>
            <Text style={styles(theme).kpiValue}>{totalResidents}</Text>
            <Text style={styles(theme).kpiLabel}>Residents</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles(theme).loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text 
            variant="bodyMedium" 
            style={{ marginTop: theme.spacing.m }}
          >
            Loading dashboard...
          </Text>
        </View>
      );
    }
    
    return (
      <ScrollView
        style={styles(theme).container}
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
        {/* KPI Summary Cards */}
        {renderKPISummary()}
        
        {/* Welcome Section */}
        <SafeSurface style={styles(theme).welcomeSection}>
          <View style={styles(theme).welcomeContent}>
            <Text style={styles(theme).greeting}>{greeting},</Text>
            <Text style={styles(theme).userName}>{user?.name || 'Manager'}</Text>
            <Text style={styles(theme).welcomeSubtitle}>
              Here's what's happening today in your properties
            </Text>
          </View>
        </SafeSurface>
        
        {/* Quick Actions */}
        <View style={styles(theme).quickActions}>
          <TouchableOpacity style={styles(theme).quickActionButton} onPress={navigateToBuildings}>
            <View style={[styles(theme).quickActionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Building2 size={24} color={theme.colors.primary} />
            </View>
            <Text variant="labelMedium">Buildings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles(theme).quickActionButton} onPress={navigateToReports}>
            <View style={[styles(theme).quickActionIcon, { backgroundColor: STATUS_COLORS.error + '20' }]}>
              <AlertCircle size={24} color={STATUS_COLORS.error} />
            </View>
            <Text variant="labelMedium">Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles(theme).quickActionButton} onPress={navigateToMessages}>
            <View style={[styles(theme).quickActionIcon, { backgroundColor: STATUS_COLORS.success + '20' }]}>
              <MessageSquare size={24} color={STATUS_COLORS.success} />
            </View>
            <Text variant="labelMedium">Messages</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles(theme).quickActionButton} onPress={navigateToInfoPoints}>
            <View style={[styles(theme).quickActionIcon, { backgroundColor: STATUS_COLORS.info + '20' }]}>
              <FileText size={24} color={STATUS_COLORS.info} />
            </View>
            <Text variant="labelMedium">Info</Text>
          </TouchableOpacity>
        </View>
        
        {/* Overview Cards */}
        <View style={styles(theme).sectionHeader}>
          <Text variant="titleMedium" style={styles(theme).sectionHeaderText}>
            Overview
          </Text>
        </View>
        
        <View style={styles(theme).statsContainer}>
          <InfoCard
            title="Buildings"
            value={buildings.length}
            icon={<Building2 size={24} color="white" />}
            color={theme.colors.primary}
            onPress={navigateToBuildings}
          />
          
          <InfoCard
            title="Total Units"
            value={totalUnits}
            icon={<Home size={24} color="white" />}
            color="#1976d2"
          />
          
          <InfoCard
            title="Residents"
            value={totalResidents}
            icon={<Users size={24} color="white" />}
            color="#00897b"
            trend={4}
            trendLabel="This month"
          />
          
          <InfoCard
            title="Open Issues"
            value={totalIssues}
            icon={<AlertCircle size={24} color="white" />}
            color="#e53935"
            trend={-3}
            trendLabel="From last week"
          />
          
          <InfoCard
            title="Avg. Occupancy"
            value={`${avgOccupancy}%`}
            icon={<Users size={24} color="white" />}
            color="#8e24aa"
            trend={1}
            trendLabel="This month"
          />
          
          <InfoCard
            title="Monthly Revenue"
            value="€24,500"
            icon={<Wallet size={24} color="white" />}
            color="#43a047"
            trend={5}
            trendLabel="From last month"
          />
        </View>
        
        {/* Recent Buildings */}
        <View style={styles(theme).sectionHeader}>
          <Text variant="titleMedium" style={styles(theme).sectionHeaderText}>
            Recent Buildings
          </Text>
          <TouchableOpacity onPress={navigateToBuildings}>
            <Text style={styles(theme).viewAllLink}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles(theme).cardWrapper}>
          <SafeSurface elevation={1} style={styles(theme).sectionCard}>
            <View style={styles(theme).cardContent}>
            {buildings.length > 0 ? (
              buildings.slice(0, 3).map((building) => (
                <ListItem
                  key={building.id}
                  title={building.name}
                  subtitle={building.address}
                  description={`${building.units} units • ${building.floors} floors`}
                  avatar={{
                    uri: building.image || 'https://picsum.photos/200/300',
                  }}
                  onPress={() => handleBuildingPress(building.id)}
                  badge={{
                    text: "2", // Mock issues count
                    color: STATUS_COLORS.error,
                  }}
                  showDivider={building.id !== buildings[Math.min(buildings.length - 1, 2)].id}
                />
              ))
            ) : (
              <View style={styles(theme).emptyState}>
                <Building2 size={40} color={theme.colors.outlineVariant} />
                <Text 
                  variant="bodyMedium" 
                  style={styles(theme).emptyStateText}
                >
                  No buildings found
                </Text>
                <Button 
                  mode="contained" 
                  style={styles(theme).emptyStateButton}
                  onPress={navigateToBuildings}
                >
                  Add Building
                </Button>
              </View>
            )}
            </View>
          </SafeSurface>
        </View>
        
        {/* Recent Issues */}
        <View style={styles(theme).sectionHeader}>
          <Text variant="titleMedium" style={styles(theme).sectionHeaderText}>
            Recent Issues
          </Text>
          <TouchableOpacity onPress={navigateToReports}>
            <Text style={styles(theme).viewAllLink}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles(theme).cardWrapper, { marginBottom: theme.spacing.xl }]}>
          <SafeSurface elevation={1} style={styles(theme).sectionCard}>
            <View style={styles(theme).cardContent}>
            <View style={styles(theme).emptyState}>
              <AlertCircle size={40} color={theme.colors.outlineVariant} />
              <Text 
                variant="bodyMedium" 
                style={styles(theme).emptyStateText}
              >
                No recent issues
              </Text>
              <Button 
                mode="contained" 
                style={styles(theme).emptyStateButton}
                onPress={navigateToReports}
              >
                View Reports
              </Button>
              </View>
            </View>
          </SafeSurface>
        </View>
      </ScrollView>
    );
  };
  
  return (
    <View style={[commonStyles.screenContainer]}>
      <Header
        title="Dashboard"
        showContextSwitcher={true}
        showBack={false}
      />
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
    paddingVertical: theme.spacing.l - 4,
    paddingTop: theme.spacing.l,
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.primary,
    marginHorizontal: theme.spacing.m,
  },
  welcomeContent: {
    paddingHorizontal: theme.spacing.s,
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
    marginBottom: theme.spacing.m,
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.s,
  },
  segmentedButtons: {
    maxWidth: 200,
  },
  accountFilterButton: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surfaceVariant,
  },
  accountFilterText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  kpiCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  kpiCard: {
    flex: 1,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
    marginHorizontal: 4,
    height: 120,
    justifyContent: 'space-between',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl - 8,
    marginBottom: theme.spacing.m - 4,
  },
  sectionHeaderText: {
    color: theme.colors.onBackground,
  },
  viewAllLink: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  cardWrapper: {
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.xl,
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
    padding: theme.spacing.xl + 8,
  },
  emptyStateText: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.m,
    color: theme.colors.onSurfaceVariant,
  },
  emptyStateButton: {
    paddingHorizontal: theme.spacing.m,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: theme.spacing.m,
    padding: theme.spacing.m - 4,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.primary,
  },
  addButtonText: {
    color: theme.colors.onPrimary,
    fontWeight: '500',
  },
}); 