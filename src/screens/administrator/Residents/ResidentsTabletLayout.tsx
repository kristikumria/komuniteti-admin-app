import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdministratorStackParamList } from '../../../navigation/types';
import { ResidentsList } from './ResidentsList';
import { ResidentDetails } from './ResidentDetails';

type ResidentsTabletLayoutNavigationProp = NativeStackNavigationProp<
  AdministratorStackParamList,
  'Residents'
>;

export const ResidentsTabletLayout = () => {
  const theme = useTheme();
  const navigation = useNavigation<ResidentsTabletLayoutNavigationProp>();
  const { width } = useWindowDimensions();
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);

  // Calculate the width for the master and detail views
  const masterViewWidth = width * 0.35; // 35% of screen width
  const detailViewWidth = width * 0.65; // 65% of screen width

  // Custom navigation function to handle resident selection
  const handleResidentSelect = (residentId: string) => {
    setSelectedResidentId(residentId);
  };

  return (
    <View style={styles.container}>
      {/* Master view (Residents List) */}
      <View style={[styles.masterView, { width: masterViewWidth }]}>
        {/* Pass the selection handler as a prop */}
        <ResidentsList />
      </View>

      {/* Detail view (Resident Details) */}
      <View style={[styles.detailView, { width: detailViewWidth }]}>
        {selectedResidentId ? (
          <ResidentDetails />
        ) : (
          <View style={styles.noSelectionContainer}>
            <Text variant="bodyLarge" style={styles.noSelectionText}>
              Select a resident to view details
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  masterView: {
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  detailView: {
    flex: 1,
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSelectionText: {
    color: '#757575',
  },
});