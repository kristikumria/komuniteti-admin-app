import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, RefreshControl } from 'react-native';
import { Text, useTheme, ActivityIndicator, Card, Button, Chip, Badge, Surface, IconButton, Avatar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Building2, Briefcase, ChevronRight, Home, Users, LayoutGrid, Plus, ArrowLeft, Grid, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import { BusinessManagerStackParamList, BusinessAccount } from '../../../navigation/types';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useAppSelector } from '../../../store/hooks';

// Define a proper navigation type for the buildings list
type BuildingsNavigationProp = NativeStackNavigationProp<
  BusinessManagerStackParamList,
  'Buildings'
>;

// Mock business accounts for the landing page
const mockBusinessAccounts: Pick<BusinessAccount, 'id' | 'name' | 'type' | 'buildings'>[] = [
  {
    id: 'ba-1',
    name: 'Komuniteti Holdings',
    type: 'Property Management',
    buildings: 12
  },
  {
    id: 'ba-2',
    name: 'Urban Spaces',
    type: 'Commercial Property',
    buildings: 5
  },
  {
    id: 'ba-3',
    name: 'Luxury Residences',
    type: 'Luxury Residential',
    buildings: 3
  }
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const BuildingsList = () => {
  const theme = useTheme();
  const navigation = useNavigation<BuildingsNavigationProp>();
  const { commonStyles } = useThemedStyles();
  const isDarkMode = useAppSelector((state) => state.settings.darkMode);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [accounts, setAccounts] = useState<Pick<BusinessAccount, 'id' | 'name' | 'type' | 'buildings'>[]>([]);
  
  // Summary statistics
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalBuildings: 0,
    residentialBuildings: 0,
    commercialBuildings: 0
  });
  
  // Load business accounts data and calculate stats
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = () => {
    // Simulate API loading
    setTimeout(() => {
      const accountsData = mockBusinessAccounts;
      setAccounts(accountsData);
      
      // Calculate stats
      const totalBuildings = accountsData.reduce((sum, account) => sum + account.buildings, 0);
      setStats({
        totalAccounts: accountsData.length,
        totalBuildings,
        residentialBuildings: Math.round(totalBuildings * 0.65), // Simulated values
        commercialBuildings: Math.round(totalBuildings * 0.35)
      });
      
      setLoading(false);
      setRefreshing(false);
    }, 800);
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };
  
  const navigateToBusinessAccount = (accountId: string, accountName: string) => {
    navigation.navigate('BuildingsByBusinessAccount', {
      businessAccountId: accountId,
      businessAccountName: accountName
    });
  };
  
  const navigateToAllBuildings = () => {
    navigation.navigate('Buildings');
  };
  
  const navigateToAllAccounts = () => {
    navigation.navigate('BusinessAccounts');
  };
  
  const navigateToAddBuilding = () => {
    navigation.navigate('AddBuilding');
  };
  
  // Helper function to get different colors for account cards
  const getAccountColor = (index: number) => {
    const colors = [
      ['#6772E5', '#4F56BD'], 
      ['#4CAF50', '#388E3C'], 
      ['#FF9800', '#F57C00'], 
      ['#2196F3', '#1976D2'], 
      ['#E91E63', '#C2185B']
    ];
    const colorPair = colors[index % colors.length];
    return colorPair;
  };
  
  const renderAccountItem = ({ item, index }: { item: Pick<BusinessAccount, 'id' | 'name' | 'type' | 'buildings'>, index: number }) => {
    const [startColor, endColor] = getAccountColor(index);
    
    return (
      <TouchableOpacity
        onPress={() => navigateToBusinessAccount(item.id, item.name)}
        style={styles.accountCardContainer}
        activeOpacity={0.8}
      >
        <Card style={styles.accountCard} mode="elevated">
          <Card.Content style={styles.accountCardContent}>
            <View style={styles.accountHeader}>
              <LinearGradient
                colors={[startColor, endColor]}
                style={styles.accountIconContainer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Briefcase size={24} color="#fff" />
              </LinearGradient>
              
              <View style={styles.accountTitleContainer}>
                <Text variant="titleMedium" style={styles.accountName}>{item.name}</Text>
                <Text variant="bodySmall" style={styles.accountType}>{item.type}</Text>
              </View>
            </View>
            
            <View style={styles.accountDetailsContainer}>
              <View style={styles.buildingsBadge}>
                <Building2 size={14} color={theme.colors.primary} style={{ marginRight: 6 }} />
                <Text variant="labelMedium" style={styles.buildingsCount}>
                  {item.buildings} {item.buildings === 1 ? 'Building' : 'Buildings'}
                </Text>
              </View>
              
              <ChevronRight size={20} color={theme.colors.onSurfaceVariant} />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
  
  const renderStatCards = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.statsCardsContainer}
    >
      <LinearGradient
        colors={['#4A69FF', '#304EFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statCard}
      >
        <View style={styles.statIconContainer}>
          <Briefcase size={24} color="#fff" />
        </View>
        <Text style={styles.statValue}>{stats.totalAccounts}</Text>
        <Text style={styles.statLabel}>Accounts</Text>
      </LinearGradient>
      
      <LinearGradient
        colors={['#FF6B8A', '#FF5376']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statCard}
      >
        <View style={styles.statIconContainer}>
          <Building2 size={24} color="#fff" />
        </View>
        <Text style={styles.statValue}>{stats.totalBuildings}</Text>
        <Text style={styles.statLabel}>Buildings</Text>
      </LinearGradient>
      
      <LinearGradient
        colors={['#50D3B4', '#3BC7A7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statCard}
      >
        <View style={styles.statIconContainer}>
          <Home size={24} color="#fff" />
        </View>
        <Text style={styles.statValue}>{stats.residentialBuildings}</Text>
        <Text style={styles.statLabel}>Residential</Text>
      </LinearGradient>
      
      <LinearGradient
        colors={['#FFBE4F', '#FFA53B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statCard}
      >
        <View style={styles.statIconContainer}>
          <Briefcase size={24} color="#fff" />
        </View>
        <Text style={styles.statValue}>{stats.commercialBuildings}</Text>
        <Text style={styles.statLabel}>Commercial</Text>
      </LinearGradient>
    </ScrollView>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon={(props) => <ArrowLeft {...props} />}
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text variant="headlineMedium" style={styles.title}>Business Accounts</Text>
        </View>
        
        <View style={styles.headerRight}>
          <IconButton
            icon={(props) => <Grid {...props} />}
            size={24}
            mode="contained"
            onPress={navigateToAllBuildings}
            style={styles.actionButton}
          />
          <IconButton
            icon={(props) => <Search {...props} />}
            size={24}
            mode="contained"
            onPress={() => {}}
            style={styles.actionButton}
          />
        </View>
      </View>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
            Loading accounts...
          </Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              {renderStatCards()}
              
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Select Account
                </Text>
                <Text variant="bodySmall" style={styles.sectionDescription}>
                  View buildings by business account
                </Text>
              </View>
            </>
          }
          data={accounts}
          keyExtractor={(item) => item.id}
          renderItem={renderAccountItem}
          contentContainerStyle={styles.accountsListContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyCardContent}>
                <Briefcase size={40} color={theme.colors.primary} style={{ opacity: 0.5, marginBottom: 12 }} />
                <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 8 }}>
                  No Business Accounts
                </Text>
                <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant, marginBottom: 24 }}>
                  Add your first business account to get started
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => {}}
                >
                  Add Business Account
                </Button>
              </Card.Content>
            </Card>
          }
        />
      )}
      
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={navigateToAddBuilding}
        color="#fff"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
  },
  backButton: {
    margin: 0,
    marginRight: 8,
  },
  actionButton: {
    margin: 0,
    marginLeft: 8,
  },
  title: {
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCardsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 12,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    width: 140,
    height: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  sectionDescription: {
    opacity: 0.6,
    marginTop: 4,
  },
  accountsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  accountCardContainer: {
    marginBottom: 12,
  },
  accountCard: {
    borderRadius: 12,
  },
  accountCardContent: {
    padding: 16,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountTitleContainer: {
    flex: 1,
  },
  accountName: {
    fontWeight: '600',
  },
  accountType: {
    opacity: 0.7,
  },
  accountDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  buildingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(19, 99, 223, 0.1)',
    borderRadius: 12,
  },
  buildingsCount: {
    color: '#1363DF',
  },
  emptyCard: {
    marginTop: 32,
    marginHorizontal: 8,
    borderRadius: 12,
    elevation: 2,
  },
  emptyCardContent: {
    padding: 24,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1363DF',
  },
}); 