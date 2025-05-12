import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessManagerStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<BusinessManagerStackParamList, 'AdministratorDetails'>;

export const AdministratorDetails = ({ route, navigation }: Props) => {
  const theme = useTheme();
  // You would typically get the administrator ID from route.params and fetch details

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Administrator Details</Text>
      <Text>Administrator details will be displayed here</Text>
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