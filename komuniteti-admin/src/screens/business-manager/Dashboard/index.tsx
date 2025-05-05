import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, useTheme, ActivityIndicator } from 'react-native-paper';
import { Building2, Users, AlertCircle, Wallet, BarChart3, ChevronRight, Plus } from 'lucide-react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { Header } from '../../../components/Header';
import { InfoCard } from '../../../components/InfoCard';
import { ListItem } from '../../../components/ListItem';
import { SideMenu } from '../../../components/SideMenu';
import { buildingService } from '../../../services/buildingService';
import { Building, BusinessManagerStackParamList, RootStackParamList } from '../../../navigation/types';
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
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  
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
    navigation.navigate('ReportsTab');
  };
  
  // Stats calculated from buildings data
  const totalUnits = buildings.reduce((acc, building) => acc + building.units, 0);
  const totalResidents = buildings.reduce((acc, building) => acc + building.residents, 0);
  const totalIssues = buildings.reduce((acc, building) => acc + building.issues, 0);
  const avgOccupancy = buildings.length 
    ? Math.round(buildings.reduce((acc, building) => acc + building.occupancyRate, 0) / buildings.length)
    : 0;
  
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
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
            icon={<Building2 size={24} color="white" />}
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
        
        <View style={styles.cardWrapper}>
          <Card 
            style={[
              styles.sectionCard,
              { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
            ]}
          >
            <View style={{ borderRadius: 12 }}>
              <View style={{ overflow: 'hidden', borderRadius: 12 }}>
                <View>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                      <Building2 
                        size={20} 
                        color={isDarkMode ? theme.colors.primary : theme.colors.primary} 
                        style={{ marginRight: 8 }} 
                      />
                      <Text 
                        style={[
                          styles.sectionTitle,
                          { color: isDarkMode ? '#fff' : '#333' }
                        ]}
                      >
                        Recent Buildings
                      </Text>
                    </View>
                    
                    <TouchableOpacity onPress={navigateToBuildings}>
                      <View style={styles.viewAllContainer}>
                        <Text 
                          style={[
                            styles.viewAll,
                            { color: theme.colors.primary }
                          ]}
                        >
                          View All
                        </Text>
                        <ChevronRight 
                          size={16} 
                          color={theme.colors.primary} 
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  
                  {buildings.slice(0, 3).map((building) => (
                    <ListItem
                      key={building.id}
                      title={building.name}
                      subtitle={building.address}
                      description={`${building.units} units • ${building.occupancyRate}% occupied`}
                      avatar={{
                        uri: building.image,
                      }}
                      onPress={() => handleBuildingPress(building.id)}
                      badge={{
                        text: building.issues > 0 ? `${building.issues}` : '0',
                        color: building.issues > 0 ? STATUS_COLORS.error : STATUS_COLORS.success,
                      }}
                      showDivider={building.id !== buildings[Math.min(buildings.length - 1, 2)].id}
                    />
                  ))}
                  
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={navigateToBuildings}
                  >
                    <Plus size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.addButtonText}>Add New Building</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>
        </View>
        
        <View style={styles.cardWrapper}>
          <Card 
            style={[
              styles.sectionCard,
              { backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }
            ]}
          >
            <View style={{ borderRadius: 12 }}>
              <View style={{ overflow: 'hidden', borderRadius: 12 }}>
                <View>
                  <View style={styles.sectionHeader}>
                    <View style={styles.sectionTitleContainer}>
                      <AlertCircle 
                        size={20} 
                        color={isDarkMode ? theme.colors.error : theme.colors.error} 
                        style={{ marginRight: 8 }} 
                      />
                      <Text 
                        style={[
                          styles.sectionTitle,
                          { color: isDarkMode ? '#fff' : '#333' }
                        ]}
                      >
                        Recent Issues
                      </Text>
                    </View>
                    
                    <TouchableOpacity onPress={navigateToReports}>
                      <View style={styles.viewAllContainer}>
                        <Text 
                          style={[
                            styles.viewAll,
                            { color: theme.colors.primary }
                          ]}
                        >
                          View All
                        </Text>
                        <ChevronRight 
                          size={16} 
                          color={theme.colors.primary} 
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  
                  <ListItem
                    title="Water Leak in Lobby"
                    subtitle="Riviera Towers • High Priority"
                    description="Reported 2 days ago by Administrator"
                    avatar={{
                      icon: <AlertCircle size={24} color="white" />,
                      color: STATUS_COLORS.error,
                    }}
                    onPress={() => {
                      navigation.navigate('ReportsTab', {
                        screen: 'ReportDetails',
                        params: { reportId: '1' }
                      });
                    }}
                    badge={{
                      text: 'Open',
                      color: STATUS_COLORS.open,
                    }}
                  />
                  
                  <ListItem
                    title="Elevator Maintenance"
                    subtitle="Park View Residence • Medium Priority"
                    description="Scheduled for tomorrow at 10:00 AM"
                    avatar={{
                      icon: <AlertCircle size={24} color="white" />,
                      color: STATUS_COLORS['in-progress'],
                    }}
                    onPress={() => {
                      navigation.navigate('ReportsTab', {
                        screen: 'ReportDetails',
                        params: { reportId: '2' }
                      });
                    }}
                    badge={{
                      text: 'In Progress',
                      color: STATUS_COLORS['in-progress'],
                    }}
                    showDivider={true}
                  />
                  
                  <ListItem
                    title="Parking Gate Malfunction"
                    subtitle="Central Plaza • Low Priority"
                    description="Resolved yesterday by maintenance team"
                    avatar={{
                      icon: <AlertCircle size={24} color="white" />,
                      color: STATUS_COLORS.resolved,
                    }}
                    onPress={() => {
                      navigation.navigate('ReportsTab', {
                        screen: 'ReportDetails',
                        params: { reportId: '3' }
                      });
                    }}
                    badge={{
                      text: 'Resolved',
                      color: STATUS_COLORS.resolved,
                    }}
                    showDivider={false}
                  />
                </View>
              </View>
            </View>
          </Card>
        </View>
        
        <View style={{ height: 20 }} />
      </ScrollView>
    );
  };
  
  return (
    <>
      <Header 
        title="Dashboard" 
        showBack={false}
        showMenu={true}
        onMenuPress={() => setMenuVisible(true)}
      />
      
      {renderContent()}
      
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  cardWrapper: {
    margin: 16,
    marginTop: 8,
  },
  sectionCard: {
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAll: {
    fontSize: 14,
    marginRight: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
}); 