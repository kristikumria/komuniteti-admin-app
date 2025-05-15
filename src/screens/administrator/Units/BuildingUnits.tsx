import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, useTheme, Card, Title, Paragraph, Divider, Button, Badge, ProgressBar } from 'react-native-paper';
import { Home, Users, Building2, Briefcase, ArrowLeft, Archive, Car } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AdministratorStackParamList } from '../../../navigation/types';
import { useAppSelector } from '../../../store/hooks';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useContextData } from '../../../hooks/useContextData';
import { ContextScreenWrapper } from '../../../components/ContextScreenWrapper';

interface BuildingUnitStats {
  totalUnits: number;
  residentialUnits: number;
  businessUnits: number;
  storageUnits: number;
  parkingUnits: number;
  occupiedResidential: number;
  occupiedBusiness: number;
  occupiedStorage: number;
  occupiedParking: number;
  vacantResidential: number;
  vacantBusiness: number;
  maintenanceUnits: number;
  totalResidents: number;
  residentialOccupancyRate: number;
  businessOccupancyRate: number;
  overallOccupancyRate: number;
}

interface UnitTypeInfo {
  id: string;
  title: string;
  description: string;
  count: number;
  occupiedCount: number;
  occupancyRate: number;
  icon: any;
  color: string;
  route: string;
}

type Props = NativeStackScreenProps<AdministratorStackParamList, 'BuildingUnits'>;

