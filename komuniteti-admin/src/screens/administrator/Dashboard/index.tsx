import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, useTheme, ActivityIndicator } from 'react-native-paper';
import { Users, AlertCircle, CalendarClock, Wallet, BarChart3, ChevronRight, Plus } from 'lucide-react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { Header } from '../../../components/Header';
import { InfoCard } from '../../../components/InfoCard';
import { ListItem } from '../../../components/ListItem';
import { SideMenu } from '../../../components/SideMenu';
import { residentService } from '../../../services/residentService';
import { Resident, AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';

// Define a proper navigation type for the administrator dashboard
type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<any, 'DashboardTab'>,
  NativeStackNavigationProp<AdministratorStackParamList>
>;

export const Dashboard = () => {
  const theme = useTheme();
  const navigation = useNavigation<DashboardNavigationProp>();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  
  useEffect(() => {
    fetchResidents();
  }, []);
  
  const fetchResidents = async () => {
    try {
      const data = await residentService.getResidents();
      setResidents(data);
    } catch (error) {
      console.error('Error fetching residents:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchResidents();
  };
  
  const handleResidentPress = (residentId: string) => {
    navigation.navigate('ResidentsTab', {
      screen: 'ResidentDetails',
      params: { residentId }
    });
  };
  
  const navigateToResidents = () => {
    navigation.navigate('ResidentsTab');
  };
  
  const navigateToPayments = () => {
    navigation.navigate('PaymentsTab');
  };
  
  const navigateToReports = () => {
    navigation.navigate('ReportsTab');
  };
  
  // Calculate stats from resident data
  const totalResidents = residents.length;
  const overdue = residents.filter(resident => resident.paymentStatus === 'overdue').length;
  const overduePercentage = totalResidents ? Math.round((overdue / totalResidents) * 100) : 0;
  const owners = residents.filter(resident => resident.status === 'owner').length;
  const ownersPercentage = totalResidents ? Math.round((owners / totalResidents) * 100) : 0;
  const tenants = residents.filter(resident => resident.status === 'tenant').length;
  
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
            title="Total Residents"
            value={totalResidents}
            icon={<Users size={24} color="white" />}
            color={theme.colors.primary}
            onPress={navigateToResidents}
          />
          
          <InfoCard
            title="Owners"
            value={owners}
            subtitle={`${ownersPercentage}% of residents`}
            icon={<Users size={24} color="white" />}
            color="#1976d2"
          />
          
          <InfoCard
            title="Tenants"
            value={tenants}
            subtitle={`${100 - ownersPercentage}% of residents`}
            icon={<Users size={24} color="white" />}
            color="#00897b"
          />
          
          <InfoCard
            title="Overdue Payments"
            value={overdue}
            icon={<AlertCircle size={24} color="white" />}
            color="#e53935"
            trend={overduePercentage}
            trendLabel="of residents"
          />
          
          <InfoCard
            title="Upcoming Payments"
            value="5"
            icon={<CalendarClock size={24} color="white" />}
            color="#8e24aa"
            subtitle="Due this week"
          />
          
          <InfoCard
            title="Revenue"
            value="€8,500"
            icon={<Wallet size={24} color="white" />}
            color="#43a047"
            trend={12}
            trendLabel="This month"
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
                      <Users 
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
                        Recent Residents
                      </Text>
                    </View>
                    
                    <TouchableOpacity onPress={navigateToResidents}>
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
                  
                  {residents.slice(0, 3).map((resident) => (
                    <ListItem
                      key={resident.id}
                      title={resident.name}
                      subtitle={`${resident.unit} • ${resident.status === 'owner' ? 'Owner' : 'Tenant'}`}
                      description={`${resident.familyMembers} family members • Moved in: ${new Date(resident.moveInDate).toLocaleDateString()}`}
                      avatar={{
                        uri: resident.image,
                      }}
                      onPress={() => handleResidentPress(resident.id)}
                      badge={{
                        text: resident.paymentStatus === 'current' ? 'Current' : 'Overdue',
                        color: resident.paymentStatus === 'current' ? STATUS_COLORS.success : STATUS_COLORS.error,
                      }}
                      showDivider={resident.id !== residents[Math.min(residents.length - 1, 2)].id}
                    />
                  ))}
                  
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={navigateToResidents}
                  >
                    <Plus size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.addButtonText}>Add New Resident</Text>
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
                      <Wallet 
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
                        Recent Payments
                      </Text>
                    </View>
                    
                    <TouchableOpacity onPress={navigateToPayments}>
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
                    title="Alexsander Meti"
                    subtitle="Monthly Maintenance • Due June 5"
                    description="€350 • Last paid: May 5, 2023"
                    avatar={{
                      uri: 'https://randomuser.me/api/portraits/men/35.jpg',
                    }}
                    badge={{
                      text: 'Pending',
                      color: STATUS_COLORS.pending,
                    }}
                  />
                  
                  <ListItem
                    title="Brikena Prifti"
                    subtitle="Quarterly Service Fee • Due June 15"
                    description="€200 • Last paid: March 15, 2023"
                    avatar={{
                      uri: 'https://randomuser.me/api/portraits/women/32.jpg',
                    }}
                    badge={{
                      text: 'Pending',
                      color: STATUS_COLORS.pending,
                    }}
                  />
                  
                  <ListItem
                    title="Dritan Hoxha"
                    subtitle="Monthly Maintenance • Due May 5"
                    description="€350 • Overdue by 20 days"
                    avatar={{
                      uri: 'https://randomuser.me/api/portraits/men/42.jpg',
                    }}
                    badge={{
                      text: 'Overdue',
                      color: STATUS_COLORS.error,
                    }}
                    showDivider={false}
                  />
                  
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={navigateToPayments}
                  >
                    <Plus size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.addButtonText}>Process New Payment</Text>
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
                        color={isDarkMode ? theme.colors.primary : theme.colors.primary} 
                        style={{ marginRight: 8 }} 
                      />
                      <Text 
                        style={[
                          styles.sectionTitle,
                          { color: isDarkMode ? '#fff' : '#333' }
                        ]}
                      >
                        Recent Reports
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
                    title="Water Leak"
                    subtitle="Apartment 3B • Reported 2 days ago"
                    description="Water leak in the bathroom needs urgent attention."
                    avatar={{
                      icon: <AlertCircle size={24} color="white" />,
                      color: STATUS_COLORS.error,
                    }}
                    badge={{
                      text: 'High',
                      color: STATUS_COLORS.error,
                    }}
                  />
                  
                  <ListItem
                    title="Broken Light"
                    subtitle="Common Area • Reported 5 days ago"
                    description="Light fixture broken in the lobby area."
                    avatar={{
                      icon: <AlertCircle size={24} color="white" />,
                      color: STATUS_COLORS['in-progress'],
                    }}
                    badge={{
                      text: 'Medium',
                      color: STATUS_COLORS['in-progress'],
                    }}
                  />
                  
                  <ListItem
                    title="Parking Issue"
                    subtitle="Parking Lot • Reported 7 days ago"
                    description="Unregistered vehicle parked in reserved space #12."
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
                  
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      { backgroundColor: theme.colors.primary }
                    ]}
                    onPress={navigateToReports}
                  >
                    <Plus size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={styles.addButtonText}>Add New Report</Text>
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
                      <BarChart3 
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
                        Quick Metrics
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.metricsContainer}>
                    <View style={styles.metric}>
                      <Text 
                        style={[
                          styles.metricValue,
                          { color: isDarkMode ? '#fff' : '#333' }
                        ]}
                      >
                        92%
                      </Text>
                      <Text 
                        style={[
                          styles.metricLabel,
                          { color: isDarkMode ? '#aaa' : '#666' }
                        ]}
                      >
                        Occupancy Rate
                      </Text>
                    </View>
                    
                    <View style={styles.metric}>
                      <Text 
                        style={[
                          styles.metricValue,
                          { color: isDarkMode ? '#fff' : '#333' }
                        ]}
                      >
                        87%
                      </Text>
                      <Text 
                        style={[
                          styles.metricLabel,
                          { color: isDarkMode ? '#aaa' : '#666' }
                        ]}
                      >
                        On-time Payments
                      </Text>
                    </View>
                    
                    <View style={styles.metric}>
                      <Text 
                        style={[
                          styles.metricValue,
                          { color: isDarkMode ? '#fff' : '#333' }
                        ]}
                      >
                        3.2d
                      </Text>
                      <Text 
                        style={[
                          styles.metricLabel,
                          { color: isDarkMode ? '#aaa' : '#666' }
                        ]}
                      >
                        Avg. Response Time
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Card>
        </View>
        
        <View style={{ height: 32 }} />
      </ScrollView>
    );
  };
  
  return (
    <>
      <Header 
        title="Administrator Dashboard" 
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
    padding: 16,
  },
  cardWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionCard: {
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
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
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
}); 