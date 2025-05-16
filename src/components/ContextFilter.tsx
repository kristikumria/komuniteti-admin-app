import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip, Text, Divider } from 'react-native-paper';
import { useContextData } from '../hooks/useContextData';
import { useThemedStyles } from '../hooks/useThemedStyles';
import type { AppTheme } from '../theme/theme';

interface ContextFilterProps {
  onFilterChange: (buildingId: string | null) => void;
  initialFilter?: string | null;
  label?: string;
  showAllOption?: boolean;
}

/**
 * A component that allows filtering data by building context
 * Following MD3 design principles for chips and typography
 */
export const ContextFilter: React.FC<ContextFilterProps> = ({
  onFilterChange,
  initialFilter = null,
  label = 'Filter by:',
  showAllOption = true,
}) => {
  const { theme } = useThemedStyles();
  const { 
    userRole, 
    currentBusinessAccount, 
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
    <View style={styles(theme).container}>
      <View style={styles(theme).labelContainer}>
        <Text variant="bodyMedium" style={styles(theme).label}>{label}</Text>
        {currentBusinessAccount && (
          <Text variant="bodySmall" style={styles(theme).businessName}>
            {currentBusinessAccount.name}
          </Text>
        )}
      </View>
      <Divider style={styles(theme).divider} />
      <View style={styles(theme).chipsContainer}>
        {showAllOption && (
          <Chip
            mode={selectedBuildingId === null ? 'flat' : 'outlined'}
            selected={selectedBuildingId === null}
            onPress={() => handleSelectFilter(null)}
            style={[
              styles(theme).chip,
              selectedBuildingId === null && { backgroundColor: theme.colors.primaryContainer }
            ]}
            showSelectedCheck={false}
            textStyle={selectedBuildingId === null ? 
              { color: theme.colors.onPrimaryContainer } : 
              { color: theme.colors.onSurfaceVariant }}
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
              styles(theme).chip,
              selectedBuildingId === building.id && { backgroundColor: theme.colors.primaryContainer }
            ]}
            showSelectedCheck={false}
            textStyle={selectedBuildingId === building.id ? 
              { color: theme.colors.onPrimaryContainer } : 
              { color: theme.colors.onSurfaceVariant }}
          >
            {building.name}
          </Chip>
        ))}
      </View>
    </View>
  );
};

const styles = (theme: AppTheme) => StyleSheet.create({
  container: {
    marginVertical: theme.spacing.s,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  label: {
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  businessName: {
    color: theme.colors.onSurfaceVariant,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.s,
  },
  chip: {
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  divider: {
    marginVertical: theme.spacing.xs,
    backgroundColor: theme.colors.outlineVariant,
  },
}); 