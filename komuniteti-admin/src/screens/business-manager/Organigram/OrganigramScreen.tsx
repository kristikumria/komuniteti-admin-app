import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BusinessManagerStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<BusinessManagerStackParamList, 'Organigram'>;

export const OrganigramScreen = ({ navigation }: Props) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Organization Chart</Text>
      <Text>Organigram will be displayed here</Text>
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