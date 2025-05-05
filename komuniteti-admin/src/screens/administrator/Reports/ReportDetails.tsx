import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdministratorStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AdministratorStackParamList, 'ReportDetails'>;

export const ReportDetails = ({ route, navigation }: Props) => {
  const theme = useTheme();
  // You would typically get the report ID from route.params and fetch details

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Report Details</Text>
      <Text>Administrator report details will be displayed here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
}); 