export const BuildingUnits = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const { commonStyles } = useThemedStyles();
  const { currentBuilding } = useContextData();
  const { buildingId } = route.params;
  
  const [refreshing, setRefreshing] = useState(false);
  const [unitStats, setUnitStats] = useState<BuildingUnitStats>({
    totalUnits: 0,
    residentialUnits: 0,
    businessUnits: 0,
    storageUnits: 0,
    parkingUnits: 0,
    occupiedResidential: 0,
    occupiedBusiness: 0,
    occupiedStorage: 0,
    occupiedParking: 0,
    vacantResidential: 0,
    vacantBusiness: 0,
    maintenanceUnits: 0,
    totalResidents: 0,
    residentialOccupancyRate: 0,
    businessOccupancyRate: 0,
    overallOccupancyRate: 0
  });
  
  const [unitTypes, setUnitTypes] = useState<UnitTypeInfo[]>([]);
  
  useEffect(() => {
    // In a real app, fetch data from API
    loadBuildingStats();
  }, [currentBuilding, buildingId]);
  
  const loadBuildingStats = () => {
    // Mock building stats - in a real app, this would be fetched from an API
    const stats: BuildingUnitStats = {
      totalUnits: 48,
      residentialUnits: 32,
      businessUnits: 8,
      storageUnits: 4,
      parkingUnits: 4,
      occupiedResidential: 28,
      occupiedBusiness: 7,
      occupiedStorage: 3,
      occupiedParking: 4,
      vacantResidential: 2,
      vacantBusiness: 1,
      maintenanceUnits: 3,
      totalResidents: 76,
      residentialOccupancyRate: 87.5,
      businessOccupancyRate: 87.5,
      overallOccupancyRate: 87.5
    };
    
    setUnitStats(stats);
    
    // Create unit types information
    const types: UnitTypeInfo[] = [
      {
        id: 'residential',
        title: 'Residential Units',
        description: `${stats.occupiedResidential} of ${stats.residentialUnits} occupied (${stats.residentialOccupancyRate}%)`,
        count: stats.residentialUnits,
        occupiedCount: stats.occupiedResidential,
        occupancyRate: stats.residentialOccupancyRate,
        icon: Users,
        color: theme.colors.secondary,
        route: 'ResidentialUnits'
      },
      {
        id: 'business',
        title: 'Business Units',
        description: `${stats.occupiedBusiness} of ${stats.businessUnits} occupied (${stats.businessOccupancyRate}%)`,
        count: stats.businessUnits,
        occupiedCount: stats.occupiedBusiness,
        occupancyRate: stats.businessOccupancyRate,
        icon: Briefcase,
        color: theme.colors.tertiary,
        route: 'BusinessUnits'
      },
      {
        id: 'storage',
        title: 'Storage Units',
        description: `${stats.occupiedStorage} of ${stats.storageUnits} occupied (${Math.round((stats.occupiedStorage / stats.storageUnits) * 100)}%)`,
        count: stats.storageUnits,
        occupiedCount: stats.occupiedStorage,
        occupancyRate: Math.round((stats.occupiedStorage / stats.storageUnits) * 100),
        icon: Archive,
        color: theme.colors.error,
        route: 'Units'
      },
      {
        id: 'parking',
        title: 'Parking Units',
        description: `${stats.occupiedParking} of ${stats.parkingUnits} occupied (${Math.round((stats.occupiedParking / stats.parkingUnits) * 100)}%)`,
        count: stats.parkingUnits,
        occupiedCount: stats.occupiedParking,
        occupancyRate: Math.round((stats.occupiedParking / stats.parkingUnits) * 100),
        icon: Car,
        color: theme.colors.primary,
        route: 'Units'
      }
    ];
    
    setUnitTypes(types);
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    // In a real app, fetch fresh data
    setTimeout(() => {
      loadBuildingStats();
      setRefreshing(false);
    }, 1000);
  };
  
  const handleNavigateToAllUnits = () => {
    navigation.navigate('Units');
  };
  
  const handleNavigateToUnitType = (route: string) => {
    navigation.navigate(route as any);
  };
  
  return (
    <ContextScreenWrapper
      title={currentBuilding ? `${currentBuilding.name} - Units Overview` : "Building Units"}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: theme.colors.primary}]}>
            Units Overview
          </Text>
        </View>
        
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Units Summary</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{unitStats.totalUnits}</Text>
                <Text style={styles.statLabel}>Total Units</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{unitStats.totalResidents}</Text>
                <Text style={styles.statLabel}>Residents</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{unitStats.overallOccupancyRate}%</Text>
                <Text style={styles.statLabel}>Occupancy</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.occupancySection}>
              <Text style={styles.sectionTitle}>Occupancy Status</Text>
              <ProgressBar
                progress={unitStats.overallOccupancyRate / 100}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
              <View style={styles.occupancyStats}>
                <View style={styles.occupancyItem}>
                  <View style={[styles.statusDot, { backgroundColor: theme.colors.primary }]} />
                  <Text style={styles.occupancyText}>
                    {unitStats.totalUnits - unitStats.vacantResidential - unitStats.vacantBusiness} Occupied
                  </Text>
                </View>
                <View style={styles.occupancyItem}>
                  <View style={[styles.statusDot, { backgroundColor: theme.colors.secondary }]} />
                  <Text style={styles.occupancyText}>
                    {unitStats.vacantResidential + unitStats.vacantBusiness} Vacant
                  </Text>
                </View>
                <View style={styles.occupancyItem}>
                  <View style={[styles.statusDot, { backgroundColor: theme.colors.error }]} />
                  <Text style={styles.occupancyText}>
                    {unitStats.maintenanceUnits} Maintenance
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Unit Types</Text>
          <Button 
            mode="text" 
            onPress={handleNavigateToAllUnits}
            icon={({ size, color }) => <Building2 size={size} color={color} />}
            compact
          >
            View All
          </Button>
        </View>
        
        {unitTypes.map((unitType) => (
          <Card 
            key={unitType.id}
            style={styles.unitTypeCard}
            onPress={() => handleNavigateToUnitType(unitType.route)}
          >
            <Card.Content style={styles.unitTypeContent}>
              <View style={styles.unitTypeHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${unitType.color}15` }]}>
                  <unitType.icon size={24} color={unitType.color} />
                </View>
                <View style={styles.unitTypeInfo}>
                  <Title style={styles.unitTypeTitle}>{unitType.title}</Title>
                  <Paragraph style={styles.unitTypeDescription}>
                    {unitType.description}
                  </Paragraph>
                </View>
                <Badge style={[styles.unitTypeBadge, { backgroundColor: unitType.color }]}>
                  {unitType.count}
                </Badge>
              </View>
              
              <View style={styles.occupancyContainer}>
                <ProgressBar
                  progress={unitType.occupancyRate / 100}
                  color={unitType.color}
                  style={styles.unitProgressBar}
                />
                <View style={styles.progressLabelRow}>
                  <Text style={styles.occupancyDetailText}>
                    {unitType.occupiedCount} occupied
                  </Text>
                  <Text style={styles.occupancyLabel}>
                    {unitType.occupancyRate}% Occupancy
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
          
        <Divider style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionButtonsContainer}>
          <Button 
            mode="outlined" 
            style={styles.actionButton}
            icon="plus"
            onPress={() => navigation.navigate('AddUnit')}
          >
            Add New Unit
          </Button>
        </View>
      </View>
    </ContextScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  occupancySection: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  occupancyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  occupancyText: {
    fontSize: 12,
    opacity: 0.7,
  },
  occupancyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitTypeCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  unitTypeContent: {
    padding: 12,
  },
  unitTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unitTypeInfo: {
    flex: 1,
  },
  unitTypeTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  unitTypeDescription: {
    fontSize: 12,
    opacity: 0.7,
    margin: 0,
  },
  unitTypeBadge: {
    marginLeft: 8,
  },
  occupancyContainer: {
    marginTop: 8,
  },
  unitProgressBar: {
    height: 4,
    borderRadius: 2,
  },
  occupancyLabel: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
    opacity: 0.7,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  occupancyDetailText: {
    fontSize: 12,
    opacity: 0.7,
  },
});
