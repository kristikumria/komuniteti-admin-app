import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Badge, useTheme } from 'react-native-paper';
import { Building2, Users, AlertTriangle, Home } from 'lucide-react-native';

import { Building } from '../../../../../navigation/types';

interface BuildingListItemProps {
  building: Building;
  onPress: () => void;
}

export const BuildingListItem: React.FC<BuildingListItemProps> = ({ building, onPress }) => {
  const theme = useTheme();

  // Calculate status color based on occupancy rate
  const getStatusColor = () => {
    if (building.occupancyRate >= 85) {
      return '#4CAF50'; // Green
    } else if (building.occupancyRate >= 70) {
      return '#FF9800'; // Orange
    } else {
      return '#F44336'; // Red
    }
  };

  // Calculate a placeholder image if no image provided
  const buildingImage = building.image || 'https://via.placeholder.com/300x200';

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: buildingImage }}
          style={styles.buildingImage}
          resizeMode="cover"
        />
        <View style={[styles.occupancyBadgeContainer, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.occupancyText}>{building.occupancyRate}%</Text>
        </View>
      </View>
      
      <Card.Content style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.buildingName}>{building.name}</Text>
          {building.issues > 0 && (
            <View style={styles.issuesContainer}>
              <AlertTriangle size={14} color={theme.colors.error} />
              <Text style={[styles.issuesText, { color: theme.colors.error }]}>
                {building.issues}
              </Text>
            </View>
          )}
        </View>
        
        <Text style={styles.address} numberOfLines={2}>
          {building.address}
        </Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Home size={16} color={theme.colors.primary} />
            <Text style={styles.statText}>{building.units} Units</Text>
          </View>
          
          <View style={styles.statItem}>
            <Users size={16} color={theme.colors.primary} />
            <Text style={styles.statText}>{building.residents} Residents</Text>
          </View>
          
          <View style={styles.statItem}>
            <Building2 size={16} color={theme.colors.primary} />
            <Text style={styles.statText}>{building.propertyType}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  buildingImage: {
    width: '100%',
    height: '100%',
  },
  occupancyBadgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  occupancyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buildingName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  issuesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  issuesText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
}); 