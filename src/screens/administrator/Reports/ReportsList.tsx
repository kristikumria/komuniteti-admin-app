import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AdministratorStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<AdministratorStackParamList, 'Reports'>;

export const ReportsList = ({ navigation }: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Reports</Text>
      <Text>Administrator reports list will be displayed here</Text>
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