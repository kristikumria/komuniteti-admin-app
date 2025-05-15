import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Chip, useTheme, Text, Divider } from 'react-native-paper';
import { useContextData } from '../hooks/useContextData';
import { Building } from '../store/slices/contextSlice';

interface ContextFilterProps {
  onFilterChange: (buildingId: string | null) => void;
  initialFilter?: string | null;
  label?: string;
  showAllOption?: boolean;
}

/**
 * A component that allows filtering data by building context
 */
export const ContextFilter: React.FC<ContextFilterProps> = ({
  onFilterChange,
  initialFilter = null,
  label = 'Filter by:',
  showAllOption = true,
}) => {
  const theme = useTheme();
  const { 
    userRole, 
    currentBusinessAccount, 
    currentBuilding, 
    assignedBuildings 
  } = useContextData();
  
  // State for the currently selected filter
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(initialFilter);
  
  // For administrators, there's no need to show a filter since they can only
  // see data for the current building already
  if (userRole === 'administrator') {
    return null;
  }
  
  // Get buildings to show in the filter
  // This could be enhanced to show only buildings for the current business account
  const buildings = assignedBuildings;
  
  // Handle filter selection
  const handleSelectFilter = (buildingId: string | null) => {
    setSelectedBuildingId(buildingId);
    onFilterChange(buildingId);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text variant="bodyMedium" style={styles.label}>{label}</Text>
        {currentBusinessAccount && (
          <Text variant="bodySmall" style={styles.businessName}>
            {currentBusinessAccount.name}
          </Text>
        )}
      </View>
      <Divider style={styles.divider} />
      <View style={styles.chipsContainer}>
        {showAllOption && (
          <Chip
            mode={selectedBuildingId === null ? 'flat' : 'outlined'}
            selected={selectedBuildingId === null}
            onPress={() => handleSelectFilter(null)}
            style={[
              styles.chip,
              selectedBuildingId === null && { backgroundColor: theme.colors.primaryContainer }
            ]}
            textStyle={selectedBuildingId === null ? { color: theme.colors.primary } : undefined}
          >
            All Buildings
          </Chip>
        )}
        
        {buildings.map((building) => (
          <Chip
            key={building.id}
            mode={selectedBuildingId === building.id ? 'flat' : 'outlined'}
            selected={selectedBuildingId === building.id}
            onPress={() => handleSelectFilter(building.id)}
            style={[
              styles.chip,
              selectedBuildingId === building.id && { backgroundColor: theme.colors.primaryContainer }
            ]}
            textStyle={selectedBuildingId === building.id ? { color: theme.colors.primary } : undefined}
          >
            {building.name}
          </Chip>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: '500',
  },
  businessName: {
    opacity: 0.7,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 4,
  },
}); 