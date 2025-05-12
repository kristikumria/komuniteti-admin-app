import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, useTheme, ActivityIndicator, Button } from 'react-native-paper';
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

// Define a proper navigation type for the business manager dashboard
type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<any, 'DashboardTab'>,
  NativeStackNavigationProp<BusinessManagerStackParamList>
>;

export const Dashboard = () => {
  const theme = useTheme();
  const navigation = useNavigation<DashboardNavigationProp>();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { user } = useAppSelector((state) => state.auth);
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
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
  
  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: isDarkMode ? '#fff' : '#333' }}>
            Loading dashboard...
          </Text>
        </View>
      );
    }
    
    return (
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? '#121212' : '#f5f5f5' }
        ]}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Welcome Section */}
        <View style={[styles.welcomeSection, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.welcomeContent}>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.userName}>{user?.name || 'Manager'}</Text>
            <Text style={styles.welcomeSubtitle}>
              Here's what's happening today in your properties
            </Text>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton} onPress={navigateToBuildings}>
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Building2 size={24} color={theme.colors.primary} />
            </View>
            <Text style={[styles.quickActionText, { color: isDarkMode ? '#fff' : '#333' }]}>Buildings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={navigateToReports}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#e53935' + '20' }]}>
              <AlertCircle size={24} color="#e53935" />
            </View>
            <Text style={[styles.quickActionText, { color: isDarkMode ? '#fff' : '#333' }]}>Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={navigateToMessages}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#00897b' + '20' }]}>
              <MessageSquare size={24} color="#00897b" />
            </View>
            <Text style={[styles.quickActionText, { color: isDarkMode ? '#fff' : '#333' }]}>Messages</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton} onPress={navigateToInfoPoints}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#8e24aa' + '20' }]}>
              <FileText size={24} color="#8e24aa" />
            </View>
            <Text style={[styles.quickActionText, { color: isDarkMode ? '#fff' : '#333' }]}>Info</Text>
          </TouchableOpacity>
        </View>
        
        {/* Overview Cards */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionHeaderText, { color: isDarkMode ? '#fff' : '#333' }]}>
            Overview
          </Text>
        </View>
        
        <View style={styles.statsContainer}>
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
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionHeaderText, { color: isDarkMode ? '#fff' : '#333' }]}>
            Recent Buildings
          </Text>
          <TouchableOpacity onPress={navigateToBuildings}>
            <Text style={[styles.viewAllLink, { color: theme.colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardWrapper}>
          <Card 
            style={[
              styles.sectionCard,
              { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
            ]}
          >
            <View style={styles.cardContent}>
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
              <View style={styles.emptyState}>
                <Building2 size={40} color={isDarkMode ? '#555' : '#ccc'} />
                <Text style={[styles.emptyStateText, { color: isDarkMode ? '#aaa' : '#888' }]}>
                  No buildings found
                </Text>
                <Button 
                  mode="contained" 
                  style={[styles.emptyStateButton, { backgroundColor: theme.colors.primary }]}
                  onPress={navigateToBuildings}
                >
                  Add Building
                </Button>
              </View>
            )}
            </View>
          </Card>
        </View>
        
        {/* Recent Issues */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionHeaderText, { color: isDarkMode ? '#fff' : '#333' }]}>
            Recent Issues
          </Text>
          <TouchableOpacity onPress={navigateToReports}>
            <Text style={[styles.viewAllLink, { color: theme.colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.cardWrapper, { marginBottom: 24 }]}>
          <Card 
            style={[
              styles.sectionCard,
              { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
            ]}
          >
            <View style={styles.cardContent}>
            <View style={styles.emptyState}>
              <AlertCircle size={40} color={isDarkMode ? '#555' : '#ccc'} />
              <Text style={[styles.emptyStateText, { color: isDarkMode ? '#aaa' : '#888' }]}>
                No recent issues
              </Text>
              <Button 
                mode="contained" 
                style={[styles.emptyStateButton, { backgroundColor: theme.colors.primary }]}
                onPress={navigateToReports}
              >
                View Reports
              </Button>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    );
  };
  
  return (
    <>
      <Header 
        title="Dashboard" 
        showBack={false}
        showNotifications={true}
      />
      
      {renderContent()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 24,
    marginBottom: 16,
  },
  welcomeContent: {
    paddingHorizontal: 8,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
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
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllLink: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  cardWrapper: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionCard: {
    borderRadius: 12,
  },
  cardContent: {
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  emptyStateButton: {
    paddingHorizontal: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    zIndex: 1,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
}); 