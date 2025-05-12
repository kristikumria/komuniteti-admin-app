import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { Text, Card, useTheme, ActivityIndicator, Surface, Button, Avatar } from 'react-native-paper';
import { Users, AlertCircle, CalendarClock, Wallet, BarChart3, ChevronRight, Plus, ArrowUpRight, TrendingUp } from 'lucide-react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { Header } from '../../../components/Header';
import { InfoCard } from '../../../components/InfoCard';
import { ListItem } from '../../../components/ListItem';
import { residentService } from '../../../services/residentService';
import { Resident, AdministratorStackParamList, AdministratorTabParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { STATUS_COLORS } from '../../../utils/constants';

// Define a proper navigation type for the administrator dashboard
type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<AdministratorTabParamList>,
  NativeStackNavigationProp<AdministratorStackParamList>
>;

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export const Dashboard = () => {
  const theme = useTheme();
  const navigation = useNavigation<DashboardNavigationProp>();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  const { user } = useAppSelector((state) => state.auth);
  
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
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
    navigation.navigate('MoreTab', {
      screen: 'ReportsStack'
    });
  };

  const navigateToMessages = () => {
    navigation.navigate('ChatTab');
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
    
    const backgroundColor = isDarkMode ? '#121212' : '#f7f7f7';
    const cardBackground = isDarkMode ? '#1E1E1E' : '#ffffff';
    const textColor = isDarkMode ? '#ffffff' : '#333333';
    const secondaryTextColor = isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
    
    return (
      <ScrollView
        style={[styles.container, { backgroundColor }]}
        contentContainerStyle={styles.contentContainer}
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
        <View style={styles.greetingSection}>
          <View>
            <Text style={[styles.welcomeText, { color: textColor }]}>
              Welcome back,
            </Text>
            <Text style={[styles.nameText, { color: textColor }]}>
              {user?.name || 'Administrator'}
            </Text>
          </View>
          <TouchableOpacity>
            <Avatar.Text 
              size={40} 
              label={user?.name?.charAt(0).toUpperCase() || 'A'}
              style={{ backgroundColor: theme.colors.primary }}
            />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Quick Actions</Text>
          
          <Surface style={[styles.quickActionsRow, { backgroundColor: cardBackground }]} elevation={1}>
            <View style={styles.quickActionsRowContent}>
            <TouchableOpacity style={styles.quickAction} onPress={navigateToResidents}>
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Users size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: textColor }]}>Residents</Text>
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : '#eee' }]} />
            
            <TouchableOpacity style={styles.quickAction} onPress={navigateToPayments}>
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Wallet size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: textColor }]}>Payments</Text>
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : '#eee' }]} />
            
            <TouchableOpacity style={styles.quickAction} onPress={navigateToReports}>
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <AlertCircle size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: textColor }]}>Reports</Text>
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : '#eee' }]} />
            
            <TouchableOpacity style={styles.quickAction} onPress={navigateToMessages}>
              <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <CalendarClock size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.quickActionText, { color: textColor }]}>Messages</Text>
            </TouchableOpacity>
            </View>
          </Surface>
        </View>
        
        {/* Overview Cards */}
        <View style={styles.overviewSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Overview</Text>
          <View style={styles.overviewCards}>
            <Surface style={[styles.overviewCard, { backgroundColor: cardBackground }]} elevation={1}>
              <View style={styles.overviewCardContent}>
              <Text style={[styles.overviewLabel, { color: secondaryTextColor }]}>Total Residents</Text>
              <View style={styles.overviewValue}>
                <Text style={[styles.overviewNumber, { color: textColor }]}>{totalResidents}</Text>
                <View style={styles.indicatorContainer}>
                  <TrendingUp size={12} color={theme.colors.primary} />
                  <Text style={[styles.indicatorText, { color: theme.colors.primary }]}>Active</Text>
                  </View>
                </View>
              </View>
            </Surface>
            
            <Surface style={[styles.overviewCard, { backgroundColor: cardBackground }]} elevation={1}>
              <View style={styles.overviewCardContent}>
              <Text style={[styles.overviewLabel, { color: secondaryTextColor }]}>Owners</Text>
              <View style={styles.overviewValue}>
                <Text style={[styles.overviewNumber, { color: textColor }]}>{owners}</Text>
                <View style={styles.indicatorContainer}>
                  <Text style={[styles.indicatorText, { color: '#00897b' }]}>{ownersPercentage}%</Text>
                  </View>
                </View>
              </View>
            </Surface>
            
            <Surface style={[styles.overviewCard, { backgroundColor: cardBackground }]} elevation={1}>
              <View style={styles.overviewCardContent}>
              <Text style={[styles.overviewLabel, { color: secondaryTextColor }]}>Revenue</Text>
              <View style={styles.overviewValue}>
                <Text style={[styles.overviewNumber, { color: textColor }]}>€8,500</Text>
                <View style={styles.indicatorContainer}>
                  <TrendingUp size={12} color="#43a047" />
                  <Text style={[styles.indicatorText, { color: '#43a047' }]}>+12%</Text>
                  </View>
                </View>
              </View>
            </Surface>
            
            <Surface style={[styles.overviewCard, { backgroundColor: cardBackground }]} elevation={1}>
              <View style={styles.overviewCardContent}>
              <Text style={[styles.overviewLabel, { color: secondaryTextColor }]}>Overdue</Text>
              <View style={styles.overviewValue}>
                <Text style={[styles.overviewNumber, { color: textColor }]}>{overdue}</Text>
                <View style={styles.indicatorContainer}>
                  <Text style={[styles.indicatorText, { color: '#e53935' }]}>{overduePercentage}%</Text>
                  </View>
                </View>
              </View>
            </Surface>
          </View>
        </View>
        
        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Residents</Text>
            <TouchableOpacity onPress={navigateToResidents} style={styles.viewAllButton}>
              <Text style={{ color: theme.colors.primary }}>View All</Text>
              <ChevronRight size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          <Surface style={[styles.recentListCard, { backgroundColor: cardBackground }]} elevation={1}>
            <View style={styles.recentListCardContent}>
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
            
            <Button 
              mode="outlined"
              icon="plus"
              onPress={navigateToResidents}
              style={styles.addButton}
            >
              Add New Resident
            </Button>
            </View>
          </Surface>
        </View>
        
        {/* Payment Activity */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Payments</Text>
            <TouchableOpacity onPress={navigateToPayments} style={styles.viewAllButton}>
              <Text style={{ color: theme.colors.primary }}>View All</Text>
              <ChevronRight size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          <Surface style={[styles.recentListCard, { backgroundColor: cardBackground }]} elevation={1}>
            <View style={styles.recentListCardContent}>
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
            
            <Button 
              mode="outlined"
              icon="plus"
              onPress={navigateToPayments}
              style={styles.addButton}
            >
              Process New Payment
            </Button>
            </View>
          </Surface>
        </View>
      </ScrollView>
    );
  };
  
  return (
    <View style={{ flex: 1 }}>
      <Header 
        title="Home" 
        showBack={false}
        showNotifications={true}
      />
      
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 90,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  welcomeText: {
    fontSize: 16,
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickActionsRow: {
    borderRadius: 12,
    marginTop: 8,
    padding: 0,
  },
  quickActionsRowContent: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
  },
  overviewSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  overviewCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  overviewCard: {
    width: cardWidth,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    height: 90,
  },
  overviewCardContent: {
    overflow: 'hidden',
    flex: 1,
  },
  overviewLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  overviewValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  overviewNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  indicatorText: {
    fontSize: 12,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  recentListCard: {
    borderRadius: 12,
  },
  recentListCardContent: {
    overflow: 'hidden',
  },
  addButton: {
    margin: 16,
    borderRadius: 8,
  },
}); 